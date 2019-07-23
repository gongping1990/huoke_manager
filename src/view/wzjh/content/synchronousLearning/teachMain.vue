<template>
  <div class="p-teachMain">
    <Card>
      <Row class="-t-header" style="height: 100%">
        <Col :span="24">
          <path-record-sp :data-prop="detailInfo"></path-record-sp>
        </Col>
      </Row>
      <chapter-tree-list ></chapter-tree-list>
    </Card>
  </div>
</template>

<script>
  import ChapterTreeList from "./chapterTreeList";
  import PathRecordSp from "@/components/tree/pathRecordSp";

  export default {
    name: 'teachMain',
    components: {PathRecordSp, ChapterTreeList},
    data() {
      return {
        detailInfo: this.$route.query
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-teachMain {
    .-t-header{
      margin-bottom: 20px;
      text-align: left;
    }

  }
</style>
