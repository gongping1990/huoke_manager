<template>
  <div class="p-content">
    <learning-goals v-if="type == '0'"></learning-goals>
    <div class="-c-wrap" v-if="!isShowEdit && type != '0'">
      <Row class="-c-wrap-row">
        <div v-for="(item,index) of itemList" :key="index" class="-c-item">
          <div class="-c-point" :class="{'g-primary-btn': item.isActive}" @click="toCheckBtn(item,index)">第{{index+1}}关</div>
          <Icon v-if="item.isActive" class="-c-item-icon" size="20" type="md-close-circle" @click="delCheckpoint"/>
        </div>

        <div class="-c-item-no g-cursor" @click="openAdd">添加关卡 +</div>
      </Row>
      <div class="-c-flex-align -c-wrap">
        <div>
          <div class="g-primary-btn -t-width" @click="toEdit">进入编辑</div>
          <Button ghost type="primary" class="-t-width" @click="openPreviewModal">预览内容</Button>
        </div>
      </div>
    </div>
    <div v-else>
      <Row>
        <div class="g-t-left g-cursor" @click="toBack">
          <Icon type="ios-arrow-back"/>
          返回关卡列表
        </div>
        <course-edit :type="type" :dataObj="dataItem" @addCourseOk="addCourse"></course-edit>
      </Row>
    </div>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import CourseEdit from "./courseEdit";
  import LearningGoals from "./learningGoals";

  export default {
    name: 'courseTitle',
    components: {LearningGoals, CourseEdit, Loading},
    props: ['type'],
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        dataItem: '',
        dataList: [],
        addInfo: {
          id: this.$route.query.lessonId,
          learnTarget: ''
        }
      }
    },
    watch: {
      'type'(_old, _new) {
        if (this.isShowEdit) {
          this.toBack()
        } else {
          this.type != '0' && this.getList()
        }
      }
    },
    computed: {
      itemList() {
        return this.dataList
      }
    },
    mounted() {
      this.type != '0' && this.getList()
    },
    methods: {
      toBack() {
        this.$Modal.confirm({
          title: '提示',
          content: '返回列表页面，当前页面编辑内容将全部丢失',
          onOk: () => {
            this.isShowEdit = false
            this.getList()
          },
          onCancel: () => {
            this.isShowEdit = true
            this.$emit('cancelChangeType')
          }
        })
      },
      toCheckBtn(data, index) {
        this.dataList[index].isShowChild = !this.dataList[index].isShowChild
        this.dataList = Object.assign([], this.dataList)
        this.dataItem = data
        this.dataList.forEach(item => {
          if (data.id == item.id) {
            item.isActive = true
          } else {
            item.isActive = false
          }
        })
      },
      openPreviewModal() {
        if (!this.addInfo.learnTarget) {
          this.toEdit()
        } else {
          console.log('进入预览')
        }
      },
      openAdd() {
        this.isShowEdit = true
      },
      toEdit() {
        this.isShowEdit = true
      },
      closeModal() {
        this.isShowEdit = false
      },
      getList() {
        this.isFetching = true
        this.$api.slide.getListType({
          lessonId: this.$route.query.lessonId,
          type: this.type
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.dataList.forEach(item => {
                item.isActive = false
              })
              localStorage.setItem('typeId', this.type)
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delCheckpoint() {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该关卡吗？',
          onOk: () => {
            this.$api.slide.delCheckpoint({
              courseId: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      addCourse() {
        this.closeModal()
        this.getList()
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-content {
    overflow-y: auto;
    height: 100%;

    .-t-width {
      margin-top: 20px;
      height: 40px;
      width: 200px;
    }
    .-c-wrap {
      height: 100%;

      .-c-wrap-row {
        position: absolute;
        text-align: left;
        width: 100%;
      }
      .-c-item {
        position: relative;
        width: 100px;
        display: inline-block;
        margin: 10px;

        &-icon {
          color: #5444E4;
          /*border: 1px solid #fff;*/
          /*border-radius: 50%;*/
          position: absolute;
          top: -12px;
          right: 8px;
        }
      }

      .-c-item-no {
        display: inline-block;
        color: #5444E4;
        margin: 10px;
        width: 100px;
        height: 30px;
        border: 1px dashed #5444E4;
        border-radius: 4px;
        text-align: center;
        line-height: 30px;
      }
    }

    .-c-flex-align {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%
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

    .-c-point {
      border-radius: 4px;
      text-align: center;
      border: 1px solid #EBEBEB;
      height: 30px;
      line-height: 30px;
      width: 80%;
      cursor: pointer;
    }
  }
</style>
