<template>
    <el-tabs ref="tabs" v-model="tabActive" editable @tab-remove="handleRemove" @tab-add="handleAdd">
        <el-tab-pane v-for="(item, index) in whiteboards" :key="item.id" :label="item.title" :name="item.id">
            <div class="canvas-container" @keyup.delete="hanldeObjectDelete">
                <canvas ref="canvas" :width="canvasWidth" height="450"></canvas>
            </div>

            <div class="toolbar">
                <el-radio-group v-model="item.mode" class="tools" @change="syncCanvas(index)">
                    <el-radio-button label="pen">画笔</el-radio-button>
                    <el-radio-button label="eraser">橡皮擦</el-radio-button>
                    <el-radio-button label="select">选择</el-radio-button>
                    <el-radio-button label="rect">矩形</el-radio-button>
                </el-radio-group>

                <template v-if="item.mode === 'pen'">
                    <el-color-picker v-model="item.color" :predefine="colors" @change="syncCanvas(index)" />
                    <el-select v-model="item.width" @change="syncCanvas(index)">
                        <el-option v-for="item in widths" :key="item.value" :value="item.value" :label="item.label">
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
import { fabric } from 'fabric'
import 'fabric/src/mixins/eraser_brush.mixin.js'
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'
import { markRaw } from 'vue'

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
            const whiteboard = {
                id: this.nextTab,
                title: `白板 ${this.nextTab}`,
                color: '#ff0000',
                width: 3,
                mode: 'pen'
            }
            this.whiteboards.push(whiteboard)
            this.tabActive = this.nextTab
            this.nextTab++
            this.$nextTick(() => {
                const index = this.nextTab - 2
                this.syncCanvas(index)
            })
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
            const canvas = this.getCanvas(index)
            canvas.clear()
        },
        async rename(index) {
            try {
                const { value } = await ElMessageBox.prompt('请输入白板名称', '重命名白板', {})
                this.whiteboards[index].title = value
            } catch (e) { }
        },
        getCanvas(index) {
            const whiteboard = this.whiteboards[index]
            let { canvas } = whiteboard
            if (!canvas) {
                const el = this.$refs.canvas[index]
                canvas = new fabric.Canvas(el, { selectionLineWidth: 3 })
                whiteboard.canvas = markRaw(canvas)
                let startX, startY
                canvas.on('mouse:down', e => {
                    if (whiteboard.mode === 'rect') {
                        canvas.selectionColor = 'transparent'
                        canvas.selectionBorderColor = whiteboard.color
                        startX = e.pointer.x
                        startY = e.pointer.y
                    }
                })
                canvas.on('mouse:up', e => {
                    if (whiteboard.mode === 'rect') {
                        const { x: endX, y: endY } = e.pointer
                        const tempW = Math.abs(endX - startX)
                        const tempH = Math.abs(endY - startY)
                        if (tempW > 3 && tempH > 3) {
                            const rect = new fabric.Rect({
                                left: Math.min(startX, endX),
                                top: Math.min(startY, endY),
                                width: tempW - 3,
                                height: tempH - 3,
                                strokeWidth: 3,
                                stroke: whiteboard.color,
                                fill: 'transparent',
                            })
                            canvas.add(rect)
                        }
                    }
                })
            }
            return canvas
        },
        hanldeObjectDelete(event) {
            console.dir(event.target)
        },
        syncCanvas(index) {
            const canvas = this.getCanvas(index)
            const whiteboard = this.whiteboards[index]
            const { mode } = whiteboard

            if (mode === 'eraser') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
                canvas.freeDrawingBrush.width = 30
                canvas.skipTargetFind = true
            }
            if (mode === 'pen') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
                canvas.freeDrawingBrush.color = whiteboard.color
                canvas.freeDrawingBrush.width = whiteboard.width
                canvas.skipTargetFind = true
            }
            if (mode === 'select') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            }
            if (mode === 'rect') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = true
                fabric.Object.prototype.selectable = false
            }
        },
    },
    mounted() {
        this.init() // this.canvasWidth = 1000  => <canvas width="1000">
        window.addEventListener('resize', () => this.init())

        this.$nextTick(() => this.syncCanvas(0))
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