<template>
  <div class="p-topBar">
    <Card>
      <Form class="-c-form g-t-left" ref="addInfo" :model="addInfo" :label-width="100">
        <Form-item label="是否启用" prop="turn" class="ivu-form-item-required -c-form-item ">
          <Radio-group v-model="addInfo.turn">
            <Radio :label=1>不启用</Radio>
            <Radio :label=2>启用</Radio>
          </Radio-group>
        </Form-item>
        <FormItem label="top文案" prop="priceYuan">
          <Input type="text" v-model="addInfo.priceYuan" placeholder="请输入top文案"></Input>
        </FormItem>
        <FormItem label="top按键文案" prop="priceYuan">
          <Input type="text" v-model="addInfo.priceYuan" placeholder="请输入top按键文案"></Input>
        </FormItem>
        <FormItem label="跳转链接" prop="priceYuan">
          <Input type="text" v-model="addInfo.priceYuan" placeholder="请输入跳转链接"></Input>
        </FormItem>
        <FormItem>
          <div class="-c-flex">
            <Button @click="closeModal()" ghost type="primary" class="-c-btn">取消</Button>
            <div @click="submitInfo()" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' : '确 认'}}</div>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";

  export default {
    name: 'customerService',
    components: {Loading},
    data() {
      return {
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        isSwitchTemplate: false,
        dataList: [],
        addInfo: {
          lessonId: this.$route.query.lessonId,
          contentType: this.type,
          operate: 1, //类型（读课文，单选题）
        }
      }
    },
    mounted() {
    },
    methods: {
      submitInfo() {
        let paramUrl = ''
        if (!this.addInfo.operate) {
          return this.$Message.error('请选择模板样式')
        } else if (this.addInfo.operate == '1' && !this.backImgUrl) {
          return this.$Message.error('请上传背景图片')
        } else if (this.addInfo.operate == '2' && !this.stemImgUrl) {
          return this.$Message.error('请上传题干图片')
        } else if (!this.addInfo.audioUrl) {
          return this.$Message.error('请上传音频内容')
        } else if (this.addInfo.autoPlay === '') {
          return this.$Message.error('请选择是否自动播放')
        }

        paramUrl = this.addInfo.id ? this.$api.slide.updateCheckpoint(this.addInfo) : this.$api.slide.addContent(this.addInfo)
        paramUrl
          .then(res => {
            if (res.data.code == '200') {
              this.$Message.success(`${this.addInfo.id ? '修改成功' : '创建成功'}`)
              this.$emit('addCourseOk')
            }
          })

      },
    }
  };
</script>

<style lang="less" scoped>
  .p-topBar {

    .-c-form {
      width:50%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }

    .-c-flex {
      display: flex;
    }

    .-c-btn {
      margin: 20px;
      width: 120px;
    }
  }
</style>
