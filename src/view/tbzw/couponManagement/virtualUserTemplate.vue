<template>
  <Modal
    class="p-virtualUserTemplate"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="选择虚拟用户">
    <div class="p-virtualUserTemplate-content">
      <div v-for="(item) of 20" class="-content-item" :class="{'-active': item.isShow}" @click="choiceUser(item)">
        <img class="-img" src="https://pub.file.k12.vip/2019/11/18/1196354701996023809.png"/>
        <div class="-name">小语专家说的就是我</div>
        <div>
          <Icon type="md-checkmark" />
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
  data () {
    return {
      isOpenDetail: false,
      dataList: [],
      choiceList: []
    }
  },
  mounted() {
  },
  watch: {
    value (_n) {
      this.isOpenDetail = _n
      this.$previewRefresh()
    },
  },
  methods: {
    choiceUser (item) {
      item.isShow = !item.isShow
      // this.choiceList.push(item)
    },
    closeModal () {
      this.isOpenDetail = false
      this.$emit('input', false)
    },
    submitInfo () {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-virtualUserTemplate{

    &-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;


      .-content-item {
        text-align: center;
        width: 80px;
        margin: 0 10px 10px;
        cursor: pointer;
        &:hover {
          background-color: rgba(43,174,233, 0.2);
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
      }

      .-active {

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
