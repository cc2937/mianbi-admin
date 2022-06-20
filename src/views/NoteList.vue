<template>
    <div>
        <el-button @click="handleAdd">新增</el-button>

        <el-table :data="notes">
            <el-table-column prop="title"></el-table-column>
            <el-table-column prop="content"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="handleShow(row.id)">查看</el-button>
                    <el-button @click="handleEdit(row.id)">编辑</el-button>
                    <el-button @click="handleDelete(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notes: [
                { id: 1, title: '学习 Quill', content: '<h2>你好，世界！</h2><p>哈哈哈!</p><p><br></p>', isPublic: false },
                { id: 2, title: '学习 wangEditor', content: '<h2>你好，世界！</h2><p>哈哈哈!</p><p><br></p>', isPublic: true },
            ]
        }
    },
    methods: {
        handleAdd() {
            this.$router.push('/notes/create')
        },
        handleShow(id) {
            this.$router.push(`/notes/${id}`)
            // this.$router.push({
            //     name: 'NoteDetails',
            //     params: id,
            // })
        },
        handleEdit(id) {
            this.$router.push(`/notes/${id}/edit`)
        },
        handleDelete(id) { },
    },
}
</script>

<style scoped>
</style>