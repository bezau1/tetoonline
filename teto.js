/**
 * teto.js — UTAU Kasane Teto TTS Engine
 *
 * Folder structure (place next to index.html):
 *   voices/
 *     standard/        ← 重音テト単独音     (files: _あ.wav, _か.wav ...)
 *     standard-vcv/    ← 重音テト連続音
 *     whisper/         ← 重音テトささやき単独音
 *     whisper-vcv/     ← 重音テトささやき連続音
 *     extra/           ← 重音テトエクストラ
 *     edge/            ← 重音テトエッジ単独音
 *     edge-vcv/        ← 重音テトエッジ連続音
 *     weak/            ← 重音テト弱単独音
 *     weak-vcv/        ← 重音テト弱連続音
 *     rikimi/          ← 重音テトカみ音源
 *     sakebi/          ← 重音テト叫び音源
 *     smooth/          ← 重音テト滑らか音源
 *     breath/          ← 重音テト語尾息吸
 *
 * CV files are named: _あ.wav, _か.wav, _R.wav etc.
 */

// ─── Voice bank paths ─────────────────────────────────────────────────────────
const VOICE_BANKS = {
  standard:    'voices/standard/',
  whisper:     'voices/whisper/',
  extra:       'voices/extra/',
  edge:        'voices/edge/',
  weak:        'voices/weak/',
  rikimi:      'voices/rikimi/',
  sakebi:      'voices/sakebi/',
  smooth:      'voices/smooth/',
  english:     'voices/english/',
  past:        'voices/past/',
};

