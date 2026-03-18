// ===== Section 1: Resizable Viewport Playground =====

const resizableFrame = document.getElementById('resizableFrame');
const resizeHandle = document.getElementById('resizeHandle');
const widthCounter = document.getElementById('widthCounter');
const breakpointBar = document.getElementById('breakpointBar');
const activeRulesCode = document.getElementById('activeRulesCode');
const playgroundContent = document.getElementById('playgroundContent');
const pgNavLinks = document.getElementById('pgNavLinks');
const pgHamburger = document.getElementById('pgHamburger');
const pgCards = document.getElementById('pgCards');

// Breakpoint definitions
const breakpoints = [
  { name: 'mobile', max: 479 },
  { name: 'tablet', min: 480, max: 767 },
  { name: 'desktop', min: 768, max: 1023 },
  { name: 'wide', min: 1024 }
];

function getActiveBreakpoint(width) {
  for (const bp of breakpoints) {
    if (bp.min === undefined && width <= bp.max) return bp.name;
    if (bp.max === undefined && width >= bp.min) return bp.name;
    if (bp.min !== undefined && bp.max !== undefined && width >= bp.min && width <= bp.max) return bp.name;
  }
  return 'mobile';
}

function updatePlayground(width) {
  // Update width counter
  widthCounter.textContent = `↔ ${Math.round(width)}px`;

  // Update breakpoint bar
  const activeBp = getActiveBreakpoint(width);
  breakpointBar.querySelectorAll('.bp-segment').forEach(seg => {
    seg.classList.toggle('active', seg.dataset.bp === activeBp);
  });

  // Update playground layout based on width
  if (width < 480) {
    // Mobile
    pgNavLinks.style.display = 'none';
    pgHamburger.style.display = 'block';
    pgCards.style.gridTemplateColumns = '1fr';
    activeRulesCode.textContent = `/* Base styles (no media query) */
.pg-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.pg-nav-links { display: none; }
.pg-hamburger { display: block; }`;
  } else if (width < 768) {
    // Tablet
    pgNavLinks.style.display = 'flex';
    pgHamburger.style.display = 'none';
    pgCards.style.gridTemplateColumns = 'repeat(2, 1fr)';
    activeRulesCode.textContent = `/* @media (min-width: 480px) */
.pg-cards {
  grid-template-columns: repeat(2, 1fr);
}
.pg-nav-links { display: flex; }
.pg-hamburger { display: none; }`;
  } else if (width < 1024) {
    // Desktop
    pgNavLinks.style.display = 'flex';
    pgHamburger.style.display = 'none';
    pgCards.style.gridTemplateColumns = 'repeat(3, 1fr)';
    activeRulesCode.textContent = `/* @media (min-width: 768px) */
.pg-cards {
  grid-template-columns: repeat(3, 1fr);
}
.pg-nav-links { display: flex; }
.pg-hamburger { display: none; }`;
  } else {
    // Wide
    pgNavLinks.style.display = 'flex';
    pgHamburger.style.display = 'none';
    pgCards.style.gridTemplateColumns = 'repeat(3, 1fr)';
    activeRulesCode.textContent = `/* @media (min-width: 1024px) */
.pg-cards {
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.pg-card {
  padding: 24px;
}`;
    pgCards.style.gap = '20px';
  }

  // Reset gap for non-wide breakpoints
  if (width < 1024) {
    pgCards.style.gap = '12px';
  }
}

// Drag-to-resize logic
let isDragging = false;

resizeHandle.addEventListener('mousedown', (e) => {
  isDragging = true;
  resizeHandle.classList.add('dragging');
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = resizableFrame.parentElement.getBoundingClientRect();
  const newWidth = Math.max(260, Math.min(e.clientX - rect.left, rect.width));
  resizableFrame.style.width = newWidth + 'px';
  updatePlayground(newWidth);
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    resizeHandle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
});

