<template>
  <div class="p-channel">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">

    <Card>
      <div class="g-add-btn " @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-channel"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="350"
        :title="addInfo.id ? '编辑渠道' : '新增渠道'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="渠道名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入渠道名称"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-channel"
        v-model="isOpenModalCopy"
        footer-hide
        @on-cancel="isOpenModalCopy = false"
        width="600"
        title="复制链接">
        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'channelManagement',
    components: {DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        copy_url: '',
        detailList: [],
        dataList: [],
        selectInfo: '1',
        searchInfo: {
          fromDate: '',
          toDate: ''
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalCopy: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入渠道名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '渠道名称长度为20字', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('span', `${params.row.gmtCreate}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '操作',
            width: 250,
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toDetail(params.row)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '学科名称',
            key: 'subjectName',
            align: 'center'
          },
          {
            title: '渠道链接',
            key: 'channelurl',
            align: 'center'
          },
          {
            title: '渠道二维码',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.channelqrcode
                },
                style: {
                  width: '60px',
                  height: '60px',
                  margin: '10px'
                }
              })
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 250,
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
                      this.copyUrlFn(params.row)
                    }
                  }
                }, '复制链接'),
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
                      this.download(params.row)
                    }
                  }
                }, '下载二维码')
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
      copyUrlFn(row) {
        this.copy_url = row.channelurl;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      download (data) {
        window.open(data.channelqrcode, '_blank');
      },
      changeDate(data) {
        this.searchInfo.fromDate = data.startTime
        this.searchInfo.toDate = data.endTime
        this.getList(1)
      },
      toDetail(data) {
        this.isOpenModalCopy = true
        this.getChannelDetail(data)
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            name: ''
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
      getChannelDetail (data) {
        this.$api.poem.listByChannelDetails({
          channelId: data.id
        }).then(
          response => {
            this.detailList = response.data.resultData;
          }
        )
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.poem.listByChannel({
          current: num ? num : this.tab.page,
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
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.poem.updateChannel(this.addInfo) : this.$api.poem.addChannel(this.addInfo)
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
  .p-channel {
    .copy-input{
      position: absolute;
      opacity: 0;
    }

    .-c-tips {
      color: #39f
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