// ─── Kana → filename mapping ──────────────────────────────────────────────────
// Files are named _<kana>.wav (with underscore prefix)
// Digraphs must come first (longer match wins)
const KANA_MAP = [
  // Digraphs
  ['きゃ','きゃ'],['きゅ','きゅ'],['きょ','きょ'],['きぇ','きぇ'],
  ['ぎゃ','ぎゃ'],['ぎゅ','ぎゅ'],['ぎょ','ぎょ'],['ぎぇ','ぎぇ'],
  ['しゃ','しゃ'],['しゅ','しゅ'],['しょ','しょ'],['しぇ','しぇ'],
  ['じゃ','じゃ'],['じゅ','じゅ'],['じょ','じょ'],['じぇ','じぇ'],
  ['ちゃ','ちゃ'],['ちゅ','ちゅ'],['ちょ','ちょ'],['ちぇ','ちぇ'],
  ['にゃ','にゃ'],['にゅ','にゅ'],['にょ','にょ'],['にぇ','にぇ'],
  ['ひゃ','ひゃ'],['ひゅ','ひゅ'],['ひょ','ひょ'],
  ['びゃ','びゃ'],['びゅ','びゅ'],['びょ','びょ'],
  ['ぴゃ','ぴゃ'],['ぴゅ','ぴゅ'],['ぴょ','ぴょ'],
  ['みゃ','みゃ'],['みゅ','みゅ'],['みょ','みょ'],
  ['りゃ','りゃ'],['りゅ','りゅ'],['りょ','りょ'],
  ['てゃ','てゃ'],['てゅ','てゅ'],['てょ','てょ'],
  ['でゃ','でゃ'],['でゅ','でゅ'],['でょ','でょ'],
  ['つぁ','つぁ'],['つぃ','つぃ'],['つぇ','つぇ'],['つぉ','つぉ'],
  ['うぃ','うぃ'],['うぇ','うぇ'],['うぉ','うぉ'],
  ['いぇ','いぇ'],
  ['くぁ','くぁ'],['くぃ','くぃ'],['くぇ','くぇ'],['くぉ','くぉ'],
  ['ぐぁ','ぐぁ'],
  ['ふぁ','ふぁ'],['ふぃ','ふぃ'],['ふぇ','ふぇ'],['ふぉ','ふぉ'],['ふゅ','ふゅ'],
  ['すぃ','すぃ'],['ずぃ','ずぃ'],
  ['とぅ','とぅ'],['どぅ','どぅ'],
  ['てぃ','てぃ'],['でぃ','でぃ'],
  // Single kana
  ['あ','あ'],['い','い'],['う','う'],['え','え'],['お','お'],
  ['か','か'],['き','き'],['く','く'],['け','け'],['こ','こ'],
  ['が','が'],['ぎ','ぎ'],['ぐ','ぐ'],['げ','げ'],['ご','ご'],
  ['さ','さ'],['し','し'],['す','す'],['せ','せ'],['そ','そ'],
  ['ざ','ざ'],['じ','じ'],['ず','ず'],['ぜ','ぜ'],['ぞ','ぞ'],
  ['た','た'],['ち','ち'],['つ','つ'],['て','て'],['と','と'],
  ['だ','だ'],['ぢ','ぢ'],['づ','づ'],['で','で'],['ど','ど'],
  ['な','な'],['に','に'],['ぬ','ぬ'],['ね','ね'],['の','の'],
  ['は','は'],['ひ','ひ'],['ふ','ふ'],['へ','へ'],['ほ','ほ'],
  ['ば','ば'],['び','び'],['ぶ','ぶ'],['べ','べ'],['ぼ','ぼ'],
  ['ぱ','ぱ'],['ぴ','ぴ'],['ぷ','ぷ'],['ぺ','ぺ'],['ぽ','ぽ'],
  ['ま','ま'],['み','み'],['む','む'],['め','め'],['も','も'],
  ['や','や'],['ゆ','ゆ'],['よ','よ'],
  ['ら','ら'],['り','り'],['る','る'],['れ','れ'],['ろ','ろ'],
  ['わ','わ'],['ゐ','ゐ'],['ゑ','ゑ'],['を','を'],
  ['ん','ん'],
  ['っ','っ'],
  ['ゔ','ゔ'],
  // Katakana → hiragana filename (same wav, just map to hiragana name)
  ['ア','あ'],['イ','い'],['ウ','う'],['エ','え'],['オ','お'],
  ['カ','か'],['キ','き'],['ク','く'],['ケ','け'],['コ','こ'],
  ['ガ','が'],['ギ','ぎ'],['グ','ぐ'],['ゲ','げ'],['ゴ','ご'],
  ['サ','さ'],['シ','し'],['ス','す'],['セ','せ'],['ソ','そ'],
  ['ザ','ざ'],['ジ','じ'],['ズ','ず'],['ゼ','ぜ'],['ゾ','ぞ'],
  ['タ','た'],['チ','ち'],['ツ','つ'],['テ','て'],['ト','と'],
  ['ダ','だ'],['ヂ','ぢ'],['ヅ','づ'],['デ','で'],['ド','ど'],
  ['ナ','な'],['ニ','に'],['ヌ','ぬ'],['ネ','ね'],['ノ','の'],
  ['ハ','は'],['ヒ','ひ'],['フ','ふ'],['ヘ','へ'],['ホ','ほ'],
  ['バ','ば'],['ビ','び'],['ブ','ぶ'],['ベ','べ'],['ボ','ぼ'],
  ['パ','ぱ'],['ピ','ぴ'],['プ','ぷ'],['ペ','ぺ'],['ポ','ぽ'],
  ['マ','ま'],['ミ','み'],['ム','む'],['メ','め'],['モ','も'],
  ['ヤ','や'],['ユ','ゆ'],['ヨ','よ'],
  ['ラ','ら'],['リ','り'],['ル','る'],['レ','れ'],['ロ','ろ'],
  ['ワ','わ'],['ヲ','を'],['ン','ん'],
  ['ッ','っ'],
  ['ヴ','ゔ'],
];

