<template>
  <div class="p-qrcode">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="radioType" type="button" @on-change="getList()">
            <Radio :label=1>正常</Radio>
            <Radio :label=2>失效</Radio>
          </Radio-group>
        </Row>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-qrcode"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑二维码' : '创建二维码'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="二维码名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入消息内容"></Input>
          </FormItem>
          <FormItem label="有效期" prop="endTime">
            <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                         v-model="addInfo.endTime"></Date-picker>
          </FormItem>
          <FormItem label="二维码">
            <upload-img v-model="addInfo.qrcode" :option="uploadOption"></upload-img>
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
  import dayjs from 'dayjs'

  export default {
    name: 'qrcodeList',
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
        radioType:1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入二维码名称', trigger: 'blur'}
          ],
          endTime: [
            {required: true, type: 'date', message: '请选择有效期', trigger: 'change'},
          ]
        },
        columns: [
          {
            title: '二维码名称',
            key: 'name'
          },
          {
            title: '二维码',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.qrcode
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '扫码次数',
            key: 'scanNum',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '结束日期',
            render: (h, params) => {
              return h('div', dayjs(+params.row.endTime).format('YYYY-MM-DD HH:mm:ss'))
            }
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
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.endTime = new Date(+this.addInfo.endTime)
        } else {
          this.addInfo = {}
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
        this.$api.composition.qrcodeList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          normal: this.radioType === 1
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
            this.$api.composition.deleteQrcode({
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
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.qrcode) {
              return this.$Message.error('请上传二维码')
            }
            this.isSending = true
            this.$api.composition.saveQrcode({
              id: this.addInfo.id,
              name: this.addInfo.name,
              qrcode: this.addInfo.qrcode,
              endTime: new Date(this.addInfo.endTime).getTime()
            })
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
  .p-qrcode {
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
