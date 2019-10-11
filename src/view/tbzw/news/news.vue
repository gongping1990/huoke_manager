<template>
  <div class="p-popManage">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-popManage"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑消息' : '创建消息'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="新闻标题" prop="title">
            <Input type="text" v-model="addInfo.title" placeholder="请输入新闻标题"></Input>
          </FormItem>
          <FormItem label="新闻描述" prop="describe">
            <Input type="text" v-model="addInfo.describe" placeholder="请输入新闻描述"></Input>
          </FormItem>
          <FormItem label="新闻链接" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入新闻链接"></Input>
          </FormItem>
          <FormItem label="新闻图片" class="ivu-form-item-required">
           <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'wheelMessage',
    components: {UploadImg},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          describe: [
            {required: true, message: '请输入新闻描述', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入新闻标题', trigger: 'blur'},
          ],
          href: [
            {required: true, message: '请输入新闻链接', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '新闻标题',
            key: 'title',
            align: 'center'
          },
          {
            title: '新闻图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.img
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 100,
            align: 'center'
          },
          {
            title: '新闻描述',
            key: 'describe',
            align: 'center'
          },
          {
            title: '新闻链接',
            key: 'href',
            align: 'center'
          },
          {
            title: '是否发布',
            render: (h, params) => {
              return h('span', params.row.publish ? '是' : '否')
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toChangeStatus(params.row)
                    }
                  }
                }, params.row.publish ? '撤下' : '发布'),
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
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toChangeStatus(params) {
        this.$api.tbzwOfficenews.publish({
          newsId: params.id
        }).then(
          response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功')
              this.getList()
            }
          })
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            img: ''
          }
        }
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
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.tbzwOfficenews.pageByAdminNews({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwOfficenews.deleteByNewsId({
              newsId: param.id
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
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(!this.addInfo.img) {
              return this.$Message.error('请上传新闻图片')
            }
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.tbzwOfficenews.updateNews(this.addInfo) : this.$api.tbzwOfficenews.saveNews(this.addInfo)
            promiseDate
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
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-popManage {
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
