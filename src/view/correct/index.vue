<template>
  <div class="correct" v-if="workData.workId">
    <div class="nav-left" :class="{ show: showLeftNav }">
      <div class="nav-header">编辑工具</div>
      <div class="nav-content">
        <List
          ref="list"
          @clickItem="clickItem"
          @changeMode="changeMode"
          @input="clickInput"
          @clickAdd="clickAddBtn"
        ></List>
      </div>
      <div class="nav-left-icon" @click="showLeftNav = !showLeftNav">
        <Icon color="#C2C9D7" size="24" type="md-arrow-dropright" />
      </div>
    </div>
    <div class="content">
      <div class="content-body">
        <p></p>
        <div class="fabric">
          <Transverse
            ref="canvas"
            v-if="workData.imgArr[imgActive]"
            :image="workData.imgArr[imgActive].url"
            :type="workData.imgArr[imgActive].type"
            :data="canvasObj"
            @mousedown="mouseDown"
            :mode="mode"
          ></Transverse>
        </div>
      </div>
      <div class="content-footer">
        <div class="content-footer-left">
          <div class="content-footer-btn" @click="handleSaveCanvasImage(0)">
            保存图片
          </div>
          <div class="content-footer-btn" @click="handleClickResetCanvas">
            放弃本次编辑
          </div>
        </div>
        <div class="content-footer-center">
          <div class="content-footer-center-btn" @click="handleClickBack">
            <i class="content-footer-center-icon ch"></i>
            撤离
          </div>
          <div class="content-footer-center-btn" @click="handleClickForward">
            <i class="content-footer-center-icon cz"></i>
            重做
          </div>
        </div>
        <div class="content-footer-right">
          <div class="content-footer-btn" @click="handleBrowseImage">
            预览图片
          </div>
        </div>
      </div>
    </div>
    <div class="nav-right" :class="{ show: showRightNav }">
      <div class="nav-header">图片选择</div>
      <div class="nav-img-list" v-if="workData.imgArr">
        <div
          class="nav-img-item"
          v-for="(img, i) in workData.imgArr"
          :key="i"
          @click="handleClickWorkImg(img, i)"
        >
          <div class="nav-img-wrap">
            <img class="nav-img" :src="img.url" />
            <div class="nav-img-mask" v-show="imgActive == i">
              <Icon size="40" color="#fff" type="md-checkmark-circle" />
            </div>
          </div>
          <p class="nav-img-text">
            {{
              `${
                img.type == 1
                  ? "学生作业" + (i + 1)
                  : "老师批改" + (img.index + 1)
              }`
            }}
          </p>
        </div>
      </div>
      <div class="nav-right-icon" @click="showRightNav = !showRightNav">
        <Icon color="#C2C9D7" size="24" type="md-arrow-dropleft" />
      </div>
    </div>
    <div
      class="-poptip"
      :class="{ show: showTip }"
      :style="{ left: left, top: top }"
    >
      <a
        href="javascript:"
        class="-poptip-item"
        @click="clickPoptipItem('remove')"
      >
        删除
      </a>
      <a
        href="javascript:"
        class="-poptip-item"
        v-if="canvasTarget && canvasTarget.type == 'image'"
        @click="clickPoptipItem('cropper')"
      >
        裁剪
      </a>
    </div>
    <Modal v-model="popupShow" fullscreen>
      <div class="-popup-img-wrap">
        <img class="-popup-img" :src="canvasImg" />
      </div>
    </Modal>
    <Modal
      v-model="badgeShow"
      title="选择勋章"
      width="800"
      @on-ok="SelectImgOk('badge')"
    >
      <div class="xz-wrap">
        <div class="xz-list">
          <div
            class="xz-item "
            :class="{ active: xzActive == i }"
            v-for="(img, i) in xzArr"
            :key="i"
            @click="xzActive = i"
          >
            <img class="xz-img" :src="img" />
            <div class="xz-mask">
              <Icon size="40" color="#fff" type="md-checkmark-circle" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="workShow"
      title="选择学生作业"
      width="800"
      @on-ok="SelectImgOk('work')"
    >
      <div class="xz-wrap work">
        <div class="xz-list">
          <div
            class="xz-item "
            :class="{ active: workActive == i }"
            v-for="(img, i) in workData.imgArr"
            :key="i"
            v-if="img.type == 1"
            @click="workActive = i"
          >
            <img class="xz-img" :src="img.url" />
            <div class="xz-mask">
              <Icon size="40" color="#fff" type="md-checkmark-circle" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="pzShow"
      title="选择批注框"
      width="800"
      @on-ok="SelectImgOk('pz')"
    >
      <div class="xz-wrap pz">
        <div class="xz-list">
          <div
            class="xz-item "
            :class="{ active: pzActive == i }"
            v-for="(img, i) in pzImgArr"
            :key="i"
            @click="pzActive = i"
          >
            <img class="xz-img" :class="{ hb: !i, sb: i }" :src="img" />
            <div class="xz-mask sb">
              <Icon size="40" color="#fff" type="md-checkmark-circle" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="showCropper"
      title="图片裁剪"
      width="800"
      :styles="{ top: '30px' }"
      @on-ok="SelectImgOk('cropper')"
    >
      <div class="cropper-wrap">
        <vueCropper
          ref="cropper"
          :img="cropperUrl"
          :autoCrop="true"
          v-if="showCropper"
        ></vueCropper>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import Vertical from "./vertical";
