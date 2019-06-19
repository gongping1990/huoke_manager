<template>
  <div class="p-retainData">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-flex-a-j-center">
          <Row class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text-two">渠道来源：</div>
            <Select v-model="radioType" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in channelList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </Row>
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {thousandFormatter} from '@/libs/index'
  import {getBaseUrl} from "@/libs/index"
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'columnData',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '查询时间',
          type: 'datetime'
        },
        dataList: [],
        channelList: [],
        radioType: '',
        total: 0,
        isFetching: false,
        searchInfo: {},
        columns: [
          {
            title: '初次上课时间',
            key:'date',
            width: 120,
            align: 'center'
          },
          {
            title: '初次上课用户',
            key: 'learnuser',
            align: 'center',
          },
          {
            title: '次日访问/打卡',
            key: 'oneRate',
            align: 'center',
          },
          {
            title: '2日后访问/打卡',
            key: 'twoRate',
            align: 'center',
          },
          {
            title: '3日后访问/打卡',
            key: 'threeRate',
            align: 'center',
          },
          {
            title: '4日后访问/打卡',
            key: 'fourRate',
            align: 'center',
          },
          {
            title: '5日后访问/打卡',
            key: 'fiveRate',
            align: 'center',
          },
          {
            title: '6日后访问/打卡',
            key: 'sixRate',
            align: 'center',
          },
          {
            title: '7日后访问/打卡',
            key: 'sevenRate',
            align: 'center',
          },
          {
            title: '14日后访问/打卡',
            key: 'fourteenRate',
            align: 'center',
          },
          {
            title: '30日后访问/打卡',
            key: 'thirtyRate',
            align: 'center',
          },
          {
            title: '45日后访问/打卡',
            key: 'fortyfiveRate',
            align: 'center',
          },
          {
            title: '60日后访问/打卡',
            key: 'sixtyRate',
            align: 'center',
          },
          {
            title: '75日后访问/打卡',
            key: 'seventyfiveRate',
            align: 'center',
          }
        ],
      };
    },
    mounted() {
      this.getChannelList()
    },
    methods: {
      changeDate(data) {
        this.searchInfo.startTime = data.startTime
        this.searchInfo.endTime = data.endTime
        this.getList(1)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getChannelList() {
        this.$api.composition.listByChannel({
          current: 1,
          size: 10000
        })
          .then(
            response => {
              this.channelList = response.data.resultData.records;
              this.radioType = this.channelList.length && this.channelList[0].id
              this.channelList.push({
                id: '0',
                name: '其他渠道'
              })
              this.getList()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : ''
        endTime = this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.composition.listRetentionRate({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          begin: startTime,
          end: endTime,
          chancelId: this.radioType
        })
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
  .p-retainData {
    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-s-radio {
      min-width: 240px;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-d-col {
      min-width: 400px;
      width: 40%;

      .-col-num {
        font-size: 14px;
        margin: 10px 0;
      }

      .-p-d-name {
        font-size: 18px;
        font-weight: bold;
      }

      .-col-flex {
        display: flex;
        justify-content: space-between;
      }

      .-col-ratio {
        font-size: 13px;
      }

      .-p-d-echart {
        width: 100%;
      }

      .-p-c-content {
        width: 100%;
        height: 450px;
        /*background-color: red;*/
        /*overflow: hidden;*/
      }
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
