<template>
  <div class="p-booking">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
            <Radio :label=0>待审核</Radio>
            <Radio :label=1>已通过</Radio>
            <Radio :label=2>未通过</Radio>
          </Radio-group>
        </Row>

        <Row class="g-t-left g-tab">
          <Col :span="5">
            <div class="-search">
              <Select v-model="selectInfo" class="-search-select">
                <Option value="1">用户昵称</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList(1)"></Input>
            </div>
          </Col>
          <Col :span="19" class="-p-b-flex">
            <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
            <Button @click="openModal()" ghost type="primary" style="width: 100px;" v-if="radioType!=1">通过</Button>
            <Poptip
              v-else
              confirm
              title="确认选中项重置为不通过"
              @on-ok="changeAudit(2)"
              placement="right-end"
              ok-text="确认"
              cancel-text="取消">
              <Button ghost type="primary" style="width: 100px;">不通过</Button>
            </Poptip>
          </Col>
        </Row>
      </Row>

      <Table :loading="isFetching"
             :columns="radioType === 0 ? columns : columnsTwo"
             :data="dataList" ref="selection"
             @on-selection-change="changeSelectTab"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>

    <Modal
      class="p-booking"
      v-model="isOpenModal"
      @on-cancel="openModal()"
      width="350"
      title="确认要通过审核吗？">
      <Form ref="addInfo" :model="addInfo" :label-width="70">
        <FormItem label="审核" prop="name">
          <Radio-group v-model="auditType">
            <Radio :label=2>不通过</Radio>
            <Radio :label=1>通过</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="开课日期" prop="name" v-if="auditType === 1">
          <Date-picker style="width: 100%" :options="dateOption" type="date" placeholder="选择日期" v-model="addInfo.opentime"></Date-picker>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-s-footer">
        <Button @click="openModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="changeAudit('')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'

  export default {
    name: 'bookingList',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '预约时间',
          type: 'datetime'
        },
        dataList: [],
        total: 0,
        selectInfo: '1',
        searchInfo: {},
        addInfo: {},
        dataItem: '',
        radioType: 0,
        auditType: 1,
        isFetching: false,
        isOpenModal: false,
        checkAll: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickname'
          },
          {
            title: '预约时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtModified).format('YYYY-MM-DD HH:mm:ss'))
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '审核')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickname'
          },
          {
            title: '电话',
            key: 'phone'
          },
          {
            title: '领课节数',
            key: 'phone'
          },
          {
            title: '预约时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtModified).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '开课时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.auditTime).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '最新审核时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.auditTime).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeSelectTab(data) {
        for (let item of data) {
          this.checkAll.push(item.id)
        }
      },
      changeDate(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.getList(1)
      },
      changeAudit(num) {
        console.log(param)
        if (!num && !this.addInfo.phone && this.auditType === 1) {
          return this.$Message.error('请选择开课日期')
        }

        this.$api.poem.recordAudit({
          id: param.id || this.dataItem.id,
          status: num || this.auditType,
          phone: this.addInfo.phone
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
              this.isOpenModal = false
              this.auditType = ''
            }
          })
      },
      openModal(data) {
        this.dataItem = data
        this.isOpenModal = !this.isOpenModal
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
        this.$api.poem.reservatRecordPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          status: this.radioType,
          nickname: this.searchInfo.nickname,
          startTime: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          endTime: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : ""
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
      noPass(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.poem.removeBroadcast({
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.poem.removeBroadcast({
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
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.poem.updateBroadcast(this.addInfo) : this.$api.poem.saveBroadcast(this.addInfo)
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
  .p-booking {
    .-c-tips {
      color: #39f
    }

    .-p-b-flex {
      display: flex;
      justify-content: space-between;
    }

    .-p-text-right {
      margin-top: 20px;
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

    .-p-s-footer {
      display: flex;
      /*text-align: center;*/
      justify-content: space-around;
    }
  }
</style>
