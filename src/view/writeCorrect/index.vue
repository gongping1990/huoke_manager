<template>
  <div class="_write" @mouseup="onMouseup($event, 1)">
    <div class="nav-left">
      <div class="nav-header">勾画工具</div>
      <div class="nav-content">
        <div class="nav-chart">
          <div class="nav-chart-left">
            <div
              v-for="i in 40"
              :key="i"
              v-if="!(i % 2) && i > 6"
              :draggable="activeIndex != -1"
              :style="{ width: i + 'px', height: i + 'px' }"
              @dragstart="ondragstart($event, '#FF5959')"
            ></div>
          </div>
          <div class="nav-chart-right">
            <div
              v-for="i in 40"
              :key="i"
              v-if="!(i % 2) && i > 6"
              :draggable="activeIndex != -1"
              :style="{
                width: i + 'px',
                height: i + 'px',
                'border-color': '#44DDB0'
              }"
              @dragstart="ondragstart($event, '#44DDB0')"
            ></div>
          </div>
        </div>
      </div>
      <div class="nav-left-icon">
        <Icon color="#C2C9D7" size="24" type="md-arrow-dropright" />
      </div>
    </div>
    <div class="content">
      <div
        ref="template"
        class="template"
        :style="{ 'background-image': `url(${workData.workImgSrc})` }"
        @drop="ondrop"
        @dragover="allowDrop"
      >
        <div
          class="template-chart"
          :class="{ show: !isWatch || item.time <= currentTime }"
          v-for="(item, i) in chartList"
          :key="i"
          :style="{
            width: item.w + 'px',
            height: item.w + 'px',
            left: item.x + 'px',
            top: item.y + 'px',
            'border-color': item.color
          }"
          @click="clickChart(i)"
        ></div>
      </div>
      <div class="content-nav-btn fixed" @click="showMsg2 = true">切换模板</div>
      <div class="content-nav" v-if="activeIndex > -1">
        <div class="content-nav-btn" @click="showMsg2 = true">切换模板</div>
        <div class="content-control">
          <div class="content-control-progress">
            <span>{{ currentTime | formateTime }}</span>
            <div
              ref="progress"
              class="content-progress"
              @mousedown="onMousedown"
              @mousemove="onMousemove"
              @mouseup="onMouseup"
            >
              <div
                class="content-progress-bar"
                :style="{ width: progress + '%' }"
              ></div>
              <div
                class="content-progress-point"
                v-for="(item, i) in templateData.tags"
                v-if="duration"
                :key="i + 'point'"
                :style="{ left: (item.time / duration) * 100 + '%' }"
              >
                <Poptip trigger="hover" content="content">
                  <span @click.stop="setTime(item.time)"></span>
                  <div slot="content">
                    <p class="content-progress-time">
                      {{ item.name }}
                    </p>
                  </div>
                </Poptip>
              </div>
              <div
                class="content-progress-bj"
                v-for="(item, i) in chartList"
                :key="i + 'bj'"
                :style="{ left: item.progress + '%' }"
              >
                <Poptip trigger="hover" content="content">
                  <span></span>
                  <div slot="content">
                    <p class="content-progress-time">
                      {{ item.time | formateTime }}
                    </p>
                  </div>
                </Poptip>
              </div>
            </div>
            <span>{{ duration | formateTime }}</span>
          </div>
          <div class="content-control-btn">
            <div class="content-control-l-arrow"></div>
            <div
              class="content-control-play"
              :class="{ paused: isPaused }"
              @click="onPlay"
            ></div>
            <div class="content-control-r-arrow"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-header">勾画记录</div>
      <div class="nav-list">
        <div class="nav-item" :class="{active: chartIndex == i}" v-for="(item, i) in chartList" :key="i">
          <span
            >({{ item.time | formateTime }}) ({{ item.x }},{{ item.y }})
          </span>
          <div class="chart-icon" :style="{ background: item.color }">
            {{ i + 1 }}
          </div>
          <i class="nav-edit-icon" @click="onClickEdit(item, i)"></i>
          <Icon
            type="ios-close-circle-outline"
            size="22"
            @click="bindClose(i)"
          />
        </div>
      </div>
      <div class="nav-footer">
        <div class="nav-btn" @click="onClickWatch">预览</div>
        <div class="nav-btn suc" @click="onChangeSavePop">保存</div>
      </div>
      <div class="nav-right-icon" @click="showRightNav = !showRightNav">
        <Icon color="#C2C9D7" size="24" type="md-arrow-dropleft" />
      </div>
      <audio class="audio" ref="audio" :src="templateData.audioUrl"></audio>
    </div>
    <Modal
      v-model="showEdit"
      @on-ok="onEditcomfirm"
      @on-cancel="onEditCancel"
      title="修改时间"
    >
      <div class="_edit-wrap" v-if="showEdit">
        <Input class="_edit-input" v-model="editTime.min" />分
        <Input class="_edit-input" v-model="editTime.sec" />秒
        <Input class="_edit-input" v-model="editTime.mil" />毫秒
      </div>
    </Modal>
    <div class="_modal" v-show="showMsg">
      <div class="_modal-content">
        <div class="_modal-header">
          <p>提示</p>
          <i @click="closePopup"></i>
        </div>
        <div class="_modal-body">
          <p class="_modal-text">确认保存</p>
          <div class="_modal-footer">
            <div class="_modal-btn" @click="onSaveCancel">取消</div>
            <div class="_modal-btn suc" @click="onSaveConfirm">确认</div>
          </div>
        </div>
      </div>
    </div>
    <div class="_modal" v-show="showMsg2">
      <div class="_modal-content">
        <div class="_modal-header">
          <p>提示</p>
          <i @click="closePopup"></i>
        </div>
        <div class="_modal-body">
          <div class="_modal-body-content">
            <div class="_modal-select">
              <span><i>*</i>语音模板</span>
              <Select v-model="templateVal" style="width:200px">
                <Option
                  :value="i"
                  v-for="(item, i) in templateList"
                  :key="item.id"
                >
                  {{item.name}}
                </Option>
              </Select>
            </div>
            <div class="_modal-checkbox">
              <Checkbox v-model="isClear">同时清空勾画记录</Checkbox>
            </div>
          </div>
          <div class="_modal-footer">
            <div class="_modal-btn" @click="closePopup">取消</div>
            <div class="_modal-btn suc" @click="onChangeTemplateConfirm">
              确认
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="_modal" v-show="showMsg1">
      <div class="_modal-content">
        <div class="_modal-header err">
          <p>提示</p>
          <i @click="closePopup"></i>
        </div>
        <div class="_modal-body">
          <p class="_modal-text">确认删除</p>
          <div class="_modal-footer">
            <div class="_modal-btn" @click="closePopup">取消</div>
            <div class="_modal-btn suc" @click="onDeleteConfirm">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getBaseUrl } from "@/libs/index";
