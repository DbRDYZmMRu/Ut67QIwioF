// animationManager.js
import gsap from 'https://esm.sh/gsap';
import { Draggable } from 'https://esm.sh/gsap/Draggable';
import { playerState } from './state.js';
import { updateProgress, updateTimeDisplay } from './progressManager.js';
import { getAudio } from './audioPlayback.js';

gsap.registerPlugin(Draggable);

const mainContainer = document.getElementById('mainContainer');
const albumArt = document.getElementById('albumArt');
const songDetails = document.getElementById('songDetails');
const seekBarContainer = document.getElementById('seekBarContainer');
const playerControls = document.getElementById('playerControls');
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
      Draggable.create(albumArt, {
        type: 'rotation',
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
          } catch (err) {
            console.error('Error in initializeDraggable onDragStart:', err.message);
          }
        },
        onDrag: function() {
          try {
            const angleDiff = this.rotation - lastSpinAngle;
            const seekChange = (angleDiff / 360) * 10;
            playerState.currentTime = Math.max(0, Math.min(playerState.totalTime, playerState.currentTime + seekChange));
            const audio = getAudio();
            audio.currentTime = playerState.currentTime;
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