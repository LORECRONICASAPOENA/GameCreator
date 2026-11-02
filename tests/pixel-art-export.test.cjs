const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('../pixel-art/estudio.js'), 'utf8');
const match = source.match(/function sheet\(\)\{[\s\S]*?\nfunction readResourceMetadata\(\)/);
assert.ok(match, 'função sheet() encontrada no Estúdio Pixel Art');
const functionSource = match[0].slice(0, match[0].lastIndexOf('\nfunction readResourceMetadata'));

const calls = [];
let smoothingAtDraw = [];
const context = {
  imageSmoothingEnabled: true,
  drawImage(...args) {
    calls.push(args);
    smoothingAtDraw.push(this.imageSmoothingEnabled);
  }
};
const outputCanvas = {
  width: 0,
  height: 0,
  getContext(type) {
    assert.equal(type, '2d');
    return context;
  }
};
const frames = [
  { canvas: { width: 16, height: 24 } },
  { canvas: { width: 32, height: 16 } }
];
const sandbox = {
  frames,
  document: { createElement(tag) {
    assert.equal(tag, 'canvas');
    return outputCanvas;
  } },
  clamp(value, min, max) { return Math.max(min, Math.min(max, value)); },
  num(id) { return id === 'cell' ? 128 : 4; }
};
vm.createContext(sandbox);
vm.runInContext(functionSource, sandbox, { filename: 'pixel-art/estudio.js' });

const result = sandbox.sheet();
assert.equal(result.out, outputCanvas, 'retorna o canvas gerado');
assert.equal(result.cell, 128, 'mantém a dimensão da célula configurada');
assert.equal(result.cols, 4, 'mantém o número de colunas');
assert.equal(result.rows, 1, 'calcula as linhas pela quantidade de quadros');
assert.equal(outputCanvas.width, 512, 'largura do atlas preservada');
assert.equal(outputCanvas.height, 128, 'altura do atlas preservada');
assert.equal(calls.length, 2, 'todos os quadros são desenhados');
assert.deepEqual(smoothingAtDraw, [false, false], 'nearest-neighbor fica ativo antes de cada redimensionamento');
assert.equal(frames[0].canvas.width, 16, 'dimensões do original não são alteradas');
assert.equal(frames[1].canvas.height, 16, 'dimensões do original não são alteradas');
console.log('PASS: spritesheet desativa suavização antes de redimensionar e preserva quadros de origem.');
