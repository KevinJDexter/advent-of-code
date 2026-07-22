// Advent of Code helper server.
// Run with: node server.js   (then open http://localhost:3000)
// Zero dependencies — uses only Node built-ins. Runs days via ts-node,
// exactly the way src/Main.ts does.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 3000;
const SRC = path.join(__dirname, 'src');

// ---- helpers -------------------------------------------------------------

const getYears = () =>
  fs.readdirSync(SRC, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{4}$/.test(d.name))
    .filter(d => fs.existsSync(path.join(SRC, d.name, 'ChallengeCode')))
    .map(d => d.name)
    .sort();

const FOLDERS = { manual: 'ChallengeCode', ai: 'ChallengeCodeAI' };

const getDays = (year, source) => {
  const dir = path.join(SRC, year, FOLDERS[source]);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map(f => (f.match(/^(Day\d{2})\.ts$/) || [])[1])
    .filter(Boolean)
    .sort();
};

const json = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};

// Mirrors src/Main.ts: read input file, split, time the run.
const runDay = (year, day, source, cb) => {
  const suffix = source === 'ai' ? 'AI' : '';
  const script = `
    const path = require('path');
    const fs = require('fs');
    const YearMethods = require('./src/YearExports');
    const year = ${JSON.stringify(year)};
    const day = ${JSON.stringify(day)};
    console.log(year, '-', day, ${JSON.stringify(source === 'ai' ? '(AI)' : '(Manual)')});
    const inputPath = path.join(process.cwd(), 'src', year, 'Inputs', day + 'Input.txt');
    const fileInput = fs.readFileSync(inputPath, 'utf8');
    const input = fileInput.split(/\\n+/);
    const methods = YearMethods['Year' + year + ${JSON.stringify(suffix)}];
    if (!methods || typeof methods[day] !== 'function') {
      console.error(day + ' is not exported from src/' + year + '/${FOLDERS[source] || ''}/DayExports.ts — add "export * from \\'./' + day + '\\';" to it.');
      process.exit(1);
    }
    const startTime = new Date();
    methods[day](input);
    const endTime = new Date();
    console.log('Algorithm Run time: ' + (endTime.valueOf() - startTime.valueOf()) + 'ms');
  `;
  const child = spawn('npx', ['ts-node', '-e', script], { cwd: __dirname });
  let out = '', err = '';
  child.stdout.on('data', d => out += d);
  child.stderr.on('data', d => err += d);
  child.on('close', code => cb({ code, out, err }));
  child.on('error', e => cb({ code: -1, out, err: String(e) }));
};

// ---- server --------------------------------------------------------------

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(PAGE);
  }

  if (url.pathname === '/api/years') {
    return json(res, 200, getYears());
  }

  if (url.pathname === '/api/days') {
    const year = url.searchParams.get('year') || '';
    const source = url.searchParams.get('source') || 'manual';
    if (!/^\d{4}$/.test(year) || !FOLDERS[source]) return json(res, 400, { error: 'bad year/source' });
    return json(res, 200, getDays(year, source));
  }

  if (url.pathname === '/api/run') {
    const year = url.searchParams.get('year') || '';
    const day = url.searchParams.get('day') || '';
    const source = url.searchParams.get('source') || 'manual';
    if (!/^\d{4}$/.test(year) || !/^Day\d{2}$/.test(day) || !FOLDERS[source]) {
      return json(res, 400, { error: 'bad year/day/source' });
    }
    return runDay(year, day, source, result => json(res, 200, result));
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Advent of Code helper running at http://localhost:${PORT}`);
});

