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
        {{detailInfo.keyPoint || '暂无课时重点'}}
      </FormItem>
      <FormItem label="作业要求">
        {{detailInfo.homeworkClaim}}
      </FormItem>
      <FormItem label="优秀批改模板">
        <Radio-group v-model="nowType" type="button" @on-change="changeRadio">
          <Radio :label=item.workId v-for="(item,index) of templateList" :key="index">模板{{index+1}}</Radio>
        </Radio-group>

        <div class="p-jobRequire-work">
          <div>
            <span class="-work-name">{{dataItem.nickName}}的作业</span>
            <span class="-c-tips g-cursor" v-if="dataInfo.isRole" @click="moveTem">移出模板</span>
          </div>

          <div class="-audio" v-if="dataItem.workAudio">
            <audio ref="media"
                   :src="dataItem.workAudio"
                   controls="controls" preload="auto"></audio>
          </div>

          <div class="g-flex-a-j-center" v-if="dataItem.workImgSrc.length">
            <img class="-img" preview="0" v-for="(url,index) of dataItem.workImgSrc" :key="index" :src="url"/>
          </div>
        </div>

        <div class="p-jobRequire-work">
          <div class="-work-name">{{dataItem.replyTeacher}}批改</div>
          <div class="-text" v-if="dataItem.replyText">{{dataItem.replyText}}</div>
          <div class="-audio" v-if="dataItem.replyAudioAuthorUrl">
            <audio ref="media"
                   :src="dataItem.replyAudioAuthorUrl"
                   controls="controls" preload="auto"></audio>
          </div>
          <div class="g-flex-a-j-center" v-if="dataItem.replyImg.length">
            <img class="-img" preview="0" v-for="(url,index) of dataItem.replyImg" :key="index" :src="url"/>
          </div>
          <div class="p-jobRequire-wrap">
            <div class="p-jobRequire-wrap-left">
              <div>
                <div class="-left-item" v-for="(item1,index1) of dataItem.evaluateObj" :key="index1">
                  <span class="-left-item-span">{{item1.name}}: </span>
                  <span>{{item1.value}}</span>
                </div>
              </div>
            </div>

            <div class="p-jobRequire-wrap-right g-flex-a-j-center">
              <div ref="echarts" class="-echart"></div>
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
    data() {
      return {
        isOpenDetail: false,
        detailInfo: {},
        nowType: '',
        dataItem: {
          workImgSrc: [],
          replyImg: []
        },
        templateList: []
      }
    },
    mounted() {
    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        _n && this.getJobLogList()
        this.$previewRefresh()
      }
    },
    methods: {
      moveTem () {
        this.$emit('moveTem', {
          courseId: this.dataItem.courseId,
          workId: this.dataItem.workId,
          replyExample: this.dataItem.replyExample,
          isFromChild: true
        })
      },
      changeRadio() {
        this.templateList.forEach(item=>{
          if (item.workId === this.nowType) {
            this.dataItem = item
            this.drawLine()
          }
        })
      },
      getJobLogList() {
        let myChart = echarts.init(this.$refs.echarts);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        this.$api.jsdJob.getHomeWorkLogWapper({
          workId: this.dataInfo.workId,
          courseId: this.dataInfo.appId
        }).then(response => {
          this.detailInfo = response.data.resultData
          this.templateList = this.detailInfo.replyExample
          this.nowType = this.templateList.length ? this.templateList[0].workId : ''
          this.dataItem = this.templateList.length ? this.templateList[0] : ''
          if (this.templateList.length) {
            for (let item of this.templateList) {
              item.time = dayjs(+item.createTime).format('YYYY-MM-DD HH:mm')
              item.replyImg = item.replyImg ? item.replyImg.split(',') : []
              item.workImgSrc = item.workImgSrc ? item.workImgSrc.split(',') : []
              item.evaluateObj = []
              item.evaluateRadar = []

              if (item.evaluate.length) {
                item.evaluate.forEach(item1 => {
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
            this.$nextTick(()=>{
              this.drawLine()
            })
          }
          console.log(this.templateList, 111111)

        })
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      },
      drawLine() {
        let self = this;
        let myChart = echarts.init(this.$refs.echarts);
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
            indicator: this.dataItem.evaluateObj
          },
          series: {
            type: 'radar',
            data: [
              {
                value: this.dataItem.evaluateRadar,
                areaStyle: {
                  normal: {
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }
              }
            ]
          },
          color: ['#80CBC4']
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

  .p-jobRequire {

    &-work {
      margin-top: 20px;

      .-work-name {
        margin-right: 20px;
      }

    }

    &-wrap {
      display: flex;
      margin: 10px 0;

      &-left {
        width: 30%;
        display: flex;
        align-items: center;

        .-left-item {
          margin-bottom: 15px;
          display: flex;
          align-items: center;

          &-span {
            display: inline-block;
            text-align: right;
            width: 80px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
          width: 100%;
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
