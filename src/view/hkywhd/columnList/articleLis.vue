<template>
  <div class="p-acticle">
    <Row class="g-search">
      <Col :span="12">
        <div class="g-flex-a-j-center">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">文章名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </div>
      </Col>
    </Row>

    <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'managerArticleList',
    props: ['columnInfo'],
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        isFetching: false,
        detailInfo: this.$route.query,
        columns: [
          {
            title: '标题',
            align: 'center',
            render: (h, param)=> {
              return h('div', param.row.name || param.row.title)
            }
          },
          {
            title: '排序值',
            key: 'sort',
            align: 'center'
          },
          {
            title: '浏览量（PV）',
            key: 'pv',
            align: 'center'
          },
          {
            title: '浏览用户(UV)',
            key: 'uv',
            align: 'center'
          }
        ],
      };
    },
    mounted() {

      if (this.detailInfo.columnNum === '0') {
        this.getList()
      }

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
        this.$api.hkywhdMaterial[this.detailInfo.urlDetail]({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          categoryName: this.columnInfo.firstName,
          subject: this.detailInfo.subject,
          name: this.searchInfo.nickname,
          subCategoryName: this.columnInfo.isFirst ?  '' : this.columnInfo.title
        })
          .then(
            response => {
              if (this.detailInfo.columnNum === '0') {
                this.dataList = response.data.resultData
              } else {
                this.dataList = response.data.resultData.records
                this.total = response.data.resultData.total
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-acticle {
    .-c-tips {
      color: #39f
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
