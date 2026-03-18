const checkboxes = document.querySelectorAll('.selector-controls input[type="checkbox"]');
const valInline = document.getElementById('valInline');
const valId = document.getElementById('valId');
const valClass = document.getElementById('valClass');
const valElement = document.getElementById('valElement');
const selectorPreview = document.getElementById('selectorPreview');
const targetElement = document.getElementById('targetElement');

function updateSpecificity() {
  let inlineCount = 0;
  let idCount = 0;
  let classCount = 0;
  let elementCount = 0;
  let buildSelector = [];
  
  if (document.getElementById('toggleElement').checked) {
    elementCount++;
    buildSelector.push('button');
  }
  
  if (document.getElementById('toggleId').checked) {
    idCount++;
    buildSelector.push('#header');
  }
  
  if (document.getElementById('toggleClass').checked) {
    classCount++;
    buildSelector.push('.card');
  }
  if (document.getElementById('toggleAttribute').checked) {
    classCount++;
    buildSelector.push('[type="button"]');
  }
  if (document.getElementById('togglePseudoClass').checked) {
    classCount++;
    buildSelector.push(':hover');
  }
  
  if (document.getElementById('togglePseudoElement').checked) {
    elementCount++;
    buildSelector.push('::before');
  }
  
  let inlineStyles = '';
  if (document.getElementById('toggleInline').checked) {
    inlineCount++;
    inlineStyles = ' style="..."';
  }

  // Update Score Boxes
  updateScoreBox(valInline, inlineCount);
  updateScoreBox(valId, idCount);
  updateScoreBox(valClass, classCount);
  updateScoreBox(valElement, elementCount);
  
  // Build and display CSS String
  if (buildSelector.length === 0 && inlineCount === 0) {
    selectorPreview.innerHTML = '<span class="placeholder">Select elements to build a rule...</span>';
  } else {
    let selectorStr = buildSelector.join('');
    if (inlineCount > 0) {
        selectorPreview.innerHTML = `<code>&lt;element${inlineStyles}&gt;</code>`;
    } else {
        selectorPreview.innerHTML = `<code>${selectorStr} { ... }</code>`;
    }
  }
  
  // Decide Target Element Class based on max specificity
  targetElement.className = 'target-element'; // Reset
  
  if (inlineCount > 0) {
    targetElement.classList.add('state-inline');
    targetElement.textContent = 'Inline Style Wins!';
  } else if (idCount > 0) {
    targetElement.classList.add('state-id');
    targetElement.textContent = 'ID Selector Wins!';
  } else if (classCount > 0) {
    targetElement.classList.add('state-class');
    targetElement.textContent = 'Class Selector Wins!';
  } else if (elementCount > 0) {
    targetElement.classList.add('state-element');
    targetElement.textContent = 'Element Selector Wins!';
  } else {
    targetElement.classList.add('state-base');
    targetElement.textContent = 'Default State';
  }
}

function updateScoreBox(elem, newValue) {
  const currentValue = parseInt(elem.textContent, 10);
  if (currentValue !== newValue) {
    elem.textContent = newValue;
    // Animate change
    elem.classList.add('highlight');
    setTimeout(() => {
      elem.classList.remove('highlight');
    }, 300);
  }
}

// Initial setup
checkboxes.forEach(cb => {
  cb.addEventListener('change', updateSpecificity);
});
updateSpecificity();
