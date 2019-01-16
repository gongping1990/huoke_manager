<template>
  <Modal title="发送记录"
         class="p-sms"
         v-model="isOpenModal"
         width="900px"
         @on-cancel="closeModal()">
    <Row>
      <Col :span="5">发送状态：
        <Select style="width: 100px;" v-model="form.state" placeholder="请选择"
                @on-change="getWxMessageList(1)">
          <Option label="全部" value="3"></Option>
          <Option label="发送成功" value="1"></Option>
          <Option label="发送失败" value="0"></Option>
        </Select>
      </Col>
      <Col :span="16" class="g-flex-a-j-center -date-search">
        <Col span="3">发送时间：</Col>
        <Col span="7" class="g-flex-a-j-center">
          <div>
            <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                         v-model="form.startTime"></Date-picker>
          </div>
          <div>&nbsp;-&nbsp;</div>
          <div>
            <Date-picker class="date-time" type="datetime" placeholder="选择结束日期"
                         v-model="form.endTime"></Date-picker>
          </div>
          <div class="-date-search">
            <Button type="primary" class="-p-modal-btn" @click="getWxMessageList(1)">搜索</Button>
          </div>
        </Col>
      </Col>
    </Row>

    <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="dataList"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChangeRecord"></Page>
  </Modal>
</template>

<script>
 import dayjs from 'dayjs'

  export default {
    name: 'wxRecordTemplate',
    props: ['data', 'type', 'otherType'],
    data() {
      return {
        form: {
          startTime: '',
          endTime: '',
          state: '3'
        },
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        dataList: [],
        total: 0,
        isOpenModal: false,
        isFetching: false,
        addInfo: {},
        columnsRecord: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '发送内容',
            key: 'content',
            align: 'center',
            width: 400
          },
          {
            title: '发送状态',
            render: (h, params) => {
              return h('div', params.row.status ? '发送成功' : '发送失败')
            },
            align: 'center'
          },
          {
            title: '发送时间',
            key: 'creatTime',
            align: 'center',
            width: 100
          },
          {
            title: '链接地址',
            key: 'url',
            align: 'center'
          }
        ]
      }
    },
    mounted() {
      this.isOpenModal = true
      this.getWxMessageList()
    },
    methods: {
      currentChangeRecord(val) {
        this.tab.page = val;
        this.getWxMessageList();
      },

      getWxMessageList(num) {
        let paramUrl = ''
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        let param = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          status: this.form.state,
          sendTimeBegin: this.form.startTime ? dayjs(this.form.startTime).format('YYYY/MM/DD HH:mm:ss') : "",
          sendTimeEnd: this.form.endTime ? dayjs(this.form.endTime).format('YYYY/MM/DD HH:mm:ss') : ""
        }

        if(this.type == '1') {
          param.id = this.data
        } else {
          param.taskId = this.data
        }

        paramUrl = this.otherType ? this.$api.custom.getWxMessageList : this.$api.user.getWxMessageList
        paramUrl(param)
          .then(response => {
            this.dataList = response.data.resultData.records;
            this.total = response.data.resultData.total;
          })
          .finally(() => {
            this.isFetching = false
          })
      },
      closeModal() {
        this.$emit('closeModal')
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-sms {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 100%;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }
  }
</style>
