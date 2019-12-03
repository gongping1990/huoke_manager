<template>
  <div class="p-dubbing">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo"
            :label-width="120">
        <Form-item :label="nameList[item.type]" prop="turn" class=" -c-form-item " v-for="item of audioList" :key="item.id">
          <upload-audio v-model="item.vfUrl"
                        :option="uploadAudioOption"
                        @parentDel="delAudio(item)"
                        @successAudio="submitInfo(item)"></upload-audio>
        </Form-item>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import UploadAudio from "../../../components/uploadAudio";

  export default {
    name: 'customerService',
    components: {UploadAudio, Loading},
    data() {
      return {
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm'],
          backstageDel: true
        },
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        nameList: {
          '1': '新用户领课',
          '2': '提醒上课',
          '3': '提醒交作业',
          '4': '引导翻阅同学作业',
          '5': '初次提醒作业要求',
          '6': '初次提醒上交作业',
          '7': '作业提交成功',
          '8': '提醒查看点评',
          '9': '查看点评',
          '10': '完善用户信息',
        },
        audioList: [],
        addInfo: {
          enable: 0
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      closeEdit() {
        this.isShowEdit = false
        this.getList()
      },
      getList() {
        this.isFetching = true
        this.$api.tbzwDubbing.listByDubbing()
          .then(
            response => {
              if (response.data.resultData) {
                this.audioList = response.data.resultData;
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delAudio (item) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk: () => {
            this.$api.tbzwDubbing.removeDubbingById({
              id: item.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      submitInfo(item) {
        console.log(item,11)
        if (this.isFetching) return
        this.isFetching = true
        setTimeout(()=>{
          this.$api.tbzwDubbing.editDubbing({
            type: item.type,
            vfUrl: item.vfUrl
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  // this.getList()
                  this.$Message.success('提交成功');
                }
              })
            .finally(()=>{
              this.isFetching = false
            })
        },0)
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-dubbing {

    .-c-form {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .-c-form-item {
        display: inline-block;
        width: 50%;
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
  }
</style>