import Transverse from "./transverse";
import List from "./list";
import { getBaseUrl } from "@/libs/index";
import { VueCropper } from "vue-cropper";
import pzImg from "../../assets/images/correct/pz.png";
import pzSbImg from "../../assets/images/correct/pz_sb.png";
import xzImg1 from "../../assets/images/correct/xz/1.png";
import xzImg2 from "../../assets/images/correct/xz/2.png";
import xzImg3 from "../../assets/images/correct/xz/3.png";
import xzImg4 from "../../assets/images/correct/xz/4.png";
import xzImg5 from "../../assets/images/correct/xz/5.png";
import xzImg6 from "../../assets/images/correct/xz/6.png";
import xzImg7 from "../../assets/images/correct/xz/7.png";
import xzImg8 from "../../assets/images/correct/xz/8.png";
import xzImg9 from "../../assets/images/correct/xz/9.png";
import xzImg10 from "../../assets/images/correct/xz/10.png";
import xzImg11 from "../../assets/images/correct/xz/11.png";
import xzImg12 from "../../assets/images/correct/xz/12.png";
import xzImg13 from "../../assets/images/correct/xz/13.png";
import xzImg14 from "../../assets/images/correct/xz/14.png";
import xzImg15 from "../../assets/images/correct/xz/15.png";
import xzImg16 from "../../assets/images/correct/xz/16.png";
import xzImg17 from "../../assets/images/correct/xz/17.png";
import xzImg18 from "../../assets/images/correct/xz/18.png";
import xzImg19 from "../../assets/images/correct/xz/19.png";
import xzImg20 from "../../assets/images/correct/xz/20.png";
import xzImg21 from "../../assets/images/correct/xz/21.png";
import xzImg22 from "../../assets/images/correct/xz/22.png";
import xzImg23 from "../../assets/images/correct/xz/23.png";
import xzImg24 from "../../assets/images/correct/xz/24.png";
import xzImg25 from "../../assets/images/correct/xz/25.jpg";
export default {
  data() {
    return {
      workShow: false,
      pzShow: false,
      badgeShow: false,
      popupShow: false,
      showTip: false,
      showLeftNav: false,
      showRightNav: false,
      showCropper: false,
      left: 0,
      top: 0,
      imgActive: 0,
      imgActiveObj: null,
      mode: 1,
      canvasImg: "",
      canvasTarget: null,
      cropperUrl: "",
      canvasObj: {
        type: "",
        show: false,
        drawWidth: 1,
        inputValue: "",
        drawColor: "#FF0000",
        fontColor: "#FF0000",
        fontSize: 18
      },
      workData: {},
      xzActive: 0,
      workActive: 0,
      pzActive: 0,
      xzArr: [
        xzImg1,
        xzImg2,
        xzImg3,
        xzImg4,
        xzImg5,
        xzImg6,
        xzImg7,
        xzImg8,
        xzImg9,
        xzImg10,
        xzImg11,
        xzImg12,
        xzImg13,
        xzImg14,
        xzImg15,
        xzImg16,
        xzImg17,
        xzImg18,
        xzImg19,
        xzImg20,
        xzImg21,
        xzImg22,
        xzImg23,
        xzImg24,
        xzImg25
      ],
      pzImgArr: [pzImg, pzSbImg]
    };
  },
  created() {
    this.getViewWork();
    document.oncontextmenu = function(e) {
      e.preventDefault();
    };
    // this.fullScreen()
  },
  methods: {
    getViewWork(fn) {
      this.$api.jsdJob
        .viewWork({
          system: this.$route.query.system,
          workId: this.$route.query.workId
        })
        .then(({ data }) => {
          let workData = data.resultData;
          let workImgSrc = workData.workImgSrc
            ? workData.workImgSrc.split(",")
            : [];
          let replyImg = workData.replyImg ? workData.replyImg.split(",") : [];
          workData.workImgSrc = workImgSrc.map((e, i) => {
            return {
              type: 1,
              url: e,
              index: i
            };
          });
          workData.replyImg = replyImg.map((e, i) => {
            return {
              type: 2,
              url: e,
              index: i
            };
          });
          workData.imgArr = [...workData.workImgSrc, ...workData.replyImg];
          this.workData = workData;
          this.imgActiveObj = workData.imgArr[0];
          fn && fn();
        });
    },
    uploadReplyImg(replyImg, fn) {
      let { canvas } = this.$refs;
      this.$api.jsdJob
        .uploadReplyImg({
          courseId: this.$route.query.courseId,
          id: this.$route.query.workId,
          replyImg,
          workImg: this.workData.imgArr[this.imgActiveObj.index].url
        })
        .then(({ data }) => {
          this.$Spin.hide();
          this.$Message.success("图片上传成功");
          if (fn) {
            console.log(fn);
            fn();
          } else {
            this.getViewWork(() => {
              this.imgActive += this.workData.workImgSrc.length;
              this.imgActiveObj = this.workData.imgArr[this.imgActive];
            });
          }
        });
    },
    fullScreen() {
      var el = document.documentElement;
      var rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
      }
      return;
    },
    mouseDown(option) {
      let { canvas } = this.$refs;
      if (option.button == 3 && option.target) {
        this.left = option.e.clientX + "px";
        this.top = option.e.clientY + "px";
        this.canvasTarget = option.target;
        this.showTip = true;
      } else {
        this.showTip = false;
      }
    },
    handleClickWorkImg(img, i) {
      this.$Modal.confirm({
        title: "提示",
        content: "你正在切换作业图片， 是否保存当前修改？",
        okText: "保存",
        cancelText: "不保存",
        onOk: () => {
          this.handleSaveCanvasImage(() => {
            this.imgActive = i;
            this.imgActiveObj = img;
          });
        },
        onCancel: () => {
          this.imgActive = i;
          this.imgActiveObj = img;
        }
      });
    },
    handleSaveCanvasImage(fn) {
      this.$Modal.confirm({
        title: "提示",
        content: `<p>确定要保存图片吗？<br/>保存图片后， 已经编辑的内容将不能再修改</p>`,
        onOk: () => {
          let { canvas } = this.$refs;
          this.canvasImg = canvas.toDataUrl();

          this.uploadImg(fn);
        }
      });
    },
    handleBrowseImage() {
      let { canvas } = this.$refs;
      this.canvasImg = canvas.toDataUrl();
      this.popupShow = true;
    },
    handleClickResetCanvas() {
      let { canvas } = this.$refs;
      this.$Modal.confirm({
        title: "提示",
        content: `<p>确定要重新编辑吗？<br/>重新编辑会初始化图片还原到编辑前的状态</p>`,
        onOk: () => {
          canvas.clear();
        }
      });
    },
    handleClickBack() {
      let { canvas } = this.$refs;
      canvas.back();
    },
    handleClickForward() {
      let { canvas } = this.$refs;
      canvas.forward();
    },
    clickAddBtn(type) {
      console.log(`${type}Show`);
      this[`${type}Show`] = true;
    },
    SelectImgOk(type) {
      let {
        xzActive,
        xzArr,
        workData,
        workActive,
        pzImgArr,
        pzActive,
        canvasTarget
      } = this;
      let { canvas, cropper } = this.$refs;
      switch (type) {
        case "badge":
          canvas.addImg(xzArr[xzActive]);
          break;
        case "work":
          canvas.addImg(workData.imgArr[workActive].url);
          break;
        case "pz":
          canvas.addImg(pzImgArr[pzActive]);
          break;
        case "cropper":
          cropper.getCropData(data => {
            // do something
            let left = canvasTarget.left
            let top = canvasTarget.top
            canvas.remove(canvasTarget)
            canvas.addImg(data, {
              left,
              top
            });
          });
      }
      this[`${type}Show`] = false;
    },
    changeMode(mode) {
      this.mode = mode;
    },
    clickPoptipItem(type) {
      let { canvas } = this.$refs;
      let { canvasTarget } = this;
      switch (type) {
        case "remove":
          let activeObjects = canvasTarget._objects;
          if (activeObjects) {
            //多选删除
            let etCount = activeObjects.length;
            for (let etindex = 0; etindex < etCount; etindex++) {
              console.log(activeObjects[etindex]);
              // canvas.remove(e.target._objects[etindex]);
            }
          } else {
            //单选删除
            let id = canvasTarget.id;
            console.log(id);
            if (id == "homeWorkImg" || id == "remarkBg") {
              this.$Modal.confirm({
                title: "提示",
                content: `<p>是否要删除${
                  id == "homeWorkImg" ? "作业图片" : "批注背景图"
                }</p>`,
                onOk: () => {
                  if (id == "remarkBg") {
                    canvas.removePz();
                  } else {
                    canvas.remove(canvasTarget);
                  }

                  this.showTip = false;
                },
                onCancel: () => {
                  this.showTip = false;
                }
              });
              return;
            }
            canvas.remove(canvasTarget);
          }
          break;
        case "cropper":
          this.cropperUrl = canvasTarget._element.src;
          this.showCropper = true;
      }
      this.showTip = false;
    },
    clickItem(item) {
      this.canvasObj = item;
    },
    clickInput() {
      let canvas = this.$refs.canvas;
      let list = this.$refs.list;
      canvas.addTextToCanvas();
      list.clearInput();
    },
    clickClose() {
      let canvas = this.$refs.canvas;
      canvas.getActiveObject();
    },
    uploadImg(fn) {
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18
              }
            }),
            h("div", "Loading")
          ]);
        }
      });
      let formData = new FormData();
      let time = new Date().getTime();
      formData.append("file", this.base64ToBlob(), `${time}.jpg`);
      var instance = axios.create({
        baseURL: getBaseUrl(),
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000
      });
      instance
        .post("/sch/common/uploadPublicFile", formData)
        .then(({ data }) => {
          this.uploadReplyImg(data.resultData.url, fn);
        });
    },
    base64ToBlob() {
      let code = this.canvasImg;
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;

      let uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    }
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
  components: {
    List,
    Vertical,
    Transverse,
    VueCropper
  }
};
</script>

