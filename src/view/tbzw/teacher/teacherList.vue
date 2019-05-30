<template>
  <div class="p-teacherList">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-teacherList"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      :title="addInfo.id ? '编辑教师' : '创建教师'">
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="教师头像" prop="name" class="-p-v-content">
          <div class="g-flex-j-sa -p-v-top">
            <div class="-p-upload">
              <Upload
                :action="baseUrl"
                :show-upload-list="false"
                :before-upload=" beforeUpload"
                :max-size="100"
                :on-success="handleSuccess"
                :on-exceeded-size="handleSize"
                :on-error="handleErr">
                <div class="-p-upload-img"
                     :style="{backgroundImage: 'url('+addInfo.headImage+')',backgroundRepeat:'no-repeat', backgroundSize: 'cover'}">
                  <Icon size="30" type="ios-camera"/>
                </div>
              </Upload>
            </div>
            <div class="-p-text">
              <div class="-p-v-text" :class="{'g-success': textType=='2','g-error': textType=='3'}">
                {{textStatus[textType]}}
                <Icon size="18" v-if="textType=='2'" type="ios-checkmark-circle"/>
                <Icon size="18" v-if="textType=='3'" type="ios-close-circle"/>
              </div>
              <div class="-p-v-tip">上传仅支持jpg、png格式，大小不超过100k</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="教师名称" prop="teacherName">
          <Input type="text" v-model="addInfo.teacherName" placeholder="请输入教师名称"></Input>
        </FormItem>
        <FormItem label="随堂音频" prop="introduce">
          <upload-audio ref="childAudio" @successAudioUrl="successAudioUrl" :option="uploadAudioOption"></upload-audio>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <Modal
      class="p-teacherList"
      v-model="isOpenModalPlay"
      @on-cancel="isOpenModalPlay = false"
      width="350"
      title="播放">
      <audio ref="playAudio" :src="addInfo.resUrl" autoplay controls></audio>
      <div slot="footer" class="g-flex-j-sa">
        <div @click="isOpenModalPlay = false" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";

  export default {
    name: "teacherList",
    components: {UploadAudio},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        isOpenModal: false,
        isOpenModalPlay: false,
        isFetching: false,
        dataList: [],
        addInfo: {},
        total: 0,
        textType: '0',
        textStatus: ['上传用户对象', '更换头像', '上传成功', '上传失败'],
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          url: '',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        columns: [
          {
            title: '用户头像/名称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headImage
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.teacherName)
              ])
            }
          },
          {
            title: '随堂音频',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalPlay(params.row)
                  }
                }
              }, '播放音频')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
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
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
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
        ],
      }
    },
    methods: {
      successAudioUrl(url) {
        this.uploadAudioOption.url = url
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.textType = '1'
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.textType = '0'
          this.addInfo = {}
          this.uploadAudioOption.url = ''
        }
        setTimeout(() => {
          this.$refs.childAudio.init()
        }, 0)
      },
      closeModal() {
        this.isOpenModal = false
      },
      openModalPlay(data) {
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.isOpenModalPlay = true
      },
      closeModalPlay() {
        this.$refs.playAudio.pause()
        this.isOpenModalPlay = false
      },
      submitInfo() {
        //if(this.addInfo.)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.teacher.teacherList({
          current: this.tab.page,
          size: this.tab.pageSize
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
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']

        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.textType = '2'
          this.addInfo.headImage = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.textType = '3'
        this.$Message.error('上传失败，请重新上传')
      },
    }
  }
</script>

<style scoped lang="less">
  .p-teacherList {
    .-p-v-content {

      .-p-v-top {
        padding: 20px 0;
        align-items: center;
      }

      .-p-upload {

        &-img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #ebebeb;
          border: 1px solid #d9dadb;
          color: rgba(179, 181, 184, 1);
          cursor: pointer;
        }

        &-img:hover {
          color: #5444E4;
        }
      }

      .-p-text {
        margin-left: 20px;

        .-p-v-text {
          font-size: 15px;
        }
      }
      .-p-v-tip {
        color: rgba(179, 181, 184, 1);
      }
    }

    .-p-v-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
