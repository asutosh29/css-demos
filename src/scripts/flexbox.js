const flexContainer = document.getElementById('flexContainer');
const flexDirection = document.getElementById('flexDirection');
const justifyContent = document.getElementById('justifyContent');
const alignItems = document.getElementById('alignItems');
const flexWrap = document.getElementById('flexWrap');
const gapRange = document.getElementById('gapRange');
const gapVal = document.getElementById('gapVal');

const addItemBtn = document.getElementById('addItemBtn');
const removeItemBtn = document.getElementById('removeItemBtn');

function updateFlexbox() {
  flexContainer.style.flexDirection = flexDirection.value;
  flexContainer.style.justifyContent = justifyContent.value;
  flexContainer.style.alignItems = alignItems.value;
  flexContainer.style.flexWrap = flexWrap.value;
  flexContainer.style.gap = `${gapRange.value}px`;
  gapVal.textContent = gapRange.value;
}

[flexDirection, justifyContent, alignItems, flexWrap, gapRange].forEach(input => {
  input.addEventListener('input', updateFlexbox);
});

addItemBtn.addEventListener('click', () => {
  const currentCount = flexContainer.children.length;
  const div = document.createElement('div');
  div.className = 'flex-item';
  div.textContent = currentCount + 1;
  flexContainer.appendChild(div);
  
  // A small animation cue is nice but transition covers mostly size
  // Trigger layout to ensure transition works immediately if applicable
});

removeItemBtn.addEventListener('click', () => {
  if (flexContainer.children.length > 1) {
    flexContainer.removeChild(flexContainer.lastChild);
  }
});

updateFlexbox();
