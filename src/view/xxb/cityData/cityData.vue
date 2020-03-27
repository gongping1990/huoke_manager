<template>
  <div class="p-cityData">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.subjectType" type="button" @on-change="getList()">
          <Radio :label=1>幼升小</Radio>
          <Radio :label=2>小升初</Radio>
          <Radio :label=3>初升高</Radio>
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
        dataList: [],
        searchInfo: {
          subjectType: 1
        },
        isFetching: false,
        columns: [
          {
            title: '排名',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '省市名称',
            render: (h, param) => {
              return h('div', `${param.row.provinceName} ${param.row.cityName || ''}` )
            },
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
            key: 'collect',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.xxbSxbStatistics.getProvinceCityStatistics({
          category: this.searchInfo.subjectType
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
  .p-cityData {

  }
</style>
