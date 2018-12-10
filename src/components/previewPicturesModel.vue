<template>
  <Modal
    v-model="isOpenModal"
    @on-cancel="closePreviewModel"
    :footer-hide="true"
    width="375"
    :styles="{'top': '20px'}"
    title="预览关卡">
    <preview-pictures :dataProp="dataProp" :courseType="courseType"></preview-pictures>
  </Modal>
</template>

<script>

  import PreviewPictures from "./previewPictures";
  export default {
    name: 'previewPicturesModel',
    components: {PreviewPictures},
    props: ['dataProp', 'courseType'], //courseType : 1为学习目标 ， 2为其他
    data() {
      return {
        isOpenModal: false
      }
    },
    mounted() {
      this.isOpenModal = true
    },
    methods: {
      closePreviewModel() {
        this.$emit('closePreviewFirst')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
