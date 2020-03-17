<template>
  <div>
    <Modal title="订阅消息"
           class="p-subscriptionMessage"
           v-model="isOpenModal"
           width="900"
           @on-cancel="closeModal()">
      <Form :model="addInfo" :label-width="80">
        <FormItem label="选择用户">
          <Button @click="openUserModal()" ghost type="primary" style="width: 100px;">+添加用户</Button>
          <p class="-c-tips">
            添加为订阅用户后，这些用户将会在“乐小狮大语文”公众号收到用户的完课消息通知<span v-if="type == '1'">和作业批改消息通知</span>
          </p>
        </FormItem>
        <FormItem label="用户列表">
          <div class="p-subscriptionMessage-formUser">
            <div class="-formUser-item" v-for="(item,index) of userImgList" :key="index">
              <img class="-img" :src="item.headimgurl"/>
              <div class="-name">{{item.nickname}}</div>
              <Icon class="-icon" size="20" type="ios-close" @click="delList(index)"/>
            </div>
            <div v-if="!userImgList.length">暂无用户</div>
          </div>
        </FormItem>
      </Form>

      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitLevel()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <Modal title="添加用户"
           class="p-subscriptionMessage"
           v-model="isOpenModalUser"
           width="500"
           @on-cancel="isOpenModalUser = false">

      <Form :model="addInfo" :label-width="80">
        <FormItem label="手机号码">
          <Input v-model="searchInfo.phone" search placeholder="请输入手机号码" icon="ios-search"
                 @on-click="searchData"></Input>
        </FormItem>
        <FormItem label="搜索结果">
          <div class="p-subscriptionMessage-formUser" v-if="resultInfo">
            <div class="-formUser-item">
              <img class="-img" :src="resultInfo.headimgurl"/>
              <div class="-name">{{resultInfo.nickname}}</div>
            </div>
          </div>
          <div v-else>暂无搜索到用户信息</div>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalUser = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="addUser()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'subscriptionMessageTemplate',
    props: ['dataItem', 'value', 'type'],
    data() {
      return {
        isOpenModal: false,
        isOpenModalUser: false,
        addInfo: {},
        searchInfo: {},
        resultInfo: '',
        userImgList: []
      }
    },
    watch: {
      value(_n, _o) {
        this.isOpenModal = _n
        if (_n) {
          this.userImgList = JSON.parse(JSON.stringify(this.dataItem.linkusers))
        }
      },
    },
    mounted() {

    },
    methods: {
      searchData() {
        if (!this.searchInfo.phone) {
          return this.$Message.error('请输入手机号码')
        }
        this.$api.tbzwUser.getUserByPhone({
          phone: this.searchInfo.phone
        })
          .then(response => {
            this.resultInfo = response.data.resultData;
            if(!this.resultInfo ) {
              this.$Message.info('暂无搜索到用户信息')
            }
          })
          .finally(() => {
            this.isFetching = false
          })
      },
      openUserModal() {
        this.isOpenModalUser = true
        this.resultInfo = ''
        this.searchInfo = {}
      },
      submitLevel() {
        let paramsUrl = ''
        let ids = []
        this.userImgList.forEach(item => {
          ids.push(item.userId)
        })
        paramsUrl = this.type == '1' ? this.$api.jsdKfteacher.bindUser : this.$api.jsdTeacher.bindUser
        paramsUrl({
          id: this.dataItem.id,
          uids: ids.toString()
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.closeModal();
            }
          })
      },
      delList(index) {
        this.userImgList.splice(index, 1)
      },
      addUser() {
        if (!this.resultInfo) return
        this.isOpenModalUser = false
        this.userImgList.push(this.resultInfo)
      },
      closeModal() {
        this.$emit('input')
        this.isOpenModal = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-subscriptionMessage {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }
    .-c-tips {
      color: #39f
    }
    &-formUser {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .-formUser-item {
        position: relative;
        text-align: center;
        width: 80px;
        /*padding: 0 10px 0 0;*/
        /*cursor: pointer;*/

        &:hover {
          background-color: rgba(43, 174, 233, 0.2);
        }

        .-img {
          cursor: pointer;
          margin: 10px auto 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .-name {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          height: 20px;
          line-height: 20px;
        }

        .-icon {
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }
      }
    }
  }
</style>
