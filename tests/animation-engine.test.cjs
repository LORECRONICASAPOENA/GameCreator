'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const engine = require('../pixel-art/animation-engine.js');

const clip = engine.createClip({
  id: 'hero-walk',
  name: 'Caminhada',
  fps: 12,
  durationFrames: 4,
  loopMode: 'loop',
  tracks: [
    {
      id: 'sprite-frames',
      targetKind: 'sprite',
      targetId: 'hero',
      property: 'frame',
      interpolation: 'step',
      keyframes: [
        { frame: 0, value: 0 },
        { frame: 1, value: 1 },
        { frame: 2, value: 2 },
        { frame: 3, value: 3 }
      ]
    },
    {
      id: 'hip-x',
      targetKind: 'bone',
      targetId: 'hip',
      property: 'x',
      interpolation: 'linear',
      keyframes: [
        { frame: 0, value: 0 },
        { frame: 3, value: 30 }
      ]
    },
    {
      id: 'arm-rotation',
      targetKind: 'bone',
      targetId: 'arm',
      property: 'rotation',
      interpolation: 'cubic',
      keyframes: [
        { frame: 0, value: 0 },
        { frame: 3, value: 90 }
      ]
    }
  ]
});

assert.equal(engine.SCHEMA, 'apoena.animation.v1');
assert.equal(clip.version, 1);
assert.equal(engine.validateClip(clip).valid, true);

const fractionalClip = engine.createClip({ id: 'fractional-fps', name: 'FPS fracionário', fps: 12.5, durationFrames: 2 });
assert.equal(fractionalClip.fps, 12.5, 'o contrato preserva FPS fracionário');
assert.equal(engine.getPlaybackPosition({ durationFrames: 4, fps: 12.5, loopMode: 'loop', elapsedMs: 80 }).frame, 1, 'playback preserva FPS fracionário');

const sample = engine.sampleClip(clip, 125);
assert.equal(sample.frame, 1.5, 'a amostragem preserva a posição fracionária da timeline');
assert.equal(sample.frameIndex, 1);
assert.equal(sample.finished, false);
assert.equal(sample.pose.find(item => item.targetId === 'hero').properties.frame, 1, 'sprite usa keyframes discretos');
assert.equal(sample.pose.find(item => item.targetId === 'hip').properties.x, 15, 'transformação linear interpola valores');
assert.equal(sample.pose.find(item => item.targetId === 'arm').properties.rotation, 45, 'cubic Hermite produz interpolação suave');

const timeline = engine.buildTimelineModel(clip);
assert.equal(timeline.durationFrames, 4);
assert.equal(timeline.tracks.length, 3);
const hipTrack = timeline.tracks.find(track => track.id === 'hip-x');
assert.equal(hipTrack.keyframes[1].position, 1);

const serialized = engine.serializeClip(clip);
assert.deepEqual(engine.deserializeClip(serialized), clip);
assert.deepEqual(engine.deserializeClip(clip), clip);

const sequence = engine.createSpriteSequenceClip({
  id: 'attack',
  name: 'Ataque',
  fps: 8,
  frames: [0, 2, 1],
  loopMode: 'once',
  targetId: 'hero'
});
assert.equal(engine.sampleClip(sequence, 250).pose[0].properties.frame, 1, 'sequência de sprites usa o frame correto');

const loop = engine.getPlaybackPosition({ durationFrames: 4, fps: 4, loopMode: 'loop', elapsedMs: 1000 });
assert.equal(loop.frame, 0, 'loop reinicia no limite da duração');
assert.equal(loop.cycle, 1);

const once = engine.getPlaybackPosition({ durationFrames: 4, fps: 4, loopMode: 'once', elapsedMs: 1000 });
assert.equal(once.frame, 3, 'once mantém o último frame');
assert.equal(once.finished, true);

const pingpong = engine.getPlaybackPosition({ durationFrames: 4, fps: 4, loopMode: 'pingpong', elapsedMs: 1000 });
assert.equal(pingpong.frame, 2, 'pingpong retorna pelo eixo inverso');
assert.equal(pingpong.direction, -1);
assert.equal(engine.getPlaybackPosition({ durationFrames: 4, fps: 4, loopMode: 'pingpong', elapsedMs: 1500 }).frame, 0);

const negativeTime = engine.getPlaybackPosition({ durationFrames: 4, fps: 8, loopMode: 'loop', elapsedMs: -100 });
assert.equal(negativeTime.frame, 0, 'tempo negativo é limitado ao início');

const singleFrame = engine.getPlaybackPosition({ durationFrames: 1, fps: 12, loopMode: 'pingpong', elapsedMs: 9000 });
assert.equal(singleFrame.frame, 0);
assert.equal(singleFrame.frameIndex, 0);

const duplicateKeyframes = JSON.parse(serialized);
duplicateKeyframes.tracks[0].keyframes.push({ frame: 0, value: 4 });
assert.equal(engine.validateClip(duplicateKeyframes).valid, false);
assert.throws(() => engine.normalizeClip(duplicateKeyframes), /mesmo frame/);

const duplicateBinding = JSON.parse(serialized);
duplicateBinding.tracks.push({
  id: 'hip-x-copy',
  targetKind: 'bone',
  targetId: 'hip',
  property: 'x',
  interpolation: 'linear',
  keyframes: [{ frame: 0, value: 0 }]
});
assert.equal(engine.validateClip(duplicateBinding).valid, false);
assert.throws(() => engine.normalizeClip(duplicateBinding), /mesmo alvo\/propriedade/);

const invalidSpriteInterpolation = JSON.parse(serialized);
invalidSpriteInterpolation.tracks.find(track => track.property === 'frame').interpolation = 'linear';
assert.throws(() => engine.normalizeClip(invalidSpriteInterpolation), /exige interpolação step/);

const invalidOpacity = JSON.parse(serialized);
const opacityTrack = invalidOpacity.tracks.find(track => track.property === 'rotation');
opacityTrack.property = 'opacity';
opacityTrack.keyframes[0].value = 2;
assert.equal(engine.validateClip(invalidOpacity).valid, false);

assert.throws(() => engine.getPlaybackPosition({ durationFrames: 0, fps: 8, loopMode: 'loop', elapsedMs: 0 }), /durationFrames inválido/);
assert.throws(() => engine.getPlaybackPosition({ durationFrames: 4, fps: 0, loopMode: 'loop', elapsedMs: 0 }), /fps inválido/);
assert.throws(() => engine.getPlaybackPosition({ durationFrames: 4, fps: 8, loopMode: 'reverse', elapsedMs: 0 }), /loopMode inválido/);
assert.throws(() => engine.getPlaybackPosition({ durationFrames: 4, fps: 8, loopMode: 'loop', elapsedMs: NaN }), /finito/);

const studioHtml = fs.readFileSync(require.resolve('../pixel-art/estudio.html'), 'utf8');
const engineScriptIndex = studioHtml.indexOf('<script src="animation-engine.js"></script>');
const studioScriptIndex = studioHtml.indexOf('<script src="estudio.js"></script>');
assert.ok(engineScriptIndex >= 0 && studioScriptIndex > engineScriptIndex, 'o motor deve carregar antes do Estúdio');

const studioSource = fs.readFileSync(require.resolve('../pixel-art/estudio.js'), 'utf8');
assert.ok(studioSource.includes('ApoenaAnimationEngine.getPlaybackPosition'), 'a prévia do Estúdio deve usar o motor de animação');
console.log('ANIMATION ENGINE OK: schema, tracks, interpolação, timeline, playback, loop modes, round-trip e integração do Estúdio');
