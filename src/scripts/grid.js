const gridContainer = document.getElementById('gridContainer');
const gridColumns = document.getElementById('gridColumns');
const alignItems = document.getElementById('alignItems');
const justifyItems = document.getElementById('justifyItems');
const gapRange = document.getElementById('gapRange');
const gapVal = document.getElementById('gapVal');

const addItemBtn = document.getElementById('addItemBtn');
const removeItemBtn = document.getElementById('removeItemBtn');
let itemCount = 6;

function updateGrid() {
  gridContainer.style.gridTemplateColumns = gridColumns.value;
  gridContainer.style.alignItems = alignItems.value;
  gridContainer.style.justifyItems = justifyItems.value;
  gridContainer.style.gap = `${gapRange.value}px`;
  gapVal.textContent = gapRange.value;
}

[gridColumns, alignItems, justifyItems, gapRange].forEach(input => {
  input.addEventListener('input', updateGrid);
});

addItemBtn.addEventListener('click', () => {
  itemCount++;
  const div = document.createElement('div');
  div.className = 'flex-item';
  div.textContent = itemCount;
  gridContainer.appendChild(div);
});

removeItemBtn.addEventListener('click', () => {
  if (gridContainer.children.length > 1) {
    gridContainer.removeChild(gridContainer.lastChild);
    itemCount--;
  }
});

updateGrid();
