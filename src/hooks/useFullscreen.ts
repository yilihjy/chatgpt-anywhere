import { ref } from 'vue';
import { isMobileBrowser } from '../utils/isMobileBrowser';

export function useFullscreen() {
    const fullscreenMode = ref(false);
    const isMobile = isMobileBrowser();
    if (isMobile) {
        fullscreenMode.value = false;
    }
    function switchFullscreen() {
        fullscreenMode.value = !fullscreenMode.value;
    }
    return {
        isPC: !isMobile,
        fullscreenMode,
        switchFullscreen
    }

}