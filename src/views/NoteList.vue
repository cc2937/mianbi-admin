<template>
    <div>
        <el-form inline>
            <el-form-item label="日期">
                <el-date-picker v-model="query.date" />
            </el-form-item>
            <el-form-item label="搜索词">
                <el-input v-model="query.q"></el-input>
            </el-form-item>
            <el-form-item label="可见性">
                <el-select v-model="query.isPublic">
                    <el-option value="" label="全部"></el-option>
                    <el-option :value="1" label="公开"></el-option>
                    <el-option :value="0" label="私有"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-button @click="handleAdd" type="primary">新增</el-button>

        <el-table :data="notes">
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="内容">
                <template #default="{ row }">
                    {{ row.content.replace(/<[^>]+>/g, '').slice(0, 20) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="handleShow(row.id)">查看</el-button>
                    <el-button @click="handleEdit(row.id)">编辑</el-button>
                    <el-button @click="handleDelete(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="query.page" v-model:page-size="query.perPage" :total="total"
            @current-change="getNotes" @size-change="search" layout="->, prev, pager, next" background />
    </div>
</template>

<script>
import { ElMessageBox } from "element-plus";
import "element-plus/es/components/message-box/style/css";
import { getNotes, deleteNote } from "@/api/note";

export default {
    data() {
        return {
            query: {
                q: '',
                date: '',
                isPublic: '',
                page: 1,
                perPage: 1,
            },
            total: 0,
            notes: [],
        }
    },
    created() {
        this.getNotes()
    },
    methods: {
        formatDate(date) {
            if (!date) return ''
            return date.toISOString().slice(0, 10)
        },
        search() {
            this.query.page = 1
            this.getNotes()
        },
        async getNotes() {
            const res = await getNotes({
                ...this.query,
                date: this.formatDate(this.query.date),
            })
            this.total = res.data.total
            this.notes = res.data.data
        },
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
        handleDelete(id) {
            ElMessageBox.confirm('确认删除？')
                .then(async () => {
                    await deleteNote(id)
                    await this.getNotes()
                })
                .catch(() => { })
        },
    },
}
</script>

<style scoped>
</style>