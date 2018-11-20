<template>
  <Modal
    class="p-img"
    v-model="isOpenModal"
    @on-cancel="closeModal"
    :footer-hide="true"
    width="500"
    :styles="{top: '20px'}"
    title="预览关卡">
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
          <div><img src="../assets/images/select-title.png"/></div>
          <div v-for="(item,index) in arraySelect" :key="index" class="-w-item">
            <div class="-item-padding">{{item.index}}</div>
            <div class="-item-padding">{{item.value}}</div>
            <div class="-item-padding"><img src="../assets/images/select-check.png"/></div>
          </div>
        </div>
      </div>

    </div>
  </Modal>
</template>

<script>

  export default {
    name: 'previewPictures',
    props: ['dataProp'],
    data() {
      return {
        isOpenModal: false,
        imgUrlInfo: '',
        arraySelect: [],
        dataInfo: this.dataProp
      }
    },
    mounted() {

      this.imgUrlInfo = JSON.parse(this.dataInfo.content)
      this.arraySelect = this.dataInfo.operate != '1' && JSON.parse(this.dataInfo.topicOption)
      this.isOpenModal = true
      console.log(this.arraySelect)
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

          .-w-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;

            img{
              width: 30px;
            }

            .-item-padding{
              padding: 0 10px;
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
    }
    .-i-img {
      width: 100%;
    }

    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

  }
</style>
