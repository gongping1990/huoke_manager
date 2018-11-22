<template>
  <div class="p-path">
    当前选择：<h5>
    <span v-if="detailInfo.chapterName && routeUrl != '/teachMain'">{{detailInfo.lessonName}} · {{detailInfo.chapterName}} · </span>
    {{detailInfo.courseName}} · {{detailInfo.gradeText}}（{{detailInfo.semesterText}}）- {{detailInfo.editionText}}</h5>
  </div>
</template>

<script>
  export default {
    name: 'pathRecord',
    props: ['dataProp'],
    data() {
      return {
        routeUrl: this.$route.path
      }
    },
    computed: {
      detailInfo() {
        return this.dataProp
      }
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-path {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