import audioUrl from "../../assets/images/audio.mp3";
export default {
  data() {
    return {
      showMsg: false,
      showMsg1: false,
      showMsg2: false,
      showEdit: false,
      isWatch: false,
      audioRef: null,
      templateRef: null,
      audioUrl: audioUrl,
      ended: false,
      isPaused: false,
      isClear: false,
      chartIndex: -1,
      currentTime: 0,
      duration: 0,
      editActive: 0,
      templateVal: -1,
      activeIndex: -1,
      elParams: {},
      workData: {},
      chartList: [],
      templateList: [],
      timePoint: [5310, 7320, 8900],
      editTime: {
        min: 0,
        sec: 0,
        mil: 0
      },
      mouseParams: {
        start: false,
        x: 0
      }
    };
  },
  filters: {
    formateTime(v) {
      if (isNaN(v)) {
        console.log("nan");
        return `00:00:00`;
      }
      let min = parseInt(v / 1000 / 60);
      let sec = parseInt((v / 1000) % 60);
      let mil = v % 1000;
      min = min >= 10 ? min : "0" + min;
      sec = sec >= 10 ? sec : "0" + sec;
      mil = mil > 100 ? mil : "0" + mil;
      return `${min}:${sec}:${mil}`;
    }
  },
  computed: {
    progress() {
      let { currentTime, duration } = this;
      if (!duration) return 0;
      return (currentTime / duration) * 100;
    },
    templateData() {
      if (!this.templateList.length || this.activeIndex == -1) return {};
      return this.templateList[this.activeIndex];
    }
  },
  methods: {
    clickChart(i) {
      this.chartIndex = i
    },
    onMousedown(e) {
      this.mouseParams.start = true;
      this.audioRef.pause();
    },
    onMousemove(e) {
      let { mouseParams } = this;
      if (!mouseParams.start) return;
      this.setProgress(e);
      // this.mouseParams.x = e.offsetX;
    },
    onMouseup(e, type) {
      let { mouseParams } = this;
      this.mouseParams.start = false;
      if (!type) this.setProgress(e, 1);
    },
    setProgress(e, type) {
      let { duration } = this;
      let { progress } = this.$refs;
      let { clientX } = e;
      let { offsetWidth } = progress;
      let offsetX = clientX - this.getOffset(progress);
      let _progress = offsetX / offsetWidth;
      let currentTime = parseInt(duration * _progress);
      this.currentTime = currentTime;
      type && this.audioRef.play();
      this.audioRef.currentTime = this.currentTime / 1000;
    },
    setTime(time) {
      this.audioRef.currentTime = time / 1000;
      this.audioRef.pause();
    },
    onClickWatch() {
      this.isWatch = true;
      this.audioRef.load();
      this.audioRef.play();
    },
    onChangeTemplateConfirm() {
      if (this.templateVal == -1) {
        this.$Message.error({
          background: true,
          content: "请选择要切换的模板"
        });
        return;
      }
      if (this.isClear) {
        this.onClear();
      }
      this.activeIndex = this.templateVal;
      this.closePopup();
    },
    onSaveCancel() {
      this.closePopup();
    },
    onChangeSavePop() {
      this.audioRef.pause();
      this.showMsg = true;
    },
    onSaveConfirm() {
      this.addTimeTag();
    },
    onDeleteConfirm() {
      let { editActive } = this;
      this.closePopup();
      this.chartList.splice(editActive, 1);
    },
    closePopup() {
      this.showMsg = false;
      this.showMsg1 = false;
      this.showMsg2 = false;
    },
    onEditcomfirm() {
      let { chartList, editActive, editTime } = this;
      let { min, sec, mil } = editTime;
      let _min = min * 60 * 1000;
      let _sec = sec * 1000;
      this.chartList[editActive].formatTime = {
        min,
        sec,
        mil
      };
      this.chartList[editActive].time = _min + _sec + mil;
      this.chartList[editActive].progress =
        ((_min + _sec + mil) / this.duration) * 100;
    },
    onEditCancel() {
      let { chartList, editActive } = this;
      this.showEdit = false;
    },
    onClickEdit(item, i) {
      console.log(item);
      this.editActive = i;
      let { min, sec, mil } = item.formatTime;
      this.editTime = {
        min,
        sec,
        mil
      };
      this.showEdit = true;
    },
    onPlay() {
      let { audioRef } = this;
      if (audioRef.paused) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    },
    formatTime(v) {
      let min = parseInt(v / 1000 / 60);
      let sec = parseInt((v / 1000) % 60);
      let mil = v % 1000;
      return {
        min,
        sec,
        mil
      };
    },
    bindClose(i) {
      this.editActive = i;
      this.showMsg1 = true;
    },
    ondragstart(ev, color) {
      let { offsetWidth } = ev.target;
      let el_center = offsetWidth / 2;
      let { offsetX, offsetY } = ev;
      let x = offsetX - el_center;
      let y = offsetY - el_center;
      this.audioRef.pause();
      this.elParams = {
        x,
        y,
        w: offsetWidth,
        color,
        time: 0
      };
    },
    ondrop(ev) {
      let clientX = ev.clientX - this.getOffset(this.templateRef);
      let clientY = ev.clientY - this.getOffset(this.templateRef, 1);
      let obj = {
        ...this.elParams,
        x: clientX - this.elParams.x,
        y: clientY - this.elParams.y,
        time: this.currentTime,
        _formatTime: this.formatTime(this.currentTime),
        formatTime: this.formatTime(this.currentTime),
        progress: (this.currentTime / this.duration) * 100
      };

      this.chartList.push(obj);
      this.audioRef.play();
      ev.preventDefault();
      // ev.preventDefault();
      // var data = ev.dataTransfer.getData("Text");
      // ev.target.appendChild(document.getElementById(data));
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    getOffset(node, type) {
      let parent = node.parentNode;
      let offsetLeft = !type ? node.offsetLeft : node.offsetTop;
      if (offsetLeft == undefined) return 0;
      if (parent) {
        offsetLeft += this.getOffset(parent, type);
      }
      return offsetLeft;
    },
    addTimeTag() {
      let tags = this.chartList.map(e => {
        return {
          x: (e.x / 1.2).toFixed(2),
          y: (e.y / 1.2).toFixed(2),
          time: e.time,
          color: e.color,
          width: e.w
        };
      });
      this.$api.tbzwStudy
        .addTimeTag({
          tags: JSON.stringify(tags),
          tmplId: this.templateData.id,
          wid: this.$route.query.workId
        })
        .then(({ data }) => {
          this.$Message.success({
            background: true,
            content: "保存成功！"
          });
          this.closePopup();
        });
    },
    getListAudioTmpl() {
      this.$api.tbzwLesson
        .listAudioTmpl({
          lessonId: this.$route.query.id
        })
        .then(({ data }) => {
          this.templateList = data.resultData;
        });
    },
    getViewWork() {
      this.$api.jsdJob
        .viewWork({
          system: this.$route.query.system,
          workId: this.$route.query.workId
        })
        .then(({ data }) => {
          this.workData = data.resultData;
        });
    },
    onClear() {
      this.chartList = [];
    }
  },
  created() {
    this.getListAudioTmpl();
    this.getViewWork();
  },
  mounted() {
    this.templateRef = this.$refs.template;
    this.audioRef = this.$refs.audio;
    this.audioRef.onplay = () => {
      this.isPaused = true;
    };
    this.audioRef.onpause = () => {
      this.isPaused = false;
    };
    this.audioRef.onended = () => {
      console.log("end");
      this.ended = true;
    };
    this.audioRef.oncanplay = () => {
      let { audioRef } = this;
      console.log("oncanplay", audioRef.duration);
      this.duration = parseInt(audioRef.duration * 1000);
    };
    this.audioRef.ontimeupdate = () => {
      let { audioRef } = this;
      this.currentTime = parseInt(audioRef.currentTime * 1000);
      this.duration = parseInt(audioRef.duration * 1000);
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$Modal.confirm({
      title: "提示",
      content: `<p>确定要离开批改图片页面吗？<br/>离开此页面后你编辑的内容将不会被保存</p>`,
      onOk: () => {
        next();
      },
      onCancel: () => {
        next(false);
      }
    });
  },
  components: {}
};
</script>

<style lang="less" scoped>
._edit {
  &-wrap {
    display: flex;
    align-items: center;
    padding: 10px 30px;
  }
  &-input {
    margin: 0 10px;
    width: 100px;
  }
}

._write {
  position: relative;
  display: flex;
  ._modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
    &-checkbox {
      margin-bottom: 26px;
    }
    &-select {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 72px;
      margin-bottom: 30px;
      span {
        margin-right: 10px;
        font-weight: 500;
        i {
          margin-right: 4px;
          color: #ff4a4a;
        }
      }
    }
    &-content {
      margin-bottom: 200px;
      width: 420px;
      height: 300px;
      background: rgba(255, 255, 255, 1);
      border-radius: 12px;
    }
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 26px;
      width: 420px;
      height: 63px;
      background: rgba(72, 79, 114, 1);
      border-radius: 10px;
      font-size: 18px;
      color: #fff;
      font-weight: 500;
      &.err {
        background: #ff5959;
      }
      i {
        cursor: pointer;
        display: block;
        width: 20px;
        height: 20px;
        background: url("../../assets/images/icon/close.png") no-repeat;
        background-size: 100%;
      }
    }
    &-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      &-content {
        text-align: left;
      }
    }
    &-footer {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-btn {
      cursor: pointer;
      margin: 0 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 30px;
      background: rgba(215, 215, 215, 1);
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      color: #fff;
      &.suc {
        background: #44ddb0;
      }
    }
    &-text {
      margin: 75px 0;
      font-size: 16px;
      color: #000;
      font-weight: 500;
    }
  }
  .audio {
    opacity: 0;
    position: fixed;
    z-index: -100;
    left: -100px;
    top: -100px;
  }
  .nav {
    &-edit-icon {
      display: block;
      margin-right: 4px;
      width: 18px;
      height: 18px;
      background: url("../../assets/images/icon/edit.png") no-repeat;
      background-size: 100%;
    }
    &-item {
      display: flex;
      align-items: center;
      padding-left: 20px;
      margin-bottom: 15px;
      width: 250px;
      height: 29px;
      background: rgba(246, 246, 246, 1);
      border-radius: 10px;
      &.active {
        background: #aabaf7;
        color: #fff;
      }
      span {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
      }
      .chart-icon {
        margin: 0 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background: rgba(255, 89, 89, 1);
        border-radius: 50%;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
      }
    }
    &-list {
      padding-top: 31px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 60px;
      height: 720px;
      overflow-y: auto;
    }
    &-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 26px;
      width: 170px;
      height: 45px;
      background: rgba(255, 169, 67, 1);
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      &.suc {
        background: #44ddb0;
      }
    }
    &-chart {
      display: flex;
      margin: 18px auto;
      padding: 30px 0;
      width: 230px;
      background: rgba(247, 249, 253, 1);
      border-radius: 10px;
      &-left,
      &-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        div {
          box-sizing: border-box;
          margin-bottom: 14px;
          background: transparent;
          border: 2px solid rgba(255, 89, 89, 1);
          border-radius: 50%;
        }
      }
    }
    &-left,
    &-right {
      position: relative;
      width: 260px;
      height: 100vh;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(146, 146, 181, 0.3);
      transition: all 0.3s;
      &.show {
        width: 260px !important;
      }
      &-icon {
        visibility: hidden;
      }
    }
    &-left {
      left: 0;
      top: 0;
    }
    &-right {
      right: 0;
      top: 0;
    }

    &-left-icon {
      position: absolute;
      top: 50%;
      right: -20px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 70px;
      background: rgba(255, 255, 255, 1);
      border-radius: 0px 10px 10px 0px;
      transform: translateY(-50%);
      box-shadow: 7px 0px 15px 0px rgba(146, 146, 181, 0.2);
      z-index: 1000;
    }
    &-right-icon {
      position: absolute;
      top: 50%;
      left: -20px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 70px;
      background: rgba(255, 255, 255, 1);
      border-radius: 10px 0px 0px 10px;
      transform: translateY(-50%);
      box-shadow: -7px 0px 15px 0px rgba(146, 146, 181, 0.2);
      z-index: 1000;
    }
    &-header {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 60px;
      font-size: 20px;
      color: #fff;
      font-weight: 500;
      background: rgba(72, 79, 114, 1);
    }
    &-content {
      position: absolute;
      left: 0;
      top: 60px;
      bottom: 0;
      right: 0;
      overflow-y: auto;
    }
    // @media screen and (max-width: 1560px) {
    //   &-left,
    //   &-right {
    //     width: 0;
    //     &-icon {
    //       visibility: visible;
    //     }
    //   }
    // }
  }
  .content {
    position: relative;
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f7f9fd;
    .template {
      position: relative;
      margin-top: 80px;
      width: 380.4px;
      height: 465.6px;
      background: url("../../assets/images/zuoye.jpeg") no-repeat;
      background-size: 100%;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: -1px 1px 35px 0px rgba(210, 210, 210, 0.65);
      overflow: hidden;
      img {
        width: 100%;
      }
      &-chart {
        opacity: 0;
        position: absolute;
        box-sizing: border-box;
        border: 2px solid rgba(255, 89, 89, 1);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.4s;
        &.show {
          opacity: 1;
        }
      }
    }
    &-nav {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 20px;
      padding-top: 40px;
      width: 94%;
      height: 148px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(146, 146, 181, 0.3);
      border-radius: 20px;
      &-btn {
        cursor: pointer;
        position: absolute;
        left: 67px;
        top: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 170px;
        height: 45px;
        background: rgba(107, 133, 230, 1);
        border-radius: 10px;
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        &.fixed {
          top: auto;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    &-control {
      position: relative;
      &-progress {
        position: relative;
        display: flex;
        align-items: center;
        & > span {
          font-size: 18px;
          color: #333333;
        }
      }
      &-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 16px;
      }
      &-play {
        cursor: pointer;
        margin: 0 65px;
        width: 28px;
        height: 38px;
        background: url("../../assets/images/icon/play.png") no-repeat center;
        background-size: 100%;
        &.paused {
          background-image: url("../../assets/images/icon/pasue.png");
        }
      }
      &-l-arrow,
      &-r-arrow {
        cursor: pointer;
        background: url("../../assets/images/icon/l-arrow.png") no-repeat;
        background-size: 100%;
        width: 20px;
        height: 37px;
      }
      &-r-arrow {
        background-image: url("../../assets/images/icon/r-arrow.png");
      }
    }
    &-progress {
      position: relative;
      margin: 0 19px;
      width: 500px;
      height: 14px;
      background: rgba(215, 215, 215, 1);
      border-radius: 7px;
      &-time {
        font-size: 18px;
        color: #000000;
      }
      &-bar {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: #44ddb0;
        border-radius: 7px;
      }
      &-bj,
      &-point {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 8px;
        z-index: 10;
        span {
          cursor: pointer;
          display: block;
          width: 8px;
          height: 14px;
          background: rgba(107, 133, 230, 1);
          transform: translateX(-50%);
          &:hover {
            transform: translateX(-50%) scale(1.3);
          }
        }
      }
      &-point {
        z-index: 9;
        span {
          background: #ff4a4a;
        }
      }
    }
  }
}
</style>
