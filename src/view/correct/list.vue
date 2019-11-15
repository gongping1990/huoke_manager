<template>
  <div class="-list">
    <Item
      icon="hx"
      type="draw"
      class="item"
      text="画笔工具"
      v-model="active"
      @click="clickItem"
    >
      <div class="item-content hx">
        <div class="common-item">
          <p class="common-title">
            画笔大小 <span>{{ canvasObj.drawWidth }}</span>
          </p>
          <div class="common-content">
            <Slider v-model="canvasObj.drawWidth" :min="2"></Slider>
          </div>
        </div>
        <div class="common-item">
          <p class="common-title">画笔颜色</p>
          <div class="common-content color">
            <div
              class="color-selected"
              :style="{ background: canvasObj.drawColor }"
            ></div>
            <div class="color-list">
              <ColorPicker v-model="canvasObj.drawColor" />
            </div>
          </div>
        </div>
      </div>
    </Item>
    <Item
      icon="tx"
      type="graph"
      class="item"
      text="图形工具"
      v-model="active"
      @click="clickItem"
    >
      <div class="item-content">
        <div class="common-item">
          <p class="common-title">图形样式</p>
          <div class="common-content graph">
            <div
              class="graph-wrap"
              title="直线"
              @click="canvasObj.graphType = 'line'"
            >
              <a
                class="graph-line"
                :class="{ active: canvasObj.graphType == 'line' }"
                href="javascript:"
              ></a>
            </div>
            <div
              class="graph-wrap"
              title="矩形"
              @click="canvasObj.graphType = 'rect'"
            >
              <a
                class="graph-rect"
                :class="{ active: canvasObj.graphType == 'rect' }"
                href="javascript:"
              ></a>
            </div>
            <div
              class="graph-wrap"
              title="圆形"
              @click="canvasObj.graphType = 'arc'"
            >
              <a
                class="graph-arc"
                :class="{ active: canvasObj.graphType == 'arc' }"
                href="javascript:"
              ></a>
            </div>
          </div>
        </div>
        <div class="common-item">
          <p class="common-title">
            画笔大小 <span>{{ canvasObj.graphWidth }}</span>
          </p>
          <div class="common-content">
            <Slider v-model="canvasObj.graphWidth" :min="1"></Slider>
          </div>
        </div>
        <div class="common-item">
          <p class="common-title">画笔颜色</p>
          <div class="common-content color">
            <div
              class="color-selected"
              :style="{ background: canvasObj.graphColor }"
            ></div>
            <div class="color-list">
              <ColorPicker v-model="canvasObj.graphColor" />
            </div>
          </div>
        </div>
      </div>
    </Item>
    <Item
      icon="text"
      class="item"
      type="text"
      text="插入文字"
      v-model="active"
      @click="clickItem"
    >
      <div class="item-content text">
        <div class="common-item">
          <textarea
            class="text-input"
            v-model="canvasObj.inputValue"
            placeholder="请输入文字"
          ></textarea>
          <Button type="primary" class="text-btn" @click="clickInput"
            >输入文字</Button
          >
        </div>
        <div class="common-item">
          <div class="common-title">
            字体大小
            <Select v-model="canvasObj.fontSize" style="width:65px">
              <Option v-for="size in fontSizeList" :value="size" :key="size">{{
                size
              }}</Option>
            </Select>
          </div>
        </div>
        <div class="common-item">
          <p class="common-title">字体颜色</p>
          <div class="common-content color">
            <div
              class="color-selected"
              :style="{ background: canvasObj.fontColor }"
            ></div>
            <div class="color-list">
              <ColorPicker v-model="canvasObj.fontColor" />
            </div>
          </div>
        </div>
      </div>
    </Item>
    <Item
      icon="tp"
      class="item"
      type="image"
      text="插入图片"
      v-model="active"
      @click="clickItem"
    >
      <div class="item-content">
        <div class="common-item">
          <Button type="primary" class="text-btn" @click="clickAddBtn('badge')"
            >选择插入的勋章</Button
          >
          <Button type="primary" class="text-btn" @click="clickAddBtn('work')"
            >选择插入的学生作业</Button
          >
          <Button type="primary" class="text-btn" @click="clickAddBtn('pz')"
            >选择插入的批注框</Button
          >
        </div>
      </div>
    </Item>
  </div>