// Romaji → kana fallback
const ROMAJI_MAP = {
  'sha':'しゃ','shi':'し','shu':'しゅ','sho':'しょ',
  'chi':'ち','cha':'ちゃ','chu':'ちゅ','cho':'ちょ',
  'tsu':'つ',
  'kya':'きゃ','kyu':'きゅ','kyo':'きょ',
  'nya':'にゃ','nyu':'にゅ','nyo':'にょ',
  'hya':'ひゃ','hyu':'ひゅ','hyo':'ひょ',
  'mya':'みゃ','myu':'みゅ','myo':'みょ',
  'rya':'りゃ','ryu':'りゅ','ryo':'りょ',
  'gya':'ぎゃ','gyu':'ぎゅ','gyo':'ぎょ',
  'bya':'びゃ','byu':'びゅ','byo':'びょ',
  'pya':'ぴゃ','pyu':'ぴゅ','pyo':'ぴょ',
  'ja':'じゃ','ji':'じ','ju':'じゅ','jo':'じょ',
  'ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ',
  'ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご',
  'sa':'さ','si':'し','su':'す','se':'せ','so':'そ',
  'za':'ざ','zi':'じ','zu':'ず','ze':'ぜ','zo':'ぞ',
  'ta':'た','ti':'ち','tu':'つ','te':'て','to':'と',
  'da':'だ','di':'ぢ','du':'づ','de':'で','do':'ど',
  'na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の',
  'ha':'は','hi':'ひ','fu':'ふ','hu':'ふ','he':'へ','ho':'ほ',
  'ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ',
  'pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ',
  'ma':'ま','mi':'み','mu':'む','me':'め','mo':'も',
  'ya':'や','yu':'ゆ','yo':'よ',
  'ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ',
  'wa':'わ','wi':'ゐ','we':'ゑ','wo':'を',
  'a':'あ','i':'い','u':'う','e':'え','o':'お',
  'n':'ん','nn':'ん',
};

// ─── English CVVC phoneme map ─────────────────────────────────────────────────
const ENGLISH_WORDS = {
  'hello': ['he+','lo+'], 'hi': ['hai+'], 'bye': ['bai+'],
  'yes': ['je+','su'], 'no': ['no+'], 'please': ['pli+','zu'],
  'thank': ['t+{','nk'], 'you': ['ju+'], 'love': ['lu+','vu'],
  'i': ['ai+'], 'me': ['mi+'], 'we': ['wi+'],
  'my': ['mai+'], 'your': ['jo+'],
  'good': ['gu+','du'], 'bad': ['b{','du'],
  'cute': ['kju+','tu'], 'nice': ['nai+','su'],
  'cool': ['ku+','lu'], 'wow': ['wau+'],
  'ok': ['o+','kei+'], 'okay': ['o+','kei+'],
  'go': ['go+'], 'come': ['ku+','mu'],
  'look': ['lu+','ku'], 'see': ['si+'],
  'eat': ['i+','tu'], 'run': ['ru+','nu'],
  'sing': ['si+','ngu'], 'dance': ['da+','nsu'],
  'teto': ['te+','to+'], 'kasane': ['ka+','sa+','ne+'],
};

function englishPhonemeToFile(p) {
  // CV pattern like 'ka+', 'ne+', 'bai+'
  const m = p.match(/^([bcdfghjklmnprstvwyz+]*?)([aeiouv+{@3][+]?(?:[iu][+]?)*)$/);
  if (m && m[1]) {
    return `_${p}_${p}_${m[1]}-`;
  }
  // Pure vowel
  return `_${p}_h${p}_${p}_${p}_${p}-`;
}

function englishTextToTokens(text) {
  const tokens = [];
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (!word) continue;
    if (ENGLISH_WORDS[word]) {
      for (const ph of ENGLISH_WORDS[word])
        tokens.push({ type: 'english', file: englishPhonemeToFile(ph) });
    } else {
      // Naive CV fallback
      const vmap = { a:'a+', e:'e+', i:'i+', o:'o+', u:'u+' };
      const cons = 'bcdfghjklmnprstvwyz';
      let i = 0;
      while (i < word.length) {
        const ch = word[i];
        if (cons.includes(ch) && i+1 < word.length && 'aeiou'.includes(word[i+1])) {
          const v = vmap[word[i+1]];
          tokens.push({ type: 'english', file: `_${ch}${v}_${ch}${v}_${ch}-` });
          i += 2;
        } else if ('aeiou'.includes(ch)) {
          const v = vmap[ch];
          tokens.push({ type: 'english', file: `_${v}_h${v}_${v}_${v}_${v}-` });
          i++;
        } else { i++; }
      }
    }
    tokens.push({ type: 'pause', duration: 0.1 });
  }
  return tokens;
}

