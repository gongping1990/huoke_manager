<template>
  <div class="p-img">
    <div v-if="courseType != '1'" :style="styles">
      <div v-if="dataProp.operate == '1'" class="-i-wrap" :class="{'-i-wrap-small':directEntry}"
           :style="{ background: 'url(' + imgUrlInfo.learn.bgImgUrl + ') no-repeat'}">
        <div class="-i-gif-img" v-if="imgUrlInfo.type == '1'"><img :src="imgUrlInfo.learn.tipcImgUrl"></div>
        <div class="-i-center" :class="{'-i-center-small': directEntry}">
          <img class="-i-gif" src="../assets/images/read-bg.png">
        </div>
      </div>

      <div v-else class="-i-wrap" :class="{'-i-wrap-small':directEntry}">
        <div class="-i-header">
          <img class="-i-img" src="../assets/images/topbar.png">
        </div>
        <div class="g-flex-a-j-center -i-title">
          <div>
            <img class="-i-title-img" src="../assets/images/questionTitle.png"/>
          </div>
          <div class="">
            问答：{{imgUrlInfo.question.question}}
          </div>
        </div>
        <div class="-i-banner">
          <img class="-i-banner-img" :src="imgUrlInfo.question.questionImgUrl"/>
        </div>
        <div class="-i-content">
          <div class="-i-content-wrap">
            <div class="-w-title">{{imgUrlInfo.question.singleAnswer ? '单项选择题' : '多项选择题'}}</div>
            <div class="-w-item-wrap">
              <div v-for="(item,index) in arraySelect" :key="index" class="-w-item">
                <div class="-item-padding">{{item.index}}</div>
                <div class="-item-padding -item-width">{{item.value}}</div>
                <div class="-item-check"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="-i-footer">
          <img class="-i-img" src="../assets/images/select-bar.png">
        </div>
      </div>
    </div>
    <div v-else class="-i-study" :style="styles">
      <!--<div class="-s-task"></div>-->
      <div class="-s-img"><img src="../assets/images/study-bg.png"></div>
      <div class="-s-wrap" :class="{'small-img': directEntry}"
           :style="{backgroundImage:'url(' + imgUrl + ')', backgroundRepeat:'no-repeat',  backgroundSize: 'cover'}">
        <div class="-s-name">{{lessonName}}</div>
        <div class="-s-head">学习目标</div>
        <div v-for="(list, index) of textList" :key="index" class="-s-list">
          . {{list.value}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'previewPictures',
    props: ['dataProp', 'courseType', 'styles', 'directEntry', 'imgUrl'], //courseType : 1为学习目标 ， 2为其他 /// directEntry: 是否是预览小图
    data() {
      return {
        // arraySelect: []
      }
    },
    computed: {
      lessonName() {
        return this.$route.query.lessonName
      },
      textList() {
        return this.dataProp
      },
      imgUrlInfo() {
        if (this.courseType != '1' && this.dataProp) {
          return this.dataProp
        } else {
          let params = {
            question: {}
          }
         return params
        }
      },
      arraySelect() {
        return (this.courseType != '1' && this.dataProp) && (this.dataProp.operate != '1' && JSON.parse(this.dataProp.question.answerItem))
      }
    },
    mounted() {

    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-img {
    position: relative;

    .-i-study {
      position: relative;
      /*background: url("../assets/images/study-bg.png") no-repeat;*/
      /*background-size: 100%;*/
      /*height: 545px;*/
    }

    .-i-wrap {
      position: relative;
      background-color: rgba(255, 250, 236, 1);
      background-size: 100% !important;
      height: 552px;

      .-i-gif-img{
        position: absolute;
        top: 100px;
        left: 25px;

        img {
          width: 110px;
        }
      }

      .-i-header {
        background-size: 100% !important;
      }

      .-i-title {
        font-weight: bold;
        font-size: 14px;
        margin: 0 20px;
        &-img {
          width: 40px;
          margin-right: 10px;
        }
      }
      .-i-banner {
        margin: 10px 20px 0;
        &-img {
          width: 100%;
          border-radius: 10px;
        }
      }

      .-i-content {
        position: absolute;
        bottom: 110px;
        width: 100%;
        display: flex;
        justify-content: center;

        .-w-title {
          background: url("../assets/images/select-title.png") no-repeat;
          background-size: 100%;
          width: 100%;
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          font-weight: bold;

          img {
            width: 100%;
          }
        }

        &-wrap {
          margin: 20px 20px 0;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 12px 0px rgba(160, 154, 131, 0.1);
          border-radius: 12px;
          font-size: 13px;
          text-align: left;
          width: 303px;

          .-w-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;

            img {
              width: 20px;
            }

            .-item-check {
              width: 20px;
              height: 20px;
              border: 2px solid rgba(153, 175, 182, 1);
              border-radius: 50%;
            }

            .-item-padding {
              padding: 0 10px;
            }

            .-item-width {
              width: 240px;
            }
          }
        }
      }

      .-i-footer {
        position: absolute;
        bottom: 0;
      }
      .-i-center {

        .-i-gif {
          width: 100%;
        }
      }

      .-i-img {
        width: 100%;
      }
    }

    .-i-wrap-small {
      height: 482px !important;

      .-i-gif-img{
        top: 90px;
        img{
          width: 90px;
        }
      }

      .-i-content {
        bottom: 77px;

        .-i-content-wrap {
          width: 260px;
        }

        .-item-check {
          height: 17px !important;
        }
      }
    }

    .-s-task {
      background-color: rgba(0, 0, 0, 0.1);
      height: 220px;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 2;
    }
    .-s-img {
      position: relative;
      z-index: 3;
      img {
        width: 100%;
      }
    }
    .-s-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      color: #ffffff;
      height: 255px;
      padding-left: 20px;
      padding-top: 40px;
      font-size: 12px;
      text-align: left;

      .-s-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .-s-head {
        margin-bottom: 6px;
      }

      .-s-list {
        padding: 1px;
      }
    }
    .small-img {
      height: 220px
    }
  }
</style>