// ---- page ----------------------------------------------------------------

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Advent of Code Runner</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: #0f0f23; color: #ccc;
         margin: 0; padding: 20px; }
  h1 { color: #00cc00; font-size: 1.4em; margin: 0 0 30px 0; text-align: center; }
  h1 span { color: #ffff66; }
  select, button { font-size: 1em; padding: 6px 10px; background: #10101a;
                   color: #ccc; border: 1px solid #333340; border-radius: 4px; }
  button { background: #009900; color: #fff; cursor: pointer; border: none; font-weight: bold; }
  button:hover:not(:disabled) { background: #00cc00; }
  button:disabled { background: #333; cursor: not-allowed; opacity: 0.5; }
  .controls { display: flex; gap: 40px; justify-content: center; margin-bottom: 40px; }
  .control-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .control-group label { color: #00cc00; font-weight: bold; font-size: 0.95em; }
  .control-group select { min-width: 140px; text-align: center; }
  .consoles { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; margin-bottom: 20px; }
  .console { display: flex; flex-direction: column; }
  .console-header { color: #00cc00; font-weight: bold; margin-bottom: 10px; font-size: 0.9em; }
  .console-output { background: #10101a; border: 1px solid #333340; border-radius: 6px;
                    padding: 12px; min-height: 300px; max-height: 400px; overflow-y: auto;
                    white-space: pre-wrap; font-size: 0.85em; font-family: monospace;
                    flex: 1; }
  .console-buttons { display: flex; gap: 8px; margin-top: 10px; }
  .console-buttons button { flex: 1; }
  .compare-btn { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding-bottom: 20px; gap: 15px; }
  .compare-btn button { width: 100px; text-align: center; }
  .comparison-result { text-align: center; min-height: 60px; display: flex; flex-direction: column; justify-content: center; gap: 6px; font-size: 0.9em; }
  .comparison { background: #10101a; border: 1px solid #333340; border-radius: 6px;
                padding: 12px; margin-top: 20px; font-size: 0.85em; }
  .comparison-item { margin-bottom: 10px; }
  .match { color: #00cc00; }
  .mismatch { color: #ff5555; }
  .timing { color: #ffff66; }
  .err { color: #ff5555; }
  .no-output { color: #888; font-style: italic; }
  select { cursor: pointer; }
</style>
</head>
<body>
<h1>Advent of Code <span>*runner*</span></h1>
<div class="controls">
  <div class="control-group">
    <label>Year</label>
    <select id="year"></select>
  </div>
  <div class="control-group">
    <label>Day</label>
    <select id="day"></select>
  </div>
</div>

<div class="consoles">
  <div class="console">
    <div class="console-header">Manual</div>
    <div class="console-output" id="manualOutput">Select a year and day, then run.</div>
    <div class="console-buttons">
      <button id="manualBtn">Run Manual</button>
    </div>
  </div>

  <div class="compare-btn">
    <div class="comparison-result" id="comparisonResult"></div>
    <button id="compareBtn">Compare</button>
  </div>

  <div class="console">
    <div class="console-header">AI</div>
    <div class="console-output" id="aiOutput">Select a year and day, then run.</div>
    <div class="console-buttons">
      <button id="aiBtn">Run AI</button>
    </div>
  </div>
</div>

<script>
const yearSel = document.getElementById('year');
const daySel = document.getElementById('day');
const manualBtn = document.getElementById('manualBtn');
const aiBtn = document.getElementById('aiBtn');
const compareBtn = document.getElementById('compareBtn');
const manualOutput = document.getElementById('manualOutput');
const aiOutput = document.getElementById('aiOutput');
const comparisonResult = document.getElementById('comparisonResult');

let availableDays = { manual: [], ai: [] };
let lastResults = { manual: null, ai: null };

const fill = (sel, items) => {
  sel.innerHTML = '';
  items.forEach(v => sel.add(new Option(v, v)));
};

const updateButtonStates = () => {
  const hasManual = availableDays.manual.includes(daySel.value);
  const hasAI = availableDays.ai.includes(daySel.value);

  manualBtn.disabled = !hasManual;
  aiBtn.disabled = !hasAI;
  compareBtn.disabled = !daySel.value || (!hasManual || !hasAI);
};

const loadDays = async () => {
  availableDays.manual = await (await fetch('/api/days?year=' + yearSel.value + '&source=manual')).json();
  availableDays.ai = await (await fetch('/api/days?year=' + yearSel.value + '&source=ai')).json();

  const allDays = [...new Set([...availableDays.manual, ...availableDays.ai])].sort();
  fill(daySel, allDays);
  if (!allDays.length) daySel.add(new Option('(no days)', ''));

  updateButtonStates();
};

const runSource = async (source) => {
  if (!daySel.value) return;

  const btn = source === 'manual' ? manualBtn : aiBtn;
  const output = source === 'manual' ? manualOutput : aiOutput;

  btn.disabled = true;
  output.textContent = 'Running ' + yearSel.value + ' ' + daySel.value + ' (' + source + ')...';

  try {
    const r = await (await fetch('/api/run?year=' + yearSel.value + '&day=' + daySel.value + '&source=' + source)).json();
    lastResults[source] = r;

    output.innerHTML = '';
    let html = '';
    if (r.out) html += r.out;
    if (r.err) html += '<span class="err">\\n' + r.err + '</span>';
    if (!r.out && !r.err) html = '<span class="no-output">(no output, exit code ' + r.code + ')</span>';

    output.innerHTML = html;
  } catch (e) {
    output.textContent = 'Request failed: ' + e;
    lastResults[source] = null;
  }

  btn.disabled = false;
};

const showComparison = async () => {
  if (!daySel.value) return;

  compareBtn.disabled = true;
  comparisonResult.innerHTML = 'Running...';

  // Run both sources
  await runSource('manual');
  await runSource('ai');

  if (!lastResults.manual || !lastResults.ai) {
    comparisonResult.innerHTML = '<span class="err">Error running one or both sources.</span>';
    compareBtn.disabled = false;
    return;
  }

  const manualOut = lastResults.manual.out || '';
  const aiOut = lastResults.ai.out || '';
  const manualTime = extractTime(lastResults.manual.out);
  const aiTime = extractTime(lastResults.ai.out);
  const manualNumbers = extractNumbers(manualOut);
  const aiNumbers = extractNumbers(aiOut);
  const numbersMatch = JSON.stringify(manualNumbers) === JSON.stringify(aiNumbers);

  let html = '';
  html += numbersMatch
    ? '<span class="match">✓ Match</span>'
    : '<span class="mismatch">✗ Differ</span>';

  if (manualTime && aiTime) {
    if (manualTime === aiTime) {
      html += '<span class="timing">Same speed</span>';
    } else {
      const faster = manualTime < aiTime ? 'Manual' : 'AI';
      const diff = Math.abs(manualTime - aiTime);
      html += '<span class="timing">' + faster + ' faster by ' + diff.toFixed(0) + 'ms</span>';
    }
  }

  comparisonResult.innerHTML = html;
  compareBtn.disabled = false;
};

const extractTime = (output) => {
  if (!output) return null;
  const match = output.match(/Algorithm Run time: (\\d+)ms/);
  return match ? parseInt(match[1]) : null;
};

const extractNumbers = (output) => {
  if (!output) return [];
  // Remove the "Algorithm Run time:" line before extracting numbers
  const withoutTiming = output.replace(/Algorithm Run time: \\d+ms/g, '');
  const matches = withoutTiming.match(/\\d+/g) || [];
  // Filter to significant numbers (3+ digits) to ignore metadata like Day01, line numbers, etc
  return matches.map(m => parseInt(m)).filter(n => n >= 100);
};

(async () => {
  const years = await (await fetch('/api/years')).json();
  fill(yearSel, years);
  yearSel.value = years[years.length - 1];
  await loadDays();
})();

yearSel.onchange = loadDays;
daySel.onchange = updateButtonStates;
manualBtn.onclick = () => runSource('manual');
aiBtn.onclick = () => runSource('ai');
compareBtn.onclick = showComparison;
</script>
</body>
</html>`;
