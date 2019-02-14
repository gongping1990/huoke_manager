<template>
  <Modal
    class="p-switchingSystem"
    v-model="isOpenModal"
    @on-cancel="closeModal()"
    width="350"
    title="切换系统">
    <Form ref="changePswForm" :label-width="70">
      <FormItem label="当前系统" prop="password">
        {{adminType[systemType]}}
      </FormItem>
      <FormItem label="切换系统" prop="password">
        <Radio-group v-model="radioType" type="button">
          <Radio label= '1'>获课学堂</Radio>
          <Radio label= '2'>获课语文</Radio>
        </Radio-group>
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
        systemType: localStorage.nowSystem,
        radioType: localStorage.nowSystem,
        adminType: {
          '1': '获课学堂',
          '2': '获课语文'
        },
      }
    },
    mounted() {
      this.isOpenModal = true
    },
    methods: {
      closeModal() {
        this.$emit('closePwdModal')
      },
      submitPwd() {
        this.$store.commit('changeSystem', this.radioType)
        localStorage.nowSystem = this.radioType
        this.closeModal()
        console.log(this.$store.state.nowAdminType,localStorage.nowSystem,'改变')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .p-switchingSystem{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255,255,255,0.3)
  }
</style>
