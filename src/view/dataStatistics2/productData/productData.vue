<template>
  <div class="p-commodity">
    <Card>
      <Row class="g-search">
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">年级：</div>
            <Select v-model="searchInfo.grade" @on-change="getList(1)" class="-search-selectOne" filterable>
              <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">学期：</div>
            <Select v-model="searchInfo.semester" placeholder="请选择" class="-search-selectOne"
                    @on-change="getList(1)">
              <Option label="上学期" value="1"></Option>
              <Option label="下学期" value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="16" class="g-flex-a-j-center">
          <Date-picker class="date-time"
                       placeholder="选择开始日期"
                       type= 'date'
                       :clearable="false"
                       @on-change="getList(1)"
                       v-model="searchInfo.date"></Date-picker>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    </Card>

  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"
  import expandRow from "./productTable";

  export default {
    name: 'productData',
    components: {expandRow},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        gradeList: [
          {
            id: '1',
            name: '一年级'
          },{
            id: '2',
            name: '二年级'
          },{
            id: '3',
            name: '三年级'
          },{
            id: '4',
            name: '四年级'
          },{
            id: '5',
            name: '五年级'
          },{
            id: '6',
            name: '六年级'
          },
        ],
        searchInfo: {
          grade: '1',
          semester: '1',
          date: new Date()
        },
        goodsId: '',
        isFetching: false,
        isOpenModal: false,
        sortInfo: '',
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row.lessons
                }
              })
            }
          },
          {
            title: '单元',
            key: 'name',
            align: 'center'
          },
          {
            title: '章节',
            align: 'center'
          },
          {
            title: '打开人数',
            align: 'center'
          },
          {
            title: '通关人数',
            align: 'center'
          },
          {
            title: '平均通关时长',
            align: 'center'
          },
          {
            title: '通关率',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center'
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
      openModal(data) {
        this.goodsId = data.goodsId
        this.isOpenModal = true
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.dataCenter.getPrepProductList({
          current: this.tab.page,
          size: this.tab.pageSize,
          courseId: '1',
          edition: '1',
          date: dayjs(this.searchInfo.date).format('YYYY-MM-DD'),
          grade: this.searchInfo.grade,
          semester: this.searchInfo.semester
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
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
      width: 120px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }
    .-search-select-text {
      min-width: 50px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
</style>
