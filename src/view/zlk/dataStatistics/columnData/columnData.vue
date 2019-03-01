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
            <div class="-search-select-text">学科：</div>
            <Select v-model="searchInfo.subject" placeholder="请选择" class="-search-selectOne"
                    @on-change="getList(1)">
              <Option v-for="(item, index) of subjectList" :key="index" :label=item.name :value=item.id></Option>
              <Option label="数学" value="2"></Option>
              <Option label="英语" value="3"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    </Card>

  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'columnData',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        subjectList: [],
        gradeList: [
          {
            id: '1',
            name: '一年级'
          },
          {
            id: '2',
            name: '二年级'
          },
          {
            id: '3',
            name: '三年级'
          },
          {
            id: '4',
            name: '四年级'
          },
          {
            id: '5',
            name: '五年级'
          },
          {
            id: '6',
            name: '六年级'
          }
        ],
        searchInfo: {
          grade: '1',
          subject: '1',
        },
        goodsId: '',
        isFetching: false,
        isOpenModal: false,
        sortInfo: '',
        columns: [
          {
            title: '栏目',
            key: 'name'
          },
          {
            title: '访问量',
            key: 'name'
          },
          {
            title: '访问用户',
            key: 'name'
          }
        ]
      };
    },
    mounted() {
      this.getList()
      this.getSubjectList()
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
        this.$api.materia.columnList({
          current: this.tab.page,
          size: this.tab.pageSize,
          grade: this.$route.query.grade,
          subject : this.searchInfo.subject
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //分页查询学科
      getSubjectList() {
        this.isFetching = true
        this.$api.materia.subjectList()
          .then(
            response => {
              this.subjectList = response.data.resultData;
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
