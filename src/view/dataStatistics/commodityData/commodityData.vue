<template>
  <div class="p-commodity">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Select v-model="selectType" class="-search-selectOne">
              <Option label='自然天' :value="1"></Option>
              <Option label='自定义' :value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="17" class="g-flex-a-j-center">
          <Date-picker class="date-time"
                       v-if="selectType===1"
                       placeholder="选择开始日期"
                       :options="dateOptionOne"
                       @on-change="changeDateOne"
                       v-model="selectTime"></Date-picker>
          <date-picker-template v-if="selectType===2" :dataInfo="dateOption"
                                @changeDate="changeDateTwo"></date-picker-template>
        </Col>
        <Col :span="4" class="g-text-right">
          <Button type="primary" class="-p-modal-btn" ghost @click="toExcel">数据导出</Button>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"
             @on-sort-change="changeSort"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <div v-if="isOpenModal">
      <goods-list-template :id="goodsId" :list="dataList" @closeModal="closeModal"></goods-list-template>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"
  import GoodsListTemplate from "../../../components/goodsListTemplate";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'bannerList',
    components: {DatePickerTemplate, GoodsListTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        searchInfo: {},
        selectType: 1,
        dateOptionOne: {
          disabledDate(date) {
            return date && date.valueOf() > (new Date().getTime() - 24 * 60 * 60 * 1000);
          }
        },
        dateOption: {
          name: '',
          type: 'datetime'
        },
        total: 0,
        goodsId: '',
        isFetching: false,
        isOpenModal: false,
        sortInfo: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTime: '',
        getEndTime: '',
        columns: [
          {
            type: 'index',
            title: '排名',
            align: 'center'
          },
          {
            title: '名称',
            key: 'courseName',
            width: 200,
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.courseCover
                  },
                  style: {
                    width: '100px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '付款金额',
            key: 'payAmount',
            render: (h, params) => {
              return h('div', params.row.payAmount / 100)
            },
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pvCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '访问用户',
            key: 'uvCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '下单用户',
            key: 'orderUserCount',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '付费用户',
            key: 'payUser',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '付费转化率',
            key: 'percentConversion',
            render: (h, params) => {
              return h('span', `${params.row.percentConversion / 10}%`)
            },
            align: 'center',
            sortable: 'custom'
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
                }, '查看详情')
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
      changeDateOne(data) {
        this.selectTime = data
        this.getList(1)
      },
      changeDateTwo(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      changeSort(data) {
        switch (data.key) {
          case 'pvCount':
            data.keyNew = 'pv_count'
            break
          case 'uvCount':
            data.keyNew = 'uv_count'
            break
          case 'payUser':
            data.keyNew = 'pay_user'
            break
          case 'percentConversion':
            data.keyNew = 'percent_conversion'
            break
        }
        this.sortInfo = data
        this.getList()
      },
      toExcel() {
        let times = ''
        if (this.selectType === 1) {
          times = `selectDate=${new Date(this.selectTime).getTime()}`
        } else {
          times = `startDate=${new Date(this.getStartTime).getTime()}&endDate=${new Date(this.getEndTime).getTime()}`
        }

        let downUrl = `${getBaseUrl()}/dataCenter/exportData?sort=${this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : ''}&sortStr=${this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.keyNew) : ''}&${times}`

        window.open(downUrl, '_blank');
      },
      closeModal() {
        this.isOpenModal = false
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.goodsId = data.goodsId
        this.isOpenModal = true
      },
      //分页查询
      getList() {
        this.isFetching = true
        let params = {
          current: this.tab.page,
          sort: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : '',
          sortStr: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.keyNew) : '',
          size: this.tab.pageSize
        }

        if (this.selectType === 2) {
          params.startDate = new Date(this.getStartTime).getTime()
          params.endDate = new Date(this.getEndTime).getTime()
        } else {
          params.selectDate = new Date(this.selectTime).getTime()
        }

        this.$api.dataCenter.getGoodsList(params)
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
  .p-commodity {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
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
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 20%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