// Touch support
resizeHandle.addEventListener('touchstart', (e) => {
  isDragging = true;
  resizeHandle.classList.add('dragging');
  e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const rect = resizableFrame.parentElement.getBoundingClientRect();
  const newWidth = Math.max(260, Math.min(touch.clientX - rect.left, rect.width));
  resizableFrame.style.width = newWidth + 'px';
  updatePlayground(newWidth);
});

document.addEventListener('touchend', () => {
  if (isDragging) {
    isDragging = false;
    resizeHandle.classList.remove('dragging');
  }
});

// Initial state
updatePlayground(resizableFrame.offsetWidth);


// ===== Section 2: Breakpoint Builder =====

const mqFeature = document.getElementById('mqFeature');
const mqValueGroup = document.getElementById('mqValueGroup');
const mqDiscreteGroup = document.getElementById('mqDiscreteGroup');
const mqValue = document.getElementById('mqValue');
const mqValueLabel = document.getElementById('mqValueLabel');
const mqDiscreteValue = document.getElementById('mqDiscreteValue');
const mqProperty = document.getElementById('mqProperty');
const mqPropValue = document.getElementById('mqPropValue');
const generatedCode = document.getElementById('generatedCode');
const btBox = document.getElementById('btBox');

// Map features to discrete/range
const discreteFeatures = {
  'orientation': ['portrait', 'landscape'],
  'prefers-color-scheme': ['dark', 'light'],
  'prefers-reduced-motion': ['reduce', 'no-preference']
};

function updateBuilderUI() {
  const feature = mqFeature.value;
  if (discreteFeatures[feature]) {
    mqValueGroup.style.display = 'none';
    mqDiscreteGroup.style.display = 'block';
    // Populate discrete options
    mqDiscreteValue.innerHTML = '';
    discreteFeatures[feature].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      mqDiscreteValue.appendChild(opt);
    });
  } else {
    mqValueGroup.style.display = 'block';
    mqDiscreteGroup.style.display = 'none';
  }
  updateGeneratedCode();
}

function updateGeneratedCode() {
  const feature = mqFeature.value;
  let featureValue;
  if (discreteFeatures[feature]) {
    featureValue = mqDiscreteValue.value;
  } else {
    featureValue = mqValue.value + 'px';
    mqValueLabel.textContent = featureValue;
  }

  const prop = mqProperty.value;
  const propVal = mqPropValue.value;

  const code = `@media (${feature}: ${featureValue}) {\n  .target {\n    ${prop}: ${propVal};\n  }\n}`;
  generatedCode.textContent = code;

  // Apply the rule live: for width-based features, check window width
  applyBuilderRule(feature, featureValue, prop, propVal);
}

