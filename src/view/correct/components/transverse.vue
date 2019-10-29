<template>
  <div>
    <Fabric ref="canvas"
            id="canvas"
            v-show="mode==1"
            class="fabric"
            :width="1100"
            :height="783"
            @remove="handleRemove"
            @mouse:down="mouseDown"
            @mouse:over="mouseOver"
            @mouse:out="mouseOut"
            @mouse:up="mouseUp"
            @mouse:move="mouseMove"></Fabric>
    <Fabric ref="canvasSb"
            id="canvasSb"
            v-show="mode==2"
            class="fabric"
            :width="764"
            :height="783"
            @remove="handleRemove"
            @mouse:down="mouseDown"
            @mouse:over="mouseOver"
            @mouse:out="mouseOut"
            @mouse:up="mouseUp"
            @mouse:move="mouseMove"></Fabric>
  </div>

</template>

<script>

import Fabric from './fabric/fabric'
import titleImg from '../../../assets/images/correct/title.png'
import pzImg from '../../../assets/images/correct/pz.png'
import titleSbImg from '../../../assets/images/correct/title_sb.png'
import pzSbImg from '../../../assets/images/correct/pz_sb.png'
export default {
  props: {
    image: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      default: () => ({
        type: '',
        show: false,
        drawWidth: 1,
        inputValue: '',
        drawColor: '#FF0000',
        fontColor: '#FF0000',
        fontSize: 18,
        graphColor: '#FF0000',
        graphWidth: 1,
        graphType: 'line'
      })
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      width: 1100,
      canvas: null,
      drawingObject: null,
      doDrawing: false,
      moveCount: 1,
      mouseTo: {},
      mouseFrom: {},
      history: [],
      backArr: [],
      pzImg: null,
      pzText: null
    }
  },
  watch: {
    mode (val) {
      this.initCanvas()
    },
    image (val) {
      this.initCanvas()
    },
    data: {
      handler: function (val, oldVal) {
        this.changeMode()
      },
      deep: true
    }
  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    initCanvas () {
      let { mode, type } = this
      this.history = []
      this.backArr = []
      this.canvas = mode == 1 ? this.$refs.canvas : this.$refs.canvasSb
      this.canvas.clear()
      if (mode == 1) {
        this.width = 1100
      } else {
        this.width = 764
      }
      type == 1 ? this.init() : this.initTeacher()

    },
    init () {
      if (this.type == 1) {
        this.createImage()
        this.setBackgroud()
        this.setText()
      }
    },
    initTeacher () {
      this.setTeacherBackgroud()
    },
    mouseDown (option) {
      this.$emit('mousedown', option)
      console.log(this.pzText)
      if (option.button == 1 && this.data.type == 'graph') {
        this.mouseFrom.x = option.e.offsetX;
        this.mouseFrom.y = option.e.offsetY;
        this.doDrawing = true
      } else if (option.button == 1 && this.data.type != 'graph' && option.target && option.target.id == "remarkBg") {

        this.pzText.enterEditing()
      } else if (this.pzText.isEditing) {
        this.pzText.exitEditing()
      }
    },
    mouseOver (option) {
    },
    mouseOut (option) {
    },
    mouseMove (option) {
      if (this.data.type == 'graph') {
        if ((this.moveCount % 2 && !this.doDrawing) || this.canvas.canvas.getActiveObject()) {
          //减少绘制频率
          return;
        }
        this.moveCount += 1
        this.mouseTo.x = option.e.offsetX;
        this.mouseTo.y = option.e.offsetY;
        this.drawing(false);
      }
    },
    mouseUp (option) {
      let objects = this.canvas.getObjects()
      if (option.button == 1) {
        if (this.data.type == 'draw') {
          this.history.push({
            type: 'add',
            target: objects[objects.length - 1]
          })
        } else if (this.data.type == 'graph') {
          this.mouseTo.x = option.e.offsetX;
          this.mouseTo.y = option.e.offsetY;

          this.drawing(true);
          this.drawingObject = null
          this.moveCount = 1
          this.doDrawing = false
        }
      }

    },
    handleRemove (target) {
      let id = target.id
      if (id == 'homeWorkImg' || id == 'remarkBg') {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>是否要删除${id == 'homeWorkImg' ? '作业图片' : '批注背景图'}</p>`,
          onOk: () => {
            if (id == 'remarkBg') {
              this.removePz();
            } else {
              this.remove(target);
            }
          }
        });
      }
      this.remove(target);

    },
    save () {
      let { width } = this
      let base64 = this.toDataUrl()
      this.canvas.clear()
      let img = fabric.Image.fromURL(base64, (img) => {
        this.canvas.setBackgroundImage(img, width / img.width, 783 / img.height)
      })
    },
    clear () {
      this.canvas.clear()
      this.initCanvas()
    },
    remove (obj) {
      this.canvas.remove(obj)
      this.history.push({
        type: 'remove',
        target: obj
      })
    },
    removePz () {
      this.remove(this.pzText)
      this.remove(this.pzImg)
    },
    add (obj) {
      this.canvas.add(obj)
      this.history.push({
        type: 'add',
        target: obj
      })
    },
    back () {
      let obj = this.history.pop()
      if (obj) {
        let { type, target } = obj
        switch (type) {
          case 'add':
            this.canvas.remove(target)
            break
          case 'remove':
            this.canvas.add(target)
            break
        }
        this.backArr.push(obj)
      }

    },
    forward () {
      let obj = this.backArr.pop()
      if (obj) {
        let { type, target } = obj
        switch (type) {
          case 'add':
            this.add(target)
            break
          case 'remove':
            this.remove(target)
            break
        }
      }
    },
    toDataUrl () {
      return this.canvas.toDataUrl()
    },
    changeMode () {
      let { type } = this.data
      let canvas = this.canvas.canvas
      let activeObject = canvas.getActiveObject()
      if (activeObject && activeObject.isEditing) {
        activeObject.exitEditing()
      }
      this.canvas.discardActive()
      this.freeDrawConfig(false)
      canvas.selection = true;
      canvas.skipTargetFind = false;
      canvas.selectable = true;
      switch (type) {
        case 'draw':
          this.freeDrawConfig(true)
          break
        case 'graph':
          canvas.selection = false;
          canvas.skipTargetFind = true;
          canvas.selectable = false;
          break
        case 'text':
          break
        case 'image':
          break
      }
    },
    drawing (end) {
      let { canvas, mouseFrom, mouseTo, drawingObject } = this
      let { graphType, graphColor, graphWidth } = this.data
      if (drawingObject) {
        canvas.remove(drawingObject);
      }
      var canvasObject = null;
      switch (graphType) {
        case "line": //直线
          canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
            stroke: graphColor,
            strokeWidth: graphWidth
          });
          break;
        case "arc": //椭圆
          var left = mouseFrom.x,
            top = mouseFrom.y;
          var radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
          canvasObject = new fabric.Ellipse({
            left: left,
            top: top,
            stroke: graphColor,
            fill: "rgba(255, 255, 255, 0)",
            originX: "center",
            originY: "center",
            rx: Math.abs(left - mouseTo.x),
            ry: Math.abs(top - mouseTo.y),
            strokeWidth: graphWidth
          });
          break;
        case "rect": //长方形
          var path =
            "M " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseTo.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseTo.x +
            " " +
            mouseTo.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseTo.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " z";
          canvasObject = new fabric.Path(path, {
            left: mouseFrom.x,
            top: mouseFrom.y,
            stroke: graphColor,
            strokeWidth: graphWidth,
            fill: "rgba(255, 255, 255, 0)"
          });
          //也可以使用fabric.Rect
          break;
      }
      if (canvasObject) {
        // canvasObject.index = getCanvasObjectIndex();
        if (end) {
          this.add(canvasObject);
        } else {
          canvas.add(canvasObject);
        }
        //.setActiveObject(canvasObject)
        this.drawingObject = canvasObject;
      }
    },
    freeDrawConfig (isDrawingMode) {
      let { drawColor, drawWidth } = this.data
      this.canvas.freeDrawConfig({
        isDrawingMode,
        color: drawColor,
        drawWidth
      })
    },
    setTeacherBackgroud () {
      let { width } = this
      let img = fabric.Image.fromURL(this.image, (img) => {
        this.canvas.setBackgroundColor('#fff')
        this.canvas.setBackgroundImage(img, width / img.width, 783 / img.height)
      }, { crossOrigin: 'anonymous' })
    },
    setBackgroud () {
      let { width, mode } = this
      let imgUrl = mode == 1 ? titleImg : titleSbImg
      let img = fabric.Image.fromURL(imgUrl, (img) => {
        this.canvas.setBackgroundColor('#fff')
        this.canvas.setBackgroundImage(img, width / img.width, 120 / img.height)
      }, { crossOrigin: 'anonymous' })
      // img.onload = () => {
      //   this.canvas.setBackgroundImage(img)
      // }
      // img.src = titleImg

    },
    setText () {
      let { mode } = this
      let imgUrl = mode == 1 ? pzImg : pzSbImg
      let width = mode == 1 ? 460 : 700
      let height = mode == 1 ? 580 : 220
      let left = (mode == 1 ? 585 : 32) + width / 2
      let top = (mode == 1 ? 153 : 528) + height / 2
      let textLeft = mode == 1 ? 626 : 122
      let textTop = mode == 1 ? 255 : 552


      this.canvas.createImage(imgUrl, {
        width,
        height,
        left,
        top,
        id: 'remarkBg'
      }, (img) => {
        img.hasControls = false;
        img.hoverCursor = 'text'
        img.zIndex = 1
        this.pzImg = img
        setTimeout(() => {
          this.canvas.createTextbox('请输入评语，总字数请控制在200左右...', {
            width: 350,
            fontSize: 18,
            fillColor: '#FF0000',
            left: textLeft,
            top: textTop,
            id: 'remarkBg',
            zIndex: 2
          }, (text) => {
            this.pzText = text
          })
        }, 500);
      })

    },
    addTextToCanvas () {
      let canvasObj = this.mode == 1 ? this.$refs.canvas : this.$refs.canvasSb
      let { canvas } = canvasObj
      let { inputValue, fontColor, fontSize } = this.data
      console.log(canvas)
      this.canvas.createTextbox(inputValue, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fillColor: fontColor,
        fontSize: fontSize
      }, (target) => {
        this.history.push({
          type: 'add',
          target
        })
      })

    },
    createImage () {
      let { mode } = this
      let width = mode == 1 ? 460 : 700
      let height = mode == 1 ? 580 : 350
      let left = (mode == 1 ? 55 : 32) + width / 2


      this.canvas.createImage(this.image, {
        width,
        height,
        left,
        top: 153 + height / 2,
        id: 'homeWorkImg'
      })
    },
    addBadge (url) {
      this.canvas.createImage(url, {
        left: 200,
        top: 200
      })
    },
    getActiveObjects () {
      return this.canvas.canvas.getActiveObjects()
    },
  },
  components: {
    Fabric
  }
}
</script>

<style>
</style>
