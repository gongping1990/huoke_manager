<template>
  <div class="p-learnAndUse">
    <Card>
      <div class="p-learnAndUse-wrap">
        <div>
          <div class="-c-item" v-for="(item, index) of dataList" :key="index">
            <div class="-c-point" :class="{'g-primary-btn': item.isActive}" @click="toCheckBtn(item,index)">
              题型{{index+1}}
            </div>
            <Icon v-if="item.isActive" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                  @click="delCheckpoint(item)"/>
          </div>
          <Button @click="openModal(1)" ghost type="primary" class="-c-btn">+添加题目</Button>
          <Button @click="openModal(2)" ghost type="primary" class="-c-btn">题目排序</Button>
        </div>

        <div v-if="isShowFormItem">
          <choice-question-two ref="childOne"
                               :type="modelChildType"
                               :isChildEdit="!isEdit"
                               :childList="choiceList"
                               @submitChoice="submitChoice"></choice-question-two>
        </div>


        <div class="g-flex-j-sa -wrap-title" v-if="dataItem || isShowFormItem">
          <Button v-if="!isEdit" @click="backCancel()" ghost type="primary">进入编辑</Button>
          <Button v-if="isEdit" @click="backCancel()" ghost type="primary" style="width: 100px;">取 消</Button>
          <div v-if="isEdit" @click="submitInfo()" class="g-primary-btn">确 认</div>
        </div>
      </div>
    </Card>

    <Modal
      class="p-learnAndUse"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      :mask-closable="false"
      :title="modelType === 1 ? '选择题型' :'拖拽排序'">
      <div class="p-learnAndUse-modal">
        <div v-if="modelType === 1 ">
          <Radio-group v-model="modelRadioType" @on-change="changeModelType">
            <Radio class="-modal-radio" :label=1>选择题（题干含图片）</Radio>
            <Radio class="-modal-radio" :label=2>选择题（选项含图片）</Radio>
            <Radio class="-modal-radio" :label=3>组词造句（题干含图片）</Radio>
            <Radio class="-modal-radio" :label=4>组词造句（选项含图片）</Radio>
          </Radio-group>
        </div>
        <draggable v-model="sortList" v-show="modelType === 2">
          <div v-for="(item,index) in sortList" :key="index" class="-c-item">
            <div class="-c-point">
              {{type == '1' ? `${item.topic}` : `第${item.pageNo}页`}}
            </div>
          </div>
        </draggable>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取 消</Button>
        <div @click="submitSort()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import draggable from 'vuedraggable'
  import ChoiceQuestionTwo from "./choiceQuestionTwo";

  export default {
    name: 'tbzw_formal_learnAndUse',
    components: {ChoiceQuestionTwo, Loading, draggable},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        dataList: [
          {
            id: 1,
            isActive: false
          },
          {
            id: 2,
            isActive: false
          },
          {
            id: 3,
            isActive: false
          },
          {
            id: 4,
            isActive: false
          },
          {
            id: 5,
            isActive: false
          }
        ],
        dataItem: '',
        addInfo: {},
        choiceList: [],
        sortList: [],
        modelType: '',
        modelRadioType: '',
        modelChildType: '',
        isEdit: false,
        isOpenModal: false,
        isShowFormItem: false,
        isSending: false
      };
    },
    mounted() {
    },
    methods: {
      changeModelType () {
        this.modelChildType = JSON.parse(JSON.stringify(this.modelRadioType))
      },
      toCheckBtn(data, index) {
        this.dataList.forEach(item => {
          if (data.id === item.id) {
            item.isActive = true
          } else {
            item.isActive = false
          }
        })
      },
      delCheckpoint(data) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.mission.delWord({
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
      openModal(num) {
        this.modelType = num
        this.isOpenModal = true
      },
      backCancel() {
        this.isEdit = !this.isEdit
      },
      submitChoice(data) {
        this.choiceList = data || []
      },
      submitSort() {
        if (this.modelType === 1) {
          this.isEdit = true
          this.isShowFormItem = true
        }
        this.isOpenModal = false
      },
      //分页查询
      getListByLessonQuestion() {
        this.isFetching = true
        this.$api.composition.listByLessonQuestion({
          type: 1,
          lessonId: this.$route.query.lessonId
        })
          .then(
            response => {
              // this.addInfo = response.data.resultData
              this.choiceList = response.data.resultData;

              this.choiceList.forEach(list => {
                list.answerMinute = parseInt(list.answerPoint / 60)
                list.answerSecond = list.answerPoint % 60
                list.publishMinute = parseInt(list.publishPoint / 60)
                list.publishSecond = list.publishPoint % 60
                list.optionJson = JSON.parse(list.optionJson)
              })

              setTimeout(() => {
                this.$refs.childOne.init()
              }, 0)
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        let isCheckQuestion = true
        let isCheckName = true
        let isCheckOptionBool = false
        let isCheckoptionJsonLength = true
        let isCheckOptionOK = false
        let checkOptionStatus = []
        let checkOptionBoolStatus = []
        let choiceDataList = []
        let isCheckRightAudio = true
        let isCheckErrorAudio = true

        this.choiceList.forEach(item => {
          if (item.answerMinute === '' || item.answerSecond === '' || !item.answerTime || item.publishMinute === '' || item.publishSecond === '') {
            isCheckQuestion = false
          }

          if (!item.name) {
            isCheckName = false
          }

          if (!item.optionJson.length) {
            isCheckoptionJsonLength = false
          }

          if (item.optionJson.length) {
            isCheckOptionBool = item.optionJson.some(list => {
              return list.isChecked == true
            })

            isCheckOptionOK = item.optionJson.every(list => {
              return list.value != ''
            })

            checkOptionStatus.push(isCheckOptionOK)
            checkOptionBoolStatus.push(isCheckOptionBool)
          }

          isCheckOptionBool = checkOptionBoolStatus.every(list => {
            return list
          })

          isCheckOptionOK = checkOptionStatus.every(list => {
            return list
          })

          if (!item.rightAudio) {
            isCheckRightAudio = false
          }

          if (!item.errorAudio) {
            isCheckErrorAudio = false
          }

        })

        if (!isCheckName) {
          return this.$Message.error('请输入题目')
        } else if (!this.choiceList.length) {
          return this.$Message.error('请新增题目')
        } else if (!isCheckQuestion && this.modalType == '3') {
          return this.$Message.error('请填写完整的答题字段')
        } else if (!isCheckoptionJsonLength) {
          return this.$Message.error('请新增选项')
        } else if (!isCheckOptionBool) {
          return this.$Message.error('请选择一个正确的答案')
        } else if (!isCheckOptionOK) {
          return this.$Message.error('选择题不能有空选项')
        } else if (!isCheckRightAudio && this.modalType == '4') {
          return this.$Message.error('请上传正确回答音频')
        } else if (!isCheckErrorAudio && this.modalType == '4') {
          return this.$Message.error('请上传错误回答音频')
        }

        choiceDataList = JSON.parse(JSON.stringify(this.choiceList))

        choiceDataList.forEach(item => {
          item.answerPoint = (+item.answerMinute * 60) + (+item.answerSecond)
          item.publishPoint = (+item.publishMinute * 60) + (+item.publishSecond)
          item.optionJson = JSON.stringify(item.optionJson)
          delete item.answerMinute
          delete item.answerSecond
          delete item.publishMinute
          delete item.publishSecond
        })

        this.$api.composition.saveLessonQuestion({
          lessonId: this.$route.query.lessonId,
          questionList: choiceDataList,
          type: 1
        })
          .then(response => {
            if (response.data.code == '200') {
              this.isEdit = false
              this.isShowFormItem = false
              this.$Message.success('操作成功');
            }
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-learnAndUse {

    &-modal {
      margin-left: 60px;

      .-modal-radio {
        margin: 20px 0;
        width: 48%;
      }
    }

    &-wrap {
      text-align: left;

      .-wrap-title {
        margin: 20px 0;
      }

      .-c-item {
        position: relative;
        width: 75px;
        display: inline-block;
        margin: 10px 10px 10px 0;

        &-icon {
          color: #5444E4;
          position: absolute;
          top: -12px;
          right: -10px;
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

      }

      .-c-btn {
        margin-right: 10px;
      }
    }
  }
</style>
