<template>
  <div class="markdown-container" v-html="renderedMarkdown"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { computed, onUpdated, onMounted } from 'vue'
import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()
const id = Math.round(Math.random() * new Date().getTime())

const md: any = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    const operation = `<div class="code-wrapper-op"><div>${
      lang ? lang : ''
    }</div><div  class="copy-button copy-button-${id}" data-code="${md.utils.escapeHtml(
      str
    )}">复制代码</div></div><code>`
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs code-wrapper">${operation}` +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
        )
      } catch (err) {
        console.log(err)
      }
    }
    return (
      `<pre class="hljs code-wrapper">${operation}<code>` +
      md.utils.escapeHtml(str) +
      '</code></pre>'
    )
  }
})

const props = defineProps({
  markdown: {
    type: String,
    required: true
  }
})

let renderedMarkdown = computed(() => {
  return md.render(props.markdown)
})

async function copyCode(el: any) {
  const code = (el as any).dataset.code
  await copy(code)
  el.innerHTML = '复制成功'
  setTimeout(() => {
    el.innerHTML = '复制代码'
  }, 1000)
}

function setCopyButton() {
  const copyButton = document.querySelectorAll(`.copy-button-${id}`)
  copyButton.forEach((el) => {
    el.addEventListener('click', copyCode.bind(undefined, el))
  })
}

onMounted(() => {
  setCopyButton()
})

onUpdated(() => {
  setCopyButton()
})
</script>

<style lang="scss">
.code-wrapper {
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;

  .code-wrapper-op {
    border-bottom: 1px solid #ccc;
    font-size: 10px;
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;

    .copy-button {
      cursor: pointer;
    }
  }
}
</style>
