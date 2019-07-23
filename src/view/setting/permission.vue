<template>
  <Modal
    class="p-permission"
    v-model="isOpenModal"
    @on-cancel="closeModal('addInfo')"
    width="900"
    title="设置权限">
    <RadioGroup v-model="radioType" @on-change="getList" type="button">
      <Radio :label="item.id" v-for="(item,index) of systemList" :key="index">{{item.name}}</Radio>
    </RadioGroup>

    <div class="p-permission-tree -c-tab" v-for="(list,index) of dataList" :key="index">
      <div class="-name">{{list.name}}</div>
      <div class="g-flex-a-j-center">
        <div class="-c-item" :label="data.id" v-for="(data,index1) in list.child" :key="index1">
          <span class="-c-item-check" :class="{'-c-item-active': data.checked}" @click="changeChecked(data)">
             <Icon v-if="data.checked" type="ios-checkmark" color="#ffffff" size="18"/>
          </span>
          <span class="-c-item-name">{{data.name}}</span>
        </div>
      </div>
    </div>

    <div class="-c-tab g-t-center" v-if="!dataList.length">暂无权限列表</div>

    <div slot="footer" class="-p-s-footer">
      <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
      <div @click="submitAdmin('addInfo')" class="g-primary-btn ">确 认</div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'usePermission',
    props: ['roleId'],
    data() {
      return {
        radioType: 1,
        dataList: [],
        systemList: [],
        checkCourseIds: [],
        isFetching: false,
        isOpenModal: true,
      };
    },
    mounted() {
      this.getList()
      this.getRoleList()
    },
    methods: {
      changeChecked (data) {
        data.checked = !data.checked
        this.$forceUpdate()
      },
      closeModal() {
        this.isOpenModal = false
        this.$emit('changeModal', false)
      },
      getList() {
        this.isFetching = true
        this.$api.admin.listChecked({
          system: this.radioType,
          roleId: this.roleId
        })
          .then(
            response => {
              this.dataList = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getRoleList() {
        this.isFetching = true
        this.$api.admin.listBizSystem()
          .then(
            response => {
              this.systemList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitAdmin(name) {
        let array = ''
        for (let item of this.dataList) {
          for (let data of item.child) {
            if(data.checked) {
              this.checkCourseIds.push(data.id)
            }
          }
        }
        array = `${this.checkCourseIds}`

        this.$api.admin.updateRoleMenu({
          roleId: this.roleId,
          menuIds: array
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal(name)
              }
            })
          .finally(() => {
            this.isSending = false
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .p-permission {
      height: 500px;
    &-title {
      font-size: 18px;
      font-weight: bold;
    }

    &-tree {
      .-name{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .-c-item {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 10px 15px 10px 0;

        &-check {
          display: inline-block;
          width: 15px;
          height: 15px;
          border: 1px solid #dcdee2;
          margin-right: 6px;
        }

        &-active {
          display: flex;
          justify-content: center;
          align-items: center;
          border-color: #2f54eb;
          background-color: #2f54eb;
        }
      }
    }
    .-p-s-footer {
      display: flex;
      /*text-align: center;*/
      justify-content: space-around;
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
