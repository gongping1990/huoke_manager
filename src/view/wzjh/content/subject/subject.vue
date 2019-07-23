<template>
  <div class="p-subject">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-subject"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑订阅信息' : '创建订阅信息'">
        <Form ref="addInfo" :model="addInfo" :label-width="100" :rules="ruleValidate">
          <Form-item label="公众号头像" prop="bottonUrl" class="ivu-form-item-required">
            <upload-img v-model="addInfo.bottonUrl" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="公众号二维码" prop="qrcode" class="ivu-form-item-required">
            <upload-img v-model="addInfo.qrcode" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="公众号名称" prop="subTitle">
            <Input type="text" v-model="addInfo.subTitle" placeholder="请输入公众号名称"></Input>
          </FormItem>
          <FormItem label="公众号描述" prop="digest">
            <Input type="text" v-model="addInfo.digest" placeholder="请输入公众号描述"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-subject"
        v-model="isOpenModalSort"
        @on-cancel="isOpenModalSort = false"
        width="350"
        title="编辑网站标题">
        <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
          <FormItem label="网站标题">
            <Input type="text" v-model="sortNum" placeholder="请输入网站标题"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="isOpenModalSort = false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitSort()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import UploadImg from "../../../../components/uploadImg";

  export default {
    name: 'subject',
    components: {UploadImg},
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalSort: false,
        isSending: false,
        addInfo: {},
        sortNum: '',
        columns: [
          {
            title: '学科名称',
            key: 'name'
          },
          {
            title: '网站标题',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalSort(params.row)
                  }
                }
              }, params.row.topTitle)
            },
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'address'
          },
          {
            title: '操作',
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
                      this.toDetail(params.row)
                    }
                  }
                }, 'banner管理'),
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
                }, '订阅信息')
              ])
            }
          }
        ],
        ruleValidate: {
          subTitle: [
            {required: true, message: '请输入公众号名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '公众号名称长度为20字', trigger: 'blur'}
          ],
          digest: [
            {required: true, message: '请输入公众号描述', trigger: 'blur'},
          ]
        },
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toDetail(data) {
        this.$router.push({
          name: 'bannerList',
          query: {
            id: data.id
          }
        })
      },
      openModal(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      openModalSort(data) {
        this.isOpenModalSort = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.sortNum = this.addInfo.topTitle
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        this.$api.wzjh.getSubjectList()
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        if (!this.addInfo.qrcode) {
          return this.$Message.error('请上传订阅按钮图片')
        } else if (!this.addInfo.bottonUrl) {
          return this.$Message.error('请上传订阅二维码图片')
        }

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.wzjh.updateSubject(this.addInfo)
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      },
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入网站标题')
        }
        this.addInfo.topTitle = this.sortNum
        this.$api.wzjh.updateSubject(this.addInfo)
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('修改成功');
              this.getList()
              this.isOpenModalSort = false
            }
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-subject {
    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }

    .-code {
      img {
        width: 100px !important;
        height: 100px !important;
      }
    }

    .-p-b-flex {
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

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
