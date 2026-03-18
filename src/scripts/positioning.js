const targetBox = document.getElementById('targetBox');
const posButtons = document.querySelectorAll('.position-types .btn');
const infoPanel = document.getElementById('infoPanel');

// Slider Inputs
const topInput = document.getElementById('topInput');
const leftInput = document.getElementById('leftInput');

// Slider Value Displays
const topVal = document.getElementById('topVal');
const leftVal = document.getElementById('leftVal');

// Descriptions
const descriptions = {
  static: `
    <h3>Static Positioning (Default)</h3>
    <p>The element sits in the normal document flow. <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code>, and <code>z-index</code> properties have no effect.</p>
  `,
  relative: `
    <h3>Relative Positioning</h3>
    <p>The element is positioned relative to its normal position in the document flow. Adjust the sliders to move it from where it <strong>would have been</strong>.</p>
  `,
  absolute: `
    <h3>Absolute Positioning</h3>
    <p>The element is removed from normal flow. It is positioned relative to its closest positioned ancestor (the container). Use sliders to position it.</p>
  `,
  fixed: `
    <h3>Fixed Positioning</h3>
    <p>The element is removed from normal flow. It is positioned relative to the viewport. Try scrolling after adjusting sliders!</p>
  `,
  sticky: `
    <h3>Sticky Positioning</h3>
    <p>The element toggles between relative and fixed depending on scroll position. A <code>top</code> or <code>bottom</code> value acts as the sticky threshold.</p>
  `
};

let currentPos = 'static';

function updatePositioning() {
  if (currentPos === 'static') {
    // Disable inputs
    [topInput, leftInput].forEach(inp => inp.disabled = true);
    
    // Reset styles and labels
    targetBox.style.top = '';
    targetBox.style.bottom = '';
    targetBox.style.left = '';
    targetBox.style.right = '';
    
    topVal.textContent = 'auto';
    leftVal.textContent = 'auto';
  } else {
    // Enable inputs
    [topInput, leftInput].forEach(inp => inp.disabled = false);
    
    // Read values
    const t = topInput.value;
    const l = leftInput.value;
    
    // Update labels
    topVal.textContent = t + 'px';
    leftVal.textContent = l + 'px';
    
    // Apply styles (reset bottom and right just in case)
    targetBox.style.bottom = '';
    targetBox.style.right = '';
    targetBox.style.top = t + 'px';
    targetBox.style.left = l + 'px';
  }
}

// Preset sensible defaults per position type
const presets = {
  relative: { t: 20, l: 20 },
  absolute: { t: 20, l: 20 },
  fixed:    { t: 20, l: 20 },
  sticky:   { t: 0, l: 20 }
};

posButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    posButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get position type
    currentPos = btn.getAttribute('data-pos');
    
    // Remove all positioning classes and add new
    targetBox.className = 'box target-box';
    targetBox.classList.add(`pos-${currentPos}`);
    
    // Update info panel
    infoPanel.innerHTML = descriptions[currentPos];
    
    // Apply presets if transitioning from static to something else
    if (presets[currentPos]) {
      topInput.value = presets[currentPos].t;
      leftInput.value = presets[currentPos].l;
    }
    
    updatePositioning();
  });
});

[topInput, leftInput].forEach(inp => {
  inp.addEventListener('input', updatePositioning);
});

// Initialize
updatePositioning();
