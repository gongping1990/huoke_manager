<template>
  <Modal
    class="p-img"
    v-model="isOpenModal"
    @on-cancel="closeModal"
    :footer-hide="true"
    width="500"
    :styles="{top: '20px'}"
    title="预览关卡">
    <div v-if="courseType != '1'">
      <div v-if="dataInfo.operate == '1'" class="-i-wrap" style=""
           :style="{ background: 'url(' + imgUrlInfo.backImg + ') no-repeat'}">
        <div>
          <img class="-i-img" src="../assets/images/topbar.png">
        </div>
        <div class="-i-center">
          <img class="-i-gif" :src="imgUrlInfo.gifImg">
        </div>
        <div class="-i-footer">
          <img class="-i-img" src="../assets/images/bottombar.png"/>
        </div>
      </div>
      <div v-else class="-i-wrap">
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
            <div v-for="(item,index) in arraySelect" :key="index" class="-w-item">
              <div class="-item-padding">{{item.index}}</div>
              <div class="-item-padding -item-width">{{item.value}}</div>
              <div class="-item-padding"><img src="../assets/images/select-check.png"/></div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-else class="-i-study">
      <div class="-s-wrap">
        <div v-for="(list, index) of arraySelect" :key="index" class="-s-list">
          <div v-for="(item ,index1) of list" :key='index1' class="-s-item">
            <div class="-s-item-num">{{item.id}}.</div>
            <div class="-s-item-text">{{item.value}}</div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>

  export default {
    name: 'previewPictures',
    props: ['dataProp', 'courseType'], //courseType : 1为学习目标 ， 2为其他
    data() {
      return {
        isOpenModal: false,
        imgUrlInfo: '',
        arraySelect: [],
        dataInfo: this.dataProp
      }
    },
    mounted() {
      if (this.courseType != '1') {
        this.imgUrlInfo = JSON.parse(this.dataInfo.content)
        this.arraySelect = this.dataInfo.operate != '1' && JSON.parse(this.dataInfo.topicOption)
      } else {
        let len = this.dataProp.length;
        let lineNum = len % 2 === 0 ? len / 2 : Math.floor((len / 2) + 1);
        for (let i = 0; i < lineNum; i++) {
          // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
          let temp = this.dataProp.slice(i * 2, i * 2 + 2);
          this.arraySelect.push(temp);
        }
      }
      this.isOpenModal = true
    },
    methods: {
      closeModal() {
        this.$emit('closePreviewModal')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-img {

    .-i-study {
      background: url("../assets/images/study-bg.png") no-repeat;
      background-size: 100%;
      height: 742px;
    }

    .-i-wrap {
      position: relative;
      background-size: 100% !important;
      height: 742px;

      .-i-header {
        background-size: 100% !important;
        height: 245px;
      }

      .-i-content {
        width: 100%;
        display: flex;
        justify-content: center;

        &-wrap {
          position: absolute;
          bottom: 140px;
          z-index: 99;
          width: 400px;
          padding: 30px;
          /*margin: 10px;*/
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 24px 0px rgba(225, 216, 186, 0.3);
          border-radius: 32px;
          font-size: 16px;
          text-align: left;

          .-w-title {
            position: absolute;
            top: -60px;
            left: 140px;

            img {
              width: 110px;
            }
          }

          .-w-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;

            img {
              width: 30px;
            }

            .-item-padding {
              padding: 0 10px;
            }

            .-item-width{
              width: 240px;
            }
          }
        }
      }

      .-i-center {
        display: inline-block;
        position: absolute;
        left: 50px;
        top: 192px;
        width: 88px;

        .-i-gif {
          width: 100%;
        }
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
      top: 200px;
      left: 87px;
      font-size: 13px;

      .-s-list {
        padding: 4px;
      }

      .-s-list:last-child{
        margin-left: 10px;
      }

      .-s-item {
        display: flex;
        /*justify-content: space-around;*/
        height: 80px;
        width: 150px;

        &-num{
          display: inline-block;
          width: 10%;
        }

        &-text {
          display: inline-block;
          width: 80%;
          margin-left: 10px;
          word-wrap: break-word;
        }
      }
    }

    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

  }
</style>
