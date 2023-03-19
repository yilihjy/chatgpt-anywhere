<template>
    <beautiful-chat class="beautiful-chat" :class="{ 'fullscreen': fullscreenMode, 'mobile': !isPC }" v-bind="beautifulChatConfig">
        <template v-slot:header>
            <span v-if="isPC" class="fullscreen-btn" @click="switchFullscreen">
                <el-icon :size="24">
                    <FullScreen></FullScreen>
                </el-icon>
                {{ fullscreenMode ? '缩小' : '全屏' }}
            </span>
            <span></span>
        </template>
        <template v-slot:text-message-body="scopedProps">
            <p class="sc-message--text-content" v-html="markdonwText(scopedProps.message.data.text)"></p>
            <p v-if="scopedProps.message.data.meta" class="sc-message--meta"
                :style="{ color: scopedProps.messageColors.color }">
                {{ scopedProps.message.data.meta }}
            </p>
            <p v-if="scopedProps.message.isEdited || scopedProps.message.liked" class="sc-message--edited">
                <template v-if="scopedProps.message.isEdited">✎</template>
                <template v-if="scopedProps.message.liked">👍</template>
            </p>
        </template>
    </beautiful-chat>
</template>

<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue';
import { useFullscreen } from '../hooks/useFullscreen';
import { useMarkAndHljs } from '../hooks/useMarkAndHljs';
import { useMessageManage } from '../hooks/useMessageManage';

const { isPC, fullscreenMode, switchFullscreen} = useFullscreen();
const { markdonwText } = useMarkAndHljs();
const { beautifulChatConfig } = useMessageManage();

</script>

<style lang="scss">
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

.beautiful-chat {
    .sc-message--text {
        max-width: 80% !important;
    }
}

.fullscreen-btn {
    font-size: 20px;
    line-height: 24px;
    cursor: pointer;

    .el-icon {
        vertical-align: bottom;
    }
}
</style>
