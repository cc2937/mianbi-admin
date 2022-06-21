<template>
    <div>
        <el-form label-width="auto">
            <el-form-item label="内容">
                <div class="editor-container">
                    <Toolbar :default-config="toolbarConfig" :editor="editor" />
                    <Editor :default-config="editorConfig" @on-created="handleEditorCreated" v-model="note.content" />
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Toolbar, Editor } from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css'
import { shallowRef } from "vue";

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
                isPublic: false,
            },
            editor: null,
            toolbarConfig: {},
            editorConfig: { autoFocus: false },
        }
    },
    methods: {
        handleEditorCreated(editor) {
            this.editor = shallowRef(editor)
        }
    },
}
</script>

<style scoped>
</style>