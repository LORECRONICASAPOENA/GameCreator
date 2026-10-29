/* Apoena Game Creator — regras de terreno e contrato de mapas.
 * Compartilhado pelo editor integrado e pela página standalone.
 * Não executa a simulação do jogo: valida e descreve dados exportáveis.
 */
(function (root) {
  'use strict';

  const SCHEMA = 'apoena.terrain.catalog.v1';
  const MAP_SCHEMA = 'apoena.map2d.v1';
  const ROLES = new Set(['terrain', 'water', 'slope', 'decoration', 'structure', 'resource', 'entity']);
  const COLLISIONS = new Set(['walkable', 'blocked', 'conditional', 'none']);
  const MAP_TYPES = new Set(['story', 'exploration', 'moba']);

  function defaultTile(name, role, connectGroup, collision, height, tags) {
    return {
      name, role, connectGroup, collision, height,
      tags: tags || [], autotile: false, variants: {}
    };
  }

  function createDefaultCatalog() {
    return {
      schema: SCHEMA,
      version: 1,
      tiles: {
        'builtin:0': defaultTile('Grama', 'terrain', 'grass', 'walkable', 0, ['natural', 'ground']),
        'builtin:1': defaultTile('Caminho', 'terrain', 'path', 'walkable', 0, ['ground', 'path']),
        'builtin:2': defaultTile('Pedra', 'terrain', 'rock', 'conditional', 0, ['mineral', 'ground']),
        'builtin:3': defaultTile('Água', 'water', 'water', 'blocked', 0, ['water', 'natural'])
      }
    };
  }

  function normalizeDefinition(source, fallbackName) {
    const input = source && typeof source === 'object' ? source : {};
    const role = ROLES.has(input.role) ? input.role : 'terrain';
    const collision = COLLISIONS.has(input.collision) ? input.collision : 'walkable';
    const tags = Array.isArray(input.tags)
      ? [...new Set(input.tags.map(v => String(v).trim().toLowerCase()).filter(Boolean))].slice(0, 32)
      : [];
    const variants = {};
    if (input.variants && typeof input.variants === 'object' && !Array.isArray(input.variants)) {
      for (const [rawMask, rawTile] of Object.entries(input.variants)) {
        const mask = Number(rawMask);
        const tile = Number(rawTile);
        if (Number.isInteger(mask) && mask >= 0 && mask <= 255 && Number.isInteger(tile) && tile >= 0 && tile < 1024) {
          variants[String(mask)] = tile;
        }
      }
    }
    return {
      name: String(input.name || fallbackName || 'Tile').trim().slice(0, 80) || 'Tile',
      role,
      connectGroup: String(input.connectGroup || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60),
      collision,
      height: Number.isFinite(Number(input.height)) ? Math.max(0, Math.min(16, Math.round(Number(input.height)))) : 0,
      tags,
      autotile: input.autotile === true,
      variants
    };
  }

  function normalizeCatalog(input) {
    const base = createDefaultCatalog();
    if (!input || typeof input !== 'object' || !input.tiles || typeof input.tiles !== 'object') return base;
    for (const [key, value] of Object.entries(input.tiles)) {
      if (!/^(builtin:[0-3]|atlas:[0-9]{1,4})$/.test(key)) continue;
      base.tiles[key] = normalizeDefinition(value, key);
    }
    return { schema: SCHEMA, version: 1, tiles: base.tiles };
  }

  function keyForCell(value) {
    if (!Number.isInteger(value) || value < 0) return null;
    if (value >= 1000 && value < 2024) return 'atlas:' + (value - 1000);
    if (value >= 0 && value <= 3) return 'builtin:' + value;
    return null;
  }

  function getTileDefinition(catalogInput, key) {
    const catalog = catalogInput && typeof catalogInput === 'object' && catalogInput.tiles && typeof catalogInput.tiles === 'object' ? catalogInput : createDefaultCatalog();
    if (catalog.tiles[key]) return catalog.tiles[key];
    if (/^atlas:[0-9]{1,4}$/.test(key)) {
      const index = Number(key.slice(6));
      return defaultTile('Tile de atlas ' + (index + 1), 'terrain', '', 'walkable', 0, ['imported']);
    }
    return null;
  }

  function definitionForCell(value, catalog) {
    const key = keyForCell(value);
    return key ? getTileDefinition(catalog, key) : null;
  }

  // Máscara de 8 vizinhos: N=1, NE=2, E=4, SE=8, S=16, SW=32, W=64, NW=128.
  // Diagonais só contam quando os dois lados cardinais também se conectam.
  function connectivityMask(cells, width, height, x, y, resolveDefinition) {
    if (!Array.isArray(cells) || !Number.isInteger(width) || !Number.isInteger(height) ||
        x < 0 || y < 0 || x >= width || y >= height || cells.length !== width * height) return 0;
    const resolve = typeof resolveDefinition === 'function' ? resolveDefinition : () => null;
    const target = resolve(cells[y * width + x]);
    if (!target || !target.connectGroup) return 0;
    const neighbors = [
      [0, -1, 1], [1, -1, 2], [1, 0, 4], [1, 1, 8],
      [0, 1, 16], [-1, 1, 32], [-1, 0, 64], [-1, -1, 128]
    ];
    let mask = 0;
    for (const [dx, dy, bit] of neighbors) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const neighbor = resolve(cells[ny * width + nx]);
      if (neighbor && neighbor.connectGroup === target.connectGroup) mask |= bit;
    }
    if (!(mask & 1) || !(mask & 4)) mask &= ~2;
    if (!(mask & 4) || !(mask & 16)) mask &= ~8;
    if (!(mask & 16) || !(mask & 64)) mask &= ~32;
    if (!(mask & 64) || !(mask & 1)) mask &= ~128;
    return mask;
  }

  function resolveVariant(mask, variants, fallback) {
    if (!Number.isInteger(mask) || mask < 0 || mask > 255) return fallback;
    if (!variants || typeof variants !== 'object') return fallback;
    const value = variants[String(mask)];
    return Number.isInteger(value) && value >= 0 && value < 1024 ? value : fallback;
  }

  function validateCatalog(input) {
    const errors = [];
    const warnings = [];
    if (!input || typeof input !== 'object') {
      return { valid: false, errors: ['Catálogo de terrenos ausente ou inválido.'], warnings };
    }
    if (input.schema && input.schema !== SCHEMA) errors.push('Schema do catálogo de terrenos não reconhecido.');
    if (!input.tiles || typeof input.tiles !== 'object' || Array.isArray(input.tiles)) {
      errors.push('O catálogo precisa conter um objeto tiles.');
      return { valid: false, errors, warnings };
    }
    for (const [key, value] of Object.entries(input.tiles)) {
      if (!/^(builtin:[0-3]|atlas:[0-9]{1,4})$/.test(key)) errors.push('Identificador de tile inválido: ' + key);
      if (!value || typeof value !== 'object') {
        errors.push('Definição ausente para ' + key + '.');
        continue;
      }
      if (!ROLES.has(value.role)) errors.push('Tipo inválido em ' + key + '.');
      if (!COLLISIONS.has(value.collision)) errors.push('Colisão inválida em ' + key + '.');
      if (!Number.isInteger(value.height) || value.height < 0 || value.height > 16) errors.push('Altura lógica inválida em ' + key + '.');
      if (value.autotile && !value.connectGroup) warnings.push(key + ' está com autotile ligado, mas sem grupo de conexão.');
      if (value.variants && typeof value.variants === 'object') {
        for (const [mask, tile] of Object.entries(value.variants)) {
          if (!/^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(mask) ||
              !Number.isInteger(tile) || tile < 0 || tile >= 1024) {
            errors.push('Variante inválida em ' + key + ' para máscara ' + mask + '.');
          }
        }
      }
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  function validateMap(map) {
    const errors = [];
    const warnings = [];
    if (!map || typeof map !== 'object') return { valid: false, errors: ['Projeto de mapa ausente.'], warnings };
    if (map.schema && map.schema !== MAP_SCHEMA) errors.push('Schema do mapa não reconhecido.');
    const width = Number(map.width), height = Number(map.height);
    if (!Number.isInteger(width) || width < 16 || width > 160) errors.push('Largura deve ficar entre 16 e 160 células.');
    if (!Number.isInteger(height) || height < 16 || height > 160) errors.push('Altura deve ficar entre 16 e 160 células.');
    const cells = Array.isArray(map.tiles) ? map.tiles : map.cells;
    if (!Array.isArray(cells)) errors.push('O mapa não possui uma lista de tiles.');
    else if (Number.isInteger(width) && Number.isInteger(height) && cells.length !== width * height) errors.push('A quantidade de tiles não corresponde às dimensões do mapa.');
    else if (cells.some(v => !Number.isInteger(v) || v < 0 || v >= 2024)) errors.push('Existem valores de tile inválidos.');
    if (Array.isArray(map.heights) && Array.isArray(cells) && map.heights.length !== cells.length) errors.push('A camada de alturas tem tamanho diferente da camada de tiles.');
    if (Array.isArray(map.heights) && map.heights.some(v => !Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > 4)) errors.push('A camada de alturas contém valores fora do intervalo 0–4.');
    if (map.mapType && !MAP_TYPES.has(map.mapType)) errors.push('Tipo de mapa inválido: ' + map.mapType + '.');
    if (!map.mapType) warnings.push('Tipo de mapa não definido; será tratado como exploração.');
    if (!map.terrainCatalog) warnings.push('Mapa antigo sem catálogo de regras de terreno; as regras padrão serão aplicadas.');
    else {
      const catalogReport = validateCatalog(map.terrainCatalog);
      errors.push(...catalogReport.errors);
      warnings.push(...catalogReport.warnings);
    }
    if (Array.isArray(map.objects) && map.objects.length > 2000) errors.push('O mapa excede o limite de 2.000 objetos.');
    if (Array.isArray(map.markers) && map.markers.length > 300) errors.push('O mapa excede o limite de 300 marcadores.');
    return { valid: errors.length === 0, errors, warnings };
  }

  function prepareMap(input) {
    const source = input && typeof input === 'object' ? input : {};
    return {
      ...source,
      schema: MAP_SCHEMA,
      formatVersion: 2,
      mapType: MAP_TYPES.has(source.mapType) ? source.mapType : 'exploration',
      terrainRulesVersion: 1,
      terrainCatalog: normalizeCatalog(source.terrainCatalog)
    };
  }

  const api = Object.freeze({
    SCHEMA, MAP_SCHEMA, MAP_TYPES: Object.freeze(Array.from(MAP_TYPES)),
    createDefaultCatalog, normalizeCatalog, normalizeDefinition, keyForCell,
    getTileDefinition, definitionForCell, connectivityMask, resolveVariant,
    validateCatalog, validateMap, prepareMap
  });
  root.ApoenaTerrainSystem = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
