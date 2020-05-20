<template>
  <div class="p-weike">
    <Card>
      <Row>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">名称：</div>
            <Input v-model="searchInfo.title" placeholder="请输入名称" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="4" class="g-t-left" style="margin-left: 20px">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">年级：</div>
            <Select v-model="searchInfo.gradeId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

  </div>
</template>

<script>
  export default {
    name: 'syncLearnList',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          gradeId: '-1'
        },
        total: 0,
        dataList: [],
        dataItem: '',
        isFetching: false,
        isOpenModal: false,
        gradeList: [
          {
            name: '全部年级',
            key: '-1'
          },
          {
            name: '一年级',
            key: '1'
          },
          {
            name: '二年级',
            key: '2'
          },
          {
            name: '三年级',
            key: '3'
          },
          {
            name: '四年级',
            key: '4'
          },
          {
            name: '五年级',
            key: '5'
          },
          {
            name: '六年级',
            key: '6'
          },
          {
            name: '初一',
            key: '7'
          },
          {
            name: '初二',
            key: '8'
          },
          {
            name: '初三',
            key: '9'
          },
          {
            name: '高一',
            key: '10'
          },
          {
            name: '高二',
            key: '11'
          },
          {
            name: '高三',
            key: '12'
          }
        ],
        columns: [
          {
            title: '名称',
            key: 'title',
            align: 'center'
          },
          {
            title: '年级',
            key: 'name',
            render: (h, params)=> {
              return h('div', this.gradeList[params.row.grade].name )
            },
            align: 'center'
          },
          {
            title: '类型',
            key: 'subCate',
            align: 'center'
          },
          {
            title: '字数',
            key: 'words',
            align: 'center'
          },
          {
            title: 'pv',
            key: 'pv',
            align: 'center'
          },
          {
            title: 'uv',
            key: 'uv',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getList(num) {
        this.isFetching = true;
        if (num) {
          this.tab.currentPage = 1;
        }
        this.$api.xxbCompositionAdmin.getList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          grade: this.searchInfo.gradeId === '-1' ? '' : this.searchInfo.gradeId,
          title: this.searchInfo.title,
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-weike {
    .-search-select-text {
      min-width: 50px;
    }
    .-search-selectOne {
      border: 1px solid #dcdee2;
      width: 120px;
      border-radius: 4px;
      margin-right: 20px;
    }
    .-p-text-right {
      text-align: right;
    }
  }
</style>
