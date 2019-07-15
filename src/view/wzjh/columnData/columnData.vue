<template>
  <div class="p-commodity">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="subjectType" type="button" @on-change="getColumnsList">
          <Radio label='1'>语文</Radio>
          <Radio label='2'>数学</Radio>
          <Radio label='3'>英语</Radio>
        </Radio-group>
      </Row>

      <Row class="g-t-left -c-tab">
        <Radio-group v-model="columnType" type="button" @on-change="getColumnsList">
          <Radio label='1'>同步学习</Radio>
          <Radio label='2'>学习资源</Radio>
        </Radio-group>
      </Row>

      <Row class="g-flex-a-j-center -c-tab" :gutter="10" style="width:70%">
        <Col v-for="(item,index) of columnList" :key="index" class="-p-d-col">
          <Card class="g-t-left">
            <div class="-p-d-name">{{item.name}}</div>
            <div class="-col-flex">
              <div class="-col-num">访问量：{{item.pv}}</div>
              <div class="-col-num">访问用户：{{item.uv}}</div>
              <div class="-col-num">订阅点击：{{item.subscribe}}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"
             @on-sort-change="changeSort"></Table>

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

  export default {
    name: 'columnData',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        columnList: [],
        titleList: [],
        subjectType: '1',
        columnType: '1',
        total: 0,
        isFetching: false,
        sortInfo: '',
        columns: [
          {
            type: 'index',
            title: '排名',
            align: 'center',
            width: 60
          },
          {
            title: '栏目',
            key: 'title',
            width: 200,
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',

            align: 'center',
            sortable: 'custom'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '订阅点击',
            key: 'subscribe',
            align: 'center',
            sortable: 'custom'
          }
        ],
      };
    },
    mounted() {
      this.getColumnsList()
    },
    methods: {
      changeSort(data) {
        this.sortInfo = data
        this.getList(1)
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
        this.$api.wzjh.getCateRank({
          current: num ? num : this.tab.page,
          sort: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : '',
          sortStr: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.key) : '',
          size: this.tab.pageSize,
          subId: this.subjectType,
          type: this.columnType
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
      //栏目数据
      getColumnsList() {
        this.columnList = []
        this.isFetching = true
        this.$api.wzjh.getColumnsList(this.subjectType)
          .then(
            response => {
              let data = response.data.resultData;
              if(this.columnType == '1') {
                this.columnList.push({
                  name: '总计',
                  pv: data.studyVO.pv,
                  uv: data.studyVO.uv,
                  subscribe: data.studyVO.subscribe
                })
              } else {
                this.columnList.push({
                  name:  '总计',
                  pv: data.resourceVO.pv,
                  uv: data.resourceVO.uv,
                  subscribe: data.resourceVO.subscribe
                })
              }
              this.getList(1)
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
