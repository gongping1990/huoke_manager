<template>
  <div class="p-teachMain">
    <Card>
      <Row class="-t-header">
        <Col :span="10">
          <RadioGroup v-model="typeInfo" type="button">
            <Radio label="1">学习目标</Radio>
            <Radio label="2">字词过关</Radio>
            <Radio label="3">初读语文</Radio>
            <Radio label="4">课文精讲</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div>
        <div class="-t-btn">
          <div>
            <div class="g-primary-btn -t-width" @click="">进入编辑</div>
            <Button ghost type="primary" class="-t-width">预览内容</Button>
          </div>
        </div>
      </div>
      <div>
        <editor v-model="addInfo.content"></editor>
      </div>
    </Card>
  </div>
</template>

<script>
  import Editor from "@/components/editor";
  export default {
    name: 'courseInfo',
    components: {Editor},
    data() {
      return {
        typeInfo: '1',
        detailInfo: this.$route.query,
        addInfo: {
          content: ''
        }
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
    .-t-width {
      margin-top: 20px;
      width: 200px;
    }
    .-t-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
  }
</style>
