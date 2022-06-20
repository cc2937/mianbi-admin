<template>
    <div>
        {{ note.content }}
        <div>
            <Toolbar :default-config="toolbarConfig" :editor="editor"></Toolbar>
            <Editor :default-config="editorConfig" @on-created="handleEditorCreated" v-model="note.content"></Editor>
        </div>
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
            editorConfig: { placeholder: '在这里写笔记……' },
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