<template>
  <div class="p-courseInfo">
    <Card style="height: 100%">
      <Row class="-t-header">
        <Col :span="10">
          <RadioGroup v-model="typeInfo" type="button">
            <Radio label="1">学习目标</Radio>
            <Radio label="2">字词过关</Radio>
            <Radio label="3">初读语文</Radio>
            <Radio label="4">课文精讲</Radio>
          </RadioGroup>
        </Col>
        <Col :span="14">
          <path-record :data-prop="detailInfo"></path-record>
        </Col>
      </Row>
      <Row style="height: 100%">
        <learning-goals v-if="typeInfo == '1'"></learning-goals>
      </Row>
    </Card>
  </div>
</template>

<script>
  import LearningGoals from "./courseType/learningGoals";
  import PathRecord from "@/components/tree/pathRecord";
  export default {
    name: 'courseInfo',
    components: {PathRecord, LearningGoals},
    data() {
      return {
        typeInfo: '1'
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
      margin-bottom: 20px;
      text-align: left;
    }
  }
</style>
