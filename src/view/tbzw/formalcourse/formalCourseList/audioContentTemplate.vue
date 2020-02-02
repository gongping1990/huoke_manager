<template>
  <Modal
    class="p-correctTemplate"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="语音批改模板">
    <Form :model="addInfo" ref="addInfo" :label-width="80">
      <FormItem label="模板类型" prop="name">
        <div class="p-correctTemplate-formDataItem" v-for="(item,index) of addInfo.correctTemplate" :key="index">
          <div class="item-label">模板{{index+1}}:</div>
          <div class="item-wrap">
            <Input class="-item-input" :maxlength="30" type="text" v-model="item.name"
                   placeholder="请输入模板名称(最多三十字)"></Input>
          </div>
          <upload-audio ref="childAudio" v-model="item.audioUrl" :option="uploadAudioOption"></upload-audio>
          <div @click="delContent(index)" class="item-del g-error g-cursor">删除</div>
        </div>
        <Button @click="addContent('addInfoAdd')" ghost type="primary">+添加模板</Button>
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
  import UploadAudio from "../../../../components/uploadAudio";

  export default {
    name: 'audioContentTemplate',
    components: {UploadAudio, UploadImgMultiple},
    props: ['value', 'dataInfo'],
    data() {
      return {
        addInfo: {
          correctTemplate: []
        },
        uploadAudioOption: {
          // tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        isOpenDetail: false,
      }
    },
    mounted() {

    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        if (_n && this.dataInfo.category === 1) {
          this.getList()
        } else {
          this.addInfo.lessonId = this.dataInfo.id
          this.addInfo.correctTemplate = this.dataInfo.correctTemplate
          console.log( this.addInfo)
        }
      },
    },
    methods: {
      addContent() {
        this.addInfo.correctTemplate.push({
          name: '',
          audioUrl: ''
        })
        console.log(this.addInfo)
      },
      delContent(index) {
        this.addInfo.correctTemplate.splice(index, 1)
      },
      getList() {
        this.$api.tbzwLesson.getLearnContent({
          lessonId: this.dataInfo.id,
        }).then(response => {
          this.addInfo = response.data.resultData
          this.addInfo.correctTemplate = this.addInfo.correctTemplate ? JSON.parse(this.addInfo.correctTemplate) : []
          console.log( this.addInfo)
        })
      },
      submitAdd() {
        let isPass = this.addInfo.correctTemplate.every(item => {
          return (item.name !== '' && item.audioUrl !== '')
        })

        if (!isPass) {
          return this.$Message.error('已增加的模板不能有空项')
        } else if (!this.addInfo.correctTemplate.length) {
          return this.$Message.error('请添加模板')
        }

        this.$api.tbzwLesson.saveCorrectTemplateById({
          lessonId: this.addInfo.lessonId,
          correctTemplate: JSON.stringify(this.addInfo.correctTemplate)
        })
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功')
              this.closeModal()
              this.$emit('successData')
            }
          })
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-correctTemplate {

    &-formDataItem {
      display: flex;
      margin-bottom: 10px;

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
        width: 50px;
        margin-left: 10px;
      }
    }

    .-c-tips {
      color: #39f;
    }
  }
</style>
