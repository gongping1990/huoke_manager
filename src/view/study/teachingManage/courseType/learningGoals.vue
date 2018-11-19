<template>
  <div class="p-learn">
    <div class="-t-btn">
      <div v-if="!isShowEditor">
        <div class="g-primary-btn -t-width" @click="toEditor">进入编辑</div>
        <Button ghost type="primary" class="-t-width" @click="openPreviewModal">预览内容</Button>
      </div>
      <div v-else class="g-t-left">
        <Form ref="addInfo" :model="addInfo" :label-width="70">
          <FormItem label="学习目标" prop="learnTarget">
            <editor v-model="addInfo.learnTarget"></editor>
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
  </div>
</template>

<script>
  import Editor from "@/components/editor";

  export default {
    name: 'learningGoals',
    components: {Editor},
    data() {
      return {
        isShowEditor: false,
        isSending: false,
        isFetching: false,
        addInfo: {
          id: this.$route.query.lessonId,
          learnTarget: ''
        }
      }
    },
    mounted() {
      this.getLearnInfo()
    },
    methods: {
      openPreviewModal () {
        if(!this.addInfo.learnTarget) {
          this.toEditor()
        } else {
          console.log('进入预览')
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
              this.addInfo.learnTarget = response.data.resultData.learnTarget;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (!this.addInfo.learnTarget || this.addInfo.learnTarget == '<p><br></p>') {
          return this.$Message.error('请填写学习目标')
        }
        this.isSending = true

        this.$api.book.updateTarget(this.addInfo)
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.closeModal()
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
  }
</style>
