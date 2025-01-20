function updateButtonStates() {
    const likeButton = document.querySelector('.player-like-button[data-action="like"]');
    const dislikeButton = document.querySelector('.player-like-button[data-action="dislike"]');
    
    if (likeButton && dislikeButton) {
      const originalLikeButton = document.querySelector('ytd-menu-renderer like-button-view-model button');
      const originalDislikeButton = document.querySelector('ytd-menu-renderer dislike-button-view-model button');
      
      if (originalLikeButton && originalDislikeButton) {
        const isLiked = originalLikeButton.getAttribute('aria-pressed') === 'true';
        const isDisliked = originalDislikeButton.getAttribute('aria-pressed') === 'true';
        
        likeButton.classList.toggle('active', isLiked);
        dislikeButton.classList.toggle('active', isDisliked);
      }
    }
  }
  
  function createLikeButtons() {
    // Check if buttons already exist
    if (document.querySelector('.player-like-buttons')) return;
  
    // Wait for YouTube controls to be ready
    const playerControls = document.querySelector('.ytp-right-controls');
    if (!playerControls) return;
  
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'player-like-buttons';
  
    // Create simple buttons that point to YouTube's buttons
    ['like', 'dislike'].forEach(action => {
      const button = document.createElement('button');
      button.className = 'player-like-button';
      button.setAttribute('data-action', action);
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="${action === 'like' 
            ? 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'
            : 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z'
          }"/>
        </svg>
      `;
      
      button.addEventListener('click', () => {
        const originalButton = action === 'like' 
          ? document.querySelector('ytd-menu-renderer like-button-view-model button')
          : document.querySelector('ytd-menu-renderer dislike-button-view-model button');
        if (originalButton) {
          originalButton.click();
          // Update states after a small delay to allow YouTube to process the click
          setTimeout(updateButtonStates, 100);
        }
      });
  
      buttonsContainer.appendChild(button);
    });
  
    // Insert at the start of controls
    const firstChild = playerControls.firstChild;
    playerControls.insertBefore(buttonsContainer, firstChild);
  
    // Initial state update
    updateButtonStates();
  }
  
  // Initial attempt
  createLikeButtons();
  
  // Watch for player updates and retry button creation
  const observer = new MutationObserver((mutations) => {
    if (!document.querySelector('.player-like-buttons')) {
      createLikeButtons();
    }
    updateButtonStates();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-pressed']
  });
  
  // Additional check for dynamic loading
  window.addEventListener('yt-navigate-finish', () => {
    createLikeButtons();
    updateButtonStates();
  });
  window.addEventListener('load', () => {
    createLikeButtons();
    updateButtonStates();
  });