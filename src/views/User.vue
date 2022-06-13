<template>
    <el-form inline>
        <el-form-item label="类型">
            <el-select v-model="query.type">
                <el-option value="" label="全部" />
                <el-option v-for="type in types" :key="type.id" :value="type.id" :label="type.name" />
            </el-select>
        </el-form-item>
        <el-form-item label="开课日期">
            <el-date-picker v-model="query.start" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary">搜索</el-button>
        </el-form-item>
    </el-form>

    <div>
        <div class="table-btns">
            <el-button type="primary" @click="showAdd">添加</el-button>
            <el-button type="danger" v-if="batchDeleteVisible" @click="handleBatchDelete">批量删除</el-button>
        </div>
        <el-table empty-text="没有数据" :data="users" table-layout="auto" @selection-change="handleChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :width="60"></el-table-column>
            <el-table-column label="面壁者">
                <template #default="{ row }">
                    <div class="user-cell">
                        <el-image class="avatar" :src="row.avatar" :preview-src-list="[row.avatar]" fit="cover"
                            preview-teleported hide-on-click-modal>
                        </el-image>
                        <span class="user-username">{{ row.username }}</span>
                        <span>({{ row.name }})</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template #default="{ row }">
                    {{ getTypeText(row.type) }}
                </template>
            </el-table-column>
            <el-table-column prop="start" label="开课日期"></el-table-column>
            <el-table-column prop="level" label="级别"></el-table-column>
            <el-table-column prop="score" label="成长值"></el-table-column>
            <el-table-column label="徽章"></el-table-column>
            <el-table-column label="操作" :width="140">
                <template #default="{ row }">
                    <el-button size="small" @click="showEdit(row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pager-container">
            <el-pagination layout="->, prev, pager, next" :total="50" background></el-pagination>
        </div>
    </div>

    <el-dialog v-model="visible" :title="`${dialogText}面壁者`" :width="350" @closed="handleClosed">
        <el-form ref="form" :model="form" :rules="rules" label-width="auto">
            <el-form-item label="代号" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="开课日期" prop="start">
                <el-input v-model="form.start"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            <el-button @click="hide">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

export default {
    data() {
        return {
            types: [
                { id: 1, name: '线上' },
                { id: 2, name: '线下' },
            ],
            query: {
                type: '',
                start: '',
            },
            users: [
                { id: 1, type: 2, username: '华山', name: '华晨', avatar: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h36tkf2rxrj20po0q4gp4.jpg', start: '2022-04-18', level: 3, score: 8876, badges: [] },
                { id: 2, type: 2, username: '小龙', name: '方晓龙', avatar: 'https://tva1.sinaimg.cn/large/e6c9d24egy1h36ok2cgx6j20py0q2jsy.jpg', start: '2022-04-18', level: 6, score: 66666, badges: [] },
            ],
            visible: false,
            form: this.getFreshForm(),
            rules: {
                username: [
                    { required: true, message: '请填写代号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请填写姓名', trigger: 'blur' },
                ],
            },
            isAdd: true,
            selection: [],
        }
    },
    computed: {
        dialogText() {
            return this.isAdd ? '添加' : '编辑'
        },
        batchDeleteVisible() {
            return !!this.selection.length
        },
    },
    methods: {
        getTypeText(typeId) {
            const type = this.types.find(item => item.id === typeId)
            return type ? type.name : '未知'
        },
        showAdd() {
            this.isAdd = true
            this.visible = true
        },
        hide() {
            this.visible = false
        },
        showEdit(id) {
            this.isAdd = false
            this.visible = true
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return
                this.visible = false
            })
        },
        handleClosed() {
            this.form = this.getFreshForm()
            this.$refs.form.clearValidate()
        },
        getFreshForm() {
            return {
                username: '',
                name: '',
                avatar: '',
                start: '',
                level: 0,
                score: 0,
                badges: [],
            }
        },
        async handleDelete(id) {
            try {
                await ElMessageBox.confirm('确认删除吗？', '请确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                // 执行删除
            } catch (error) { }
        },
        handleChange(selection) {
            this.selection = selection
        },
        async handleBatchDelete() {
            try {
                await ElMessageBox.confirm('确认删除吗？', '请确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                // 执行删除
            } catch (error) { }
        },
    },
}
</script>

<style scoped>
.user-cell {
    display: flex;
    align-items: center;
}

.user-username {
    margin-right: 4px;
}

.avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
}

.table-btns {
    margin-bottom: 8px;
}

.pager-container {
    margin-top: 8px;
}
</style>