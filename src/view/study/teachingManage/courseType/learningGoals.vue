<template>
  <div class="p-learn">
    <div class="-t-btn">
      <div v-if="!isShowEditor">
        <div class="g-primary-btn -t-width" @click="toEditor">进入编辑</div>
        <Button ghost type="primary" class="-t-width" @click="openPreviewModal">预览内容</Button>
      </div>
      <div v-else class="g-t-left">
        <Form ref="addInfo" :model="addInfo" :label-width="70">
          <FormItem class="-select-wrap" v-for="(item,index) in optionList" :key="index">
            <span class="-s-width -s-title"><span class="-s-color">*</span> 目标{{index+1}}</span>
            <Input class="-s-width" v-model="item.value" type="textarea" :autosize="true" placeholder="请输入选项内容"
                   :maxlength="22" style="width: 300px"/>
            <span class="-s-width">文字字数不超过22字，包含标点符号</span>
            <span class="-s-width -s-color g-cursor" @click="delOption(index)">删除</span>
          </FormItem>
          <FormItem class="-c-flex">
            <div class="-form-btn g-cursor " v-if="optionList.length < 4" @click="addOption">+ 新增目标</div>
          </FormItem>
          <FormItem>
            <div class="-c-flex">
              <Button @click="closeModal()" ghost type="primary" class="-c-btn">取消</Button>
              <div @click="submitInfo()" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' : '确 认'}}</div>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div v-if="isOpenImgModal">
      <preview-pictures :dataProp="optionList" :courseType="1" @closePreviewModal="closePreview"></preview-pictures>
    </div>
  </div>
</template>

<script>

  import PreviewPictures from "@/components/previewPictures";
  export default {
    name: 'learningGoals',
    components: {PreviewPictures},
    data() {
      return {
        isShowEditor: false,
        isSending: false,
        isFetching: false,
        isOpenImgModal: false,
        optionList: [],
        addInfo: {
          id: this.$route.query.lessonId,
          learnTarget: []
        }
      }
    },
    mounted() {
      this.getLearnInfo()
    },
    methods: {
      closePreview () {
        this.isOpenImgModal = false
      },
      addOption() {
        this.optionList.push({
          id: this.optionList.length+1,
          value: ''
        })
      },
      delOption(index) {
        this.optionList.splice(index, 1)
      },
      openPreviewModal() {
        if (!this.addInfo.learnTarget) {
          this.toEditor()
        } else {
          this.isOpenImgModal = true
        }
      },
      toEditor() {
        this.isShowEditor = true
      },
      closeModal() {
        this.isShowEditor = false
      },
      getLearnInfo() {
        this.isFetching = true
        this.$api.book.getLessonTarget({
          lessonId: this.$route.query.lessonId
        })
          .then(
            response => {
              if(response.data.resultData.learnTarget != null) {
                this.optionList = JSON.parse(response.data.resultData.learnTarget)
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        let isPass = this.optionList.length && this.optionList.every(item=>{
          return item.value != ''
        })

        if (!this.optionList.length || !isPass) {
          return this.$Message.error('请填写学习目标')
        }

        this.isSending = true

        this.addInfo.learnTarget = JSON.stringify(this.optionList)

        this.$api.book.updateTarget(this.addInfo)
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.closeModal()
                this.getLearnInfo()
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-learn {
    height: 100%;

    .-t-width {
      margin-top: 20px;
      height: 40px;
      width: 200px;
    }
    .-t-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .-c-flex {
      display: flex;
      justify-content: center;
    }

    .-c-btn {
      margin-left: 20px;
      height: 40px;
      width: 120px;
    }

    .-select-wrap {
      padding: 10px 0;

      .-s-title {
        color: #b3b5b8;
      }
      .-s-width {
        padding-right: 10px;
      }

      .-s-color {
        color: rgb(218, 55, 75);
      }
    }

    .-form-btn {
      margin: 10px 0 0 0;
      width: 333px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      border: 1px dashed #5444E4;
      color: #5444E4;
    }

  }
</style>
