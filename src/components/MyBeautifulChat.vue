<template>
    <beautiful-chat class="beautiful-chat" :class="{ 'fullscreen': fullscreenMode, 'mobile': !isPC }"
        v-bind="beautifulChatConfig">
        <template v-slot:header>
            <span v-if="isPC" class="icon-btn" @click="switchFullscreen">
                <el-icon :size="24">
                    <FullScreen></FullScreen>
                </el-icon>
                {{ fullscreenMode ? '缩小' : '全屏' }}
            </span>
            <span v-else class="icon-btn" @click="openSetting">
                <el-icon :size="24">
                    <Setting></Setting>
                </el-icon>
                {{ '打开设置' }}
            </span>
        </template>
        <template v-slot:text-message-body="scopedProps">
            <p class="sc-message--text-content"  v-html="markdonwText(scopedProps.message.data.text)"></p>
            <p v-if="scopedProps.message.data.meta" class="sc-message--meta"
                :style="{ color: scopedProps.messageColors.color }">
                {{ scopedProps.message.data.meta }}
            </p>
            <p v-if="scopedProps.message.isEdited || scopedProps.message.liked" class="sc-message--edited">
                <template v-if="scopedProps.message.isEdited">✎</template>
                <template v-if="scopedProps.message.liked">👍</template>
            </p>
            <span v-if="['me', 'assistant'].includes(scopedProps.message.author)" class="copy-text" @click="copyText(scopedProps.message.data.text)">
                <el-icon :size="18 ">
                    <CopyDocument />
                </el-icon>
            </span>
        </template>
    </beautiful-chat>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { watch } from 'vue';
import { FullScreen, Setting, CopyDocument } from '@element-plus/icons-vue';
import { useFullscreen } from '../hooks/useFullscreen';
import { useMarkAndHljs } from '../hooks/useMarkAndHljs';
import { useMessageManage } from '../hooks/useMessageManage';

const emit = defineEmits<{
    (e: 'open'): void
    (e: 'close'): void
    (e: 'enterFullscreen'): void
    (e: 'closeFullscreen'): void
}>();



const { isPC, fullscreenMode, switchFullscreen } = useFullscreen();
const { markdonwText } = useMarkAndHljs();
const { beautifulChatConfig } = useMessageManage();

const { copy } = useClipboard()

function open() {
    beautifulChatConfig.open()
}

function openFullscreen() {
    beautifulChatConfig.open()
    if (isPC && !fullscreenMode.value) {
        switchFullscreen()
    }
}

function openSetting() {
    beautifulChatConfig.close()
}

async function copyText(text: string) {
    await copy(text)
}

watch(() => beautifulChatConfig.isOpen, (cur) => {
    if (cur) {
        emit('open')
    } else {
        emit('close')
    }
})

watch(() => fullscreenMode.value, (cur) => {
    if (cur) {
        emit('enterFullscreen')
    } else {
        emit('closeFullscreen')
    }
})

defineExpose({
    open,
    openFullscreen
})
</script>

<style lang="scss">
.hidden-in-mobile.hide {
    display: none;
}

/**
  复写样式
 */
.beautiful-chat.fullscreen {
    .sc-chat-window {
        width: calc(100% - 50px) !important;
        max-height: calc(100% - 120px) !important;

        .sc-message {
            width: calc(100% - 10px) !important;
        }

        .sc-user-input--text {
            width: calc(100% - 200px) !important;
        }
    }

}

.beautiful-chat.mobile {
    .sc-chat-window {
        width: 100%;
        height: 100%;
        max-height: 100%;
        right: 0;
        bottom: 0;
        border-radius: 0;
    }

    .sc-header {
        border-radius: 0;
    }

    .sc-message {
        width: calc(100% - 10px) !important;
    }

    .sc-user-input {
        border-radius: 0;
    }

    .sc-user-input--text {
        width: calc(100% - 100px) !important;
    }
}

.beautiful-chat {
    .sc-message--text {
        max-width: 80% !important;
    }
}

.icon-btn {
    font-size: 20px;
    line-height: 24px;
    cursor: pointer;

    .el-icon {
        vertical-align: bottom;
    }
}

.copy-text {
    display: inline-block;
    font-size: 10px;
    line-height: 18px;
    padding-bottom: 5px;

    cursor: pointer;

    .el-icon {
        vertical-align: bottom;
    }
}

.code-container {
    position: relative;

    .code-copy-icon {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 2px;
        top: 2px;
        cursor: pointer;
    }
}
</style>
