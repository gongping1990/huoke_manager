<template>
  <Modal
    class="p-switchingSystem"
    v-model="isOpenModal"
    @on-cancel="closeModal()"
    width="300"
    title="切换系统">
    <Form ref="changePswForm" :label-width="70">
      <FormItem label="当前系统" prop="password">
        {{systemName}}
      </FormItem>
      <FormItem label="切换系统" prop="password">
        <Select v-model="radioType">
          <Option v-for="(item,index) of adminType" :key="index" :label=item.name :value=item.sort></Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer" class="g-flex-j-sa">
      <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitPwd()" class="g-primary-btn ">确 认</div>
    </div>
  </Modal>
</template>

<script>

  export default {
    name: 'switchingSystem',
    data() {
      return {
        isOpenModal: false,
        systemName: '',
        radioType: +localStorage.nowSystem,
        adminType: []
      }
    },
    mounted() {
      this.getRoleList()
      this.isOpenModal = true
    },
    methods: {
      closeModal() {
        this.$emit('closePwdModal')
      },
      getRoleList() {
        let nowId = localStorage.nowSystem
        this.$api.admin.listBizSystem()
          .then(
            response => {
              this.adminType = response.data.resultData;
              this.systemName = this.adminType[nowId].name
            })
      },
      submitPwd() {
        this.$store.commit('changeSystem', this.radioType)
        localStorage.nowSystem = this.radioType
        this.closeModal()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .p-switchingSystem {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.3)
  }
</style>
