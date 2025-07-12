// animations.js
import gsap from 'https://esm.sh/gsap';
import { Draggable } from 'https://esm.sh/gsap/Draggable';
import { audioPlayer, updateTimeDisplay } from './player.js';
import { playerState } from './state.js';

gsap.registerPlugin(Draggable);

const mainContainer = document.getElementById('mainContainer');
const albumArt = document.getElementById('albumArt');
const songDetails = document.getElementById('songDetails');
const seekBarContainer = document.getElementById('seekBarContainer');
const playerControls = document.getElementById('playerControls');
const seekBar = document.getElementById('seekBar');
const seekProgress = document.getElementById('seekProgress');
const seekHandle = document.getElementById('seekHandle');
const spinIndicator = document.getElementById('spinIndicator');

let rotation = 0;
let spinTween = null;
let lastSpinAngle = 0;

export function initializeAnimations() {
  try {
    if (mainContainer) {
      gsap.to(mainContainer, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'back.out(1.7)'
      });
      gsap.to([songDetails, seekBarContainer, playerControls], {
        duration: 0.6,
        opacity: 1,
        y: 0,
        stagger: 0.2,
        delay: 0.3,
        ease: 'power2.out'
      });
    } else {
      console.error('Error in initializeAnimations: Missing mainContainer');
    }
  } catch (err) {
    console.error('Error in initializeAnimations:', err.message);
  }
}

export function startSpinning() {
  try {
    if (spinTween) spinTween.kill();
    spinTween = gsap.ticker.add(spin);
  } catch (err) {
    console.error('Error in startSpinning:', err.message);
  }
}

export function stopSpinning() {
  try {
    if (spinTween) {
      gsap.ticker.remove(spinTween);
      spinTween = null;
      gsap.to(albumArt, {
        duration: 0.5,
        rotation: Math.round(gsap.getProperty(albumArt, 'rotation') / 360) * 360,
        ease: 'power2.out'
      });
    }
  } catch (err) {
    console.error('Error in stopSpinning:', err.message);
  }
}

function spin() {
  try {
    rotation += 0.5;
    gsap.set(albumArt, { rotation });
  } catch (err) {
    console.error('Error in spin:', err.message);
  }
}

export function initializeDraggable() {
  try {
    if (albumArt && spinIndicator) {
      albumArt.addEventListener('click', e => e.preventDefault());
      Draggable.create(albumArt, {
        type: 'rotation',
        inertia: true, // Add inertia for smoother scrubbing
        onDragStart: function() {
          try {
            playerState.isManualSpinning = true;
            playerState.isDragging = true;
            lastSpinAngle = this.rotation;
            if (spinTween) spinTween.kill();
            gsap.to(spinIndicator, {
              duration: 0.3,
              opacity: 1,
              y: -5,
              ease: 'power2.out'
            });
            if (playerState.isPlaying && audioPlayer && audioPlayer.readyState >= 2) {
              audioPlayer.pause();
            }
          } catch (err) {
            console.error('Error in initializeDraggable onDragStart:', err.message);
          }
        },
        onDrag: function() {
          try {
            if (!audioPlayer || audioPlayer.readyState < 2) {
              console.log('Audio not ready for scrubbing, readyState:', audioPlayer ? audioPlayer.readyState : 'undefined');
              return;
            }
            const angleDiff = this.rotation - lastSpinAngle;
            const seekChange = (angleDiff / 360) * playerState.totalTime; // Precise mapping
            playerState.currentTime = Math.max(0, Math.min(playerState.totalTime, playerState.currentTime + seekChange));
            audioPlayer.currentTime = playerState.currentTime;
            updateProgress();
            updateTimeDisplay();
            lastSpinAngle = this.rotation;
          } catch (err) {
            console.error('Error in initializeDraggable onDrag:', err.message);
          }
        },
        onDragEnd: function() {
          try {
            playerState.isManualSpinning = false;
            playerState.isDragging = false;
            gsap.to(spinIndicator, {
              duration: 0.3,
              opacity: 0,
              y: 0,
              ease: 'power2.out'
            });
            if (playerState.isPlaying && audioPlayer && audioPlayer.readyState >= 2) {
              audioPlayer.play().catch(err => {
                console.error('Error resuming playback after scrub:', err.message);
              });
            }
            if (playerState.isPlaying) {
              setTimeout(() => {
                if (!playerState.isDragging) startSpinning();
              }, 100);
            }
          } catch (err) {
            console.error('Error in initializeDraggable onDragEnd:', err.message);
          }
        }
      });
    } else {
      console.error('Error in initializeDraggable: Missing albumArt or spinIndicator');
    }
  } catch (err) {
    console.error('Error in initializeDraggable:', err.message);
  }
}

