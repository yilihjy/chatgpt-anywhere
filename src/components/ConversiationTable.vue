<template>
  <el-table class="record-table" :data="conversations" stripe>
    <el-table-column prop="id" label="对话ID"></el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="created" label="创建时间" :formatter="formatTimestamp"></el-table-column>
    <el-table-column prop="updated" label="更新时间" :formatter="formatTimestamp"></el-table-column>
    <el-table-column label="操作" width="150px">
      <template #default="scope">
        <el-button type="primary" plain @click="seeConversation(scope.row)">查看对话</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    v-model:current-page="currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pageSize"
    layout="total, prev, pager, next"
    :total="totalItems"
  ></el-pagination>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PaginationResult, conversation } from '@/types/DB'
import { useConversationRecord } from '../hooks/useConversationRecord'

const conversations = ref<conversation[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const { getConversationsByPage } = useConversationRecord()
const emit = defineEmits<{
  (e: 'seeConversation', id: string): void
}>()

const loadConversations = async () => {
  const result: PaginationResult<conversation> = await getConversationsByPage(
    currentPage.value,
    pageSize.value,
    'desc'
  )
  conversations.value = result.list
  totalItems.value = result.totalItems
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadConversations()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadConversations()
}

const formatTimestamp = (row: conversation, column: any) => {
  const timestamp = row[column.property as 'created' | 'updated']
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', { hour12: false })
}

const seeConversation = (row: conversation) => {
  emit('seeConversation', row.id)
}

loadConversations()

defineExpose({
  loadConversations
})
</script>
