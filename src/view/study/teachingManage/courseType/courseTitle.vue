<template>
  <div class="p-content">
    <div class="-c-wrap" v-if="!isShowEdit && type != '0' && type!= '-1'">
      <Row class="-c-wrap-row">
        <div v-for="(item,index) of itemList" :key="index" class="-c-item">
          <div class="-c-point" :class="{'g-primary-btn': item.isActive}" @click="toCheckBtn(item,index)">
            {{type == '1' ? `${item.topic}` : `第${item.pageNo}页`}}
          </div>
          <Icon v-if="item.isActive" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                @click="delCheckpoint(item)"/>
        </div>
        <div class="-c-item-no g-cursor" v-if="itemList.length" @click="toEdit(0)">{{type == '1' ? '添加生字' : '添加页面'}} +
        </div>
        <div class="-c-item-no g-cursor" @click="toSort()" v-if="itemList.length > 1">{{type == '1' ? '生字排序' :
          '页面排序'}}
        </div>
      </Row>
      <div class="-t-btn-wrap">
        <div v-if="type== '1'" class="-t-btn-radio">
          <RadioGroup v-model="wordRadioType" type="button" @on-change="changeWordType">
            <Radio label="1">讲解</Radio>
            <Radio label="2">练习</Radio>
          </RadioGroup>
        </div>
        <div>
          <preview-pictures v-if="itemList.length" :dataProp="dataItem" :courseType="2" :style="styleInfo"
                            :directEntry="true"></preview-pictures>

          <div class="-t-btn-wrap">
            <div class="g-primary-btn -t-width" @click="toEdit(1)" v-if="type!='1'">{{dataItem ? '进入编辑' : '添加页面'}}
            </div>
            <div class="g-primary-btn -t-width" @click="toEdit(2)" v-if="type=='1' && wordRadioType=='1'">编辑讲解</div>
            <div class="g-primary-btn -t-width" @click="toEdit(3)" v-if="type=='1' && wordRadioType=='2'">编辑练习</div>
            <div class="g-primary-btn -t-width g-cursor" v-if="type=='1' && !itemList.length" @click="toEdit(0)">添加生字
            </div>
            <Button ghost type="primary" class="-t-width" v-if="itemList.length" @click="openPreviewModal">预览大图</Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isShowEdit">
      <Row>
        <course-edit :type="type" :wordType="wordType" :dataObj="dataItem" @addCourseOk="addCourse"></course-edit>
      </Row>
    </div>

    <learning-goals v-if="type == '0'"></learning-goals>

    <course-cover v-if="type == '-1'"></course-cover>

    <div v-if="isOpenModal">
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
                {{type == '1' ? `${item.topic}` : `第${item.pageNo}页`}}
              </div>
            </div>
          </draggable>
        </div>
        <div slot="footer" class="g-flex-j-sa">
          <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </div>

    <div v-if="isOpenWordModal">
      <word-modal @closeWordModal="closeWord"></word-modal>
    </div>

    <div v-if="isOpenImgModal">
      <preview-pictures-model :dataProp="dataItem" :courseType="2"
                              @closePreviewFirst="closePreview"></preview-pictures-model>
    </div>

    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import CourseEdit from "./courseEdit";
  import LearningGoals from "./learningGoals";
  import draggable from 'vuedraggable'
  import PreviewPicturesModel from "@/components/previewPicturesModel";
  import PreviewPictures from "@/components/previewPictures";
  import CourseCover from "./courseCover";
  import WordModal from "../../../../components/tree/wordModal";

  export default {
    name: 'courseTitle',
    components: {
      WordModal,
      CourseCover, PreviewPictures, PreviewPicturesModel, LearningGoals, CourseEdit, Loading, draggable
    },
    props: ['type'],
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        isOpenModal: false,
        isOpenImgModal: false,
        isOpenWordModal: false,
        wordType: '',
        wordRadioType: '1',
        dataItem: '',
        dataList: [],
        sortList: [],
        addInfo: {
          id: this.$route.query.lessonId,
          learnTarget: ''
        },
        styleInfo: {
          'width': '300px',
          'height': '500px',
          'margin': 'auto',
          'overflow': 'hidden'
        }
      }
    },
    watch: {
      'type'(_old, _new) {
        if (this.isShowEdit) {
          this.toBack()
        } else {
          this.dataItem = '';
          (this.type != '0' && this.type != '-1') && this.getList()
        }
      }
    },
    computed: {
      itemList() {
        return this.dataList
      }
    },
    mounted() {
      (this.type != '0' && this.type != '-1') && this.getList()
    },
    methods: {
      changeWordType () {
        let dataStorage = JSON.parse(JSON.stringify(this.dataItem))
        console.log(dataStorage,'ceshi1')
        this.dataItem = ''
        this.dataItem = dataStorage
        this.dataItem.operate = this.wordRadioType
      },
      closeWord() {
        this.isOpenWordModal = false
        this.getList()
      },
      toSort() {
        this.sortList = this.dataList
        this.isOpenModal = true
      },
      closeModal() {
        this.isOpenModal = false
      },
      submitInfo() {
        if (this.isSending) return
        this.isSending = true
        let param = []

        for (let item of this.sortList) {
          param.push(item.id)
        }
        let interParams = ''
        switch (+this.type) {
          case 1:
            interParams = this.$api.mission.wordPageNo
            break
          case 2:
            interParams = this.$api.mission.readPageNo
            break
          case 3:
            interParams = this.$api.mission.lecturePageNo
            break
        }
        interParams(param)
          .then(
            response => {
              if (response.data.code == '200') {
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
            this.isShowEdit = false;
            (this.type != '0' && this.type != '-1') && this.getList()
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
        if(this.type == '1') {
          this.dataItem.operate = '1'
          this.dataItem.type = '1'
          this.wordRadioType = '1'
        }
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
      closePreview() {
        this.isOpenImgModal = false
      },
      toEdit(num) {
        if (this.type == '1' && num != '2' && num != '3') {
          this.isOpenWordModal = true
        } else {
          this.isShowEdit = true
          this.wordType = (num == 2 || num == 3) ? num : ''
          !num && (this.dataItem = '')
        }
      },
      closeEdit() {
        this.isShowEdit = false
      },
      getList() {
        this.isFetching = true
        let params = ''
        switch (+this.type) {
          case 1:
            params = this.$api.mission.wordList
            break
          case 2:
            params = this.$api.mission.readList
            break
          case 3:
            params = this.$api.mission.lectureList
            break
        }
        params({
          lessonId: this.$route.query.lessonId,
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.dataList.forEach((item, index) => {
                if (index == '0') {
                  item.isActive = true
                  this.dataItem = item
                  if(this.type == '1') {
                    this.dataItem.operate = '1'
                    this.dataItem.type = '1'
                  }
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
            let params = ''
            switch (+this.type) {
              case 1:
                params = this.$api.mission.delWord
                break
              case 2:
                params = this.$api.mission.delRead
                break
              case 3:
                params = this.$api.mission.delLecture
                break
            }
            params({
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
    height: 98%;

    .-t-btn-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .-t-btn-radio{
      position: absolute;
      left: 0;
    }

    .-t-width {
      margin: 20px;
      height: 40px;
      width: 200px;
    }

    .-t-width-half {
      width: 100px;
      margin: 20px 5px;
    }
    .-c-wrap {
      height: 100%;

      .-c-wrap-row {
        /*position: absolute;*/
        text-align: left;
        width: 100%;
      }
      .-c-item {
        position: relative;
        width: 75px;
        display: inline-block;
        margin: 0 10px 20px 0;

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
