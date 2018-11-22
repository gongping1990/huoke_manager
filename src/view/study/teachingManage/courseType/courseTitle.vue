<template>
  <div class="p-content">
    <div class="-c-wrap" v-if="!isShowEdit && type != '0'">
      <Row class="-c-wrap-row">
        <div v-for="(item,index) of itemList" :key="index" class="-c-item">
          <div class="-c-point" :class="{'g-primary-btn': item.isActive}" @click="toCheckBtn(item,index)">
            第{{item.pageNo}}关
          </div>
          <Icon v-if="item.isActive" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                @click="delCheckpoint(item)"/>
        </div>

        <div class="-c-item-no g-cursor" v-if="itemList.length" @click="toEdit(0)">添加关卡 +</div>
        <div class="-c-item-no g-cursor" @click="toSort()" v-if="itemList.length > 1">关卡排序</div>
      </Row>
      <div class="-c-flex-align -c-wrap">
        <div>
          <div class="g-primary-btn -t-width" @click="toEdit(1)">{{dataItem ? '进入编辑' : '添加关卡'}}</div>
          <Button ghost type="primary" class="-t-width"  v-if="itemList.length" @click="openPreviewModal">预览内容</Button>
          <div class="-c-color -t-width g-cursor" @click="backCourseList">返回课时列表</div>
        </div>
      </div>
    </div>

    <div v-if="isShowEdit">
      <Row>
        <course-edit :type="type" :dataObj="dataItem" @addCourseOk="addCourse"></course-edit>
      </Row>
    </div>

    <learning-goals v-if="type == '0'"></learning-goals>

    <loading v-if="isFetching"></loading>

    <Modal
      class="p-content"
      v-model="isOpenModal"
      @on-cancel="closeModal()"
      :mask-closable="false"
      title="拖拽排序">
      <div class="-c-wrap">
        <draggable v-model="sortList">
          <div v-for="(item,index) in sortList" :key="index" class="-c-item">
            <div class="-c-point">
              第{{item.pageNo}}关
            </div>
          </div>
        </draggable>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <div v-if="isOpenImgModal">
      <preview-pictures :dataProp="dataItem" :courseType="2" @closePreviewModal="closePreview"></preview-pictures>
    </div>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import CourseEdit from "./courseEdit";
  import LearningGoals from "./learningGoals";
  import draggable from 'vuedraggable'
  import PreviewPictures from "@/components/previewPictures";

  export default {
    name: 'courseTitle',
    components: {PreviewPictures, LearningGoals, CourseEdit, Loading, draggable},
    props: ['type'],
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        isOpenModal: false,
        isOpenImgModal: false,
        dataItem: '',
        dataList: [],
        sortList: [],
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
          this.dataItem = ''
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
      backCourseList () {
        this.$router.push({
          name: 'teachMain',
          query:{
            ...this.$route.query,
            isBack: true
          }
        })
      },
      toSort() {
        this.sortList = this.dataList
        this.isOpenModal = true
      },
      closeModal() {
        this.isOpenModal = false
      },
      submitInfo () {
        if(this.isSending) return
        this.isSending = true
        let param = []
        for (let item of this.sortList)  {
          param.push(item.id)
        }
        this.$api.slide.updateChapter(param)
          .then(
            response => {
             if(response.data.code == '200') {
               this.$Message.success('排序成功')
               this.closeModal()
               this.getList()
             }
            })
          .finally(() => {
            this.isSending = false
          })
      },
      toBack() {
        this.$Modal.confirm({
          title: '提示',
          content: '返回列表页面，当前页面编辑内容将全部丢失',
          onOk: () => {
            this.isShowEdit = false
            this.type != '0' && this.getList()
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
        if (!this.dataItem) {
          this.$Message.info('请选择关卡')
        } else {
          this.isOpenImgModal = true
        }
      },
      closePreview () {
        this.isOpenImgModal = false
      },
      toEdit(bool) {
        this.isShowEdit = true
        !bool && (this.dataItem = '')
      },
      closeEdit() {
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
              this.dataList.forEach((item, index) => {
                if(index == '0') {
                  item.isActive = true
                  this.dataItem = item
                } else {
                  item.isActive = false
                }
              })
              localStorage.setItem('typeId', this.type)
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delCheckpoint(data) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该关卡吗？',
          onOk: () => {
            this.$api.slide.delCheckpoint({
              id: data.id
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
        this.dataItem = ''
        this.closeEdit()
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
        width: 75px;
        display: inline-block;
        margin: 0 10px 0 0;

        &-icon {
          color: #5444E4;
          position: absolute;
          top: -12px;
          right: -10px;
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
      width: 100%;
      cursor: pointer;
    }

    .-c-color {
      color: #5444E4;
    }
  }
</style>
