import { TrialRunWidget } from './trialrun-widget.js';

// Register the custom element if it hasn't been registered already
if (!customElements.get('trialrun-widget')) {
  customElements.define('trialrun-widget', TrialRunWidget);
}

// Export the class for those who want to use it programmatically
window.TrialRunWidget = TrialRunWidget;

// This function will be called when the script is loaded
// It will check for a data-sandbox-id attribute on the script tag
// and use it to initialize a widget if found
function initTrialRunWidget() {
  // Find the script tag that loaded this script
  const scriptTag = document.currentScript;
  
  // Get the sandbox ID from the data attribute
  const sandboxId = scriptTag?.getAttribute('data-sandbox-id');
  
  // If there's a sandbox ID and auto-init is not disabled, create a widget
  const autoInit = scriptTag?.getAttribute('data-auto-init') !== 'false';
  
  if (sandboxId && autoInit) {
    console.log(`TrialRun Widget: Auto-initializing with sandbox ID ${sandboxId}`);
    
    // Get dimension attributes
    const playgroundWidth = scriptTag.getAttribute('data-playground-width');
    const playgroundHeight = scriptTag.getAttribute('data-playground-height');
    const cardWidth = scriptTag.getAttribute('data-card-width');
    const cardHeight = scriptTag.getAttribute('data-card-height');
    
    // Get target container (if specified)
    const targetSelector = scriptTag.getAttribute('data-target');
    const targetContainer = targetSelector ? document.querySelector(targetSelector) : document.body;
    
    if (!targetContainer) {
      console.error(`TrialRun Widget: Target container "${targetSelector}" not found.`);
      return;
    }
    
    // Create the widget element
    const widget = document.createElement('trialrun-widget');
    widget.setAttribute('sandbox-id', sandboxId);
    
    // Set dimension attributes if provided
    if (playgroundWidth) widget.setAttribute('playground-width', playgroundWidth);
    if (playgroundHeight) widget.setAttribute('playground-height', playgroundHeight);
    if (cardWidth) widget.setAttribute('card-width', cardWidth);
    if (cardHeight) widget.setAttribute('card-height', cardHeight);
    
    // Set widget style to fill its container
    widget.style.width = '100%';
    widget.style.height = '100%';
    
    // Append it to the target container
    targetContainer.appendChild(widget);
  } else {
    // Just log a usage message if not auto-initializing
    console.log('TrialRun Widget loaded. Use <trialrun-widget sandbox-id="YOUR_ID"></trialrun-widget> to add it to your page.');
  }
}

// Initialize the widget when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTrialRunWidget);
} else {
  initTrialRunWidget();
}

// Export a function to manually create and append a widget
window.createTrialRunWidget = function(options = {}) {
  const {
    sandboxId,
    playgroundWidth,
    playgroundHeight,
    cardWidth,
    cardHeight,
    container = document.body
  } = options;
  
  if (!sandboxId) {
    console.error('TrialRun Widget: No sandbox ID provided.');
    return null;
  }
  
  // Create the widget element
  const widget = document.createElement('trialrun-widget');
  widget.setAttribute('sandbox-id', sandboxId);
  
  // Set dimension attributes if provided
  if (playgroundWidth) widget.setAttribute('playground-width', playgroundWidth);
  if (playgroundHeight) widget.setAttribute('playground-height', playgroundHeight);
  if (cardWidth) widget.setAttribute('card-width', cardWidth);
  if (cardHeight) widget.setAttribute('card-height', cardHeight);
  
  // Set widget style to fill its container
  widget.style.width = '100%';
  widget.style.height = '100%';
  
  // Append it to the container
  container.appendChild(widget);
  
  return widget;
};
