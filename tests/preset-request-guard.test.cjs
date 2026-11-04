'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const createGuard = require('../pixel-art/preset-request-guard.js');

const guard = createGuard();
const first = guard.begin();
const second = guard.begin();
assert.equal(guard.isCurrent(first), false, 'Uma solicitação antiga não pode continuar válida.');
assert.equal(guard.isCurrent(second), true, 'A solicitação mais recente deve permanecer válida.');
const third = guard.begin();
assert.equal(guard.isCurrent(second), false, 'Uma nova solicitação deve invalidar a anterior.');
assert.equal(guard.isCurrent(third), true, 'A última solicitação deve ser a única autorizada a aplicar o preset.');

const html = fs.readFileSync(path.join(__dirname, '../pixel-art/estudio.html'), 'utf8');
const guardScript = html.indexOf('<script src="preset-request-guard.js"></script>');
const studioScript = html.indexOf('<script src="estudio.js"></script>');
assert.ok(guardScript >= 0 && studioScript > guardScript, 'O helper deve carregar antes do Estúdio.');

const studio = fs.readFileSync(path.join(__dirname, '../pixel-art/estudio.js'), 'utf8');
assert.match(studio, /const presetRequestGuard = ApoenaPresetRequestGuard\(\)/, 'O Estúdio deve criar o guard.');
assert.match(studio, /const requestId = presetRequestGuard\.begin\(\)/, 'Cada carregamento deve receber um identificador.');
assert.match(studio, /if \(!presetRequestGuard\.isCurrent\(requestId\)\) return;/, 'onload deve ignorar uma solicitação antiga.');
assert.match(studio, /if \(presetRequestGuard\.isCurrent\(requestId\)\) msg\(/, 'onerror antigo não deve sobrescrever o status atual.');

console.log('PASSOU: guard de concorrência dos presets e integração do Estúdio.');