export function updateProgress() {
  try {
    const progressPercent = playerState.totalTime ? (playerState.currentTime / playerState.totalTime) * 100 : 0;
    if (seekProgress && seekBar) {
      gsap.to(seekProgress, {
        duration: 0.3,
        width: progressPercent + '%',
        ease: 'power2.out'
      });
      // seekHandle position handled by CSS (right: -8px)
    } else {
      console.error('Error in updateProgress: Missing seekProgress or seekBar');
    }
  } catch (err) {
    console.error('Error in updateProgress:', err.message);
  }
}

export function initializeSeekBar() {
  try {
    if (seekBar && seekHandle && seekProgress) {
      let isDraggingSeek = false;
      
      // Click handler for seekbar
      seekBar.addEventListener('click', e => {
        try {
          if (isDraggingSeek) return;
          if (!audioPlayer || audioPlayer.readyState < 2) {
            console.log('Audio not ready for seeking, readyState:', audioPlayer ? audioPlayer.readyState : 'undefined');
            return;
          }
          const rect = seekBar.getBoundingClientRect();
          const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          playerState.currentTime = clickPosition * playerState.totalTime;
          audioPlayer.currentTime = playerState.currentTime;
          updateProgress();
          updateTimeDisplay();
          if (playerState.isPlaying && audioPlayer.paused && audioPlayer.readyState >= 2) {
            audioPlayer.play().catch(err => {
              console.error('Error resuming playback after seek:', err.message);
            });
          }
        } catch (err) {
          console.error('Error in initializeSeekBar click:', err.message);
        }
      });
      
      // Drag handler for seekHandle
      Draggable.create(seekHandle, {
        bounds: seekBar,
        type: 'x',
        edgeResistance: 0.95, // Prevent dragging beyond bounds
        onPress: function() {
          // Ensure seekHandle is interactive
          seekHandle.style.pointerEvents = 'auto';
          seekHandle.style.zIndex = '100';
        },
        onDragStart: function() {
          try {
            isDraggingSeek = true;
            if (playerState.isPlaying && audioPlayer && audioPlayer.readyState >= 2) {
              audioPlayer.pause();
            }
            seekHandle.classList.add('active');
          } catch (err) {
            console.error('Error in seekHandle onDragStart:', err.message);
          }
        },
        onDrag: function() {
          try {
            if (!audioPlayer || audioPlayer.readyState < 2) {
              console.log('Audio not ready for dragging, readyState:', audioPlayer ? audioPlayer.readyState : 'undefined');
              return;
            }
            const rect = seekBar.getBoundingClientRect();
            const handleWidth = seekHandle.offsetWidth;
            const maxHandlePosition = rect.width - handleWidth;
            const progress = Math.max(0, Math.min(1, this.x / maxHandlePosition));
            playerState.currentTime = progress * playerState.totalTime;
            audioPlayer.currentTime = playerState.currentTime;
            gsap.set(seekProgress, { width: (progress * 100) + '%' }); // Instant update
            updateTimeDisplay();
          } catch (err) {
            console.error('Error in seekHandle onDrag:', err.message);
          }
        },
        onDragEnd: function() {
          try {
            isDraggingSeek = false;
            seekHandle.classList.remove('active');
            seekHandle.style.zIndex = ''; // Reset zIndex
            updateProgress();
            if (playerState.isPlaying && audioPlayer && audioPlayer.readyState >= 2) {
              audioPlayer.play().catch(err => {
                console.error('Error resuming playback after seekHandle drag:', err.message);
              });
            }
          } catch (err) {
            console.error('Error in seekHandle onDragEnd:', err.message);
          }
        }
      });
    } else {
      console.error('Error in initializeSeekBar: Missing seekBar, seekHandle, or seekProgress');
    }
  } catch (err) {
    console.error('Error in initializeSeekBar:', err.message);
  }
}