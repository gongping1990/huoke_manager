<template>
  <div class="p-img">
    <div v-if="courseType != '1'" :style="styles">
      <div v-if="dataProp.operate == '1'" class="-i-wrap" :class="{'-i-wrap-small':directEntry}"
           :style="{ background: 'url(' + imgUrlInfo.backImg + ') no-repeat'}">
        <div>
          <img class="-i-img" src="../assets/images/topbar.png">
        </div>
        <div class="-i-center" :class="{'-i-center-small': directEntry}">
          <img class="-i-gif" :src="imgUrlInfo.gifImg">
        </div>
        <div class="-i-footer">
          <img class="-i-img" src="../assets/images/bottombar.png"/>
        </div>
      </div>

      <div v-else class="-i-wrap" :class="{'-i-wrap-small':directEntry}">
        <div class="-i-header"
             :style="{ 'background': 'url(' + imgUrlInfo.stemImg + ') no-repeat', 'background-size': '100%'}">
          <img class="-i-img" src="../assets/images/topbar.png">
        </div>
        <div class="-i-footer">
          <img class="-i-img" src="../assets/images/select-bar.png">
        </div>

        <div class="-i-content">

          <div class="-i-content-wrap">
            <div class="-w-title"><img src="../assets/images/select-title.png"/></div>
            <div class="-w-item-wrap">
              <div v-for="(item,index) in arraySelect" :key="index" class="-w-item">
                <div class="-item-padding">{{item.index}}</div>
                <div class="-item-padding -item-width">{{item.value}}</div>
                <div class="-item-padding"><img src="../assets/images/select-check.png"/></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="-i-study" :style="styles">
      <div class="-s-wrap" :class="{'small-img': directEntry}">
        <div v-for="(list, index) of textList" :key="index" class="-s-list">
          <div v-for="(item ,index1) of list" :key='index1' class="-s-item">
            <div class="-s-item-num">{{item.id}}.</div>
            <div class="-s-item-text">{{item.value}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'previewPictures',
    props: ['dataProp', 'courseType', 'styles', 'directEntry'], //courseType : 1为学习目标 ， 2为其他 /// directEntry: 是否是预览小图
    data() {
      return {
        // arraySelect: []
      }
    },
    computed: {
      textList() {
        return this.initData()
      },
      imgUrlInfo() {
        return (this.courseType != '1' && this.dataProp) && JSON.parse(this.dataProp.content)
      },
      arraySelect() {
        return (this.courseType != '1' && this.dataProp) && (this.dataProp.operate != '1' && JSON.parse(this.dataProp.topicOption))
      }
    },
    mounted() {

    },
    methods: {
      initData() {
        let array = []
        let len = this.dataProp.length;
        let lineNum = len % 2 === 0 ? len / 2 : Math.floor((len / 2) + 1);
        for (let i = 0; i < lineNum; i++) {
          // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
          let temp = this.dataProp.slice(i * 2, i * 2 + 2);
          array.push(temp);
        }
        return array
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-img {

    .-i-study {
      position: relative;
      background: url("../assets/images/study-bg.png") no-repeat;
      background-size: 100%;
      height: 545px;
    }

    .-i-wrap-small {
      height: 500px !important;
    }
    .-i-wrap {
      position: relative;
      background-size: 100% !important;
      height: 545px;

      .-i-header {
        background-size: 100% !important;
        height: 245px;
      }

      .-i-content {
        width: 100%;
        display: flex;
        justify-content: center;

        .-w-title {
          position: absolute;
          top: -40px;
          left: 90px;
          z-index: 2;

          img {
            width: 90px;
          }
        }

        &-wrap {
          position: absolute;
          bottom: 100px;
          width: 270px;
          padding: 6px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 24px 0px rgba(225, 216, 186, 0.3);
          border-radius: 32px;
          font-size: 13px;
          text-align: left;


          .-w-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;

            img {
              width: 20px;
            }

            .-item-padding {
              padding: 0 10px;
            }

            .-item-width {
              width: 240px;
            }
          }
        }

        .-w-item-wrap {
          max-height: 260px;
          overflow-y: auto;
          margin-top: 30px;
        }
      }

      .-i-center {
        display: inline-block;
        position: absolute;
        left: 36px;
        top: 118px;
        width: 84px;

        .-i-gif {
          width: 100%;
        }
      }

      .-i-center-small {
        width: 62px;
      }

      .-i-footer {
        position: absolute;
        bottom: 0;
      }

      .-i-img {
        width: 100%;
      }
    }

    .-s-wrap {
      display: flex;
      position: absolute;
      top: 78px;
      left: 53px;
      font-size: 12px;

      .-s-list {
        padding: 4px;
      }

      .-s-list:last-child {
        margin-left: 10px;
      }

      .-s-item {
        display: flex;
        /*justify-content: space-around;*/
        height: 74px;
        width: 107px;

        &-num {
          display: inline-block;
          width: 10%;
        }

        &-text {
          display: inline-block;
          width: 80%;
          margin-left: 6px;
          word-wrap: break-word;
          text-align: left;
        }
      }
    }

    .small-img {
      top: 74px;
      left: 40px;

      .-s-list {
        padding: 0;
      }

      .-s-list:last-child {
        margin-left: 6px;
      }

      .-s-item {
        height: 60px;
      }
    }
  }
</style>
