// state.js
import { reactive } from './petite-vue.js';

export const playerState = reactive({
  currentTime: 0,
  totalTime: 0,
  isPlaying: false,
  isDragging: false,
  isManualSpinning: false,
  progressTimer: null,
  audio: null,
  currentTrackUrl: null
});