function applyBuilderRule(feature, featureValue, prop, propVal) {
  // Check if the media query condition is currently met
  let matches = false;
  const mq = window.matchMedia(`(${feature}: ${featureValue})`);
  matches = mq.matches;

  // Reset to default first
  btBox.style.cssText = '';
  btBox.textContent = matches ? '✓ Query matches!' : 'Query does not match';

  if (matches) {
    btBox.style[toCamelCase(prop)] = propVal;
    btBox.style.boxShadow = '0 0 0 3px var(--primary)';
  }
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

mqFeature.addEventListener('change', updateBuilderUI);
mqValue.addEventListener('input', updateGeneratedCode);
mqDiscreteValue.addEventListener('change', updateGeneratedCode);
mqProperty.addEventListener('change', updateGeneratedCode);
mqPropValue.addEventListener('input', updateGeneratedCode);

// Also re-evaluate on window resize
window.addEventListener('resize', updateGeneratedCode);

updateBuilderUI();


// ===== Section 3: Common Patterns =====

const patternsTabs = document.getElementById('patternsTabs');
const patternCodeContent = document.getElementById('patternCodeContent');
const patternRender = document.getElementById('patternRender');
const patternFrame = document.getElementById('patternFrame');
const patternResizeHandle = document.getElementById('patternResizeHandle');
const patternWidthCounter = document.getElementById('patternWidthCounter');

const patterns = {
  'mobile-first': {
    code: `/* Mobile-First: start small, add complexity */

/* Base (mobile) */
.cards { 
  display: grid;
  grid-template-columns: 1fr; 
}

/* Tablet and up */
@media (min-width: 480px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and up */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}`,
    render: () => `
      <div class="ptn-cards" id="ptnMFCards">
        <div class="ptn-card">Card 1</div>
        <div class="ptn-card">Card 2</div>
        <div class="ptn-card">Card 3</div>
        <div class="ptn-card">Card 4</div>
        <div class="ptn-card">Card 5</div>
        <div class="ptn-card">Card 6</div>
      </div>`,
    update: (w) => {
      const cards = document.getElementById('ptnMFCards');
      if (!cards) return;
      if (w >= 768) cards.style.gridTemplateColumns = 'repeat(3, 1fr)';
      else if (w >= 480) cards.style.gridTemplateColumns = 'repeat(2, 1fr)';
      else cards.style.gridTemplateColumns = '1fr';
    }
  },
  'desktop-first': {
    code: `/* Desktop-First: start full, remove complexity */

/* Base (desktop) */
.cards { 
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
}

/* Tablet and below */
@media (max-width: 767px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile and below */
@media (max-width: 479px) {
  .cards { grid-template-columns: 1fr; }
}`,
    render: () => `
      <div class="ptn-cards" id="ptnDFCards">
        <div class="ptn-card">Card 1</div>
        <div class="ptn-card">Card 2</div>
        <div class="ptn-card">Card 3</div>
        <div class="ptn-card">Card 4</div>
        <div class="ptn-card">Card 5</div>
        <div class="ptn-card">Card 6</div>
      </div>`,
    update: (w) => {
      const cards = document.getElementById('ptnDFCards');
      if (!cards) return;
      if (w <= 479) cards.style.gridTemplateColumns = '1fr';
      else if (w <= 767) cards.style.gridTemplateColumns = 'repeat(2, 1fr)';
      else cards.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
  },
  'responsive-nav': {
    code: `/* Responsive Navigation */

/* Base: horizontal links */
.nav-links { display: flex; gap: 14px; }
.hamburger { display: none; }

/* On small screens: hide links, show hamburger */
@media (max-width: 600px) {
  .nav-links { display: none; }
  .hamburger { display: block; }
}`,
    render: () => `
      <div class="ptn-nav" id="ptnNavBar">
        <span class="ptn-nav-logo">Brand</span>
        <div class="ptn-nav-links" id="ptnNavLinks2">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>
        <button class="ptn-hamburger" id="ptnHam2">☰</button>
      </div>
      <div style="padding:16px; color: var(--text-secondary); font-size: 0.82rem;">
        ← Resize to see the nav switch between horizontal links and a hamburger icon.
      </div>`,
    update: (w) => {
      const links = document.getElementById('ptnNavLinks2');
      const ham = document.getElementById('ptnHam2');
      if (!links || !ham) return;
      if (w <= 600) {
        links.style.display = 'none';
        ham.style.display = 'block';
      } else {
        links.style.display = 'flex';
        ham.style.display = 'none';
      }
    }
  },
  'card-reflow': {
    code: `/* Card Reflow with auto-fit */

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

/* No media query needed!
   auto-fit + minmax() handles reflow
   automatically as container shrinks. */`,
    render: () => `
      <div class="ptn-cards" id="ptnAutoCards" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
        <div class="ptn-card">🎨 Design</div>
        <div class="ptn-card">⚡ Build</div>
        <div class="ptn-card">🚀 Ship</div>
        <div class="ptn-card">📊 Measure</div>
        <div class="ptn-card">🔄 Iterate</div>
      </div>
      <div style="padding:12px 0 0; color: var(--text-secondary); font-size: 0.82rem;">
        ← This uses <code>auto-fit</code> + <code>minmax()</code> — no media query needed!
      </div>`,
    update: () => {} // auto-fit handles it
  },
  'dark-mode': {
    code: `/* Dark Mode via prefers-color-scheme */

.panel {
  background: #ffffff;
  color: #111111;
}

@media (prefers-color-scheme: dark) {
  .panel {
    background: #1a1a1a;
    color: #f1f1f1;
  }
}

/* You can also combine with a class toggle
   for manual user control. */`,
    render: () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return `
      <div class="ptn-dark-demo" id="ptnDarkPanel" style="background:${prefersDark ? '#1a1a1a' : '#ffffff'}; color:${prefersDark ? '#f1f1f1' : '#111'};">
        <h3>Hello, User 👋</h3>
        <p>This panel responds to your system's color scheme preference.</p>
        <p style="margin-top:10px; font-size:0.75rem; opacity:0.6;">Current preference: <strong>${prefersDark ? 'dark' : 'light'}</strong></p>
      </div>
      <button id="ptnToggleDark" class="btn btn-secondary" style="margin-top:12px; width:100%; font-size: 0.82rem;">Toggle Dark / Light (simulate)</button>`;
    },
    update: () => {},
    afterRender: () => {
      const toggleBtn = document.getElementById('ptnToggleDark');
      const panel = document.getElementById('ptnDarkPanel');
      if (!toggleBtn || !panel) return;
      let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      toggleBtn.addEventListener('click', () => {
        dark = !dark;
        panel.style.background = dark ? '#1a1a1a' : '#ffffff';
        panel.style.color = dark ? '#f1f1f1' : '#111';
        panel.querySelector('strong').textContent = dark ? 'dark' : 'light';
      });
    }
  }
};

let activePattern = 'mobile-first';
let patternUpdateFn = null;

function renderPattern(name) {
  const pattern = patterns[name];
  if (!pattern) return;

  activePattern = name;
  patternCodeContent.textContent = pattern.code;
  patternRender.innerHTML = pattern.render();
  patternUpdateFn = pattern.update;

  // Call update with current width
  if (patternUpdateFn) {
    patternUpdateFn(patternFrame.offsetWidth);
  }

  // Post-render hooks
  if (pattern.afterRender) {
    pattern.afterRender();
  }

  // Update tabs
  patternsTabs.querySelectorAll('.pattern-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.pattern === name);
  });
}

patternsTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.pattern-tab');
  if (!tab) return;
  renderPattern(tab.dataset.pattern);
});

// Pattern frame resize
let isPatternDragging = false;

patternResizeHandle.addEventListener('mousedown', (e) => {
  isPatternDragging = true;
  patternResizeHandle.classList.add('dragging');
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isPatternDragging) return;
  const rect = patternFrame.parentElement.getBoundingClientRect();
  const newWidth = Math.max(260, Math.min(e.clientX - rect.left, rect.width));
  patternFrame.style.width = newWidth + 'px';
  patternWidthCounter.textContent = `↔ ${Math.round(newWidth)}px`;
  if (patternUpdateFn) patternUpdateFn(newWidth);
});

document.addEventListener('mouseup', () => {
  if (isPatternDragging) {
    isPatternDragging = false;
    patternResizeHandle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
});

// Pattern frame touch support
patternResizeHandle.addEventListener('touchstart', (e) => {
  isPatternDragging = true;
  patternResizeHandle.classList.add('dragging');
  e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
  if (!isPatternDragging) return;
  const touch = e.touches[0];
  const rect = patternFrame.parentElement.getBoundingClientRect();
  const newWidth = Math.max(260, Math.min(touch.clientX - rect.left, rect.width));
  patternFrame.style.width = newWidth + 'px';
  patternWidthCounter.textContent = `↔ ${Math.round(newWidth)}px`;
  if (patternUpdateFn) patternUpdateFn(newWidth);
});

document.addEventListener('touchend', () => {
  if (isPatternDragging) {
    isPatternDragging = false;
    patternResizeHandle.classList.remove('dragging');
  }
});

// Initial render
renderPattern('mobile-first');
patternWidthCounter.textContent = `↔ ${patternFrame.offsetWidth}px`;
