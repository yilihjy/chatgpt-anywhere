<template>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="应用配置" name="config">
            <el-card class="el-card">
                <MyConfig></MyConfig>
            </el-card>
            <el-card class="el-card">
                <ConfigGuide></ConfigGuide>
            </el-card>
        </el-collapse-item>
    </el-collapse>
    <MyBeautifulChat></MyBeautifulChat>
</template>

<script setup lang="ts">
import MyConfig from './components/MyConfig.vue';
import ConfigGuide from './components/ConfigGuide.vue';
import MyBeautifulChat from './components/MyBeautifulChat.vue';

import { ref } from 'vue'

const activeNames = ref(['config'])
</script>

<style lang="scss">
.el-card {
    margin-bottom: 20px;
}
</style>