</template>

<script>
import Item from "./item";
export default {
  data() {
    return {
      mode: 1,
      active: "",
      canvasObj: {
        type: "",
        show: false,
        drawWidth: 2,
        inputValue: "",
        drawColor: "#FF0000",
        fontColor: "#FF0000",
        fontSize: 26,
        graphColor: "#FF0000",
        graphWidth: 2,
        graphType: "line"
      },

      fontSizeList: [
        26,
        28,
        30,
        32,
        34,
        36,
        38,
        40,
        42,
        44,
        46,
        48,
        50,
        52,
        54,
        56,
        58,
        60,
        62,
        64,
        66,
        68,
        70,
        72,
        74,
        76,
        78,
        80,
        82,
        84,
        86,
        88,
        90,
        92,
        94,
        96,
        98,
        100
      ]
    };
  },
  watch: {
    canvasObj: {
      handler: function(val) {
        this.$emit("clickItem", val);
      },
      deep: true
    },
    mode(val) {
      this.$emit("changeMode", val);
    }
  },
  methods: {
    clickItem(type, show) {
      if (show) {
        this.canvasObj.show = show;
        this.canvasObj.type = type;
      }
    },
    clickInput() {
      if (!this.canvasObj.inputValue) {
        this.$Message.error("请填写要插入的文字！");
        return;
      }
      this.$emit("input");
    },
    clickAddBtn(type) {
      this.$emit("clickAdd", type);
    },
    clearInput() {
      this.canvasObj.inputValue = "";
    }
  },
  components: {
    Item
  }
};
</script>

<style lang="less" scoped>
.-list {
  width: 260px;
  .graph {
    display: flex;
    align-items: center;
    justify-content: space-around;
    &-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    &-line {
      display: block;
      width: 20px;
      height: 4px;
      background: rgba(154, 165, 192, 1);
      border-radius: 2px;
      &.active {
        background: #6a84e5;
      }
    }
    &-rect {
      display: block;
      width: 18px;
      height: 18px;
      border: 4px solid rgba(154, 165, 192, 1);
      border-radius: 4px;
      &.active {
        border-color: #6a84e5;
      }
    }
    &-arc {
      display: block;
      width: 20px;
      height: 20px;
      border: 4px solid rgba(154, 165, 192, 1);
      border-radius: 10px;
      &.active {
        border-color: #6a84e5;
      }
    }
  }
  .canvas-mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    &-icon {
      margin-right: 27px;
      width: 26px;
      height: 26px;
      background-size: 100%;
      background-repeat: no-repeat;
      &.sb {
        background-image: url("../../assets/images/correct/sb.png");
      }
      &.hb {
        background-image: url("../../assets/images/correct/hb.png");
      }
    }
  }
  .item-content {
    padding: 1px 20px;
    padding-bottom: 24px;
  }
  .common {
    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 19px;
      font-size: 18px;
      color: #333;
      font-weight: 500;
    }
    &-item {
      margin-top: 24px;
    }
    &-content {
      padding: 8px 20px;
      background: rgba(241, 243, 247, 1);
      border-radius: 5px;
    }
  }
  .text {
    &-input {
      box-sizing: border-box;
      padding: 13px 15px;
      margin-bottom: 15px;
      width: 220px;
      height: 100px;
      background: rgba(241, 243, 247, 1);
      border-radius: 5px;
      border: none;
    }
    &-btn {
      margin-bottom: 20px;
      width: 220px;
      height: 45px;
      font-size: 18px;
      color: #fff;
      background: #6b85e6;
      border-color: #6b85e6;
      border-radius: 10px;
    }
  }
  .color {
    display: flex;
    align-items: center;
    &-selected {
      margin-right: 22px;
      width: 37px;
      height: 37px;
      border-radius: 5px;
    }
  }
  .tp {
    &-list {
      display: flex;
      flex-wrap: wrap;
    }
    &-item {
      position: relative;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      margin-bottom: 17px;
      border-radius: 10px;
      overflow: hidden;
      background: #333;
      &.active {
        border: 2px solid #6b85e6;
      }
      &:nth-child(2n) {
        margin-left: 18px;
      }
    }
    &-mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
