<template>
  <Modal
    class="p-jobRecord"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="700"
    title="作业记录">
    <Timeline v-if="recordList.length">
      <TimelineItem v-for="(item,index) of recordList" :key="index">
        <div>{{item.time}} &emsp; {{item.uname}}</div>
        <div class="-text" v-if="item.replyText">{{item.replyText}}</div>
        <div class="-audio" v-if="item.audio">
          <audio ref="media"
                 :src="item.audio"
                 controls="controls" preload="auto"></audio>
        </div>
        <div class="g-flex-a-j-center">
          <img class="-img" preview="0" v-for="url of item.img" :src="url"/>
        </div>
        <div class="p-jobRecord-wrap" v-if="item.evaluate.length">
          <div class="p-jobRecord-wrap-left">
            <div>
              <div class="-left-item" v-for="(item1,index1) of item.evaluateObj" :key="index1">
                <span class="-left-item-span">{{item1.name}}: </span>
                <span>{{item1.value}}</span>
              </div>
            </div>
          </div>
          <div class="p-jobRecord-wrap-right">
            <div :id="'item'+index" class="-echart" ></div>
          </div>
        </div>
      </TimelineItem>
    </Timeline>
    <div class="p-jobRecord-noText" v-else>暂无作业记录~</div>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  import echarts from "echarts/lib/echarts";
  import "echarts/lib/chart/radar";
  import "echarts/lib/component/title";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/tooltip";
export default {
  name: 'jobRecordTemplate',
  props: ['value', 'dataInfo', 'type'],
  data () {
    return {
      isOpenDetail: false,
      recordList: []
    }
  },
  mounted() {

  },
  watch: {
    value (_n) {
      this.isOpenDetail = _n
      _n && this.getJobLogList()
      this.$previewRefresh()
    }
  },
  methods: {
    getJobLogList() {
      let paramUrl = ''
      switch (+this.type) {
        case 2:
          paramUrl =   this.$api.jsdJob.listHomeWorkLogByLesson({
            uid: this.dataInfo.uid,
            lessonId: this.dataInfo.lessonId,
            courseId: this.dataInfo.appId,
          })
          break
        default:
          paramUrl =  this.$api.jsdJob.listHomeWorkLog({
            workId: this.dataInfo.workId,
            courseId: this.dataInfo.appId,
          })
      }
      paramUrl.then(response => {
        this.recordList = response.data.resultData
        for (let item of this.recordList) {
          item.time = dayjs(+item.createTime).format('YYYY-MM-DD HH:mm')
          item.img = item.img ? item.img.split(',') : []
          item.evaluateObj = []
          item.evaluateRadar = []

          if(item.evaluate.length) {
            console.log(1)
            item.evaluate.forEach(item1=>{
              let array = item1.split('=')
              item.evaluateObj.push({
                name: array[0],
                value: array[1],
                max: 100
              })
              item.evaluateRadar.push(array[1])
            })
          }
        }
        console.log(this.recordList,111111)
        this.$nextTick(()=>{
          if(this.type != '2') {
            this.recordList.forEach((item,index)=>{
              if(item.evaluate.length) {
                this.drawLine(`item${index}`, item)
              }
            })
          }
        })
      })
    },
    closeModal () {
      this.isOpenDetail = false
      this.$emit('input', false)
    },
    drawLine(name, item) {
      let self = this;
      let myChart = echarts.init(document.getElementById(name));
      myChart.clear();
      myChart.resize();
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(114, 172, 209, 0.2)',
                'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10
            }
          },
          radius: 70,
          indicator: item.evaluateObj
        },
        series: {
          type: 'radar',
          data: [
            {
              value : item.evaluateRadar,
              areaStyle: {
                normal: {
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }
            }
          ]
        },
        color: [ '#80CBC4']
      })

      window.addEventListener("resize", () => {
        myChart.resize();
      });
      myChart.hideLoading()
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-jobRecord{


    &-noText {
      text-align: center;
      margin: 10px 0;
    }

    &-wrap {
      display: flex;
      margin: 10px 0;

      &-left {
        width: 20%;
        display: flex;
        align-items: center;

        .-left-item {
          margin-bottom: 15px;

          &-span {
            display: inline-block;
            text-align: right;
            width: 80px ;
            margin-right: 10px;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      &-right {
        width: 80%;

        .-echart {
          width: 300px;
          height: 230px;
        }
      }
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

    .-img {
      cursor: zoom-in;
      margin-top: 20px;
      width: 120px;
      height: 100px;
      margin-right: 10px;
    }

    .-audio {
      margin: 10px 0;
    }

  }
</style>