<style lang="less" scoped>
.-popup-img {
  &-wrap {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    width: 100%;
  }
}
.cropper-wrap {
  width: 100%;
  height: 700px;
}
.xz {
  &-list {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
  }
  &-mask {
    visibility: hidden;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  &-img {
    width: 100%;
  }
  &-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
    margin-top: 20px;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 10px;
    cursor: pointer;
    &.active {
      .xz-mask {
        visibility: visible;
      }
    }
  }
  &-wrap.work {
    .xz-item {
      width: 180px;
      height: 130px;
    }
  }
  &-wrap.pz {
    .xz-item {
      width: auto;
      height: auto;
    }
    .xz-img.hb {
      width: 260px;
    }
    .xz-img.sb {
      width: 360px;
    }
  }
}
.correct {
  display: flex;

  .-poptip {
    position: fixed;
    width: 150px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    visibility: hidden;
    &.show {
      visibility: visible;
    }
    &-item {
      display: block;
      padding: 8px 16px;
      color: #17233d;
      font-size: 14px;
      border-bottom: 1px #e8eaec solid;
      &:last-child {
        border: none;
      }
      &:hover {
        background: #f8f8f9;
      }
    }
  }
  .nav {
    &-left,
    &-right {
      position: absolute;
      width: 260px;
      height: 100vh;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(146, 146, 181, 0.3);
      z-index: 1000;
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
    &-img {
      width: 100%;
      &-list {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        overflow-y: auto;
      }
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 56px;
        cursor: pointer;
      }
      &-wrap {
        position: relative;
        margin-bottom: 16px;
        width: 180px;
        height: 130px;
        border-radius: 20px;
        overflow: hidden;
      }
      &-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
      }
      &-text {
        font-size: 20px;
        color: #333;
      }
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
    @media screen and (max-width: 1560px) {
      &-left,
      &-right {
        width: 0;
        &-icon {
          visibility: visible;
        }
      }
    }
  }
  .content {
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 1100px;
    background: #f7f9fd;
    &-body {
      display: flex;
      flex-direction: column;
      justify-content: cneter;
      align-items: center;
      margin-bottom: 30px;
      width: 100%;
      height: 783px;
      .fabric {
        box-shadow: 0px 0px 20px 0px rgba(146, 146, 181, 0.3);
      }
    }
    &-footer {
      width: 1100px;
      height: 70px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &-center {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        &-close {
          cursor: pointer;
          position: absolute;
          right: 53px;
          top: 50%;
          width: 22px;
          height: 22px;
          background: url("../../assets/images/correct/close.png") no-repeat;
          background-size: 100%;
          transform: translateY(-50%);
        }
        &-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 25px;
          font-size: 18px;
          color: #828fae;
          cursor: pointer;
        }
        &-icon {
          display: block;
          margin-right: 16px;
          width: 28px;
          height: 16px;
          background-size: 100%;
          background-repeat: no-repeat;
          &.ch {
            background-image: url("../../assets/images/correct/cx.png");
          }
          &.cz {
            background-image: url("../../assets/images/correct/ht.png");
          }
        }
      }
      &-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 170px;
        height: 45px;
        font-size: 18px;
        color: #fff;
        background: rgba(107, 133, 230, 1);
        border-radius: 10px;
        &:last-child {
          margin-left: 36px;
        }
        &.disabled {
          background: #b9c1d3;
        }
        &.success {
          background: linear-gradient(
            -37deg,
            rgba(15, 218, 130, 1),
            rgba(0, 209, 118, 1)
          );
        }
      }
    }
  }
}
</style>
