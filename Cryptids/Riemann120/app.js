const byId = (id) => document.getElementById(id);

function createProductVisual() {
  const input = byId('n-input');
  const host = document.querySelector('#panel-math > .panel');
  if (!input || !host || host.querySelector('#product-visual')) return;

  const card = document.createElement('div');
  card.id = 'product-visual';
  card.className = 'mt-5 rounded-[var(--radius)] border border-slate-200 bg-white p-3 sm:p-4';
  card.innerHTML = `
    <div class="mb-2">
      <p class="text-sm font-semibold">How the number is built</p>
      <p class="mt-1 text-xs leading-5 text-slate-600">Two groups of factors are multiplied together to make Aₙ.</p>
    </div>
    <svg id="product-visual-svg" class="h-auto w-full" viewBox="0 0 640 286" role="img" aria-labelledby="product-visual-title product-visual-desc"></svg>
    <p class="mt-1 text-xs leading-5 text-slate-600"><strong>Factorial:</strong> every whole number from 1 to n. <strong>Prime product:</strong> every prime number up to n.</p>
  `;
  const inputLabel = host.querySelector('label[for="n-input"]');
  host.insertBefore(card, inputLabel || host.firstChild);
  renderProductVisual();
}

function renderProductVisual() {
  const svg = byId('product-visual-svg');
  const input = byId('n-input');
  if (!svg || !input) return;

  const parsed = Number(input.value);
  const n = Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
  const smallFactors = n <= 7
    ? Array.from({ length: n }, (_, index) => index + 1)
    : [1, 2, 3, 4, 5, '…', n];
  const primes = [];
  for (let value = 2; value <= n; value += 1) {
    let prime = true;
    for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
      if (value % divisor === 0) {
        prime = false;
        break;
      }
    }
    if (prime) primes.push(value);
  }
  const shownPrimes = primes.length <= 7
    ? primes
    : [...primes.slice(0, 5), '…', primes[primes.length - 1]];

  const drawRow = (items, y, fill, textColor) => {
    const cellWidth = Math.min(48, 520 / Math.max(items.length, 1));
    const gap = 7;
    const totalWidth = items.length * cellWidth + (items.length - 1) * gap;
    const startX = (640 - totalWidth) / 2;
    return items.map((item, index) => {
      const x = startX + index * (cellWidth + gap);
      const label = String(item);
      return `<g>
        <rect x="${x}" y="${y}" width="${cellWidth}" height="34" rx="8" fill="${item === '…' ? 'var(--color-surface)' : fill}" stroke="${item === '…' ? 'var(--color-slate-300)' : fill}" stroke-dasharray="${item === '…' ? '3 3' : '0'}" />
        <text x="${x + cellWidth / 2}" y="${y + 22}" text-anchor="middle" fill="${item === '…' ? 'var(--color-muted)' : textColor}" font-family="var(--font-mono)" font-size="14" font-weight="700">${label}</text>
      </g>`;
    }).join('');
  };

  svg.innerHTML = `
    <title id="product-visual-title">Building A n from factorial and prime factors</title>
    <desc id="product-visual-desc">The top row shows the whole numbers multiplied for n factorial. The second row shows the prime numbers up to n. The two products are multiplied to make A n.</desc>
    <rect x="1" y="1" width="638" height="284" rx="var(--radius)" fill="var(--color-bg)" />
    <text x="20" y="27" fill="var(--color-text)" font-family="var(--font-body)" font-size="12" font-weight="700">1 · BUILD THE FACTORIAL n!</text>
    <text x="20" y="48" fill="var(--color-muted)" font-family="var(--font-body)" font-size="11">Multiply every whole number from 1 through n</text>
    ${drawRow(smallFactors, 58, 'var(--color-primary)', 'var(--color-primary-contrast)')}
    <text x="320" y="108" text-anchor="middle" fill="var(--color-primary)" font-family="var(--font-heading)" font-size="18" font-weight="700">×</text>
    <text x="20" y="132" fill="var(--color-text)" font-family="var(--font-body)" font-size="12" font-weight="700">2 · BUILD THE PRIME PRODUCT P(n)</text>
    <text x="20" y="153" fill="var(--color-muted)" font-family="var(--font-body)" font-size="11">Keep only prime numbers no larger than n</text>
    ${drawRow(shownPrimes, 163, 'var(--color-emerald-700)', 'var(--color-primary-contrast)')}
    <path d="M320 203 V218" fill="none" stroke="var(--color-primary)" stroke-width="2" />
    <path d="M314 212 L320 219 L326 212" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="104" y="225" width="432" height="43" rx="var(--radius)" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="2" />
    <text x="320" y="253" text-anchor="middle" fill="var(--color-text)" font-family="var(--font-heading)" font-size="18" font-weight="700">Aₙ = n! × P(n)</text>
  `;
}

