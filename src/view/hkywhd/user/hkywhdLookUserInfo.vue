<template>
  <Modal
    class="p-job-model"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="1000"
    title="用户详情">
    <hkywhd_user-info ref="modelUserInfo" :userId="dataInfo.userId"></hkywhd_user-info>
  </Modal>
</template>

<script>
  import Hkywhd_userInfo from "./userInfo";
  export default {
    name: 'hkywhdLookUserInfo',
    components: {Hkywhd_userInfo},
    props: ['value', 'dataInfo'],
    data () {
      return {
        isOpenDetail: false,
      }
    },
    mounted() {
    },
    watch: {
      value (_n) {
        this.isOpenDetail = _n
      },
      dataInfo (_n) {
        setTimeout(()=>{
          this.$refs.modelUserInfo.listBase()
        })
      }
    },
    methods: {
      closeModal () {
        this.isOpenDetail = false
        this.$emit('input', false)
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .p-loading{
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
