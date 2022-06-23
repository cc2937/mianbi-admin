<template>
    <div>
        笔记详情
        <div>{{ note.title }}</div>
        <div v-html="note.content"></div>
        <div>{{ note.isPublic ? '公开' : '私有' }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            note: {
                id: 1,
                title: '你好',
                content: '<h2>你好，世界！</h2><p>哈哈哈!</p><p><br></p>',
                isPublic: true,
            }
        }
    },
}
</script>

<style scoped>
</style>