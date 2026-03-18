// Inputs
const wInput = document.getElementById('widthRange');
const pInput = document.getElementById('paddingRange');
const bInput = document.getElementById('borderRange');
const mInput = document.getElementById('marginRange');

// Displays
const wVal = document.getElementById('widthVal');
const pVal = document.getElementById('paddingVal');
const bVal = document.getElementById('borderVal');
const mVal = document.getElementById('marginVal');

// Common labels
const reqWLabels = document.querySelectorAll('.val-req-w');
const padLabels = document.querySelectorAll('.val-pad');
const brdLabels = document.querySelectorAll('.val-brd');

// Computed Totals
const cbTotal = document.getElementById('contentBoxTotal');
const bbTotal = document.getElementById('borderBoxTotal');
const bbContentActual = document.getElementById('bbContentActual');

// Elements - Content Box
const cbMargin = document.getElementById('cbMargin');
const cbBorder = document.getElementById('cbBorder');
const cbPadding = document.getElementById('cbPadding');
const cbContent = document.getElementById('cbContent');

// Elements - Border Box
const bbMargin = document.getElementById('bbMargin');
const bbBorder = document.getElementById('bbBorder');
const bbPadding = document.getElementById('bbPadding');
const bbContent = document.getElementById('bbContent');

function updateBoxModel() {
  const w = parseInt(wInput.value);
  const p = parseInt(pInput.value);
  const b = parseInt(bInput.value);
  const m = parseInt(mInput.value);

  // Update Input labels
  wVal.textContent = w;
  pVal.textContent = p;
  bVal.textContent = b;
  mVal.textContent = m;

  // Update formula labels
  reqWLabels.forEach(el => el.textContent = w);
  padLabels.forEach(el => el.textContent = p);
  brdLabels.forEach(el => el.textContent = b);

  // Math for Content Box (Width is JUST content, padding/border add to total)
  // Total computed width = width + 2*padding + 2*border
  const cbW = w + (p * 2) + (b * 2);
  cbTotal.textContent = cbW;

  // Math for Border Box (Width INCLUDES padding/border, content shrinks)
  bbTotal.textContent = w;
  
  // The actual inner content area for border box
  let bbActualW = w - (p * 2) - (b * 2);
  if (bbActualW < 0) bbActualW = 0; // Prevent negative content width visually
  bbContentActual.textContent = bbActualW;

  // Apply visually
  // Content Box Elements
  cbContent.style.width = `${w}px`;
  cbContent.style.height = '100px';

  cbPadding.style.padding = `${p}px`;
  cbBorder.style.padding = `${b}px`;
  cbMargin.style.padding = `${m}px`;

  // Border Box Elements
  // Note: the DOM element has box-sizing: border-box
  // So setting width affects the total of content+padding+border
  // But for our visualizer layers, we simulate by applying padding to wrappers.
  bbContent.style.width = `${bbActualW}px`;
  bbContent.style.height = `${Math.max(0, 100 - (p*2) - (b*2))}px`;

  bbPadding.style.padding = `${p}px`;
  bbBorder.style.padding = `${b}px`;
  bbMargin.style.padding = `${m}px`;
}

// Event Listeners
[wInput, pInput, bInput, mInput].forEach(input => {
  input.addEventListener('input', updateBoxModel);
});

// Init
updateBoxModel();
