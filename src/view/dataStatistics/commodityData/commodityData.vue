<template>
  <div class="p-commodity">
    <Card>
      <Row class="g-search">
        <Col :span="18" class="g-flex-a-j-center">
          <Col span="2">查询时间:</Col>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="searchInfo.fromDate"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期"
                           v-model="searchInfo.toDate"></Date-picker>
            </div>
            <div class="-date-search">
              <Button type="primary" class="-p-modal-btn" @click="getList">搜索</Button>
            </div>
          </Col>
        </Col>
        <Col :span="6" class="g-text-right">
          <Button type="primary" class="-p-modal-btn" @click="getList">数据导出</Button>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'bannerList',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        searchInfo: {},
        total: 0,
        isFetching: false,
        getStartTime: '',
        getEndTime: '',
        columns: [
          {
            title: '名称',
            key: 'name'
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
                    src: params.row.imgResUrl
                  },
                  style: {
                    width: '200px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '访问量',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'href'
          },
          {
            title: '付费用户',
            key: 'href'
          },{
            title: '付款金额',
            key: 'href'
          },{
            title: '付费转化率',
            key: 'href'
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {


      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.banner.bannerList({
          current: this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          fromDate: this.searchInfo.fromDate ? dayjs(this.searchInfo.fromDate).format("YYYY/MM/DD HH:mm:ss") : '',
          toDate:  this.searchInfo.toDate  ? dayjs(this.searchInfo.toDate).format("YYYY/MM/DD HH:mm:ss") : ''
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
  .p-commodity {
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
