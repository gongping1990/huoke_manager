<template>
  <div class="p-virtual">
    <Card>
      <div class="g-add-btn -t-add-icon" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-virtual"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="350"
        :title="addInfo.userId ? '编辑用户' : '创建用户'">
        <div class="-p-v-content">
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
                     :style="{backgroundImage: 'url('+addInfo.headImgUrl+')',backgroundRepeat:'no-repeat', backgroundSize: 'cover'}">
                  <Icon size="30" type="ios-camera"/>
                </div>
              </Upload>
            </div>
            <div class="-p-text">
              <div class="-p-v-text" :class="{'g-success': textType=='2','g-error': textType=='3'}">
                {{textStatus[textType]}}
                <Icon size="18" v-if="textType=='2'" type="ios-checkmark-circle"/>
                <Icon size="18"  v-if="textType=='3'" type="ios-close-circle"/>
              </div>
              <div class="-p-v-tip">上传仅支持jpg、png格式，大小不超过100k</div>
            </div>
          </div>
          <div class="-p-v-down">
            <Input type="text" v-model="addInfo.nickname" placeholder="请输入昵称"></Input>
          </div>
        </div>
        <div slot="footer" class="-p-v-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'virtualUser',
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        textType: '0',
        textStatus: ['上传用户对象','更换头像','上传成功','上传失败'],
        ruleValidate: {
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headImgUrl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            }
          },
          {
            title: '创建时间',
            key: 'creatTime'
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
                }, '编辑')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.textType = '1'
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.textType = '0' +
            ''
          this.addInfo = {}
        }
      },
      closeModal() {
        this.isOpenModal = false
      },
      beforeUpload(file) {
        let imgType = ['jpeg','png']
        console.log(file)
        if(file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
         return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.textType = '2'
          this.addInfo.headImgUrl = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.textType = '3'
        this.$Message.error('上传失败，请重新上传')
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.user.getUserPage({
          current: this.tab.page,
          size: this.tab.pageSize,
          virtual: 1
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
      submitInfo () {
        if(!this.addInfo.headImgUrl) {
          return this.$Message.error('请上传头像')
        } else if (!this.addInfo.nickname) {
          return this.$Message.error('请输入昵称')
        }

        let promiseDate = this.addInfo.userId ? this.$api.user.uploadVirtualUser(this.addInfo) : this.$api.user.addVirtualUser(this.addInfo)
        promiseDate
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal()
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-virtual {
    .-p-v-content {
      padding: 0 20px;

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