function isPrime(value) {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function primorial(n) {
  let product = 1n;
  for (let value = 2; value <= n; value += 1) {
    if (isPrime(value)) product *= BigInt(value);
  }
  return product;
}

function factorial(n) {
  let product = 1n;
  for (let value = 2; value <= n; value += 1) {
    product *= BigInt(value);
  }
  return product;
}

function shuniaProduct(n) {
  return factorial(n) * primorial(n);
}

function offsetDigits(base, value) {
  if (base < 2) return 0;
  let count = 0;
  const bigBase = BigInt(base);

  while (value > 0n) {
    count += 1;
    value = (value - 1n) / bigBase;
  }

  return count;
}

function quarterClock(value) {
  let count = 0;
  while (value > 0) {
    count += 1;
    value = Math.floor(value / 4);
  }
  return count;
}

function calculateNumbers() {
  const input = Number(byId('n-input').value);
  const errorBox = byId('math-error');
  errorBox.classList.add('hidden');

  if (!Number.isInteger(input) || input < 1 || input > 200) {
    errorBox.textContent = 'Enter a whole number from 1 to 200.';
    errorBox.classList.remove('hidden');
    return;
  }

  const p = primorial(input);
  const product = factorial(input) * p;
  const digits = offsetDigits(input, product - 1n);
  const deficit = Math.max(0, input - 1 - digits);
  const clock = quarterClock(input - 1);
  const threshold = BigInt(clock + 1) * (2n ** BigInt(clock));
  const isCounterexample = threshold <= BigInt(deficit);

  byId('primorial-result').textContent = p.toString();
  byId('product-result').textContent = product.toString();
  byId('digits-result').textContent = String(digits);
  byId('deficit-result').textContent = String(deficit);
  byId('clock-result').textContent = String(clock);
  byId('counterexample-badge').textContent = `Predicate: ${isCounterexample}`;
  byId('counterexample-badge').className = isCounterexample ?
    'rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700' :
    'rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700';
  byId('predicate-equation').textContent = `(${clock} + 1) × 2^${clock} = ${threshold.toString()}  ${isCounterexample ? '≤' : '>'}  Δₙ = ${deficit}`;
}

const tabs = [...document.querySelectorAll('.tab-button')];
const panels = [...document.querySelectorAll('.tab-panel')];

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.tab;
    tabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('tab-active', active);
      button.classList.toggle('border-transparent', !active);
      button.classList.toggle('text-slate-500', !active);
      button.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.id !== `panel-${selected}`);
    });
  });
});

let machine = null;

function parseRules(text) {
  const rules = new Map();
  const lines = text.split('\n');

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) return;

    const fields = line.split(',').map((field) => field.trim());
    if (fields.length !== 5) {
      throw new Error(`Line ${index + 1}: expected state,read,write,move,next.`);
    }

    const [state, read, write, moveRaw, next] = fields;
    const move = moveRaw.toUpperCase();
    if (!state || !next || !['_', '0', '1'].includes(read) || !['_', '0', '1'].includes(write)) {
      throw new Error(`Line ${index + 1}: use a state name and symbols 0, 1, or _.`);
    }
    if (!['L', 'R'].includes(move)) {
      throw new Error(`Line ${index + 1}: direction must be L or R.`);
    }

    const key = `${state}\u0000${read}`;
    if (rules.has(key)) {
      throw new Error(`Line ${index + 1}: duplicate rule for state ${state} reading ${read}.`);
    }
    rules.set(key, {
      write,
      move,
      next
    });
  });

  return rules;
}

