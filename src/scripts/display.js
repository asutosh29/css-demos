const displayBtns = document.querySelectorAll('.display-btn');
const displayTargets = document.querySelectorAll('.display-target');
const displayInfo = document.getElementById('displayInfo');

const displayDescriptions = {
  inline: `
    <h3>Inline</h3>
    <p>Elements sit side-by-side with text. Width, height, top/bottom margins, and top/bottom padding don't affect vertical spacing.</p>
  `,
  block: `
    <h3>Block</h3>
    <p>Elements force a line break before and after. They take up the full width available, and width/height margins/padding are respected.</p>
  `,
  'inline-block': `
    <h3>Inline-Block</h3>
    <p>Elements sit side-by-side like inline elements, but width, height, margins, and padding are respected like block elements.</p>
  `
};

displayBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    displayBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get display type
    const type = btn.getAttribute('data-display');
    
    // Update targets
    displayTargets.forEach(target => {
      target.style.display = type;
    });
    
    // Update info
    displayInfo.innerHTML = displayDescriptions[type];
  });
});

// Section 2: Visibility vs Display None
const hideBtns = document.querySelectorAll('.hide-btn');
const hideTarget = document.getElementById('hideTarget');
const hideInfo = document.getElementById('hideInfo');

const hideDescriptions = {
  reset: `
    <h3>Visible</h3>
    <p>The element is fully visible and participates in the document layout.</p>
  `,
  hidden: `
    <h3>Visibility: Hidden</h3>
    <p>The element is invisible, but it <strong>still takes up its original space</strong> in the layout. Notice the gap remains.</p>
  `,
  none: `
    <h3>Display: None</h3>
    <p>The element is completely removed from the document layout. It takes up <strong>no space</strong> at all.</p>
  `
};

hideBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    hideBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get action
    const action = btn.getAttribute('data-action');
    
    // Reset classes
    hideTarget.classList.remove('is-hidden', 'is-none');
    
    // Apply action
    if (action === 'hidden') {
      hideTarget.classList.add('is-hidden');
    } else if (action === 'none') {
      hideTarget.classList.add('is-none');
    }
    
    // Update info
    hideInfo.innerHTML = hideDescriptions[action];
  });
});
