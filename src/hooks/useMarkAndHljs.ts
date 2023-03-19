import { marked } from 'marked';
import hljs from 'highlight.js';

export function useMarkAndHljs() {
    // 创建自定义的渲染器
    const renderer = new marked.Renderer();

    // 重写code渲染方法，使用highlight.js进行语法高亮
    renderer.code = function (code: string) {
        return '<pre><code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>';
    }

    // 配置marked.js
    marked.setOptions({
        renderer: renderer
    });

    function markdonwText(test: string) {
        return marked.parse(test)
    }

    return {
        markdonwText
    }
}