function readTapeSymbol(position) {
  return machine.tape.get(position) ?? '_';
}

function machineMessage(text, type = 'neutral') {
  const status = byId('machine-status');
  status.textContent = text;
  status.className = type === 'good' ?
    'rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700' :
    type === 'bad' ?
    'rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700' :
    'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600';
}

function addLog(message) {
  const list = byId('machine-log');
  const empty = list.querySelector('[data-empty]');
  if (empty) empty.remove();
  const item = document.createElement('li');
  item.textContent = message;
  list.prepend(item);
  while (list.children.length > 6) list.lastElementChild.remove();
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attributes).forEach(([attribute, value]) => {
    element.setAttribute(attribute, value);
  });
  return element;
}

function renderMachine() {
  if (!machine) return;

  const svg = byId('machine-visualizer');
  svg.replaceChildren();

  const title = createSvgElement('title', { id: 'machine-svg-title' });
  title.textContent = 'Turing machine tape visualizer';
  svg.append(title);

  const description = createSvgElement('desc', { id: 'machine-svg-description' });
  description.textContent = `State ${machine.state}; tape head at cell ${machine.head}; ${machine.steps} steps completed.`;
  svg.append(description);

  const stateBox = createSvgElement('rect', {
    x: '350',
    y: '16',
    width: '200',
    height: '46',
    rx: 'var(--radius)',
    fill: 'var(--color-surface)',
    stroke: 'var(--color-primary)',
    'stroke-width': '2'
  });
  svg.append(stateBox);

  const stateText = createSvgElement('text', {
    x: '450',
    y: '45',
    'text-anchor': 'middle',
    fill: 'var(--color-text)',
    'font-family': 'var(--font-heading)',
    'font-size': '17',
    'font-weight': '700'
  });
  stateText.textContent = `State: ${machine.state}`;
  svg.append(stateText);

  const headLine = createSvgElement('line', {
    x1: '450',
    y1: '64',
    x2: '450',
    y2: '96',
    stroke: 'var(--color-primary)',
    'stroke-width': '2'
  });
  svg.append(headLine);

  const headArrow = createSvgElement('path', {
    d: 'M 444 90 L 450 98 L 456 90',
    fill: 'none',
    stroke: 'var(--color-primary)',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });
  svg.append(headArrow);

  const positions = 9;
  const cellWidth = 76;
  const gap = 10;
  const totalWidth = positions * cellWidth + (positions - 1) * gap;
  const firstX = (900 - totalWidth) / 2;

  for (let offset = -4; offset <= 4; offset += 1) {
    const position = machine.head + offset;
    const x = firstX + (offset + 4) * (cellWidth + gap);
    const isHead = offset === 0;

    const cell = createSvgElement('rect', {
      x: String(x),
      y: '101',
      width: String(cellWidth),
      height: '62',
      rx: 'var(--radius)',
      fill: isHead ? 'var(--color-primary)' : 'var(--color-surface)',
      stroke: isHead ? 'var(--color-primary)' : 'var(--color-slate-300)',
      'stroke-width': isHead ? '3' : '1.5'
    });
    svg.append(cell);

    const symbol = createSvgElement('text', {
      x: String(x + cellWidth / 2),
      y: '141',
      'text-anchor': 'middle',
      fill: isHead ? 'var(--color-primary-contrast)' : 'var(--color-text)',
      'font-family': 'var(--font-mono)',
      'font-size': '24',
      'font-weight': isHead ? '700' : '500'
    });
    symbol.textContent = readTapeSymbol(position);
    svg.append(symbol);

    const coordinate = createSvgElement('text', {
      x: String(x + cellWidth / 2),
      y: '184',
      'text-anchor': 'middle',
      fill: 'var(--color-muted)',
      'font-family': 'var(--font-mono)',
      'font-size': '12'
    });
    coordinate.textContent = String(position);
    svg.append(coordinate);
  }

  const headLabel = createSvgElement('text', {
    x: '450',
    y: '216',
    'text-anchor': 'middle',
    fill: 'var(--color-primary)',
    'font-family': 'var(--font-body)',
    'font-size': '12',
    'font-weight': '700'
  });
  headLabel.textContent = `TAPE HEAD · CELL ${machine.head} · ${machine.steps} STEPS`;
  svg.append(headLabel);

  byId('current-state').textContent = machine.state;
  byId('head-position').textContent = String(machine.head);
  byId('step-count').textContent = String(machine.steps);
}

