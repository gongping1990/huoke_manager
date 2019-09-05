<template>
  <div class="p-booking">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left g-tab">
          <Col :span="4" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">是否回访</div>
              <Select v-model="searchInfo.visited" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="4">
            <div class="-search">
              <Select v-model="selectInfo" class="-search-select">
                <Option value="1">用户昵称</Option>
                <Option value="2">手机号码</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList(1)"></Input>
            </div>
          </Col>
          <Col :span="10" class="g-flex-a-j-center">
            <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          </Col>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>
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
          name: '领取时间',
          type: 'datetime'
        },
        dataList: [],
        visitedStatusList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '是'
          },
          {
            id: '0',
            name: '否'
          }
        ],
        total: 0,
        selectInfo: '1',
        searchInfo: {
          visited: '-1'
        },
        isFetching: false,
        columns: [
          {
            title: '用户昵称',
            key: 'nickname'
          },
          {
            title: '电话号码',
            key: 'phone'
          },
          {
            title: '领取时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtModified).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '是否回访',
            render: (h,p)=> {
              return h('div',p.row.visited ? '是' : '否')
            }
          },
          {
            title: '操作',
            width: 190,
            render: (h, params) => {
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    display: !params.row.visited ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.changeAudit(params.row)
                    }
                  }
                }, '标记为已回访')
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
      changeDate(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.getList(1)
      },
      changeAudit(param) {
        console.log(param)
        this.$api.composition.visitReservRecord({
          id: param.id
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
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
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          visited: this.searchInfo.visited == '-1' ? '' : this.searchInfo.visited,
          startTime: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          endTime: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.$api.composition.reservatRecordPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
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

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
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
  }
</style>
