<template>
  <Modal
    class="p-job-model"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="1000"
    title="用户详情">
      <tbzw-user-info ref="modelUserInfo" :userId="dataInfo.uid" :sortNum="dataInfo.sortnum" :courseId="dataInfo.courseId"></tbzw-user-info>
  </Modal>
</template>

<script>
  import TbzwUserInfo from "../../tbzw/user/userInfo";
  export default {
    name: 'lookUserInfo',
    components: {TbzwUserInfo},
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
        localStorage.setItem('isJump', '1')
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
