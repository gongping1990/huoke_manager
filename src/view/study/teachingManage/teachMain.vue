<template>
  <div class="p-teachMain">
    <Card>
      <Row>
        <Col :span="5">
          <RadioGroup v-model="typeInfo" type="button">
            <Radio label="1">课程内容</Radio>
            <Radio label="2">章节树</Radio>
          </RadioGroup>
        </Col>
        <Col :span="19" class="-t-text">
          当前选择：<h5>{{detailInfo.courseName}} · {{detailInfo.gradeText}}（{{detailInfo.semesterText}}）-
          {{detailInfo.editionText}}</h5>
        </Col>
      </Row>
      <course-list v-if="typeInfo == 1"></course-list>
      <chapter-tree-list v-else></chapter-tree-list>
    </Card>
  </div>
</template>

<script>
  import CourseList from "./courseList";
  import ChapterTreeList from "./chapterTreeList";

  export default {
    name: 'teachMain',
    components: {ChapterTreeList, CourseList},
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
    .-t-text {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
