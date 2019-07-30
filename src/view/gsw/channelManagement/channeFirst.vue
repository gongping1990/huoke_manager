<template>
  <div class="p-channel">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="channelType" type="button" @on-change="changeChannel">
            <Radio label='1'>渠道管理</Radio>
            <Radio label='2'>渠道用户</Radio>
          </Radio-group>
        </Row>
        <Row class="g-t-left p-channel-top">
          <Radio-group v-if="channelType ==='1'" v-model="radioType" type="button" @on-change="getList(1)">
            <Radio label='1'>试听课</Radio>
            <Radio label='2'>正式课</Radio>
          </Radio-group>
          <Radio-group v-else v-model="radioTypeUser" type="button" @on-change="getUserList(1)">
            <Radio label='0'>渠道管理员</Radio>
            <Radio label='1'>投放人员</Radio>
          </Radio-group>
        </Row>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()" v-if="channelType==='2'">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="channelType === '1' ? columns : columnsUser" :data="dataList"></Table>

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
          <FormItem label="人员名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入人员名称"></Input>
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
        channelType: '1',
        radioTypeUser: '0',
        radioType: '1',
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入人员名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '人员名称长度为20字', trigger: 'blur'}
          ]
        },
        columnsUser: [
          {
            title: '人员名称',
            key: 'name',
            align: 'center'
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
        ]
      };
    },
    computed: {
      columns () {
        let array= []

        if (this.radioType === '1') {
          array = [
            {
              title: '名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计页面访问量',
              key: 'pv',
              align: 'center'
            },
            {
              title: '累计访问用户',
              key: 'uv',
              align: 'center'
            },
            {
              title: '累计试听申请用户',
              key: 'tryapplyuv',
              align: 'center'
            },
            {
              title: '累计付试听通过用户',
              key: 'trypasseduv',
              align: 'center'
            },
            {
              title: '累计试听后付费用户',
              key: 'payeduv',
              align: 'center'
            },
            {
              title: '累计付费金额',
              key: 'payedmoney',
              align: 'center'
            },
            {
              title: '操作',
              width: 100,
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
                        this.toSecondJump(params.row)
                      }
                    }
                  }, '二级渠道'),
                ])
              }
            }
          ]
        } else {
          array = [
            {
              title: '名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计页面访问量',
              key: 'pv',
              align: 'center'
            },
            {
              title: '累计访问用户',
              key: 'uv',
              align: 'center'
            },
            {
              title: '累计付费用户',
              key: 'payeduv',
              align: 'center'
            },
            {
              title: '累计付费金额',
              key: 'payedmoney',
              align: 'center'
            },
            {
              title: '操作',
              width: 100,
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
                        this.toSecondJump(params.row)
                      }
                    }
                  }, '二级渠道'),
                ])
              }
            }
          ]
        }
        return array
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeChannel () {
        if (this.channelType === '1') {
          this.getList(1)
        } else {
          this.getUserList(1)
        }
      },
      toSecondJump (data) {
        this.$router.push({
          path: '/gsw_secondChannel',
          query: {
            type: this.radioType,
            name: data.name
          }
        })
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            name: '',
            type: this.radioTypeUser
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.gswChannel.managerRemove({
              id: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getUserList();
                }
              })
          }
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.gswChannel.listPChannelTypeCount({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          productId: this.radioType
        })
          .then(
            response => {
              this.dataList = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getUserList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.gswChannel.managerList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: this.radioTypeUser
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
            let promiseDate = this.addInfo.id ? this.$api.gswChannel.managerUpdate(this.addInfo) : this.$api.gswChannel.managerAdd(this.addInfo)
            promiseDate
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getUserList(1)
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

    &-top {
      margin-top: 16px;
    }

    .g-add-top {
      top: 86px;
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

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
