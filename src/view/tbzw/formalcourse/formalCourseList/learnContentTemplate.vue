<template>
  <Modal
    class="p-learnContent"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    :title="(dataInfo.category === 1 ||  dataInfo.category === 2 ) ? '学习内容' : '书写要点'">
    <Form :model="addInfo" ref="addInfo" :label-width="80">
      <FormItem label="要点选项" prop="name">
        <div class="p-learnContent-formDataItem" v-for="(item,index) of addInfo.learncontent" :key="index">
          <div class="item-label">要点{{index+1}}:</div>
          <div class="item-wrap">
            <Input class="-item-input" :maxlength="30" type="text" v-model="item.value"
                   placeholder="请输入内容(最多三十字)"></Input>
          </div>
          <div @click="delContent(index)" class="item-del g-error g-cursor">删除</div>
        </div>
        <div class="-c-tips" v-if="(dataInfo.category === 1 ||  dataInfo.category === 2 )">知识要点将在每课的学情报告中向用户展示</div>
        <Button @click="addContent('addInfoAdd')" ghost type="primary">+添加要点</Button>
      </FormItem>
      <FormItem label="重点笔记" v-if="(dataInfo.category === 1 ||  dataInfo.category === 2 )">
        <upload-img-multiple v-model="addInfo.keynotes" :option="uploadOption"></upload-img-multiple>
        <div class="-c-tips">可将上课视频中重要的板书总结截图下来直接使用，不超过9张，可拖动排序</div>
      </FormItem>
      <FormItem label="阅读字数" v-if="dataInfo.category === 2">
        <Input class="-item-input" type="text" v-model="addInfo.readingWords" placeholder="请输入阅读字数"></Input>
        <div class="-c-tips">阅读字数将在读写课每课的学情报告中向用户展示</div>
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
    data() {
      return {
        addInfo: {
          learncontent: [],
          keynotes: []
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
      value(_n) {
        this.isOpenDetail = _n
        if (_n && (this.dataInfo.category === 1 || this.dataInfo.category === 2)) {
          this.getList()
        } else {
          this.addInfo.lessonId = this.dataInfo.id
          this.addInfo.learncontent = this.dataInfo.learncontent ? JSON.parse(this.dataInfo.learncontent) : []
        }
      },
    },
    methods: {
      addContent() {
        if (this.dataInfo.category === 3 && this.addInfo.learncontent.length >= 5) {
          return this.$Message.error('最多添加五个选项')
        }
        this.addInfo.learncontent.push({
          value: ''
        })
        console.log(this.addInfo)
      },
      delContent(index) {
        this.addInfo.learncontent.splice(index, 1)
      },
      getList() {
        this.$api.tbzwLesson.getLearnContent({
          lessonId: this.dataInfo.id,
        }).then(response => {
          this.addInfo = response.data.resultData
          this.addInfo.learncontent = this.addInfo.learncontent ? JSON.parse(this.addInfo.learncontent) : []
          this.addInfo.keynotes = this.addInfo.keynotes ? JSON.parse(this.addInfo.keynotes) : []
        })
      },
      submitAdd() {
        let isPass = this.addInfo.learncontent.every(item => {
          return item.value !== ''
        })

        if (!isPass) {
          return this.$Message.error('已增加的要点选项不能有空项')
        } else if (!this.addInfo.learncontent.length) {
          return this.$Message.error('请添加要点选项')
        } else if (this.addInfo.keynotes.length > 9) {
          return this.$Message.error('最多上传9张')
        }

        this.$api.tbzwLesson.editLearnContent({
          lessonId: this.addInfo.lessonId,
          readingWords: this.addInfo.readingWords,
          keynotes: JSON.stringify(this.addInfo.keynotes),
          learncontent: JSON.stringify(this.addInfo.learncontent)
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

  .p-learnContent {

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
