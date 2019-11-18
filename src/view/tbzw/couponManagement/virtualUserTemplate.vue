<template>
  <Modal
    class="p-virtualUserTemplate"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    width="750"
    title="选择虚拟用户">

  </Modal>
</template>

<script>
export default {
  name: 'virtualUserTemplate',
  props: ['value', 'dataInfo'],
  data () {
    return {
      isOpenDetail: false,
      dataList: []
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
    closeModal () {
      this.isOpenDetail = false
      this.$emit('input', false)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-virtualUserTemplate{

    .-img {
      cursor: zoom-in;
      width: 200px;
      height: 100px;
      margin-right: 10px;
    }
  }
</style>
