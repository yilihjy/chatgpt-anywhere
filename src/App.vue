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
    </el-collapse>
    <MyBeautifulChat ref="myBeautifulChat"></MyBeautifulChat>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MyConfig from './components/MyConfig.vue';
import ConfigGuide from './components/ConfigGuide.vue';
import MyBeautifulChat from './components/MyBeautifulChat.vue';
import { useConfig } from './hooks/useConfig';
const myBeautifulChat = ref<InstanceType<typeof MyBeautifulChat> | null>(null)
const activeNames = ref(['config'])
const { hasAllConfig } = useConfig();
function startChat() {
    if (myBeautifulChat.value) {
        myBeautifulChat.value?.openFullscreen()
    }
}

onMounted(() => {
    if (hasAllConfig.value) {
        startChat();
    }
})


</script>

<style lang="scss">
.el-card {
    margin-bottom: 20px;
}
</style>
