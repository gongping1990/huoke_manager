<template>
  <div class="p-active">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" :label-width="60">
        <FormItem class="-select-wrap" v-for="(item,index) in optionList" :key="index" :label="`搜索${index+1}`">

          <Input class="-s-width" v-model="item.content" type="textarea" :autosize="true" placeholder="请输入选项内容"
                 :disabled="!isShowEdit"
                 :maxlength="20" style="width: 300px"/>
          <span class="-s-width -s-color g-cursor"  v-if="isShowEdit" @click="delOption(index)">删除</span>
        </FormItem>
        <FormItem v-if="isShowEdit">
          <div class="-form-btn g-cursor " @click="addOption">+ 新增目标</div>
        </FormItem>
        <FormItem>
          <div class="-c-flex">
            <Button @click="isShowEdit = true" ghost type="primary" class="-c-btn" v-if="!isShowEdit">进入编辑</Button>
            <Button @click="closeEdit" ghost type="primary" class="-c-btn" v-else>取消</Button>
            <div v-if="isShowEdit" @click="submitInfo()" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' :
              '确 认'}}
            </div>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";

  export default {
    name: 'active',
    components: {Loading},
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        optionList: [],
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      addOption() {
        this.optionList.push({
          id: this.optionList.length+1,
          content: ''
        })
      },
      delOption(index) {
        this.optionList.splice(index, 1)
      },
      closeEdit() {
        this.isShowEdit = false
        this.getList()
      },
      getList() {
        this.isFetching = true
        this.courseList = []
        this.$api.wzjh.listByHotKeyword()
          .then(
            response => {
              if (response.data.resultData) {
                this.optionList = response.data.resultData;
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        let isPass = true
        isPass = this.optionList.length && this.optionList.every(item=>{
          return (item.content != '')
        })

        if (!isPass) {
          return this.$Message.error('关键词不能为空')
        }

        this.isSending = true
        this.$api.wzjh.updateHotKeyword({
          list: JSON.stringify(this.optionList)
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.closeEdit()
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-active {
    .-select-wrap {
      padding: 10px 0;

      .-s-title {
        color: #b3b5b8;
      }
      .-s-width {
        padding-right: 10px;
      }

      .-s-color {
        color: rgb(218, 55, 75);
      }
    }

    .-c-form {
      margin-top: 16px;
      width: 50%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }

    .-c-flex {
      display: flex;
      justify-content: center;
    }

    .-c-btn {
      margin: 20px;
      width: 120px;
    }

    .-form-btn {
      margin: 10px 0 0 0;
      width: 333px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      border: 1px dashed #5444E4;
      color: #5444E4;
    }
  }
</style>
