<template>
    <h2>编辑</h2>
    <el-form label-width="auto" :model="note" :rules="rules" hide-required-asterisk>
        <el-form-item label="标题" prop="title">
            <el-input v-model="note.title" autofocus></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
            <div class="editor-container">
                <Toolbar :default-config="toolbarConfig" :editor="editor" />
                <Editor :default-config="editorConfig" @on-created="handleEditorCreated" v-model="note.content" />
            </div>
        </el-form-item>
        <el-form-item label="可见性" prop="isPublic">
            <el-radio-group v-model="note.isPublic">
                <el-radio :label="true">公开</el-radio>
                <el-radio :label="false">私有</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleUpdate">更新</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { Toolbar, Editor } from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css'
import { shallowRef } from "vue";
import { getNote, updateNote } from "@/api/note";

export default {
    components: {
        Toolbar,
        Editor,
    },
    data() {
        return {
            note: {
                title: '',
                content: '',
                isPublic: null,
            },
            rules: {
                title: [
                    { required: true, message: '标题必填', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '内容必填', trigger: 'blur' },
                ],
                isPublic: [
                    { required: true, message: '可见性必选', trigger: 'change' },
                ],
            },
            editor: null,
            toolbarConfig: {},
            editorConfig: { autoFocus: false },
        }
    },
    created() {
        this.getNote()
    },
    methods: {
        async getNote() {
            const res = await getNote(this.$route.params.id)
            this.note = res.data
        },
        async handleUpdate() {
            const { note } = this
            await updateNote(note.id, note)
            this.$router.push('/notes')
        },
        handleCancel() {
            this.$router.push('/notes')
        },
        handleEditorCreated(editor) {
            this.editor = shallowRef(editor)
        },
    },
}
</script>

<style scoped>
</style>