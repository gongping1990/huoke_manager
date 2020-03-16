<template>
  <div class="p-dataStatistics">
    <div class="p-dataStatistics-tab">
      <Tabs v-model="tabType" @on-click="changeTab(0)">
        <TabPane label="概览"></TabPane>
        <TabPane label="家长"></TabPane>
        <TabPane label="老师"></TabPane>
        <TabPane label="学生"></TabPane>
      </Tabs>
    </div>

    <div class="p-dataStatistics-wrap">
      <Card class="p-dataStatistics-card">
        <div class="p-dataStatistics-title">
          兴趣
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartOne" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card" v-if="tabType===0">
        <div class="p-dataStatistics-title">
          角色分布
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartTwo" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card" v-if="tabType===1">
        <div class="p-dataStatistics-title">
          与孩子关系
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartRelation" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card" v-if="tabType===1">
        <div class="p-dataStatistics-title">
          是否陪伴在孩子身边
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartBeside" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card" v-if="tabType!==0">
        <div class="p-dataStatistics-title">
          {{tabType === 2 ? '授课年级' : '就读年级'}}
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartGrade" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card" v-if="tabType!==0">
        <div class="p-dataStatistics-title">
          性别
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartSex" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card" v-if="tabType!==0">
        <div class="p-dataStatistics-title">
          所在城市
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartCity" class="-p-c-content"></div>
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'
  import echarts from 'echarts'
  import dayjs from 'dayjs'
  // 引入柱状图
  import 'echarts/src/chart/pie';
  import "echarts/lib/chart/bar";
  import "echarts/lib/component/title";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/dataZoom";

  export default {
    name: 'userData',
    data() {
      return {
        tabType: 0,
        isFetching: false,
        gradeText: {
          '0': '幼儿园',
          '1': '一年级',
          '2': '二年级',
          '3': '三年级',
          '4': '四年级',
          '5': '五年级',
          '6': '六年级',
          '20': '初中',
          '100': '其他',
        },
        userRoleList: '',//角色分布
        userTagList: '',//兴趣爱好
        userCityList: '',//所在城市
        userSexList: '',//性别分布
        userGradeList: '',//年级分布
        userRelationList: '',//孩子关系
        userBesideList: '',//是否陪伴
      }
    },
    computed: {
      legendTagName() {
        let arrayX = []
        for (let item of this.userTagList) {
          arrayX.push(item.tagName || item.tag)
        }
        return arrayX
      },
      legendTagNum() {
        let arrayX = []
        for (let item of this.userTagList) {
          arrayX.push(item.count)
        }
        return arrayX
      },
      legendCityName() {
        let arrayX = []
        for (let item of this.userCityList) {
          arrayX.push(item.city)
        }
        return arrayX
      },
      legendCityNum() {
        let arrayX = []
        for (let item of this.userCityList) {
          arrayX.push(item.count)
        }
        return arrayX
      }
    },
    mounted() {
      this.getUserPortraintOverview()
    },
    methods: {
      changeTab() {
        if (this.tabType < 1) {
          this.getUserPortraintOverview()
        } else {
          this.getUserPortraintByRole()
        }
      },
      echartTagFn() {
        let myChart = echarts.init(this.$refs.echartOne);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {},
          xAxis: {
            data: this.legendTagName
          },
          yAxis: {
            name: '单位（人）'
          },
          series:[
            {
              type: 'bar',
              data: this.legendTagNum
            }
          ],
          color: ['#1890FF', '#F5222D', '#FAAD14'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      echartCityFn() {
        let myChart = echarts.init(this.$refs.echartCity);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {},
          xAxis: {
            data: this.legendCityName
          },
          yAxis: {
            name: '单位（人）'
          },
          series: [
            {
              type: 'bar',
              data: this.legendCityNum
            }
          ],
          color: ['#1890FF', '#F5222D', '#FAAD14'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      echartRoleFn() {
        let myChart = echarts.init(this.$refs.echartTwo);
        this.userRoleList.forEach(item=>{
          item.value = item.count
          item.name = `${item.roleName}：${item.count} (${item.percent}%)`
        })
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: this.userRoleList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#1890FF', '#FAAD14', '#52C41A'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      echartSexFn() {
        let myChart = echarts.init(this.$refs.echartSex);
        this.userSexList.forEach(item=>{
          item.value = item.count
          item.name = item.gender === 1 ? `男孩：${item.count} (${item.percent}%)` : item.gender === 2 ? `女孩：${item.count} (${item.percent}%)` : `其他：${item.count} (${item.percent}%)`
        })
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: this.userSexList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#FAAD14', '#52C41A'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      echartGradeFn() {
        let myChart = echarts.init(this.$refs.echartGrade);
        this.userGradeList.forEach(item=>{
          item.value = item.count
          item.name = `${this.gradeText[item.grade]}：${item.count} (${item.percent}%)`
        })
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: this.userGradeList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#1890FF', '#FAAD14', '#52C41A'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      echartRelationFn() {
        let myChart = echarts.init(this.$refs.echartRelation);
        this.userRelationList.forEach(item=>{
          item.value = item.count
          item.name = `${item.relationship}：${item.count} (${item.percent}%)`
        })
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: this.userRelationList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#1890FF', '#FAAD14', '#52C41A'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      echartBesideFn() {
        let myChart = echarts.init(this.$refs.echartBeside);
        this.userBesideList.forEach(item=>{
          item.value = item.count
          item.name = item.besideChild ? `是：${item.count} (${item.percent}%)` : `否：${item.count} (${item.percent}%)`
        })
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: this.userBesideList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#1890FF', '#FAAD14', '#52C41A'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      getUserPortraintOverview() {
        this.$api.hkywhdUserPortraint.getUserPortraintOverview()
          .then(
            response => {
              let dataInfo = response.data.resultData
              this.userRoleList = dataInfo.userRoleOverviewList;
              this.userTagList = dataInfo.userTagOverviewList;
              this.echartTagFn()
              this.echartRoleFn()
            })
      },
      getUserPortraintByRole() {
        this.$api.hkywhdUserPortraint.getUserPortraintByRole({
          role: this.tabType === 1 ? '家长' : this.tabType === 2 ? '老师' : '学生',
        })
          .then(
            response => {
              let dataInfo = response.data.resultData
              this.userTagList = dataInfo.userRoleTagList;
              this.userCityList = dataInfo.cityDistributedList;
              this.userSexList = dataInfo.genderDistributedList;
              this.userGradeList = dataInfo.gradeDistributedList;
              this.userRelationList = dataInfo.relationshipDistributedList;
              this.userBesideList = dataInfo.besideChildDistributedList;
              this.echartTagFn()
              this.echartCityFn()
              this.echartSexFn()
              this.tabType !== 0 && this.echartGradeFn()
              this.tabType === 1 && this.echartRelationFn()
              this.tabType === 1 && this.echartBesideFn()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-dataStatistics {
    &-tab {
      /*background-color: #ffffff;*/
    }

    &-title {
      display: flex;
      align-items: center;
      text-align: left;
      height: 22px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;

      &::before {
        margin-right: 16px;
        content: "";
        display: inline-block;
        background: #1890FF;
        width: 4px;
        height: 16px;
        border-radius: 2px;
      }
    }

    &-wrap {
      display: flex;
      flex-flow: wrap;
      margin-top: 25px;
    }

    &-echart {
      width: 100%;

      .-p-c-content {
        width: 100%;
        height: 350px;
        /*background-color: red;*/
        /*overflow: hidden;*/
      }
    }

    &-card {
      margin-bottom: 20px;
      margin-right: 20px;
      width: 30%;
    }
  }
</style>
