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
    <p class="p-permission-title -c-tab">权限模块</p>
    <Checkbox-group v-model="checkCourseIds" class="p-permission-tree -c-tab" v-for="(list,index) of dataList"
                    :key="index">
      <Checkbox class="-c-item" :label="data.code" v-for="(data,index1) in list.permissions" :key="index1">
        {{data.desc}}
      </Checkbox>
    </Checkbox-group>

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
      closeModal() {
        this.isOpenModal = false
        this.$emit('changeModal', false)
      },
      getList() {
        this.isFetching = true
        this.$api.admin.permissionsList({
          roleId: this.roleId,
          system: this.radioType
        })
          .then(
            response => {
              this.dataList = response.data.resultData

              for (let item of this.dataList[0].permissions) {
                if(item.checked) {
                  this.checkCourseIds.push(item.code)
                }
              }

              console.log( this.checkCourseIds,11)
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
        let array = `${this.checkCourseIds}`
        this.$api.admin.updateRolePerm({
          roleId: this.roleId,
          codes: array
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

    &-title {
      font-size: 18px;
      font-weight: bold;
    }
    &-tree {
      .-c-item {
        display: inline-block;
        width: 48%;
        padding: 10px 0;
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
