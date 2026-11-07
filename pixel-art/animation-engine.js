(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ApoenaAnimationEngine = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var SCHEMA = 'apoena.animation.v1';
  var VERSION = 1;
  var MAX_FPS = 60;
  var MAX_DURATION_FRAMES = 6000;
  var MAX_TRACKS = 256;
  var MAX_KEYFRAMES_PER_TRACK = 10000;
  var MAX_TOTAL_KEYFRAMES = 50000;

  var TARGET_PROPERTIES = {
    sprite: ['frame'],
    bone: ['x', 'y', 'rotation', 'scaleX', 'scaleY', 'opacity', 'zIndex'],
    part: ['x', 'y', 'rotation', 'scaleX', 'scaleY', 'opacity', 'zIndex']
  };
  var PROPERTY_RULES = {
    frame: { min: 0, max: 65535, integer: true },
    x: { min: -1000000, max: 1000000 },
    y: { min: -1000000, max: 1000000 },
    rotation: { min: -36000, max: 36000 },
    scaleX: { min: -100, max: 100 },
    scaleY: { min: -100, max: 100 },
    opacity: { min: 0, max: 1 },
    zIndex: { min: -10000, max: 10000, integer: true }
  };
  var LOOP_MODES = ['loop', 'once', 'pingpong'];
  var INTERPOLATIONS = ['step', 'linear', 'cubic'];

  function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function compareText(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
  }

  function requiredText(value, field, maxLength, errors) {
    if (typeof value !== 'string') {
      errors.push(field + ' deve ser texto.');
      return '';
    }
    var normalized = value.trim();
    if (!normalized) errors.push(field + ' não pode ficar vazio.');
    if (normalized.length > maxLength) errors.push(field + ' excede ' + maxLength + ' caracteres.');
    return normalized;
  }

  function finiteNumber(value, field, errors) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(field + ' deve ser um número finito.');
      return 0;
    }
    return value;
  }

  function normalizeClip(input) {
    var errors = [];
    if (!isRecord(input)) throw new TypeError('Clip de animação deve ser um objeto.');

    if (input.schema !== SCHEMA) errors.push('schema deve ser ' + SCHEMA + '.');
    if (input.version !== VERSION) errors.push('version deve ser ' + VERSION + '.');

    var id = requiredText(input.id, 'id', 128, errors);
    var name = requiredText(input.name, 'name', 120, errors);
    var fps = input.fps;
    var durationFrames = input.durationFrames;
    var loopMode = input.loopMode;

    if (!Number.isInteger(fps) || fps < 1 || fps > MAX_FPS) {
      errors.push('fps deve ser inteiro entre 1 e ' + MAX_FPS + '.');
    }
    if (!Number.isInteger(durationFrames) || durationFrames < 1 || durationFrames > MAX_DURATION_FRAMES) {
      errors.push('durationFrames deve ser inteiro entre 1 e ' + MAX_DURATION_FRAMES + '.');
    }
    if (LOOP_MODES.indexOf(loopMode) === -1) {
      errors.push('loopMode deve ser loop, once ou pingpong.');
    }

    if (!Array.isArray(input.tracks)) errors.push('tracks deve ser um array.');
    var rawTracks = Array.isArray(input.tracks) ? input.tracks : [];
    if (rawTracks.length > MAX_TRACKS) errors.push('O clip excede o limite de ' + MAX_TRACKS + ' tracks.');

    var trackIds = Object.create(null);
    var bindings = Object.create(null);
    var totalKeyframes = 0;
    var tracks = [];

    rawTracks.slice(0, MAX_TRACKS).forEach(function (rawTrack, trackIndex) {
      var prefix = 'tracks[' + trackIndex + ']';
      if (!isRecord(rawTrack)) {
        errors.push(prefix + ' deve ser um objeto.');
        return;
      }

      var trackId = requiredText(rawTrack.id, prefix + '.id', 128, errors);
      var targetKind = rawTrack.targetKind;
      var targetId = requiredText(rawTrack.targetId, prefix + '.targetId', 128, errors);
      var property = rawTrack.property;
      var allowed = TARGET_PROPERTIES[targetKind];

      if (trackId) {
        if (trackIds[trackId]) errors.push('ID de track duplicado: ' + trackId + '.');
        trackIds[trackId] = true;
      }
      if (!allowed || allowed.indexOf(property) === -1) {
        errors.push(prefix + ' combina targetKind/property não suportados.');
      }

      var defaultInterpolation = property === 'frame' ? 'step' : 'linear';
      var interpolation = rawTrack.interpolation == null ? defaultInterpolation : rawTrack.interpolation;
      if (INTERPOLATIONS.indexOf(interpolation) === -1) {
        errors.push(prefix + '.interpolation deve ser step, linear ou cubic.');
      }
      if (property === 'frame' && interpolation !== 'step') {
        errors.push(prefix + ' usa frame de sprite, que exige interpolação step.');
      }

      var bindingKey = JSON.stringify([targetKind, targetId, property]);
      if (targetId && property && bindings[bindingKey]) {
        errors.push('Há mais de uma track para o mesmo alvo/propriedade: ' + targetId + '/' + property + '.');
      }
      if (targetId && property) bindings[bindingKey] = true;

      if (rawTrack.name != null && (typeof rawTrack.name !== 'string' || rawTrack.name.trim().length > 120)) {
        errors.push(prefix + '.name deve ter até 120 caracteres.');
      }
      var trackName = typeof rawTrack.name === 'string' ? rawTrack.name.trim() : '';

      if (!Array.isArray(rawTrack.keyframes)) {
        errors.push(prefix + '.keyframes deve ser um array.');
        return;
      }
      if (rawTrack.keyframes.length < 1) errors.push(prefix + ' precisa de ao menos um keyframe.');
      if (rawTrack.keyframes.length > MAX_KEYFRAMES_PER_TRACK) {
        errors.push(prefix + ' excede o limite de keyframes.');
      }

      totalKeyframes += rawTrack.keyframes.length;
      var keyframes = [];
      rawTrack.keyframes.slice(0, MAX_KEYFRAMES_PER_TRACK).forEach(function (rawKeyframe, keyIndex) {
        var keyPrefix = prefix + '.keyframes[' + keyIndex + ']';
        if (!isRecord(rawKeyframe)) {
          errors.push(keyPrefix + ' deve ser um objeto.');
          return;
        }

        var frame = rawKeyframe.frame;
        if (!Number.isInteger(frame) || frame < 0 || (Number.isInteger(durationFrames) && frame >= durationFrames)) {
          errors.push(keyPrefix + '.frame deve estar entre 0 e durationFrames - 1.');
        }

        var value = finiteNumber(rawKeyframe.value, keyPrefix + '.value', errors);
        var rule = PROPERTY_RULES[property];
        if (rule && Number.isFinite(value)) {
          if (value < rule.min || value > rule.max) {
            errors.push(keyPrefix + '.value está fora do limite permitido para ' + property + '.');
          }
          if (rule.integer && !Number.isInteger(value)) {
            errors.push(keyPrefix + '.value deve ser inteiro para ' + property + '.');
          }
        }

        var keyframe = { frame: frame, value: value };
        ['inTangent', 'outTangent'].forEach(function (field) {
          if (rawKeyframe[field] != null) {
            if (interpolation !== 'cubic') {
              errors.push(keyPrefix + '.' + field + ' só é permitido com interpolation cubic.');
            }
            if (typeof rawKeyframe[field] !== 'number' || !Number.isFinite(rawKeyframe[field]) || Math.abs(rawKeyframe[field]) > 1000000) {
              errors.push(keyPrefix + '.' + field + ' deve ser um número finito dentro do limite.');
            } else {
              keyframe[field] = rawKeyframe[field];
            }
          }
        });
        keyframes.push(keyframe);
      });

      keyframes.sort(function (a, b) { return a.frame - b.frame; });
      for (var keyIndex = 1; keyIndex < keyframes.length; keyIndex += 1) {
        if (keyframes[keyIndex - 1].frame === keyframes[keyIndex].frame) {
          errors.push(prefix + ' contém dois keyframes no mesmo frame.');
          break;
        }
      }

      if (trackId && targetId && allowed && allowed.indexOf(property) !== -1) {
        var track = {
          id: trackId,
          targetKind: targetKind,
          targetId: targetId,
          property: property,
          interpolation: interpolation,
          keyframes: keyframes
        };
        if (trackName) track.name = trackName;
        tracks.push(track);
      }
    });

    if (totalKeyframes > MAX_TOTAL_KEYFRAMES) {
      errors.push('O clip excede o limite total de ' + MAX_TOTAL_KEYFRAMES + ' keyframes.');
    }
    if (errors.length) throw new TypeError('Clip de animação inválido: ' + errors.join(' '));

    tracks.sort(function (a, b) {
      return compareText(a.targetKind, b.targetKind) ||
        compareText(a.targetId, b.targetId) ||
        compareText(a.property, b.property) ||
        compareText(a.id, b.id);
    });

    return {
      schema: SCHEMA,
      version: VERSION,
      id: id,
      name: name,
      fps: fps,
      durationFrames: durationFrames,
      loopMode: loopMode,
      tracks: tracks
    };
  }

  function createClip(options) {
    var source = isRecord(options) ? options : {};
    return normalizeClip({
      schema: SCHEMA,
      version: VERSION,
      id: source.id == null ? 'animation' : source.id,
      name: source.name == null ? 'Animação' : source.name,
      fps: source.fps == null ? 12 : source.fps,
      durationFrames: source.durationFrames == null ? 1 : source.durationFrames,
      loopMode: source.loopMode == null ? 'loop' : source.loopMode,
      tracks: source.tracks == null ? [] : source.tracks
    });
  }

  function validateClip(input) {
    try {
      normalizeClip(input);
      return { valid: true, errors: [] };
    } catch (error) {
      return { valid: false, errors: [error && error.message ? error.message : String(error)] };
    }
  }

  function sampleTrack(track, framePosition) {
    if (!track || !Array.isArray(track.keyframes) || track.keyframes.length === 0) return null;
    if (typeof framePosition !== 'number' || !Number.isFinite(framePosition)) {
      throw new TypeError('framePosition deve ser um número finito.');
    }

    var keys = track.keyframes;
    if (framePosition <= keys[0].frame) return keys[0].value;
    if (framePosition >= keys[keys.length - 1].frame) return keys[keys.length - 1].value;

    var low = 0;
    var high = keys.length - 1;
    while (low + 1 < high) {
      var middle = Math.floor((low + high) / 2);
      if (keys[middle].frame <= framePosition) low = middle;
      else high = middle;
    }

    var left = keys[low];
    var right = keys[high];
    var span = right.frame - left.frame;
    var t = (framePosition - left.frame) / span;

    if (track.interpolation === 'step') return left.value;
    if (track.interpolation === 'cubic') {
      var t2 = t * t;
      var t3 = t2 * t;
      var h00 = 2 * t3 - 3 * t2 + 1;
      var h10 = t3 - 2 * t2 + t;
      var h01 = -2 * t3 + 3 * t2;
      var h11 = t3 - t2;
      var outTangent = left.outTangent == null ? 0 : left.outTangent;
      var inTangent = right.inTangent == null ? 0 : right.inTangent;
      return h00 * left.value + h10 * span * outTangent +
        h01 * right.value + h11 * span * inTangent;
    }
    return left.value + (right.value - left.value) * t;
  }

  function getPlaybackPosition(options) {
    if (!isRecord(options)) throw new TypeError('Configuração de playback deve ser um objeto.');
    var durationFrames = options.durationFrames;
    var fps = options.fps;
    var loopMode = options.loopMode == null ? 'loop' : options.loopMode;
    var elapsedMs = options.elapsedMs == null ? 0 : options.elapsedMs;

    if (!Number.isInteger(durationFrames) || durationFrames < 1 || durationFrames > MAX_DURATION_FRAMES) {
      throw new RangeError('durationFrames inválido para playback.');
    }
    if (!Number.isInteger(fps) || fps < 1 || fps > MAX_FPS) {
      throw new RangeError('fps inválido para playback.');
    }
    if (LOOP_MODES.indexOf(loopMode) === -1) throw new RangeError('loopMode inválido para playback.');
    if (typeof elapsedMs !== 'number' || !Number.isFinite(elapsedMs)) {
      throw new TypeError('elapsedMs deve ser um número finito.');
    }

    var elapsedFrames = Math.max(0, elapsedMs) * fps / 1000;
    if (!Number.isFinite(elapsedFrames)) throw new RangeError('Tempo de playback excede o limite numérico.');
    var frame = 0;
    var direction = 1;
    var cycle = 0;
    var finished = false;

    if (loopMode === 'loop') {
      cycle = Math.floor(elapsedFrames / durationFrames);
      frame = elapsedFrames - cycle * durationFrames;
    } else if (loopMode === 'once') {
      frame = Math.min(elapsedFrames, durationFrames - 1);
      finished = elapsedFrames >= durationFrames;
    } else {
      var span = durationFrames - 1;
      if (span > 0) {
        var period = span * 2;
        cycle = Math.floor(elapsedFrames / period);
        var phase = elapsedFrames - cycle * period;
        if (phase <= span) {
          frame = phase;
        } else {
          frame = period - phase;
          direction = -1;
        }
      }
    }

    return {
      frame: frame,
      frameIndex: Math.min(durationFrames - 1, Math.floor(frame)),
      finished: finished,
      direction: direction,
      cycle: cycle,
      progress: durationFrames <= 1 ? 0 : frame / (durationFrames - 1),
      elapsedFrames: elapsedFrames
    };
  }

  function sampleClip(input, elapsedMs) {
    var clip = normalizeClip(input);
    var playback = getPlaybackPosition({
      durationFrames: clip.durationFrames,
      fps: clip.fps,
      loopMode: clip.loopMode,
      elapsedMs: elapsedMs
    });
    var targets = Object.create(null);
    var order = [];

    clip.tracks.forEach(function (track) {
      var key = JSON.stringify([track.targetKind, track.targetId]);
      if (!targets[key]) {
        targets[key] = {
          targetKind: track.targetKind,
          targetId: track.targetId,
          properties: {}
        };
        order.push(key);
      }
      targets[key].properties[track.property] = sampleTrack(track, playback.frame);
    });

    return {
      schema: SCHEMA,
      clipId: clip.id,
      frame: playback.frame,
      frameIndex: playback.frameIndex,
      finished: playback.finished,
      direction: playback.direction,
      cycle: playback.cycle,
      progress: playback.progress,
      pose: order.map(function (key) { return targets[key]; })
    };
  }

  function buildTimelineModel(input) {
    var clip = normalizeClip(input);
    return {
      schema: SCHEMA,
      clipId: clip.id,
      name: clip.name,
      fps: clip.fps,
      durationFrames: clip.durationFrames,
      loopMode: clip.loopMode,
      tracks: clip.tracks.map(function (track) {
        return {
          id: track.id,
          name: track.name || track.targetId + ' · ' + track.property,
          targetKind: track.targetKind,
          targetId: track.targetId,
          property: track.property,
          interpolation: track.interpolation,
          keyframes: track.keyframes.map(function (keyframe) {
            return {
              frame: keyframe.frame,
              value: keyframe.value,
              position: clip.durationFrames <= 1 ? 0 : keyframe.frame / (clip.durationFrames - 1)
            };
          })
        };
      })
    };
  }

  function serializeClip(input) {
    return JSON.stringify(normalizeClip(input));
  }

  function deserializeClip(serialized) {
    var value = serialized;
    if (typeof serialized === 'string') {
      try {
        value = JSON.parse(serialized);
      } catch (error) {
        throw new TypeError('JSON de animação inválido: ' + error.message);
      }
    }
    return normalizeClip(value);
  }

  function createSpriteSequenceClip(options) {
    var source = isRecord(options) ? options : {};
    var frames = source.frames;
    if (!Array.isArray(frames) || frames.length < 1 || frames.length > MAX_DURATION_FRAMES) {
      throw new RangeError('frames deve conter entre 1 e ' + MAX_DURATION_FRAMES + ' valores.');
    }
    return createClip({
      id: source.id == null ? 'sprite-sequence' : source.id,
      name: source.name == null ? 'Sequência de sprites' : source.name,
      fps: source.fps == null ? 8 : source.fps,
      durationFrames: frames.length,
      loopMode: source.loopMode == null ? 'loop' : source.loopMode,
      tracks: [{
        id: 'sprite-frames',
        targetKind: 'sprite',
        targetId: source.targetId == null ? 'sprite' : source.targetId,
        property: 'frame',
        interpolation: 'step',
        keyframes: frames.map(function (value, index) {
          return { frame: index, value: value };
        })
      }]
    });
  }

  return {
    SCHEMA: SCHEMA,
    VERSION: VERSION,
    MAX_FPS: MAX_FPS,
    MAX_DURATION_FRAMES: MAX_DURATION_FRAMES,
    createClip: createClip,
    normalizeClip: normalizeClip,
    validateClip: validateClip,
    sampleTrack: sampleTrack,
    getPlaybackPosition: getPlaybackPosition,
    sampleClip: sampleClip,
    buildTimelineModel: buildTimelineModel,
    serializeClip: serializeClip,
    deserializeClip: deserializeClip,
    createSpriteSequenceClip: createSpriteSequenceClip
  };
});
