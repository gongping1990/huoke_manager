<template>
  <div class="p-path">
    当前选择：
    <h5 v-if="routeParams.type== '2'">{{detailInfo.subject}} - {{detailInfo.columnName}}</h5>
    <h5 v-else>{{detailInfo.subject}} · {{detailInfo.grade}}（{{detailInfo.term}}）- {{detailInfo.teachEdition}}</h5>
  </div>
</template>

<script>
  export default {
    name: 'pathRecordSp',
    props: ['dataProp'],
    data() {
      return {
        routeParams: this.$route.query
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
