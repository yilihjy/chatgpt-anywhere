<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="应用配置" name="config">
      <el-card class="el-card">
        <MyConfig @start-chat="startChat"></MyConfig>
      </el-card>
      <el-card class="el-card">
        <ConfigGuide></ConfigGuide>
      </el-card>
    </el-collapse-item>
    <el-collapse-item title="历史对话" name="records">
      <el-card class="el-card">
        <ConversiationTable
          ref="conversiationTable"
          @seeConversation="seeConversation"
        ></ConversiationTable>
      </el-card>
    </el-collapse-item>
  </el-collapse>
  <MyBeautifulChat
    ref="myBeautifulChat"
    @close="onChatClose"
    @open="onChatOpen"
    @enter-fullscreen="onEnterChatFullscreen"
    @close-fullscreen="onCloseChatFullscreen"
  ></MyBeautifulChat>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MyConfig from './components/MyConfig.vue'
import ConfigGuide from './components/ConfigGuide.vue'
import MyBeautifulChat from './components/MyBeautifulChat.vue'
import ConversiationTable from './components/ConversiationTable.vue'
import { useConfig } from './hooks/useConfig'
import { isMobileBrowser } from './utils/isMobileBrowser'
const myBeautifulChat = ref<InstanceType<typeof MyBeautifulChat> | null>(null)
const conversiationTable = ref<InstanceType<typeof ConversiationTable> | null>(null)
const activeNames = ref(['config', 'records'])
const { hasAllConfig } = useConfig()
const isMobile = isMobileBrowser()
function startChat() {
  if (myBeautifulChat.value) {
    myBeautifulChat.value?.openFullscreen()
  }
  if (isMobile) {
    activeNames.value[0] = ''
  }
}

function onChatClose() {
  activeNames.value[1] = 'records'
  conversiationTable.value?.loadConversations()
}

function onChatOpen() {
  if (isMobile) {
    activeNames.value[0] = ''
  }
}

function onEnterChatFullscreen() {
  activeNames.value[0] = ''
}

function onCloseChatFullscreen() {
  activeNames.value[1] = 'records'
  conversiationTable.value?.loadConversations()
}

function seeConversation(id: string) {
  myBeautifulChat.value?.seeConversation(id)
}

onMounted(() => {
  if (hasAllConfig.value) {
    startChat()
  }
})
</script>

<style lang="scss">
.el-card {
  margin-bottom: 20px;
}
.sc-launcher {
  z-index: 99;
}
</style>
