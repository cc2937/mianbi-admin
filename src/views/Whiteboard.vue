<template>
    <el-tabs ref="tabs" v-model="tabActive" editable @tab-remove="handleRemove" @tab-add="handleAdd">
        <el-tab-pane
            v-for="(item, index) in whiteboards"
            :key="item.id"
            :label="item.title"
            :name="item.id"
        >
            <canvas ref="canvas" @mousedown="handleDraw($event, index)" :width="canvasWidth" height="450"></canvas>

            <div class="toolbar">
                <el-radio-group v-model="item.mode" class="tools">
                    <el-radio-button label="pen">画笔</el-radio-button>
                    <el-radio-button label="eraser">橡皮擦</el-radio-button>
                </el-radio-group>

                <template v-if="item.mode === 'pen'">
                    <el-color-picker v-model="item.color" :predefine="colors" />
                    <el-select v-model="item.width">
                        <el-option
                            v-for="item in widths"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        >
                        </el-option>
                    </el-select>
                </template>

                <el-button @click="clear(index)">清屏</el-button>
                <el-button @click="rename(index)">重命名</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

export default {
    data() {
        return {
            tabActive: 1,
            whiteboards: [
                { id: 1, title: '白板 1', color: '#ff0000', width: 3, mode: 'pen' },
            ],
            nextTab: 2,
            canvasWidth: 0,
            colors: ['#ff0000', '#ffff00'],
            widths: [
                { value: 1, label: '极细' },
                { value: 3, label: '常规' },
                { value: 5, label: '粗' },
                { value: 20, label: '极粗' },
            ],
        }
    },
    methods: {
        init() {
           this.canvasWidth = this.$refs.tabs.$el.getBoundingClientRect().width
        },
        handleRemove(name) {
            const index = this.whiteboards.findIndex(item => item.id === name)
            this.whiteboards.splice(index, 1)
        },
        handleAdd() {
            this.whiteboards.push({
                id: this.nextTab,
                title: `白板 ${this.nextTab}`,
                color: '#ff0000',
                width: 3,
                mode: 'pen'
            })
            this.tabActive = this.nextTab
            this.nextTab++
        },
        handleDraw(event, index) {
            const canvas = event.target
            const ctx = canvas.getContext('2d')
            const whiteboard = this.whiteboards[index]
            if (whiteboard.mode === 'eraser') {
                ctx.lineWidth = 30
                ctx.strokeStyle = '#ffffff'
            } else {
                ctx.lineWidth = whiteboard.width
                ctx.strokeStyle = whiteboard.color
            }
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.beginPath()
            ctx.moveTo(event.offsetX, event.offsetY)
            document.onmousemove = (e) => {
                ctx.lineTo(e.offsetX, e.offsetY)
                ctx.stroke()
            }
            document.onmouseup = () => {
                ctx.closePath()
                document.onmousemove = null
                document.onmouseup = null
            }
        },
        clear(index) {
            const canvas = this.$refs.canvas[index]
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        },
        async rename(index) {
            try {
                const { value } = await ElMessageBox.prompt('请输入白板名称', '重命名白板', {})
                this.whiteboards[index].title = value
            } catch (e) {}
        },
    },
    mounted() {
        this.init()
        window.addEventListener('resize', () => this.init())
    },
}
</script>

<style scoped>
.toolbar {
    display: flex;
}

.tools {
    margin-right: 24px;
}

</style>