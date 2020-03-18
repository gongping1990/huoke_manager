<template>
  <div class="p-columnData">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-flex-a-j-center">
          <Row class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text-two">当前选中：</div>
            <Select v-model="searchInfo.cityId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in cityList" :label=" item.cityName || item.provinceName" :value="item.id" :key="index"></Option>
            </Select>
          </Row>
        </Col>
      </Row>
      <Row class="g-search g-tab g-t-left">
        <Radio-group v-model="searchInfo.subjectType" type="button" @on-change="getList()">
          <Radio :label=1>幼升小</Radio>
          <Radio :label=2>小升初</Radio>
          <Radio :label=3>初升高</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search g-tab g-t-left">
        <Radio-group v-model="searchInfo.columnId" type="button" @on-change="getList()">
          <Radio :label=0>一级栏目</Radio>
          <Radio :label=1>二级栏目</Radio>
        </Radio-group>
      </Row>

      <div class="g-search g-tab g-t-left p-columnData-allData">
        <div class="-allData-title">总计</div>
        <div class="-allData-flex">
          <div>访问量： 233</div>
          <div>访问用户： 233</div>
          <div>收藏人次： 233</div>
        </div>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'columnData',
    data() {
      return {

        dataList: [],
        cityList: [],
        searchInfo: {
          subjectType: 1,
          columnId: 0,
          cityId: ''
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
            title: '栏目名称',
            key: 'name',
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
      this.getAllProvinceCity()
    },
    methods: {
      getAllProvinceCity() {
        this.$api.xxbProvinceCity.getAllProvinceCity()
          .then(
            response => {
              this.cityList = response.data.resultData;
              this.searchInfo.cityId = this.cityList[0].id
              this.getList()
            })
      },
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.xxbSxbStatistics.getSectionStatistics({
          category: this.searchInfo.subjectType,
          provinceCityId: this.searchInfo.cityId,
          sectionType: this.searchInfo.columnId,
        })
          .then(
            response => {
              this.dataList = response.data.resultData || [];
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-columnData {

    &-allData {
      width: 400px;
      padding: 10px;
      border: 1px solid #dcdee2;
      border-radius: 4px;

      .-allData-title {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
      }

      .-allData-flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

    }

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
      text-align: left;
    }
  }
</style>
