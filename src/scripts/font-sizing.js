const rootBtns = document.querySelectorAll('.root-btn');
const parentBtns = document.querySelectorAll('.parent-btn');
const rootValDisplay = document.getElementById('rootValDisplay');
const parentValDisplay = document.getElementById('parentValDisplay');

const demoContainer = document.getElementById('demoContainer');

rootBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    rootBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get size
    const size = btn.getAttribute('data-size');
    rootValDisplay.textContent = size;
    
    // Apply to root html
    document.documentElement.style.fontSize = size;
  });
});

parentBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    parentBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get size
    const size = btn.getAttribute('data-size');
    parentValDisplay.textContent = size;
    
    // Apply to parent container
    demoContainer.style.fontSize = size;
  });
});
