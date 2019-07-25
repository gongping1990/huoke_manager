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
        <div class="-p-tab">
          <Col v-for="(list,index) of dataList" :key="index" >
            <div class="-p-tab-tr">{{list.name}}</div>
            <div v-for="(item,index1) of list.list" :key="index1">
              {{item.date}}
            </div>
          </Col>
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
                {
                  name: '日期',
                  list: [
                    {
                      date: '2019/10/10'
                    },
                    {
                      date: '2019/10/11'
                    },
                    {
                      date: '2019/10/12'
                    },
                    {
                      date: '2019/10/13'
                    },
                    {
                      date: '2019/10/14'
                    },
                    {
                      date: '课时打卡总数'
                    },
                    {
                      date: '购买后已排课课总人数'
                    },
                    {
                      date: '比率'
                    }
                  ]
                },
                {
                  name: '江南',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                },
                {
                  name: '长歌行',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                },
                {
                  name: '卢乐阁',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                },
                {
                  name: '雪',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                },
                {
                  name: '咏柳',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                },
                {
                  name: '咏鹅',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                },
                {
                  name: '风',
                  list: [
                    {
                      date: '598'
                    },
                    {
                      date: '632'
                    },
                    {
                      date: '4589'
                    },
                    {
                      date: '1202'
                    },
                    {
                      date: '636'
                    },
                    {
                      date: '987'
                    },
                    {
                      date: '997'
                    },
                    {
                      date: '10.2%'
                    }
                  ]
                }
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
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-tr {

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
