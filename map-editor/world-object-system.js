/* Apoena Game Creator — comportamento declarativo de objetos do mundo.
 * Metadados exportáveis; a execução real pertence ao runtime do jogo.
 */
(function (root) {
  'use strict';
  const SCHEMA = 'apoena.world-object.v1';
  const CATEGORIES = new Set(['decoration', 'resource', 'plant', 'animal', 'mount', 'npc', 'structure', 'vehicle']);
  const INTERACTIONS = new Set(['none', 'collect', 'chop', 'mine', 'harvest', 'talk', 'trade', 'ride', 'attack', 'enter']);
  const MOVEMENT = new Set(['static', 'ground', 'water', 'air', 'mounted']);
  const COLLISION = new Set(['none', 'walkable', 'blocked', 'conditional']);
  const PROFESSIONS = new Set(['none', 'blacksmith', 'merchant', 'farmer', 'adventurer', 'guard', 'mage', 'healer', 'hunter', 'scholar', 'custom']);
  const MARKET_ROLES = new Set(['none', 'buyer', 'seller', 'both']);

  function defaultBehavior() {
    return {
      schema: SCHEMA, category: 'decoration', interaction: 'none', movement: 'static',
      collision: 'none', rideable: false, ecological: false,
      resource: { itemId: '', amount: 1, respawnDays: 0 },
      npc: { profession: 'none', routine: [] },
      economy: { role: 'none', priceModifier: 1, buyItemIds: [], sellItemIds: [] },
      ecology: {
        enabled: false, waterMin: 0.25, nutrientMin: 0.2, lightMin: 0.2,
        tempMin: -10, tempMax: 50, growthDays: 0, lifespanDays: 0,
        shadeRadius: 0, reproduction: 'none'
      }
    };
  }

  function bounded(value, fallback, min, max, integer) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    const result = Math.max(min, Math.min(max, n));
    return integer ? Math.round(result) : result;
  }

  function normalizeBehavior(source) {
    const input = source && typeof source === 'object' ? source : {};
    const defaults = defaultBehavior();
    const resource = input.resource && typeof input.resource === 'object' ? input.resource : {};
    const npc = input.npc && typeof input.npc === 'object' ? input.npc : {};
    const economy = input.economy && typeof input.economy === 'object' ? input.economy : {};
    const ecology = input.ecology && typeof input.ecology === 'object' ? input.ecology : {};
    const routine = Array.isArray(npc.routine) ? npc.routine.slice(0, 48).map(entry => ({
      hour: bounded(entry && entry.hour, 8, 0, 23, true),
      activity: String(entry && entry.activity || '').trim().slice(0, 80),
      locationId: String(entry && entry.locationId || '').trim().slice(0, 100)
    })) : [];
    const itemIds = value => Array.isArray(value) ? [...new Set(value.map(v => String(v).trim()).filter(Boolean))].slice(0, 100) : [];
    return {
      schema: SCHEMA,
      category: CATEGORIES.has(input.category) ? input.category : defaults.category,
      interaction: INTERACTIONS.has(input.interaction) ? input.interaction : defaults.interaction,
      movement: MOVEMENT.has(input.movement) ? input.movement : defaults.movement,
      collision: COLLISION.has(input.collision) ? input.collision : defaults.collision,
      rideable: input.rideable === true,
      ecological: input.ecological === true,
      resource: {
        itemId: String(resource.itemId || '').trim().slice(0, 100),
        amount: bounded(resource.amount, 1, 1, 99, true),
        respawnDays: bounded(resource.respawnDays, 0, 0, 3650, true)
      },
      npc: {
        profession: PROFESSIONS.has(npc.profession) ? npc.profession : 'none',
        routine
      },
      economy: {
        role: MARKET_ROLES.has(economy.role) ? economy.role : 'none',
        priceModifier: bounded(economy.priceModifier, 1, 0.25, 3, false),
        buyItemIds: itemIds(economy.buyItemIds),
        sellItemIds: itemIds(economy.sellItemIds)
      },
      ecology: {
        enabled: ecology.enabled === true,
        waterMin: bounded(ecology.waterMin, 0.25, 0, 1, false),
        nutrientMin: bounded(ecology.nutrientMin, 0.2, 0, 1, false),
        lightMin: bounded(ecology.lightMin, 0.2, 0, 1, false),
        tempMin: bounded(ecology.tempMin, -10, -50, 70, false),
        tempMax: bounded(ecology.tempMax, 50, -50, 70, false),
        growthDays: bounded(ecology.growthDays, 0, 0, 100000, true),
        lifespanDays: bounded(ecology.lifespanDays, 0, 0, 100000, true),
        shadeRadius: bounded(ecology.shadeRadius, 0, 0, 1000, false),
        reproduction: ['none', 'seed', 'fruit', 'offspring', 'vegetative'].includes(ecology.reproduction) ? ecology.reproduction : 'none'
      }
    };
  }

  function validateBehavior(source, label) {
    const behavior = normalizeBehavior(source);
    const errors = [];
    const warnings = [];
    const prefix = label ? label + ': ' : '';
    if (!CATEGORIES.has(behavior.category)) errors.push(prefix + 'categoria de objeto inválida.');
    if (!INTERACTIONS.has(behavior.interaction)) errors.push(prefix + 'interação inválida.');
    if (!MOVEMENT.has(behavior.movement)) errors.push(prefix + 'perfil de movimentação inválido.');
    if (!COLLISION.has(behavior.collision)) errors.push(prefix + 'colisão inválida.');
    if (!Number.isInteger(behavior.resource.amount) || behavior.resource.amount < 1 || behavior.resource.amount > 99) errors.push(prefix + 'quantidade de recurso deve ficar entre 1 e 99.');
    if (behavior.ecology.tempMin > behavior.ecology.tempMax) errors.push(prefix + 'temperatura mínima maior que a máxima.');
    if (['collect', 'chop', 'mine', 'harvest'].includes(behavior.interaction) && !behavior.resource.itemId) warnings.push(prefix + 'interação de coleta sem ID de item/recurso.');
    if (behavior.category === 'mount' && !behavior.rideable) warnings.push(prefix + 'objeto classificado como montaria, mas a opção de montar está desativada.');
    if (behavior.category === 'npc' && behavior.npc.profession === 'none') warnings.push(prefix + 'NPC sem profissão definida.');
    if (behavior.economy.role === 'buyer' || behavior.economy.role === 'both') {
      if (!behavior.economy.buyItemIds.length) warnings.push(prefix + 'NPC/comerciante compra sem IDs de itens configurados.');
    }
    if (behavior.economy.role === 'seller' || behavior.economy.role === 'both') {
      if (!behavior.economy.sellItemIds.length) warnings.push(prefix + 'NPC/comerciante vende sem IDs de itens configurados.');
    }
    if (behavior.npc.routine.some(entry => !entry.activity)) warnings.push(prefix + 'a rotina contém uma atividade sem nome.');
    if (behavior.ecological && !behavior.ecology.enabled) warnings.push(prefix + 'objeto ecológico sem parâmetros ambientais habilitados.');
    if (behavior.movement === 'air' && behavior.collision === 'blocked') warnings.push(prefix + 'entidade aérea marcada como bloqueio total; confirme a regra do runtime.');
    return { valid: errors.length === 0, errors, warnings, behavior };
  }

  function normalizeAsset(asset) {
    const input = asset && typeof asset === 'object' ? asset : {};
    return { ...input, worldBehavior: normalizeBehavior(input.worldBehavior) };
  }

  function validateAssets(assets) {
    const errors = [];
    const warnings = [];
    if (!Array.isArray(assets)) return { valid: false, errors: ['Lista de assets inválida.'], warnings };
    if (assets.length > 50) errors.push('O editor aceita até 50 assets de objeto por mapa.');
    const ids = new Set();
    for (const asset of assets) {
      if (!asset || typeof asset !== 'object') {
        errors.push('Existe um asset sem dados válidos.');
        continue;
      }
      const id = String(asset.id || '').trim();
      if (!id) errors.push('Existe um asset sem ID.');
      else if (ids.has(id)) errors.push('ID de asset duplicado: ' + id + '.');
      ids.add(id);
      if (typeof asset.src !== 'string' || !asset.src) warnings.push((id || 'Asset') + ' não possui imagem vinculada.');
      const report = validateBehavior(asset.worldBehavior, id || String(asset.name || 'Asset'));
      errors.push(...report.errors);
      warnings.push(...report.warnings);
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  const api = Object.freeze({
    SCHEMA, CATEGORIES: Object.freeze(Array.from(CATEGORIES)),
    PROFESSIONS: Object.freeze(Array.from(PROFESSIONS)), MARKET_ROLES: Object.freeze(Array.from(MARKET_ROLES)),
    INTERACTIONS: Object.freeze(Array.from(INTERACTIONS)),
    MOVEMENT: Object.freeze(Array.from(MOVEMENT)),
    COLLISION: Object.freeze(Array.from(COLLISION)),
    defaultBehavior, normalizeBehavior, validateBehavior, normalizeAsset, validateAssets
  });
  root.ApoenaWorldObjectSystem = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
