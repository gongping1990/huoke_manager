<template>
  <Modal
    class="p-correctTemplate"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="语音批改模板"
  >
    <div class="p-correctTemplate-content" v-if="isLoad">
      <div class="p-correctTemplate-header">
        <div v-for="(item, i) in list" :key="item.id">
          <Button
            v-if="i == activeIndex"
            type="info"
            class="p-correctTemplate-header-btn"
            @click="changeTemplate(item, i)"
          >
            {{ item.name }}
          </Button>
          <Button
            v-else
            class="p-correctTemplate-header-btn"
            @click="changeTemplate(item, i)"
          >
            {{ item.name }}
          </Button>
        </div>

        <Button ghost type="primary" style="width: 100px;" @click="addTemplate">
          +添加模板
        </Button>
      </div>
      <Form
        :model="templateData"
        ref="templateData"
        :label-width="80"
        v-for="(item, i) in list"
        :key="item.id"
        v-if="i == activeIndex"
      >
        <FormItem label="模版名称" prop="name">
          <div class="p-correctTemplate-formDataItem">
            <div class="item-wrap">
              <Input
                class="-item-input"
                :maxlength="30"
                type="text"
                v-model="item.name"
                placeholder="请输入模板名称(最多三十字)"
              />
            </div>
            <div
              @click="removeAudioTmpl(item, i)"
              class="item-del g-error g-cursor"
            >
              删除模版
            </div>
            <div class="item-del -c-tips g-cursor" @click="addTimepoint">
              添加时间点
            </div>
          </div>
        </FormItem>
        <FormItem label="模版音频" prop="audioUrl">
          <div class="p-correctTemplate-formDataItem">
            <upload-audio
              ref="childAudio"
              v-model="item.audioUrl"
              :option="uploadAudioOption"
            ></upload-audio>
          </div>
        </FormItem>
        <div v-for="(_item, index) in item.tags" :key="index">
          <FormItem label="时间点名称">
            <div class="p-correctTemplate-formDataItem">
              <div class="item-wrap">
                <Input
                  class="-item-input"
                  :maxlength="30"
                  type="text"
                  v-model="_item.name"
                  placeholder="请输入时间点名称"
                />
              </div>
              <div
                @click="removeTimePoint(index, i)"
                class="item-del g-error g-cursor"
              >
                删除时间点
              </div>
            </div>
          </FormItem>
          <FormItem label="时间">
            <div class="p-correctTemplate-formDataItem">
              <div class="_time-point">
                <InputNumber
                  class="-item-input"
                  :max="60"
                  :min="0"
                  v-model="_item.min"
                ></InputNumber>
                <span>分</span>
                <InputNumber
                  class="-item-input"
                  :max="60"
                  :min="0"
                  v-model="_item.sec"
                ></InputNumber>
                <span>秒</span>
              </div>
            </div>
          </FormItem>
        </div>
        <FormItem label="笔画特写">
          <div class="p-correctTemplate-formDataItem">
            <div class="_time-point">
              <InputNumber
                class="-item-input"
                :max="60"
                :min="0"
                v-model="item.startTime.min"
              ></InputNumber>
              <span>分</span>
              <InputNumber
                class="-item-input"
                :max="60"
                :min="0"
                v-model="item.startTime.sec"
              ></InputNumber>

              <span>秒，开始</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="笔画特写">
          <div class="p-correctTemplate-formDataItem">
            <div class="_time-point">
              <InputNumber
                class="-item-input"
                :max="60"
                :min="0"
                v-model="item.endTime.min"
              ></InputNumber>
              <span>分</span>
              <InputNumber
                class="-item-input"
                :max="60"
                :min="0"
                v-model="item.endTime.sec"
              ></InputNumber>
              <span>秒，结束</span>
            </div>
          </div>
        </FormItem>
      </Form>
    </div>

    <div slot="footer" class="g-flex-j-sa">
      <Button
        @click="closeModal('addInfoAdd')"
        ghost
        type="primary"
        style="width: 100px;"
        >取消</Button
      >
      <div @click="submitAdd" class="g-primary-btn ">确认</div>
    </div>
  </Modal>
</template>

<script>
import dayjs from "dayjs";
import UploadImgMultiple from "../../../../components/uploadImgMultiple";
import UploadAudio from "../../../../components/uploadAudio";

