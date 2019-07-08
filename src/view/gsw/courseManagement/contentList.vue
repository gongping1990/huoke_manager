<template>
  <div class="p-course-content-list">
    <Modal
      class="p-course-content-list"
      v-model="isOpenModal"
      @on-cancel="closeModal()"
      footer-hide
      width="700"
      title="课时内容">
      <Button @click="openModal()" ghost type="primary" style="width: 100px;">新增课时</Button>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    </Modal>

    <Modal
      class="p-course-content-list"
      v-model="isOpenModalItem"
      @on-cancel="isOpenModalItem = false"
      width="700"
      title="诗词">
      <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
        <Form-item label="上传图片" class="-c-form-item ivu-form-item-required">
          <Upload
            style="display: inline-block"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="500"
            :on-success="handleSuccessCover"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传图片</Button>
          </Upload>
          <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          <div class="-c-course-wrap" v-if="addInfo.coverphoto">
            <div class="-c-course-item">
              <img :src="addInfo.coverphoto">
            </div>
          </div>
        </Form-item>
        <Form-item label="上传音频" prop="video" class="-c-form-item -c-border ivu-form-item-required">
          <Upload
            :action="baseUrlVa"
            :show-upload-list="false"
            :max-size="20480"
            :before-upload="beforeUpload"
            :on-success="handleSuccessAudio"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传音频</Button>
            <div class="-c-tips">音频格式：mp3、wma、arm 音频大小：20M以内</div>
          </Upload>

          <div class="-c-course-wrap" v-if="addInfo.video">
            <div class="-c-course-item -item-audio">
              <Icon class="-item-icon" type="md-volume-up" size="30"/>
              <audio style="margin-left: 20px;display: flex"
                     ref="media"
                     :src="playAudioUrl"
                     controls="controls" preload="auto"></audio>
              <Icon type="md-close-circle" size="20" class="-item-icon-close g-cursor" @click="closeAudio"/>
            </div>
          </div>
        </Form-item>
        <FormItem label="排序值" prop="sortnum">
          <InputNumber :max="999" :min="0" v-model="addInfo.sortnum" placeholder="请输入排序值"  class="g-width"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalItem = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
      <loading v-if="isFetching"></loading>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "../../../components/loading";

  export default {
    name: 'contentList',
    components: {Loading},
    props: ['open', 'lessonId'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `${getBaseUrl()}/sch/common/uploadPrivateFile`, //私有地址 （音视频）
        dataList: [],
        audioType: ['mp3', 'wma', 'arm'],
        isFetching: false,
        isOpenModal: this.open,
        isOpenModalItem: false,
        isSending: false,
        playAudioUrl: '',
        addInfo: {
          coverphoto: '',
          video: '',
          duration: '',
          sortnum: null
        },
        columns: [
          {
            title: '序号',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.coverphoto
                },
                style: {
                  width: '40px',
                  height: '60px',
                  margin: '10px',
                }
              })
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 220,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      closeAudio() {
        this.addInfo.video = ''
        this.playAudioUrl = ''
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
      handleSuccessCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.coverphoto = res.resultData.url
        }
      },
      handleSuccessAudio(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.addInfo.video = res.resultData.url
          this.addInfo.duration = res.resultData.duration
          this.getAvUrl(this.addInfo.video)
        }
      },
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        isPass = this.audioType.some(item => {
          return item == fileType[fileType.length - 1]
        })
        this.isFetching = isPass
        if (!isPass) {
          this.$Message.error('上传格式错误')
        }
        return isPass
      },
      getAvUrl(data) {
        this.$api.common.getAVUrl({
          key: data
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('上传成功')
                this.playAudioUrl = response.data.resultData
              }
            });
      },
      openModal(data) {
        this.isOpenModalItem = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.playAudioUrl = this.addInfo.authVideo
          this.addInfo.sortnum = +this.addInfo.sortnum
        } else {
          this.addInfo = {
            lessonId: this.lessonId,
            coverphoto: '',
            duration: '',
            video: '',
            sortnum: null
          }
        }
      },
      closeModal() {
        this.$emit('closeContentChild')
        this.isOpenModal = false
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.poem.delPoemLessonPeriod({
              id: param.id
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
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.poem.getPoemLessonPeriodList({
          current: this.tab.page,
          size: this.tab.pageSize,
          lessonId: this.lessonId
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (!this.addInfo.video) {
          return this.$Message.error('请上传音频')
        } else if (!this.addInfo.coverphoto) {
          return this.$Message.error('请上传图片')
        } else if (!this.addInfo.sortnum) {
          return this.$Message.error('请输入排序值')
        }
        let paramUrl = this.addInfo.id ? this.$api.poem.updatePoemLessonPeriod : this.$api.poem.addPoemLessonPeriod
        paramUrl(this.addInfo)
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('修改成功');
              this.getList()
              this.isOpenModalItem = false
            }
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-course-content-list {
    .-c-course-wrap {
      position: relative;

      .-c-course-item {
        position: relative;
        background-color: #EBEBEB;
        width: 200px;
        margin-top: 20px;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 4px;
        img {
          display: flex;
          width: 100%;
        }
      }
      .-item-audio {
        display: flex;
        align-items: center;
        width: 350px;

        .-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: #ffffff;
          background: rgba(255, 237, 116, 1);
        }

        .-item-icon-close {
          position: absolute;
          right: -10px;
          top: -10px;
        }
      }
    }

    .-t-add-icon {
      top: 56px
    }
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
