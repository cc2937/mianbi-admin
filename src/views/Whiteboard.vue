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
                    <el-radio-button label="rect">矩形</el-radio-button>
                    <el-radio-button label="text">文本</el-radio-button>
                    <el-radio-button label="select">选择</el-radio-button>
                </el-radio-group>

                <div class="tool-group">
                    <el-color-picker v-if="['pen', 'rect', 'text'].includes(item.mode)" v-model="item.color"
                        :predefine="colors" @change="syncCanvas(index)">
                    </el-color-picker>
                    <el-select v-if="item.mode === 'pen'" v-model="item.width" @change="syncCanvas(index)"
                        class="width-selector">
                        <el-option v-for="item in widths" :key="item.value" :value="item.value" :label="item.label">
                        </el-option>
                    </el-select>
                </div>

                <div class="tool-group">
                    <el-button @click="removeObject(index)">删除</el-button>
                    <el-button @click="clear(index)">清屏</el-button>
                    <el-button @click="rename(index)">重命名</el-button>
                    <el-button @click="undo(index)">撤销</el-button>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { fabric } from 'fabric'
import 'fabric/src/mixins/eraser_brush.mixin.js'
import 'fabric-history'
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
            dpr: 0,
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
            this.dpr = window.devicePixelRatio
            this.$nextTick(() => {
                this.whiteboards.forEach((_, index) => {
                    const canvas = this.getCanvas(index)
                    canvas.setWidth(this.canvasWidth)
                })
            })
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
                    startX = e.pointer.x
                    startY = e.pointer.y
                    if (whiteboard.mode === 'rect') {
                        canvas.selectionColor = 'transparent'
                        canvas.selectionBorderColor = whiteboard.color
                    }
                    if (whiteboard.mode === 'text') {
                        if (!e.target || !e.target.text) {
                            const text = new fabric.Textbox('', {
                                fill: whiteboard.color,
                                width: 100,
                                top: startY - 8,
                                left: startX,
                                fontSize: 16,
                                lineHeight: 1,
                                fontFamily: 'Monaco, monospace',
                            })
                            canvas.add(text)
                            text.enterEditing()
                        }
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
                                borderScaleFactor: 1,
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
            if (mode === 'text') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            } else {
                const textboxes = canvas.getObjects('textbox')
                textboxes.forEach(box => box.exitEditing())
            }
        },
        undo(index) {
            const canvas = this.getCanvas(index)
            canvas.undo()
        },
        removeObject(index) {
            const canvas = this.getCanvas(index)
            const selected = canvas.getActiveObjects()
            canvas.remove(...selected)
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
    justify-content: space-between;
}

.tools {
    margin-right: 24px;
}

.tool-group {
    display: flex;
}

.tool-group :deep(> div) {
    margin-left: 8px;
}

.width-selector {
    width: 100px;
}
</style>