// ─── Audio context ────────────────────────────────────────────────────────────
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// ─── Text → phoneme tokens ────────────────────────────────────────────────────
function textToTokens(text) {
  const tokens = [];
  let i = 0;
  const lower = text.toLowerCase();

  while (i < text.length) {
    // Skip spaces / punctuation — add a small pause token
    if (/[\s、。,.!?！？]/.test(text[i])) {
      tokens.push({ type: 'pause', duration: /[。.!?！？]/.test(text[i]) ? 0.3 : 0.15 });
      i++;
      continue;
    }

    // Try kana map (digraphs first — they're listed first in KANA_MAP)
    let matched = false;
    for (const [src, file] of KANA_MAP) {
      if (text.startsWith(src, i)) {
        // Skip small kana that are part of digraphs already consumed
        if (['ゃ','ゅ','ょ','ぁ','ぃ','ぅ','ぇ','ぉ','ャ','ュ','ョ'].includes(text[i]) && tokens.length > 0) {
          // already handled as part of digraph above — shouldn't reach here
        }
        tokens.push({ type: 'kana', file });
        i += src.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try romaji (3-char, 2-char, 1-char)
    for (const len of [3, 2, 1]) {
      const chunk = lower.slice(i, i + len);
      if (ROMAJI_MAP[chunk]) {
        // Find the kana file for this
        const kana = ROMAJI_MAP[chunk];
        const entry = KANA_MAP.find(([s]) => s === kana);
        if (entry) {
          tokens.push({ type: 'kana', file: entry[1] });
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (matched) continue;

    // Unknown character — skip
    i++;
  }

  return tokens;
}

// ─── Load & decode wav ────────────────────────────────────────────────────────
const audioCache = {};

async function loadSample(voicePath, filename) {
  // English files already have full filename like _ka+_ka+_k-
  // Extra voicebank uses _x prefix: _xか.wav
  // Japanese files need _prefix added: あ → _あ
  const isEnglish = filename.startsWith('_') && filename.includes('+');
  const isFullPath = filename.startsWith('_') && !filename.includes('+');
  
  let url;
  if (isFullPath) {
    url = voicePath + filename + '.wav';
  } else if (isEnglish) {
    url = voicePath + filename + '.wav';
  } else {
    url = voicePath + '_' + filename + '.wav';
  }
  
  // Try the url, if 404 try with _x prefix (extra bank)
  if (audioCache[url]) return audioCache[url];
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const decoded = await getAudioCtx().decodeAudioData(buf);
    audioCache[url] = decoded;
    return decoded;
  } catch {
    return null;
  }
}

// ─── Play tokens ──────────────────────────────────────────────────────────────
let stopRequested = false;
let activeSources = [];

async function playTokens(tokens, voicePath, speed, pitch) {
  stopRequested = false;
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') await ctx.resume();

  // Pre-load all samples
  setStatus('Loading samples…', false);
  const buffers = await Promise.all(
    tokens.map(t => (t.type === 'kana' || t.type === 'english') ? loadSample(voicePath, t.file) : Promise.resolve(null))
  );

  setStatus('Playing…', true);
  setPlaying(true);

  let time = ctx.currentTime + 0.05;

  for (let i = 0; i < tokens.length; i++) {
    if (stopRequested) break;
    const token = tokens[i];

    if (token.type === 'pause') {
      time += token.duration / speed;
      continue;
    }

    const buf = buffers[i];
    if (!buf) continue;

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.playbackRate.value = speed * pitch;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 1.0;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(time);
    activeSources.push(source);

    // Each sample plays for its duration / speed, with slight overlap
    const sampleDuration = buf.duration / (speed * pitch);
    time += Math.max(sampleDuration * 0.85, 0.05);
  }

  // Wait for playback to finish
  const totalDuration = (time - ctx.currentTime) * 1000;
  await new Promise(r => setTimeout(r, totalDuration + 200));

  setPlaying(false);
  if (!stopRequested) {
    setStatus('Done ✓', false);
    // Render to downloadable wav
    if (!stopRequested) renderAndEnableDownload(tokens, buffers, speed, pitch);
  }
}

async function renderAndEnableDownload(tokens, buffers, speed, pitch) {
  // Calculate total duration
  let totalDur = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'pause') { totalDur += token.duration / speed; continue; }
    const buf = buffers[i];
    if (buf) totalDur += Math.max((buf.duration / (speed * pitch)) * 0.85, 0.05);
  }
  totalDur += 0.3;

  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(totalDur * sampleRate), sampleRate);
  let time = 0.05;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'pause') { time += token.duration / speed; continue; }
    const buf = buffers[i];
    if (!buf) continue;
    const src = offlineCtx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = speed * pitch;
    src.connect(offlineCtx.destination);
    src.start(time);
    time += Math.max((buf.duration / (speed * pitch)) * 0.85, 0.05);
  }

  const rendered = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(rendered);
  const url = URL.createObjectURL(wavBlob);

  const btn = document.getElementById('downloadBtn');
  btn.href = url;
  btn.download = 'teto.wav';
  btn.style.display = 'inline-block';
}

