// --- Section 1: Transitions ---
const transDuration = document.getElementById('transDuration');
const valDuration = document.getElementById('valDuration');
const transTiming = document.getElementById('transTiming');
const transDelay = document.getElementById('transDelay');
const valDelay = document.getElementById('valDelay');

const transitionTarget = document.getElementById('transitionTarget');
const transitionCode = document.getElementById('transitionCode');

function updateTransition() {
  const dur = transDuration.value + 's';
  const timing = transTiming.value;
  const del = transDelay.value + 's';
  
  valDuration.textContent = dur;
  valDelay.textContent = del;
  
  const cssValue = `all ${dur} ${timing} ${del}`;
  transitionTarget.style.transition = cssValue;
  
  transitionCode.innerHTML = `<code>transition: ${cssValue};</code>`;
}

[transDuration, transTiming, transDelay].forEach(el => {
  el.addEventListener('input', updateTransition);
});
updateTransition();

// --- Section 2: Transforms ---
const transX = document.getElementById('transX');
const valTransX = document.getElementById('valTransX');
const transY = document.getElementById('transY');
const valTransY = document.getElementById('valTransY');
const tScale = document.getElementById('tScale');
const valScale = document.getElementById('valScale');
const tRotate = document.getElementById('tRotate');
const valRotate = document.getElementById('valRotate');
const tSkew = document.getElementById('tSkew');
const valSkew = document.getElementById('valSkew');

const transformTarget = document.getElementById('transformTarget');
const transformCode = document.getElementById('transformCode');
const resetTransform = document.getElementById('resetTransform');

function updateTransform() {
  const tx = transX.value + 'px';
  const ty = transY.value + 'px';
  const sc = tScale.value;
  const rot = tRotate.value + 'deg';
  const sk = tSkew.value + 'deg';
  
  valTransX.textContent = tx;
  valTransY.textContent = ty;
  valScale.textContent = sc;
  valRotate.textContent = rot;
  valSkew.textContent = sk;
  
  let changes = [];
  if (transX.value !== '0' || transY.value !== '0') changes.push(`translate(${tx}, ${ty})`);
  if (tScale.value !== '1') changes.push(`scale(${sc})`);
  if (tRotate.value !== '0') changes.push(`rotate(${rot})`);
  if (tSkew.value !== '0') changes.push(`skewX(${sk})`);
  
  const cssValue = changes.length > 0 ? changes.join(' ') : 'none';
  transformTarget.style.transform = cssValue;
  transformCode.innerHTML = `<code>transform: ${cssValue};</code>`;
}

[transX, transY, tScale, tRotate, tSkew].forEach(el => {
  el.addEventListener('input', updateTransform);
});

resetTransform.addEventListener('click', () => {
  transX.value = '0';
  transY.value = '0';
  tScale.value = '1';
  tRotate.value = '0';
  tSkew.value = '0';
  updateTransform();
});
updateTransform();

// --- Section 3: Keyframes ---
const animRadios = document.querySelectorAll('input[name="animPreset"]');
const animDuration = document.getElementById('animDuration');
const valAnimDuration = document.getElementById('valAnimDuration');
const animTiming = document.getElementById('animTiming');
const animInfinite = document.getElementById('animInfinite');
const animAlternate = document.getElementById('animAlternate');

const animationTarget = document.getElementById('animationTarget');
const animationCode = document.getElementById('animationCode');

function updateAnimation() {
  const preset = document.querySelector('input[name="animPreset"]:checked').value;
  const dur = animDuration.value + 's';
  const timing = animTiming.value;
  const iter = animInfinite.checked ? 'infinite' : '1';
  const dir = animAlternate.checked ? 'alternate' : 'normal';
  
  valAnimDuration.textContent = dur;
  
  // Set class for keyframe selection
  animationTarget.className = `animation-box ${preset}`;
  
  const cssValue = `${preset} ${dur} ${timing} 0s ${iter} ${dir}`;
  
  // Apply the properties directly
  animationTarget.style.animationDuration = dur;
  animationTarget.style.animationTimingFunction = timing;
  animationTarget.style.animationIterationCount = iter;
  animationTarget.style.animationDirection = dir;
  
  animationCode.innerHTML = `<code>animation: ${cssValue};</code>`;
  
  // Re-trigger animation to apply changes instantly without waiting for loop bounds
  animationTarget.style.animationName = 'none';
  void animationTarget.offsetWidth; // Force reflow
  animationTarget.style.animationName = preset;
}

animRadios.forEach(radio => radio.addEventListener('change', updateAnimation));
[animDuration, animTiming, animInfinite, animAlternate].forEach(el => {
  el.addEventListener('input', updateAnimation);
});
updateAnimation();
