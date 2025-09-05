(function() {
  // Generate a random prefix for classes and IDs to avoid conflicts
  const prefix = 'fsad_' + Math.random().toString(36).substring(2, 10);

  // Single source of truth for ad state
  const adState = {
    soundActivated: false,
    isPaused: false,
    pauseStartTime: null,
    elapsedBeforePause: 0,
    animationFrameId: null,
    currentIndex: null,
    currentMedia: null,
    currentDuration: 0,
    currentCallback: null,
    isReplay: false,
    videoEnded: false,
    skipButton: null // Only for media skip button, not CTA
  };

  // Create and inject styles with prefixed classes
  const style = document.createElement('style');
  style.innerHTML = `
    .${prefix}-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1001;
      background-color: #000;
      display: none;
      overflow: hidden;
    }
    .${prefix}-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.3);
      z-index: 1000;
    }
    .${prefix}-progress-bar {
      height: 100%;
      background-color: #ff0000;
      width: 0;
    }
    .${prefix}-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }
    .${prefix}-image,
    .${prefix}-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .${prefix}-cta,
    .${prefix}-sound-prompt,
    .${prefix}-error-prompt {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      text-align: center;
      z-index: 1001;
    }
    .${prefix}-cta div,
    .${prefix}-sound-prompt p,
    .${prefix}-error-prompt p {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    .${prefix}-cta button,
    .${prefix}-sound-prompt button,
    .${prefix}-error-prompt button,
    .${prefix}-skip,
    .${prefix}-replay {
      padding: 10px 20px;
      background-color: #fff;
      color: #000;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin: 10px;
      z-index: 1002;
      pointer-events: auto;
    }
    .${prefix}-skip {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .${prefix}-replay {
      position: absolute;
      top: 10px;
      left: 10px;
    }
  `;
  document.head.appendChild(style);

  // Create container and sub-elements
  const container = document.createElement('div');
  container.className = `${prefix}-container`;
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  container.setAttribute('aria-label', 'Advertisement overlay');

  const progress = document.createElement('div');
  progress.className = `${prefix}-progress`;
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '100');
  progress.setAttribute('aria-valuenow', '0');
  progress.setAttribute('aria-label', 'Ad progress');

  const progressBar = document.createElement('div');
  progressBar.className = `${prefix}-progress-bar`;
  progress.appendChild(progressBar);

  const content = document.createElement('div');
  content.className = `${prefix}-content`;

  container.appendChild(progress);
  container.appendChild(content);
  document.body.appendChild(container);

  // Get ad data
  const ads = window.adData || [];
  if (ads.length === 0) return; // No ads, do nothing

  // Function to sanitize HTML to prevent XSS
  function sanitizeHTML(html) {
    const allowedTags = ['br', 'span', 'b', 'i', 'u'];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (!allowedTags.includes(node.tagName.toLowerCase())) {
        node.parentNode.removeChild(node);
      } else {
        if (node.tagName.toLowerCase() === 'span') {
          const style = node.getAttribute('style');
          node.removeAttribute('*');
          if (style) node.setAttribute('style', style);
        } else {
          node.removeAttribute('*');
        }
      }
    }
    return tempDiv.innerHTML;
  }

  // Function to start progress animation
  function startProgress(duration, callback, media) {
    let startTime = null;
    progressBar.style.transition = 'none';
    progressBar.style.width = `${(adState.elapsedBeforePause / duration) * 100}%`;
    progress.setAttribute('aria-valuenow', Math.round((adState.elapsedBeforePause / duration) * 100));

    function updateProgress(timestamp) {
      if (adState.isPaused) return;

      if (!startTime) startTime = timestamp - adState.elapsedBeforePause * 1000;
      const elapsed = (timestamp - startTime) / 1000;
      const progressValue = Math.min(elapsed / duration, 1);
      progressBar.style.width = `${progressValue * 100}%`;
      progress.setAttribute('aria-valuenow', Math.round(progressValue * 100));

      if (progressValue >= 1 && !adState.skipButton) {
        adState.skipButton = createMediaSkipButton(() => {
          if (media && media.tagName === 'VIDEO' && !adState.videoEnded) {
            media.pause();
          }
          callback();
        });
        content.appendChild(adState.skipButton);
        adState.skipButton.focus();
        console.log('Media skip button created for ad', adState.currentIndex, 'after duration', duration);
      }

      if (progressValue < 1 || (media && media.tagName === 'VIDEO' && !adState.videoEnded)) {
        adState.animationFrameId = requestAnimationFrame(updateProgress);
      } else if (media && media.tagName === 'IMG') {
        adState.elapsedBeforePause = 0;
        callback();
      }
    }

    adState.animationFrameId = requestAnimationFrame(updateProgress);
  }

  // Function to pause ad
  function pauseAd() {
    if (adState.isPaused || !adState.currentMedia) return;
    adState.isPaused = true;
    adState.pauseStartTime = performance.now();
    if (adState.animationFrameId) {
      cancelAnimationFrame(adState.animationFrameId);
      adState.animationFrameId = null;
    }
    if (adState.currentMedia.tagName === 'VIDEO') {
      adState.currentMedia.pause();
      adState.elapsedBeforePause = Math.min(adState.currentMedia.currentTime, adState.currentDuration);
    }
  }

  // Function to resume ad
  function resumeAd() {
    if (!adState.isPaused || !adState.currentMedia) return;
    adState.isPaused = false;

    if (adState.currentMedia.tagName === 'IMG') {
      adState.elapsedBeforePause = 0;
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      progress.setAttribute('aria-valuenow', '0');
      startProgress(adState.currentDuration, adState.currentCallback, adState.currentMedia);
    } else if (adState.currentMedia.tagName === 'VIDEO') {
      const rewindSeconds = 2;
      adState.currentMedia.currentTime = Math.max(adState.currentMedia.currentTime - rewindSeconds, 0);
      adState.elapsedBeforePause = Math.max(adState.elapsedBeforePause - rewindSeconds, 0);
      progressBar.style.transition = 'none';
      progressBar.style.width = `${(adState.elapsedBeforePause / adState.currentDuration) * 100}%`;
      progress.setAttribute('aria-valuenow', Math.round((adState.elapsedBeforePause / adState.currentDuration) * 100));

      adState.currentMedia.play().catch(() => {
        adState.currentMedia.muted = true;
        adState.currentMedia.play();
      });
      if (adState.skipButton && !content.contains(adState.skipButton)) {
        content.appendChild(adState.skipButton);
      }
      startProgress(adState.currentDuration, adState.currentCallback, adState.currentMedia);
    }
  }

  // Handle visibility change
  function handleVisibilityChange() {
    if (document.hidden) {
      pauseAd();
    } else {
      resumeAd();
    }
  }

  window.addEventListener('blur', pauseAd);
  window.addEventListener('focus', resumeAd);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Function to create media skip button
  function createMediaSkipButton(onClick) {
    const skipBtn = document.createElement('button');
    skipBtn.className = `${prefix}-skip media-skip`;
    skipBtn.textContent = 'Skip';
    skipBtn.setAttribute('aria-label', 'Skip ad');
    skipBtn.style.pointerEvents = 'auto';
    skipBtn.addEventListener('click', () => {
      console.log('Media skip button clicked for ad', adState.currentIndex);
      skipBtn.remove();
      adState.skipButton = null;
      onClick();
    }, { once: true });
    return skipBtn;
  }

  // Function to create CTA skip button
  function createCTASkipButton(onClick) {
    const skipBtn = document.createElement('button');
    skipBtn.className = `${prefix}-skip cta-skip`;
    skipBtn.textContent = 'Skip';
    skipBtn.setAttribute('aria-label', 'Skip to next ad');
    skipBtn.style.pointerEvents = 'auto';
    skipBtn.addEventListener('click', () => {
      console.log('CTA skip button clicked for ad', adState.currentIndex, 'advancing to', adState.currentIndex + 1);
      onClick();
    }, { once: true });
    return skipBtn;
  }

  // Function to check if video audio is muted
  function isVideoMuted(video) {
    return video.muted || video.volume === 0;
  }

  // Function to show sound prompt
  function showSoundPrompt(callback, media) {
    const promptDiv = document.createElement('div');
    promptDiv.className = `${prefix}-sound-prompt`;

    const msg = document.createElement('p');
    msg.textContent = 'Activate sound to play the video.';

    const activateBtn = document.createElement('button');
    activateBtn.textContent = 'Activate Sound';
    activateBtn.setAttribute('aria-label', 'Activate sound for video');
    activateBtn.style.pointerEvents = 'auto';
    activateBtn.addEventListener('click', () => {
      console.log('Sound activated for ad', adState.currentIndex);
      promptDiv.remove();
      adState.soundActivated = true;
      callback(true, media);
    }, { once: true });

    promptDiv.appendChild(msg);
    promptDiv.appendChild(activateBtn);
    content.appendChild(promptDiv);
    promptDiv.style.display = 'flex';
    activateBtn.focus();
  }

  // Function to show error prompt for media load failure
  function showErrorPrompt(index) {
    clearAdState(); // Clear state to prevent conflicts
    content.innerHTML = ''; // Clear any existing content

    const promptDiv = document.createElement('div');
    promptDiv.className = `${prefix}-error-prompt`;

    const msg = document.createElement('p');
    msg.textContent = 'Failed to load ad. Please check your network connection and try again.';

    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Retry';
    retryBtn.setAttribute('aria-label', 'Retry loading ad');
    retryBtn.style.pointerEvents = 'auto';
    retryBtn.addEventListener('click', () => {
      console.log('Retry button clicked for ad', index);
      promptDiv.remove();
      playAd(index, adState.isReplay); // Retry the same ad
    }, { once: true });

    promptDiv.appendChild(msg);
    promptDiv.appendChild(retryBtn);
    content.appendChild(promptDiv);
    promptDiv.style.display = 'flex';
    retryBtn.focus();
  }

  // Function to preload next media
  function preloadNextAd(index) {
    if (index + 1 < ads.length) {
      const nextAd = ads[index + 1];
      if (nextAd.type === 'image') {
        const img = new Image();
        img.src = nextAd.url;
      } else if (nextAd.type === 'video') {
        const video = document.createElement('video');
        video.src = nextAd.url;
        video.preload = 'auto';
      }
    }
  }

  // Function to start media playback
  function startMediaAfterLoad(media, duration, callback, index) {
    let loaded = false;
    const handleLoad = () => {
      if (loaded) return;
      loaded = true;
      console.log(`${media.tagName} loaded for ad`, adState.currentIndex);
      if (media.tagName === 'VIDEO') {
        media.play().catch(() => {
          media.muted = true;
          media.play();
        });
      }
      startProgress(duration, callback, media);
    };

    if (media.tagName === 'IMG') {
      media.onload = handleLoad;
      media.onerror = () => showErrorPrompt(index);
      if (media.complete) handleLoad();
    } else if (media.tagName === 'VIDEO') {
      media.addEventListener('canplaythrough', handleLoad, { once: true });
      media.addEventListener('error', () => showErrorPrompt(index), { once: true });
      media.load();
    }

    // Timeout to trigger error prompt
    setTimeout(() => {
      if (!loaded) {
        console.warn('Media load timeout for ad', adState.currentIndex);
        showErrorPrompt(index);
      }
    }, 10000); // 10s timeout
  }

  // Function to clear ad state for transition
  function clearAdState() {
    if (adState.animationFrameId) {
      cancelAnimationFrame(adState.animationFrameId);
      adState.animationFrameId = null;
    }
    adState.elapsedBeforePause = 0;
    adState.isPaused = false;
    adState.videoEnded = false;
    adState.skipButton = null;
    adState.currentMedia = null;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    progress.setAttribute('aria-valuenow', '0');
  }

  // Function to show CTA
  function showCTA(index, media) {
    clearAdState(); // Clear state including animation and progress

    if (media && media.tagName === 'VIDEO') {
      media.pause();
      media.removeEventListener('ended', media.onended);
      media.onended = null;
    }

    // Remove media and any skip button
    if (media) media.remove();
    if (adState.skipButton) adState.skipButton.remove();

    const ad = ads[index];
    const ctaDiv = document.createElement('div');
    ctaDiv.className = `${prefix}-cta`;

    const msg = document.createElement('div');
    msg.innerHTML = sanitizeHTML(ad.cta.message);

    const actionBtn = document.createElement('button');
    actionBtn.textContent = ad.cta.buttonText || 'Go';
    actionBtn.setAttribute('aria-label', ad.cta.buttonText || 'Go to ad link');
    actionBtn.style.pointerEvents = 'auto';
    actionBtn.addEventListener('click', () => {
      console.log('Action button clicked for ad', index, 'link:', ad.cta.link);
      if (ad.cta.link !== '#') {
        window.open(ad.cta.link, '_blank');
      }
    }, { once: true });

    const replayBtn = document.createElement('button');
    replayBtn.className = `${prefix}-replay`;
    replayBtn.textContent = 'See Again';
    replayBtn.setAttribute('aria-label', 'Replay ad');
    replayBtn.style.pointerEvents = 'auto';
    replayBtn.addEventListener('click', () => {
      console.log('Replay button clicked for ad', index);
      ctaDiv.remove();
      clearAdState(); // Ensure clean state for replay
      playAd(index, true);
    }, { once: true });

    const ctaSkipBtn = createCTASkipButton(() => {
      ctaDiv.remove();
      clearAdState(); // Ensure clean state for next ad
      playAd(index + 1);
    });

    ctaDiv.appendChild(msg);
    if (ad.cta.link !== '#') {
      ctaDiv.appendChild(actionBtn);
    }
    ctaDiv.appendChild(replayBtn);
    ctaDiv.appendChild(ctaSkipBtn);
    content.appendChild(ctaDiv);
    ctaDiv.style.display = 'flex';
    replayBtn.focus();
    console.log('Showing CTA for ad', index);

    preloadNextAd(index);
  }

  // Function to play ad item
  function playAd(index, isReplay = false) {
    if (index >= ads.length) {
      closeAd();
      return;
    }

    clearAdState(); // Clear any lingering state before starting new ad
    content.innerHTML = ''; // Clear content for new ad

    const ad = ads[index];
    adState.currentIndex = index;
    adState.isReplay = isReplay;
    adState.currentDuration = ad.duration;
    adState.currentCallback = () => showCTA(index, adState.currentMedia);
    console.log('Playing ad', index, 'replay:', isReplay);

    let media;

    if (ad.type === 'image') {
      media = document.createElement('img');
      media.src = ad.url;
      media.className = `${prefix}-image`;
      media.alt = 'Advertisement image';
      content.appendChild(media);
      adState.currentMedia = media;
      startMediaAfterLoad(media, ad.duration, adState.currentCallback, index);
    } else if (ad.type === 'video') {
      media = document.createElement('video');
      media.src = ad.url;
      media.className = `${prefix}-video`;
      media.autoplay = false;
      media.muted = !adState.soundActivated;
      media.playsInline = true;

      content.appendChild(media);
      adState.currentMedia = media;
      media.onended = () => {
        adState.videoEnded = true;
        showCTA(index, media);
      };

      if (!adState.soundActivated && isVideoMuted(media) && !isReplay) {
        showSoundPrompt((soundActivatedResult, promptMedia) => {
          promptMedia.muted = !soundActivatedResult;
          promptMedia.currentTime = 0;
          startMediaAfterLoad(promptMedia, ad.duration, adState.currentCallback, index);
        }, media);
      } else {
        media.muted = false;
        startMediaAfterLoad(media, ad.duration, adState.currentCallback, index);
      }
    }

    preloadNextAd(index);
  }

  // Function to close the ad
  function closeAd() {
    clearAdState(); // Final cleanup
    container.style.display = 'none';
    window.removeEventListener('blur', pauseAd);
    window.removeEventListener('focus', resumeAd);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    container.remove();
    style.remove();
    console.log('Ad closed and cleaned up');
  }

  // Start the ad
  container.style.display = 'block';
  playAd(0);
})();