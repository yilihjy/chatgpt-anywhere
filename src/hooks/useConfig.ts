import { useLocalStorage } from '@vueuse/core'
import type { config } from '../types/config'
import { unref, computed } from 'vue'

export function useConfig() {
  const KEY = 'chatGpt-Anywhere-Config'
  const refConfig = useLocalStorage(KEY, getDefaultConfig(), {
    mergeDefaults: true
  })

  const hasAllConfig = computed(() => {
    if (
      refConfig.value.key &&
      refConfig.value.baseUrl &&
      refConfig.value.model &&
      refConfig.value.systemRole
    ) {
      return true
    } else {
      return false
    }
  })

  function getDefaultConfig(): config {
    return {
      key: '',
      baseUrl: '',
      model: 'gpt-3.5-turbo',
      systemRole: 'You are a helpful assistant.',
      max_tokens: 1000,
      temperature: 1,
      stream: false
    }
  }

  function setConfig(config: config) {
    localStorage.setItem(KEY, JSON.stringify(config))
  }

  function getUnrefConf() {
    return unref(refConfig)
  }

  return {
    getUnrefConf,
    setConfig,
    refConfig,
    hasAllConfig
  }
}
