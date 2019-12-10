<template>
  <Modal
    class="p-learnContent"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="学习内容">
    <Form :model="addInfo" ref="addInfo" :label-width="80">
      <FormItem label="学习内容" prop="name" class="ivu-form-item-required">
        <div class="p-learnContent-formDataItem" v-for="(item,index) of addInfo.contentList" :key="index">
          <div class="item-label">内容{{index+1}}:</div>
          <div class="item-wrap">
            <Input class="-item-input" type="text" v-model="item.value" placeholder="请输入内容"></Input>
          </div>
          <div @click="delContent(index)" class="item-del g-error g-cursor">删除</div>
        </div>
        <div class="-c-tips">学习内容将在每课的学情报告中向用户展示</div>
        <Button @click="addContent('addInfoAdd')" ghost type="primary">+添加学习内容</Button>
      </FormItem>
      <FormItem label="重点笔记" class="ivu-form-item-required">
        <upload-img-multiple v-model="addInfo.imgList" :option="uploadOption"></upload-img-multiple>
        <div class="-c-tips">可将上课视频中重要的板书总结截图下来直接使用，不超过9张，可拖动排序</div>
      </FormItem>
    </Form>

    <div slot="footer" class="g-flex-j-sa">
      <Button @click="closeModal('addInfoAdd')" ghost type="primary" style="width: 100px;">取消</Button>
      <div @click="submitAdd('addInfoAdd')" class="g-primary-btn ">确认</div>
    </div>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  import UploadImgMultiple from "../../../../components/uploadImgMultiple";
  export default {
    name: 'learnContentTemplate',
    components: {UploadImgMultiple},
    props: ['value', 'dataInfo'],
    data () {
      return {
        addInfo: {
          contentList: []
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        isOpenDetail: false,
      }
    },
    mounted() {

    },
    watch: {
      value (_n) {
        this.isOpenDetail = _n
        // _n && this.getList()
      },
    },
    methods: {
      addContent() {
        this.addInfo.contentList.push({
          id: this.addInfo.contentList.length+1,
          value: ''
        })
      },
      delContent (index) {
        this.addInfo.contentList.splice(index,1)
      },
      // getList() {
      //   this.$api.tbzwStudyRecordData.getStudyDataDetails({
      //     activeConfigId: this.propPeriodId,
      //     lessonId: this.searchInfo.lessonId,
      //   }).then(response => {
      //     this.dataList = response.data.resultData
      //   })
      // },
      submitAdd () {
        let isPass = this.addInfo.contentList.every(item=>{
          return item.value !== ''
        })

        if (!isPass || !this.addInfo.contentList.length){
          return this.$Message.error('学习内容不能为空')
        } else if (!this.addInfo.imgList.length) {
          return this.$Message.error('请上传重点笔记截图')
        } else if (this.addInfo.imgList.length > 9) {
          return this.$Message.error('最多上传9张')
        }

        this.$api.composition.saveHomeWork({
          lessonId: this.addInfo.id,
          imgList: this.addInfo.imgList,
          contentList: this.addInfo.contentList
        })
          .then(response => {
            if (response.data.code == '200') {
              this.closeModal()
            }
          })
      },
      closeModal () {
        this.isOpenDetail = false
        this.$emit('input', false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-learnContent{

    &-formDataItem {
      display: flex;
      margin-bottom: 10px;

      .item-wrap {
        width: 100%;
        margin: 0 10px;
      }

      .item-label {
        width: 50px;
      }

      .-item-input {
        width: 100%;
      }

      .item-del {
        width: 50px;
      }
    }

    .-c-tips {
      color: #39f;
    }
  }
</style>
