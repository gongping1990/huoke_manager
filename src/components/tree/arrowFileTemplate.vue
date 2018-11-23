<template>
  <div class="p-c-arrow">
    <div class="-c-a-flex -t-float" >
      <div class="-c-a-flex" @click="openNextChild">
        <Icon v-if="!isShow && sort != '3' && sort!=1" type="md-arrow-dropright" size="20"/>
        <Icon v-if="isShow && sort != '3' && sort!=1" type="md-arrow-dropdown" size="20"/>
        <img class="-t-img" v-if="sort != '3' && !isShow" src="../../assets/images/tree-file-close.png">
        <img class="-t-img" v-if="sort != '3' && isShow " src="../../assets/images/tree-file.png">
        <img class="-t-img" v-if="sort == '3'" src="../../assets/images/tree-text.png">
      </div>
      <div class="-t-name">{{title}} <span v-if="pinyin">({{pinyin}})</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'arrowFile',
  props: ['nodeData', 'nodePinyin', 'sort'],
  data () {
    return {
      isShow: false
    }
  },
  computed: {
    title () {
      return this.nodeData.name
    },
    pinyin () {
      return this.nodePinyin
    }
  },
  mounted () {
    if(localStorage.chapterId == this.nodeData.id) {
      this.isShow = true
    }
  },
  methods: {
    openNextChild () {
      this.isShow = !this.isShow
      this.$emit('openChildData')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-c-arrow{
    .-c-a-flex {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .-t-name{
      margin-left: 15px;
    }

    .-t-float {
      float: left;
    }

    .-t-img {
      width: 24px;
      height: 18px
    }
  }
</style>