export default {
  name: "audioContentTemplate",
  components: { UploadAudio, UploadImgMultiple },
  props: ["value", "dataInfo"],
  data() {
    return {
      activeIndex: 0,
      templateData: {},
      list: [],
      addInfo: {
        correctTemplate: []
      },
      uploadAudioOption: {
        // tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
        size: 153600,
        format: ["mp3", "wma", "arm"]
      },
      isOpenDetail: false,
      isLoad: false
    };
  },
  watch: {
    value(_n) {
      this.isOpenDetail = _n;
      if (_n) {
        this.getListAudioTmpl();
      } else {
        this.list = [];
        this.activeIndex = 0;
        this.isLoad = false;
      }
    }
  },
  methods: {
    initTemplate(fn) {
      let templateData = {
        name: "模板" + (this.list.length + 1),
        audioUrl: "",
        tags: [
          {
            name: "",
            min: 0,
            sec: 0
          }
        ],
        endTime: {
          min: 0,
          sec: 0
        },
        startTime: {
          min: 0,
          sec: 0
        }
      };
      this.list.push(templateData);
    },
    changeTemplate(item, i) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否已经保存当前模板？",
        okText: "保存",
        cancelText: "不保存",
        onOk: () => {
          this.editAudioTmpl(() => {
            this.activeIndex = i;
          });
        },
        onCancel: () => {
          this.activeIndex = i;
        }
      });
    },
    addTemplate() {
      this.$Modal.confirm({
        title: "提示",
        content: "是否已经保存当前模板？",
        okText: "保存",
        cancelText: "不保存",
        onOk: () => {
          this.editAudioTmpl(() => {
            this.initTemplate();
            this.activeIndex = this.list.length - 1;
          });
        },
        onCancel: () => {
          this.initTemplate();
          this.activeIndex = this.list.length - 1;
        }
      });
    },
    addTimepoint() {
      this.list[this.activeIndex].tags.push({
        name: "",
        min: 0,
        sec: 0
      });
    },
    removeTimePoint(i) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否要删除该时间点？",
        onOk: () => {
          this.list[this.activeIndex].tags.splice(i, 1);
        }
      });
    },
    removeTemplate() {
      this.initTemplate();
    },
    addContent() {
      this.addInfo.correctTemplate.push({
        name: "",
        audioUrl: ""
      });
      console.log(this.addInfo);
    },
    removeAudioTmpl(item, i) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否要删除该模板？",
        onOk: () => {
          console.log(item);
          if (!item.id) {
            this.list.splice(i, 1);
            this.activeIndex = i < this.list.length ? 0 : this.activeIndex - 1;
            return;
          }
          this.$api.tbzwLesson
            .removeAudioTmpl({
              id: item.id
            })
            .then(() => {
              this.$Message.success("模板删除成功！");
              this.list.splice(i, 1);
              this.activeIndex =
                i < this.list.length ? 0 : this.activeIndex - 1;
            });
        }
      });
    },
    getListAudioTmpl() {
      this.$api.tbzwLesson
        .listAudioTmpl({
          lessonId: this.dataInfo.id
        })
        .then(({ data }) => {
          if (data.resultData.length) {
            this.list = data.resultData.map(e => {
              let start_min = parseInt(e.startTime / 1000 / 60);
              let start_sec = parseInt((e.startTime / 1000) % 60);
              let end_min = parseInt(e.endTime / 1000 / 60);
              let end_sec = parseInt((e.endTime / 1000) % 60);
              e.startTime = {
                min: +start_min,
                sec: +start_sec
              };
              e.endTime = {
                min: +end_min,
                sec: +end_sec
              };
              e.tags = e.tags.map(_e => {
                let min = parseInt(_e.time / 1000 / 60);
                let sec = parseInt((_e.time / 1000) % 60);
                return {
                  name: _e.name,
                  min: +min,
                  sec: +sec
                };
              });
              return e;
            });
          } else {
            this.initTemplate(() => {
              this.list.push(this.templateData);
            });
          }
          this.isLoad = true;
          console.log(this.list);
        });
    },
    submitAdd() {
      if (!this.list.length) {
        return this.$Message.error("请添加模板");
      }
      this.editAudioTmpl(() => {
        this.$emit("input", false);
      });

      // this.$api.tbzwLesson
      //   .saveCorrectTemplateById({
      //     lessonId: this.addInfo.lessonId,
      //     correctTemplate: JSON.stringify(this.addInfo.correctTemplate)
      //   })
      //   .then(response => {
      //     if (response.data.code == "200") {
      //       this.$Message.success("操作成功");
      //       this.closeModal();
      //       this.$emit("successData");
      //     }
      //   });
    },
    editAudioTmpl(fn) {
      let { list, dataInfo, activeIndex } = this;
      let templateData = list[activeIndex];
      let start_min = templateData.startTime.min * 60 * 1000;
      let start_sec = templateData.startTime.sec * 1000;
      let end_min = templateData.endTime.min * 60 * 1000;
      let end_sec = templateData.endTime.sec * 1000;
      templateData._startTime = start_min + start_sec;
      templateData._endTime = end_min + end_sec;
      templateData._tags = templateData.tags.map(e => {
        let _min = e.min * 60 * 1000;
        let _sec = e.sec * 1000;
        return { name: e.name, time: _min + _sec };
      });
      let params = {
        audioUrl: templateData.audioUrl,
        endTime: templateData._endTime,
        lessonId: dataInfo.id,
        name: templateData.name,
        startTime: templateData._startTime,
        tags: templateData._tags
      };

      if (templateData.id) {
        params.id = templateData.id;
      }
      this.$api.tbzwLesson.editAudioTmpl(params).then(() => {
        fn && fn();
      });
    },
    closeModal() {
      this.isOpenDetail = false;
      this.$emit("input", false);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.p-correctTemplate {
  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    &-btn {
      width: 100px;
      margin-right: 15px;
    }
  }
  &-formDataItem {
    display: flex;
    .item-wrap {
      width: 40%;
      margin: 0 10px;
    }

    .item-label {
      width: 50px;
    }

    .-item-input {
      width: 100%;
    }

    .item-del {
      width: 60px;
      margin-left: 10px;
    }
  }
  ._time-point {
    display: flex;
    align-items: center;
    margin-left: 10px;
    .-item-input {
      width: 150px;
    }
    span {
      margin: 0 8px;
    }
  }

  .-c-tips {
    color: #39f;
  }
  .ivu-form-item {
    margin-bottom: 14px;
  }
}
</style>
