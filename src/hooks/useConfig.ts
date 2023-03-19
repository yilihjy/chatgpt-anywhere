import { useLocalStorage } from '@vueuse/core'
import type { config } from '../types/config';
import { unref } from 'vue';

export function useConfig () {
    const KEY = 'chatGpt-Anywhere-Config';
    const refConfig = useLocalStorage(KEY, getDefaultConfig(), {
        mergeDefaults: true 
    });

    function getDefaultConfig (): config {
        return {
            key: '',
            baseUrl: '',
            model: 'gpt-3.5-turbo',
            systemRole: 'You are a helpful assistant.'
        }
    }

    function setConfig(config: config) {
        localStorage.setItem(KEY, JSON.stringify(config));
    }

    function getUnrefConf () {
        return unref(refConfig)
    }

    return {
        getUnrefConf,
        setConfig,
        refConfig
    }
}