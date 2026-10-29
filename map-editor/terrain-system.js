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
  const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);
  const TERRAIN_KINDS = new Set(['grassland', 'forest', 'soil', 'sand_beach', 'sand_desert', 'rock', 'stone', 'water', 'wetland', 'snow', 'wood', 'custom']);

  function defaultHydrology(kind = 'grassland', role = 'terrain') {
    const profiles = {
      grassland: { permeability: 0.38, retention: 0.55, erosionResistance: 0.62, runoff: 0.30, source: false },
      forest: { permeability: 0.48, retention: 0.68, erosionResistance: 0.70, runoff: 0.22, source: false },
      soil: { permeability: 0.42, retention: 0.60, erosionResistance: 0.46, runoff: 0.32, source: false },
      sand_beach: { permeability: 0.78, retention: 0.18, erosionResistance: 0.24, runoff: 0.12, source: false },
      sand_desert: { permeability: 0.66, retention: 0.10, erosionResistance: 0.20, runoff: 0.18, source: false },
      rock: { permeability: 0.08, retention: 0.12, erosionResistance: 0.92, runoff: 0.82, source: false },
      stone: { permeability: 0.06, retention: 0.08, erosionResistance: 0.96, runoff: 0.88, source: false },
      water: { permeability: 0.02, retention: 0.98, erosionResistance: 0.98, runoff: 0.02, source: true },
      wetland: { permeability: 0.24, retention: 0.88, erosionResistance: 0.34, runoff: 0.16, source: false },
      snow: { permeability: 0.20, retention: 0.52, erosionResistance: 0.42, runoff: 0.36, source: false },
      wood: { permeability: 0.12, retention: 0.18, erosionResistance: 0.88, runoff: 0.68, source: false },
      custom: { permeability: 0.35, retention: 0.45, erosionResistance: 0.50, runoff: 0.30, source: false }
    };
    const base = profiles[kind] || profiles.custom;
    return { ...base, source: role === 'water' || base.source };
  }

  function normalizeHydrology(source, kind = 'grassland', role = 'terrain') {
    const input = source && typeof source === 'object' ? source : {};
    const base = defaultHydrology(kind, role);
    const number = (value, fallback) => {
      const n = Number(value);
      return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : fallback;
    };
    return {
      permeability: number(input.permeability, base.permeability),
      retention: number(input.retention, base.retention),
      erosionResistance: number(input.erosionResistance, base.erosionResistance),
      runoff: number(input.runoff, base.runoff),
      source: input.source === true || (input.source === undefined && base.source)
    };
  }

  function normalizeSeasonalVariants(source) {
    const input = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const result = {};
    for (const season of SEASONS) {
      const value = input[season];
      result[season] = value === null || value === undefined || value === ''
        ? null
        : (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) < 1024 ? Number(value) : null);
    }
    return result;
  }

  function defaultEnvironment() {
    return {
      enabled: false, waterMin: 0.25, nutrientMin: 0.2, lightMin: 0.2,
      tempMin: -10, tempMax: 50, healthyVariant: null, dryVariant: null,
      recovery: 'gradual'
    };
  }

  function defaultTile(name, role, connectGroup, collision, height, tags) {
    const terrainKind = role === 'water' ? 'water' : (tags || []).includes('mineral') ? 'rock' : (tags || []).includes('path') ? 'soil' : 'grassland';
    return {
      name, role, connectGroup, collision, height,
      tags: tags || [], biomeTags: tags || [], terrainKind,
      autotile: false, variants: {}, seasonalVariants: normalizeSeasonalVariants(null),
      hydrology: defaultHydrology(terrainKind, role), environment: defaultEnvironment()
    };
  }

  function normalizeDefinition(source, fallbackName) {
    const input = source && typeof source === 'object' ? source : {};
    const role = ROLES.has(input.role) ? input.role : 'terrain';
    const collision = COLLISIONS.has(input.collision) ? input.collision : 'walkable';
    const tags = Array.isArray(input.tags)
      ? [...new Set(input.tags.map(v => String(v).trim().toLowerCase()).filter(Boolean))].slice(0, 32)
      : [];
    const biomeTags = Array.isArray(input.biomeTags)
      ? [...new Set(input.biomeTags.map(v => String(v).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')).filter(Boolean))].slice(0, 32)
      : tags.slice();
    const terrainKind = TERRAIN_KINDS.has(input.terrainKind) ? input.terrainKind :
      role === 'water' ? 'water' : tags.includes('mineral') || tags.includes('rock') ? 'rock' :
      tags.includes('path') ? 'soil' : 'grassland';
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
      biomeTags,
      terrainKind,
      autotile: input.autotile === true,
      variants,
      seasonalVariants: normalizeSeasonalVariants(input.seasonalVariants),
      hydrology: normalizeHydrology(input.hydrology, terrainKind, role),
      environment: normalizeEnvironment(input.environment)
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
      if (value.environment !== undefined) {
        const env = value.environment;
        if (!env || typeof env !== 'object' || typeof env.enabled !== 'boolean') errors.push('Perfil ambiental inválido em ' + key + '.');
        else {
          for (const field of ['waterMin', 'nutrientMin', 'lightMin']) {
            if (!Number.isFinite(Number(env[field])) || Number(env[field]) < 0 || Number(env[field]) > 1) errors.push('Limite ambiental ' + field + ' inválido em ' + key + '.');
          }
          if (!Number.isFinite(Number(env.tempMin)) || !Number.isFinite(Number(env.tempMax)) || Number(env.tempMin) > Number(env.tempMax)) errors.push('Faixa de temperatura inválida em ' + key + '.');
          if (env.enabled && (env.healthyVariant === null || env.dryVariant === null)) warnings.push(key + ' reage ao ambiente, mas ainda não tem variante saudável e seca configuradas.');
        }
      }
      if (!TERRAIN_KINDS.has(value.terrainKind || 'grassland')) errors.push('Tipo de terreno inválido em ' + key + '.');
      if (value.biomeTags !== undefined && (!Array.isArray(value.biomeTags) || value.biomeTags.length > 32)) errors.push('Tags de bioma inválidas em ' + key + '.');
      if (value.seasonalVariants !== undefined) {
        const seasons = value.seasonalVariants;
        if (!seasons || typeof seasons !== 'object' || Array.isArray(seasons)) errors.push('Variantes sazonais inválidas em ' + key + '.');
        else for (const season of SEASONS) {
          const variant = seasons[season];
          if (variant !== null && variant !== undefined && (!Number.isInteger(variant) || variant < 0 || variant >= 1024)) errors.push('Índice de variante sazonal inválido em ' + key + ' (' + season + ').');
        }
      }
      if (value.hydrology !== undefined) {
        const hydro = value.hydrology;
        if (!hydro || typeof hydro !== 'object') errors.push('Perfil hidrológico inválido em ' + key + '.');
        else for (const field of ['permeability', 'retention', 'erosionResistance', 'runoff']) {
          if (!Number.isFinite(Number(hydro[field])) || Number(hydro[field]) < 0 || Number(hydro[field]) > 1) errors.push('Parâmetro hidrológico ' + field + ' inválido em ' + key + '.');
        }
      }
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

  function materialProfileForCell(value, catalog) {
    const def = definitionForCell(value, catalog);
    if (!def) return { ...defaultHydrology('grassland', 'terrain'), terrainKind: 'grassland', role: 'terrain' };
    return { ...normalizeHydrology(def.hydrology, def.terrainKind, def.role), terrainKind: def.terrainKind || 'grassland', role: def.role || 'terrain' };
  }

  function createHydrologySimulation(mapInput) {
    const map = mapInput && typeof mapInput === 'object' ? mapInput : {};
    const width = Math.max(1, Math.min(160, Math.floor(Number(map.width) || 1)));
    const height = Math.max(1, Math.min(160, Math.floor(Number(map.height) || 1)));
    const tiles = Array.isArray(map.tiles) ? map.tiles : Array.isArray(map.cells) ? map.cells : [];
    const heights = Array.isArray(map.heights) ? map.heights : [];
    const catalog = normalizeCatalog(map.terrainCatalog);
    const count = width * height;
    const elevation = new Array(count);
    const originalElevation = new Array(count);
    const profiles = new Array(count);
    const soilMoisture = new Array(count).fill(0.28);
    const waterDepth = new Array(count).fill(0);
    const snowpack = new Array(count).fill(0);
    const erosion = new Array(count).fill(0);
    const flowAccumulation = new Array(count).fill(0);
    const channels = new Array(count).fill(false);
    const sources = new Array(count).fill(false);
    for (let i = 0; i < count; i++) {
      const tile = Number.isInteger(tiles[i]) ? tiles[i] : 0;
      const def = definitionForCell(tile, catalog);
      const profile = materialProfileForCell(tile, catalog);
      const rawHeight = Number(heights[i]);
      const h = Math.max(0, Math.min(8, (Number.isFinite(rawHeight) ? rawHeight : 0) + (def ? Number(def.height || 0) / 4 : 0)));
      elevation[i] = h;
      originalElevation[i] = h;
      profiles[i] = profile;
      sources[i] = profile.source === true || profile.role === 'water';
      if (sources[i]) waterDepth[i] = 0.28;
    }
    return {
      schema: 'apoena.hydrology.preview.v1', width, height,
      elevation, originalElevation, profiles, soilMoisture, waterDepth, snowpack,
      erosion, flowAccumulation, channels, sources, elapsedDays: 0, erodedCells: 0
    };
  }

  function stepHydrology(sim, weather = {}, days = 1) {
    if (!sim || !Number.isInteger(sim.width) || !Number.isInteger(sim.height)) throw new Error('Simulação hidrológica inválida.');
    let remaining = Math.max(0, Math.min(30, Number(days) || 0));
    if (!remaining) return sim;
    const rainName = String(weather.tempo || weather.weather || 'Sol');
    const season = String(weather.estacao || weather.season || 'summer').toLowerCase();
    const temperature = Number.isFinite(Number(weather.temperatura ?? weather.temperature)) ? Number(weather.temperatura ?? weather.temperature) : 25;
    const rainfall = Number.isFinite(Number(weather.rainfall)) ? Math.max(0, Math.min(2, Number(weather.rainfall))) :
      rainName === 'Tempestade' || rainName === 'storm' ? 1.35 :
      rainName === 'Chuva' || rainName === 'rain' ? 0.82 : 0;
    const count = sim.width * sim.height;
    while (remaining > 0.000001) {
      const dt = Math.min(0.1, remaining);
      remaining -= dt;
      const deltaWater = new Array(count).fill(0);
      const outgoing = new Array(count).fill(0);
      for (let i = 0; i < count; i++) {
        const profile = sim.profiles[i] || defaultHydrology();
        const permeability = profile.permeability;
        const retention = profile.retention;
        if (rainName === 'Neve' || rainName === 'snow') sim.snowpack[i] = Math.min(3, sim.snowpack[i] + 0.58 * dt);
        else sim.waterDepth[i] += rainfall * dt * (1 - permeability * 0.62);
        sim.soilMoisture[i] = Math.max(0, Math.min(1,
          sim.soilMoisture[i] + rainfall * dt * permeability * 0.28 - (season === 'summer' || season === 'verão' ? 0.045 : 0.025) * dt
        ));
        const melt = (temperature > 1 || (season !== 'winter' && season !== 'inverno')) ? Math.min(sim.snowpack[i], 0.18 * dt) : 0;
        sim.snowpack[i] -= melt;
        sim.waterDepth[i] += melt;
        const infiltration = Math.min(sim.waterDepth[i], permeability * dt * 0.24, Math.max(0, 1 - sim.soilMoisture[i]) * retention);
        sim.waterDepth[i] -= infiltration;
        sim.soilMoisture[i] = Math.max(0, Math.min(1, sim.soilMoisture[i] + infiltration * retention * 0.5));
        const evaporation = season === 'summer' || season === 'verão' ? 0.07 : season === 'winter' || season === 'inverno' ? 0.018 : 0.04;
        if (!sim.sources[i]) sim.waterDepth[i] = Math.max(0, sim.waterDepth[i] - evaporation * dt);
        else sim.waterDepth[i] = Math.max(0.22, sim.waterDepth[i] - evaporation * dt);
        sim.waterDepth[i] = Math.min(4, sim.waterDepth[i]);
      }
      for (let y = 0; y < sim.height; y++) for (let x = 0; x < sim.width; x++) {
        const i = y * sim.width + x;
        if (sim.waterDepth[i] <= 0.025) continue;
        const surface = sim.elevation[i] + sim.waterDepth[i];
        let best = -1, lowest = surface;
        for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= sim.width || ny >= sim.height) continue;
          const j = ny * sim.width + nx;
          const other = sim.elevation[j] + sim.waterDepth[j];
          if (other < lowest - 0.025) { lowest = other; best = j; }
        }
        if (best < 0) continue;
        const difference = surface - lowest;
        const transfer = Math.min(sim.waterDepth[i] * 0.22, difference * 0.12, 0.16 * dt + 0.002);
        if (transfer <= 0) continue;
        deltaWater[i] -= transfer;
        deltaWater[best] += transfer;
        outgoing[i] += transfer;
        sim.flowAccumulation[i] = Math.min(1000, sim.flowAccumulation[i] + transfer);
      }
      for (let i = 0; i < count; i++) {
        sim.waterDepth[i] = Math.max(sim.sources[i] ? 0.22 : 0, Math.min(4, sim.waterDepth[i] + deltaWater[i]));
        const profile = sim.profiles[i] || defaultHydrology();
        if (outgoing[i] > 0.002) {
          sim.erosion[i] += outgoing[i] * (1 - profile.erosionResistance) * 4;
          if (sim.erosion[i] >= 1 && sim.elevation[i] > 0) {
            sim.elevation[i] = Math.max(0, sim.elevation[i] - 1);
            sim.erosion[i] -= 1;
            sim.erodedCells++;
            sim.channels[i] = true;
          }
        }
        if (sim.flowAccumulation[i] >= 1.2 && sim.waterDepth[i] > 0.06) sim.channels[i] = true;
      }
      sim.elapsedDays += dt;
    }
    return sim;
  }

  function simulateHydrology(sim, days, weatherAtDay) {
    const total = Math.max(0, Math.min(3650, Math.floor(Number(days) || 0)));
    for (let day = 0; day < total; day++) {
      const weather = typeof weatherAtDay === 'function'
        ? weatherAtDay(day, sim)
        : { tempo: day % 5 < 2 ? 'Chuva' : 'Sol', estacao: 'summer' };
      stepHydrology(sim, weather, 1);
    }
    return sim;
  }

  function hydrologyStats(sim) {
    if (!sim) return { puddles: 0, channels: 0, erodedCells: 0, wetCells: 0, maxDepth: 0 };
    let puddles = 0, channels = 0, wetCells = 0, maxDepth = 0;
    for (let i = 0; i < sim.waterDepth.length; i++) {
      if (sim.waterDepth[i] > 0.12 && !sim.sources[i]) puddles++;
      if (sim.channels[i]) channels++;
      if (sim.soilMoisture[i] >= 0.7) wetCells++;
      maxDepth = Math.max(maxDepth, sim.waterDepth[i]);
    }
    return { puddles, channels, erodedCells: sim.erodedCells || 0, wetCells, maxDepth: Number(maxDepth.toFixed(3)), elapsedDays: Number((sim.elapsedDays || 0).toFixed(2)) };
  }

  const api = Object.freeze({
    SCHEMA, MAP_SCHEMA, MAP_TYPES: Object.freeze(Array.from(MAP_TYPES)),
    createDefaultCatalog, normalizeCatalog, normalizeDefinition, normalizeEnvironment, normalizeHydrology, normalizeSeasonalVariants, keyForCell,
    getTileDefinition, definitionForCell, connectivityMask, resolveVariant,
    createHydrologySimulation, stepHydrology, simulateHydrology, hydrologyStats,
    validateCatalog, validateMap, prepareMap
  });
  root.ApoenaTerrainSystem = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
