<template>
  <div class="p-punchData">
    <Card>
      <Row class="g-t-left ">
        <Radio-group v-model="courseType" type="button" @on-change="getList(1)">
          <Radio label='1'>老课程</Radio>
          <Radio label='2'>新课程</Radio>
        </Radio-group>
      </Row>
      <Row class="g-t-left g-tab">
        <Col :span="12">
          <Radio-group v-model="dataType" type="button" @on-change="getList(1)">
            <Radio label='1'>日数据汇总</Radio>
            <Radio label='2'>课程数据汇总</Radio>
          </Radio-group>
        </Col>
        <Col :span="12" class="g-text-right" v-if="dataType==='2'">
          <span>课时分页：</span>
          <Select v-model="tab.coursePage" style="width: 100px" class="g-t-center">
            <Option v-for="(item,index) in coursePageList" :label="`第${item}页`" :value="item" :key="index"></Option>
          </Select>
        </Col>
      </Row>

      <Table v-if="dataType==='1'" class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Row v-else class="-c-tab">
        <!--<div class="-p-tab">-->
          <!--<Col v-for="(list,index) of dataList" :key="index">-->
            <!--<div class="-p-tab-tr">{{list.name}}</div>-->
            <!--<div class="-p-tab-tb" v-for="(item,index1) of list.list" :key="index1">-->
              <!--{{item.date}}-->
            <!--</div>-->
          <!--</Col>-->
        <!--</div>-->
        <div class="-p-tab">
          <div v-for="(list,index) of dataList" :key="index" class="-p-tab-tr" :class="{'-p-tab-first': index == 0}">
            <div class="-p-tab-tb" v-for="(item,index1) of list" :key="index1">{{item}}</div>
          </div>
        </div>

      </Row>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'patchRecord',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          coursePage: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        coursePageList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        courseType: '1',
        dataType: '2',
        total: 0,
        isFetching: false,
        columns: [
          {
            title: '日期',
            align: 'center',
            key: 'date'
          },
          {
            title: '打卡人数',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '付费人数',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '付费打卡比例',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '新增打卡人数（当日初次打卡）',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '新增打卡比例',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '全部课时每日打卡比例',
            align: 'center',
            key: 'createTime'
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
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.poem.listRepairCard({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.radioType
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records || [];
              this.total = response.data.resultData.total;

              this.dataList = [
                ['日期','江南','长歌行','卢乐阁','雪','百里香','咏柳','真心自我','枫桥夜泊','哈哈','风'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['2019/10/01','598','896','635','5566','121','3434','4354','121','0','66'],
                ['课时打卡总数','11','22','33','44','55','66','77','88','99','10'],
                ['购买后课总人数','598','896','635','5566','121','3434','4354','121','0','66'],
                ['比率','23%','11%','10%','5.5%','36.9%','0.2%','0.03%','0.04%','10%','11%'],
              ]
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-punchData {
    .-p-tab {
      /*display: flex;*/
      position: relative;
      border: 1px solid #dcdee2;
      /*justify-content: space-between;*/
      /*align-items: center;*/

      width: inherit;
      height: 100%;
      max-width: 100%;
      overflow: hidden;
      color: #515a6e;
      font-size: 12px;
      box-sizing: border-box;

      &-tr {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 20px;
        line-height: 40px;
        height: 40px;
        white-space: nowrap;
        overflow: hidden;
        border-bottom: 1px solid #e8eaec;
        text-align: center;
        /*max-width: 100px;*/
        :first-child {
            width: 220px!important;
        }
      }

      &-first {
        background-color: #f8f8f9;
        font-weight: bold;

        /*.-p-tab-tb {*/
          /*width: 200px;*/
        /*}*/

      }

      &-tb {
        padding: 0 20px;
        vertical-align: middle;
        border-bottom: 1px solid #e8eaec;
        line-height: 40px;
        width: 120px;
      }
    }

    .-c-tips {
      color: #39f
    }


    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }

  }
</style>
