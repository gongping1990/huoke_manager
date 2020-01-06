<template>
  <div class="p-pictureBookTemplate">
    <div class="p-pictureBookTemplate-wrap">
      <div class="-wrap-top">
        <div class="-c-item" v-for="(item, index) of dataList" :key="index">
          <div class="-c-point" :class="{'g-primary-btn': dataItem.id === item.id}" @click="toCheckBtn(item,index)">
            页面{{item.index}}
          </div>
          <Icon v-if=" dataItem.id === item.id" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                @click="delCheckpoint(item)"/>
        </div>
        <Button @click="openModal()" ghost type="primary" class="-c-btn">添加页面</Button>
        <Button @click="openSort()" ghost type="primary" class="-c-btn" v-if="dataList.length>1">页面排序</Button>
      </div>

      <div class="-wrap-down" v-show="isShowFormItem">
        <Form :model="addInfo" :label-width="120">
          <FormItem label="页面音频" class="ivu-form-item-required">
            <upload-audio v-model="addInfo.vfUrl" :option="uploadAudioOption"></upload-audio>
          </FormItem>
          <Form-item label="页面图片" class="ivu-form-item-required">
            <upload-img v-model="addInfo.imgUrl" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
      </div>

      <div class="-wrap-footer g-flex-j-sa" v-show="isShowFormItem">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>

    </div>

    <Modal
      class="p-pictureBookTemplate"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      title="页面排序">
      <div class="p-pictureBookTemplate-wrap">
        <draggable v-model="sortList">
          <div v-for="(item,index) in sortList" :key="index" class="-c-item">
            <div class="-c-point">
              页面{{item.index}}
            </div>
          </div>
        </draggable>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取 消</Button>
        <div @click="submitSort()" class="g-primary-btn" style="line-height: 40px"> {{isSending ? '提交中...' : '确 认'}}
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import draggable from 'vuedraggable'
  import ChoiceQuestionTwo from "../choiceQuestionTwo";
  import UploadImg from "../../../../../components/uploadImg";
  import UploadAudio from "../../../../../components/uploadAudio";

  export default {
    name: 'pictureBookTemplate',
    components: {UploadAudio, UploadImg, ChoiceQuestionTwo, Loading, draggable},
    data() {
      return {
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        dataItem: {},
        addInfo: {},
        sortList: [],
        pointId: '',
        isOpenModal: false,
        isShowFormItem: false,
        isSending: false
      };
    },
    mounted() {
    },
    methods: {
      closeModal () {
        this.dataItem = ''
        this.isShowFormItem = false
      },
      toCheckBtn(data) {
        this.dataItem = data
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.isShowFormItem = true
        this.$forceUpdate()
      },
      delCheckpoint(data) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwLesson.removeIllustrationBookById({
              ibookId: data.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success('删除成功')
                  this.getList()
                  this.openModal()
                }
              })
          }
        })
      },
      openSort () {
        this.isOpenModal = true
        this.sortList = JSON.parse(JSON.stringify(this.dataList))
      },
      openModal() {
        this.dataItem = ''
        this.isShowFormItem = true
        this.addInfo = {
          pointId: this.pointId,
          imgUrl: '',
          vfUrl: ''
        }
      },
      submitSort() {
        this.dataItem = {}
        let array = []
        this.sortList.forEach(item=>{
          array.push(item.id)
        })
        this.$api.tbzwLesson.sortByIds({
          ids: array,
          pointId: this.pointId,
          type: 2
        })
          .then(response => {
            if (response.data.code == '200') {
              this.isOpenModal = false
              this.getList()
              this.closeModal()
              this.$Message.success('操作成功');
            }
          })
      },
      //分页查询
      getList(data) {
        data && (this.pointId = data.id)
        this.isFetching = true
        this.$api.tbzwLesson.listIllustrationBook({
          pointId: this.pointId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (!this.addInfo.vfUrl) {
          return this.$Message.error('请选择页面音频')
        } else if (!this.addInfo.imgUrl) {
          return this.$Message.error('请选择页面图片')
        }
        this.$api.tbzwLesson.saveIllustrationBook(this.addInfo)
          .then(response => {
            if (response.data.code == '200') {
              this.getList()
              this.openModal()
              this.$Message.success('操作成功');
            }
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-pictureBookTemplate {
    padding: 30px 0;

    &-modal {
      margin-left: 60px;

      .-modal-radio {
        margin: 20px 0;
        width: 48%;
      }
    }

    &-wrap {
      text-align: left;

      .-wrap-top {
        display: flex;
        align-items: center;
        padding: 0 0 20px 30px;
        border-bottom: 1px solid #ebebeb;
      }

      .-wrap-down {
        margin: 20px 0;
      }

      .-c-item {
        position: relative;
        /*width: 75px;*/
        display: inline-block;
        margin: 0px 10px 10px 0;

        &-icon {
          color: #5444E4;
          position: absolute;
          top: -12px;
          right: -10px;
        }

        .-c-point {
          padding: 5px 15px 6px;
          border-radius: 4px;
          text-align: center;
          border: 1px solid #EBEBEB;
          width: 100%;
          height: inherit;
          line-height: inherit;
          cursor: pointer;
        }
      }

      .-c-btn {
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .-wrap-footer {
        width: 50%;
        margin: 20px 0;
      }
    }
  }
</style>