function audioBufferToWav(buffer) {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const data = buffer.getChannelData(0);
  const length = data.length;
  const arrayBuf = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuf);
  const writeStr = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, length * 2, true);
  for (let i = 0; i < length; i++) {
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 0x7FFF, true);
  }
  return new Blob([arrayBuf], { type: 'audio/wav' });
}

function stopAll() {
  stopRequested = true;
  activeSources.forEach(s => { try { s.stop(); } catch {} });
  activeSources = [];
  setPlaying(false);
  setStatus('Stopped', false);
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function setStatus(msg, active) {
  const el = document.getElementById('statusText');
  el.textContent = msg;
  el.className = 'status-text' + (active ? ' active' : '');
}

function setPlaying(playing) {
  document.getElementById('waveform').className = 'waveform' + (playing ? ' playing' : '');
  document.getElementById('speakBtn').disabled = playing;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  let selectedVoice = 'standard';

  // Voice buttons
  document.querySelectorAll('.voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedVoice = btn.dataset.voice;
      // Clear cache when switching voices
      Object.keys(audioCache).forEach(k => delete audioCache[k]);
      setStatus('Voice: ' + btn.textContent, false);
    });
  });

  // Speed slider
  const speedSlider = document.getElementById('speedSlider');
  const speedVal = document.getElementById('speedVal');
  speedSlider.addEventListener('input', () => {
    speedVal.textContent = parseFloat(speedSlider.value).toFixed(2) + '×';
  });

  // Pitch slider
  const pitchSlider = document.getElementById('pitchSlider');
  const pitchVal = document.getElementById('pitchVal');
  pitchSlider.addEventListener('input', () => {
    pitchVal.textContent = parseFloat(pitchSlider.value).toFixed(2) + '×';
  });

  // Speak button
  document.getElementById('speakBtn').addEventListener('click', async () => {
    const text = document.getElementById('textInput').value.trim();
    if (!text) { setStatus('Type something first!', false); return; }
    document.getElementById('downloadBtn').style.display = 'none';

    const tokens = selectedVoice === 'english' ? englishTextToTokens(text) : textToTokens(text);
    if (!tokens.length) { setStatus('No recognizable phonemes found', false); return; }

    const voicePath = VOICE_BANKS[selectedVoice];
    const speed = parseFloat(speedSlider.value);
    const pitch = parseFloat(pitchSlider.value);

    await playTokens(tokens, voicePath, speed, pitch);
  });

  // Stop button
  document.getElementById('stopBtn').addEventListener('click', stopAll);

  // Enter key in textarea
  document.getElementById('textInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('speakBtn').click();
    }
  });

  setStatus('Ready — select a voice and type something', false);
});