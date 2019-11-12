<template>
  <Modal
    class="p-jobRequire"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="600"
    title="作业要求">
    <Form ref="detailInfo" :model="detailInfo" :label-width="100">
      <FormItem label="课时重点">
        11111
      </FormItem>
      <FormItem label="作业要求">
        <p>{{dataInfo.homeworkRequire}}</p>
      </FormItem>
      <FormItem label="优秀批改模板">
        <Radio-group v-model="detailInfo.type" type="button" @on-change="changeRadio(item)">
          <Radio :label=item.id v-for="(item,index) of 5" :key="index">模板{{index+1}}</Radio>
        </Radio-group>

        <div class="p-jobRequire-work">
          <div>
            <span class="-work-name">{{'小林哥'}}的作业</span>
            <span class="-c-tips">移出模板</span>
          </div>
          <div class="-audio">
            <audio ref="media"
                   src=""
                   controls="controls" preload="auto"></audio>
          </div>
          <div class="g-flex-a-j-center">
            <img class="-img" preview="0" v-for="url of 2" :src="url"/>
          </div>
        </div>

        <div class="p-jobRequire-work">
          <div>
            <span class="-work-name">{{'赵老师'}}批改</span>
          </div>
          <div class="-text">{{'小朋友你说的非常好'}}</div>
          <div class="-audio">
            <audio ref="media"
                   src=""
                   controls="controls" preload="auto"></audio>
          </div>
          <div class="g-flex-a-j-center">
            <img class="-img" preview="0" v-for="url of 2" :src="url"/>
          </div>
          <div class="p-jobRequire-wrap">
            <div class="p-jobRequire-wrap-left">
              <div>
                <div class="-left-item" v-for="(item1,index1) of 5" :key="index1">
                  <span class="-left-item-span">{{item1.name}}: </span>
                  <span>{{item1.value}}</span>
                </div>
              </div>
            </div>
            <div class="p-jobRequire-wrap-right">
              <div :id="'item'+index1" class="-echart" ></div>
            </div>
          </div>
        </div>
      </FormItem>
    </Form>
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
  name: 'jobRequireTemplate',
  props: ['value', 'dataInfo', 'type'],
  data () {
    return {
      isOpenDetail: false,
      detailInfo: {
        type: 1
      },
      templateList: [
        {
          id: 1,
          name: '模板'
        },
        {
          id: 2,
          name: '模板'
        },
        {
          id: 3,
          name: '模板'
        },
        {
          id: 4,
          name: '模板'
        }
      ],
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
      console.log(this.dataInfo,11)
    }
  },
  methods: {
    changeRadio () {

    },
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

  .p-jobRequire{

    &-work {
      margin-top: 20px;

      .-work-name{
        margin-right: 20px;
      }

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
      margin-top: 10px;
      width: 120px;
      height: 100px;
      margin-right: 10px;
    }

    .-audio {
      margin: 10px 0;
    }

    .-c-tips {
      color: #39f
    }

  }
</style>
