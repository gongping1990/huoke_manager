<template>
  <Modal
    class="p-virtualUserTemplate"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="选择虚拟用户">
    <div class="p-virtualUserTemplate-content">
      <div v-for="(item, index) of dataList" :key="index" class="-content-item" @click="choiceUser(item)">
        <img class="-img" src="https://pub.file.k12.vip/2019/11/18/1196354701996023809.png"/>
        <div class="-name">{{item.name}}</div>
        <div class="-icon" v-if="item.isShow">
          <img src="../../../assets/images/suc-log.png"/>
        </div>

      </div>
    </div>
    <div slot="footer" class="-p-b-flex">
      <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
      <div @click="submitInfo()" class="g-primary-btn ">确 认</div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'virtualUserTemplate',
    props: ['value', 'dataInfo'],
    data() {
      return {
        isOpenDetail: false,
        dataList: [
          {
            name: '小专家说的就是我',
            isShow: false,
            id: 1
          },
          {
            name: 'hover小玲和',
            isShow: false,
            id: 2
          },
        ],
        choiceList: []
      }
    },
    mounted() {
    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        this.$previewRefresh()
      },
    },
    methods: {
      choiceUser(item) {
        item.isShow = !item.isShow
        // this.choiceList.push(item)
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      },
      submitInfo() {

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-virtualUserTemplate {

    &-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .-content-item {
        position: relative;
        text-align: center;
        width: 80px;
        padding: 10px;
        margin: 0 10px 10px;
        cursor: pointer;
        &:hover {
          background-color: rgba(43, 174, 233, 0.2);
        }

        .-img {
          cursor: pointer;
          margin: 0 auto;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .-name {
          margin-top: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .-icon {
          position: absolute;
          top: 0;
          right:  0;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: #2baee9;

          img {
            width: 100%;
          }
        }
      }
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-img {
      cursor: zoom-in;
      width: 200px;
      height: 100px;
      margin-right: 10px;
    }
  }
</style>
