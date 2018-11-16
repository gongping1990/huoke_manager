<template>
  <div class="p-teachMain">
    <Card>
      <Row class="-t-header" style="height: 100%">
        <Col :span="5">
          <RadioGroup v-model="typeInfo" type="button">
            <Radio label="1">课程内容</Radio>
            <Radio label="2">章节树</Radio>
          </RadioGroup>
        </Col>
        <Col :span="19">
          <path-record :data-prop="detailInfo"></path-record>
        </Col>
      </Row>
      <course-list v-if="typeInfo == 1" :pathInfo="detailInfo"></course-list>
      <chapter-tree-list v-else></chapter-tree-list>
    </Card>
  </div>
</template>

<script>
  import CourseList from "./courseList";
  import ChapterTreeList from "./chapterTreeList";
  import PathRecord from "../../../components/tree/pathRecord";

  export default {
    name: 'teachMain',
    components: {PathRecord, ChapterTreeList, CourseList},
    data() {
      return {
        typeInfo: '1',
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