function loadMachine() {
  const errorBox = byId('machine-error');
  errorBox.classList.add('hidden');

  try {
    const rules = parseRules(byId('rules-input').value);
    const input = byId('tape-input').value.trim();
    if (!/^[01]*$/.test(input)) {
      throw new Error('Starting tape can contain only 0 and 1. An empty tape is allowed.');
    }
    const state = byId('state-input').value.trim();
    if (!state) throw new Error('Enter a starting state.');

    const tape = new Map();
    [...input].forEach((symbol, position) => tape.set(position, symbol));
    machine = {
      rules,
      tape,
      head: 0,
      state,
      steps: 0,
      halted: false
    };
    byId('machine-log').replaceChildren();
    addLog(`Started in state “${state}” with ${input.length} tape cells.`);
    byId('last-action').textContent = `Ready! The machine is in state “${state}”. Its pointer starts on the first tape cell. Take one step to see what it does.`;
    machineMessage('Ready to start');
    renderMachine();
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove('hidden');
  }
}

function stepMachine() {
  if (!machine) {
    loadMachine();
    if (!machine) return false;
  }
  if (machine.halted) return false;

  const read = readTapeSymbol(machine.head);
  const rule = machine.rules.get(`${machine.state}\u0000${read}`);
  if (!rule) {
    machine.halted = true;
    machineMessage(`Halted · no rule for ${machine.state} / ${read}`, 'good');
    addLog(`No instruction for state ${machine.state} reading ${read}; machine stopped.`);
    byId('last-action').textContent = `The machine stopped: there is no instruction for state “${machine.state}” when it sees “${read}”. Try another tape or update the advanced instructions.`;
    renderMachine();
    return false;
  }

  const oldState = machine.state;
  const oldHead = machine.head;
  if (rule.write === '_') machine.tape.delete(machine.head);
  else machine.tape.set(machine.head, rule.write);
  machine.head += rule.move === 'R' ? 1 : -1;
  machine.state = rule.next;
  machine.steps += 1;

  if (machine.state.toLowerCase() === 'halt') {
    machine.halted = true;
    machineMessage('Halted', 'good');
  } else if (machine.steps >= 10000) {
    machine.halted = true;
    machineMessage('Step limit reached', 'bad');
  } else {
    machineMessage('Running');
  }

  const direction = rule.move === 'R' ? 'right' : 'left';
  const writtenText = rule.write === '_' ? 'left the cell empty' : `wrote “${rule.write}”`;
  byId('last-action').textContent = `It saw “${read}” in cell ${oldHead}, ${writtenText}, moved one cell ${direction}, and switched from state “${oldState}” to “${rule.next}”. The highlight shows where it is now.`;
  addLog(`Saw ${read} in cell ${oldHead}: wrote ${rule.write}, moved ${direction}, changed to ${rule.next}.`);
  renderMachine();
  return !machine.halted;
}

function runMachine() {
  if (!machine) {
    loadMachine();
    if (!machine) return;
  }
  for (let count = 0; count < 100 && !machine.halted; count += 1) {
    if (!stepMachine()) break;
  }
  if (!machine.halted) machineMessage('Paused after 100 steps');
}

byId('calculate-button').addEventListener('click', calculateNumbers);
byId('n-input').addEventListener('input', renderProductVisual);
byId('n-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') calculateNumbers();
});
byId('reset-machine').addEventListener('click', loadMachine);
byId('step-machine').addEventListener('click', stepMachine);
byId('run-machine').addEventListener('click', runMachine);

createProductVisual();
calculateNumbers();
loadMachine();
