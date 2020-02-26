<template>
  <Modal
    class="p-virtualUserTemplate"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="选择体验课老师">
    <div class="p-virtualUserTemplate-content">
      <div v-for="(item, index) of dataList" :key="index" class="-content-item" @click="choiceUser(item)">
        <img class="-img" :src="item.avatar"/>
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
    <loading v-if="isFetching"></loading>
  </Modal>
</template>

<script>
  import Loading from "../../../components/loading";

  export default {
    name: 'virtualTeacherTemplate',
    components: {Loading},
    props: ['value', 'propList', 'dataItem'],
    data() {
      return {
        isOpenDetail: false,
        isFetching: false,
        dataList: [],
        choiceList: []
      }
    },
    mounted() {
    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        this.$previewRefresh()
        _n && this.getList()
      },
    },
    methods: {
      choiceUser(item) {
        item.isShow = !item.isShow
        this.$forceUpdate()
      },
      getList() {
        this.isFetching = true
        this.$api.jsdKfteacher.selectTeacher({
          courseId: this.dataItem.courseId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;

              if (this.propList.length) {
                this.propList.forEach(list => {
                  this.dataList.forEach(item => {
                    if (list.id === item.id) {
                      item.isShow = true
                    }
                  })
                })
              } else {
                this.dataList.forEach(item => {
                  item.isShow = false
                })
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      },
      submitInfo() {
        this.choiceList = []
        this.dataList.forEach(item => {
          if (item.isShow) {
            this.choiceList.push(item)
          }
        })
        this.closeModal()
        this.$emit('changeUsers', this.choiceList)
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
        width: 120px;
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
          right: 0;
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
