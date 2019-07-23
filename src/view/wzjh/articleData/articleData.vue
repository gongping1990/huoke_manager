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

      <Row class="g-search -c-tab">
        <Col :span="6" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">文章栏目：</div>
            <Select v-model="searchInfo.categoryId" @on-change="getList(1)" class="-search-selectOne" filterable
                    v-if="columnType == '1'">
              <Option v-for="(item,index) in columnList" :label="item.name" :value="item.mateId" :key="index"></Option>
            </Select>
            <Select v-model="searchInfo.categoryId" @on-change="getList(1)" class="-search-selectOne" filterable v-else>
              <Option v-for="(item,index) in columnList" :label="item.name" :value="item.cateId" :key="index"></Option>
            </Select>
          </div>
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
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'articleData',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        subjectType: '1',
        columnType: '1',
        dataList: [],
        columnList: [],
        searchInfo: {},
        total: 0,
        isFetching: false,
        sortInfo: '',
        columns: [
          {
            type: 'index',
            title: '排名',
            align: 'center'
          },
          {
            title: '标题',
            key: 'title',
            width: 300,
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
                    src: params.row.url
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
            title: '收藏',
            key: 'collectNum',
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
        this.$api.wzjh.getArtcileRank({
          current: num ? num : this.tab.page,
          sort: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : '',
          sortStr: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.key) : '',
          size: this.tab.pageSize,
          mateId: this.columnType == '1' ? this.searchInfo.categoryId : '',
          cateId: this.columnType == '2' ? this.searchInfo.categoryId : ''
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
        this.$api.wzjh.getSubjectColumn({
          subId: this.subjectType,
          type: this.columnType
        })
          .then(
            response => {
              this.columnList = response.data.resultData;
              this.searchInfo.categoryId = this.columnType == '1' ? this.columnList[0].mateId : this.columnList[0].cateId
              this.getList(1)
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

    .-c-tab {
      margin: 20px 0;
    }

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 200px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
</style>
