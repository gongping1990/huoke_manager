<template>
  <div class="p-courseInfo">
    <Card style="height: 100%;">
      <Row class="-t-header">
        <Col :span="10" class="-t-col">
          <RadioGroup v-model="typeInfo" type="button">
            <Radio label="0">学习目标</Radio>
            <Radio label="1">字词过关</Radio>
            <Radio label="2">初读语文</Radio>
            <Radio label="3">课文精讲</Radio>
          </RadioGroup>
        </Col>
        <Col :span="14">
          <path-record :data-prop="detailInfo"></path-record>
        </Col>
      </Row>
      <Row style="height: 100%">
        <course-title :type="typeInfo" @cancelChangeType="changeType"></course-title>
      </Row>
    </Card>
  </div>
</template>

<script>
  import PathRecord from "@/components/tree/pathRecord";
  import CourseTitle from "./courseType/courseTitle";
  export default {
    name: 'courseInfo',
    components: {CourseTitle, PathRecord},
    data() {
      return {
        typeInfo: '0'
      }
    },
    computed: {
      detailInfo () {
        let param = {
          ...this.$route.query
        }
        return param
      }
    },
    methods: {
      changeType () {
        this.typeInfo = localStorage.typeId
      }
    }
  };
</script>

<style lang="less">
  .p-courseInfo{
    .ivu-card-body{
      height: 98%;
    }
  }
</style>

<style lang="less" scoped>
  .p-courseInfo {
    height: 100%;

    .-t-header{
      .-t-col{
        text-align: left;
      }
      margin-bottom: 20px;
    }
  }
</style>
