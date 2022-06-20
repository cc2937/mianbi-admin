<template>
    <div>
        笔记详情
        {{ $route.params.id }}

        <div>{{ note.content }}</div>
        <div v-html="note.content"></div>
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