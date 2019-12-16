<template>
  <div class="p-active">
    <Card>
      <Form class="-c-form g-t-left" ref="addInfo" :model="addInfo" :label-width="100">
        <Form-item :label="typeName[item.type]" class="-c-form-item" v-for="(item,index) of dataList" :key="index">
          <div class="-c-flex">
            <Radio-group v-model="item.param">
              <Radio label='0' :disabled="!isShowEdit">不启用</Radio>
              <Radio label='1' :disabled="!isShowEdit">启用</Radio>
            </Radio-group>
            <span v-if="isShowEdit" @click="submitInfo(item)" class="g-cursor -c-tips">确认</span>
          </div>
        </Form-item>
        <FormItem>
          <div class="-c-flex -c-margin">
            <Button @click="isShowEdit = true" ghost type="primary" class="-c-btn" v-if="!isShowEdit">进入编辑</Button>
            <Button @click="closeEdit" ghost type="primary" class="-c-btn" v-else>取消</Button>
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
  import {pattern} from '@/libs/regexp'

  export default {
    name: 'systemSetting',
    components: {Loading},
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        dataList: [],
        typeName: {},
        addInfo: {
          type: 0
        }
      }
    },
    mounted() {
      this.getList()
      this.getSystemConfigEnums()
    },
    methods: {
      closeEdit() {
        this.isShowEdit = false
        this.getList()
      },
      getList() {
        this.isFetching = true

        this.$api.tbzwSystemconfig.listSystemConfig()
          .then(
            response => {
              if (response.data.resultData) {
                this.dataList = response.data.resultData;
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getSystemConfigEnums() {
        this.isFetching = true

        this.$api.tbzwSystemconfig.getSystemConfigEnums()
          .then(
            response => {
              if (response.data.resultData) {
                this.typeName = response.data.resultData;
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(data) {

        this.isSending = true

        this.$api.tbzwSystemconfig.editSystemConfig(data)
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
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-active {

    .-c-form {
      width: 50%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }

    .-c-margin {
      margin-top: 20px;
    }


    .-c-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .-c-btn {
      width: 100px;
    }

    .-c-tips {
      font-size: 16px;
      color: #39f
    }

  }
</style>
