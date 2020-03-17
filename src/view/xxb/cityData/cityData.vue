<template>
  <div class="p-cityData">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.subjectType" type="button" @on-change="getList()">
          <Radio :label=0>幼升小</Radio>
          <Radio :label=1>小升初</Radio>
          <Radio :label=2>初升高</Radio>
        </Radio-group>
      </Row>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'cityData',
    data() {
      return {
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        searchInfo: {
          subjectType: 0
        },
        pageId: '',
        totalDetail: 0,
        dataItem: {},
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '排名',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '省市名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center'
          },
          {
            title: '收藏人数',
            key: 'orderNum',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      closeModal() {
        this.isOpenModal = false
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      openModal(data) {
        this.dataItem = data
        this.getDetailList()
        this.isOpenModal = true
      },
      getDetailList() {
        this.isFetching = true
        this.$api.xxbBook.getBookDataDetails({
          courseName: this.dataItem.courseName,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.xxbBook.getAllBookData()
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
  .p-cityData {

  }
</style>
