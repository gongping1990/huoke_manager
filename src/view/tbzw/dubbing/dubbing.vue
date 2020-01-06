<template>
  <div class="p-dubbing">
    <Card>
      <Row class="g-t-left g-tab">
        <Radio-group v-model="radioType" type="button" @on-change="getList">
          <Radio label='1'>引导提示</Radio>
          <Radio label='2'>课程答题</Radio>
        </Radio-group>
      </Row>

      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo" v-if="radioType === '1'"
            :label-width="120">
        <Form-item :label="nameList[item.type]" prop="turn" class=" -c-form-item " v-for="item of audioList"
                   :key="item.id">
          <upload-audio v-model="item.vfUrl"
                        :option="uploadAudioOption"
                        @parentDel="delAudio(item)"
                        @successAudio="submitInfo(item)"></upload-audio>
        </Form-item>
      </Form>

      <div v-if="radioType === '2'" class="g-t-left">
        <div v-for="(list, index) of audioList" :key="index">
          <div class="p-dubbing-title">{{list.typeName}}</div>
          <div class="p-dubbing-item">
            <div class="-item-list" v-for="(item, index1) of list.vfUrls" :key="index1">
              <upload-audio v-model="item.url" :option="uploadAudioOption" @parentDel="delAudioTwo(list,index1)"
                            @successAudio="submitInfoTwo(list)"></upload-audio>
            </div>
            <div class="p-dubbing-btn">
              <Button @click="addAudio(list.vfUrls)" class="-btn" ghost type="primary" style="width: 100px;">添加音频</Button>
            </div>
          </div>
        </div>
      </div>
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
        radioType: '1',
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
      addAudio (list) {
        list.push({
          url: ''
        })
      },
      getList() {
        this.isFetching = true
        this.$api.tbzwDubbing.listByDubbing({
          category: this.radioType
        })
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
      delAudio(list,index) {
        list.splice(index,1)
      },
      delAudioTwo(list,index) {
        list.vfUrls.splice(index,1)
        this.submitInfoTwo(list)
      },
      submitInfo(item) {
        if (this.isFetching) return
        this.isFetching = true
        setTimeout(() => {
          this.$api.tbzwDubbing.editDubbing({
            category: this.radioType,
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
            .finally(() => {
              this.isFetching = false
            })
        }, 0)
      },
      submitInfoTwo(list) {
        if (this.isFetching) return
        this.isFetching = true
        let  arrayUrl = []
        setTimeout(() => {
          for(let item of list.vfUrls) {
            arrayUrl.push(item.url)
          }
          this.$api.tbzwDubbing.editDubbing({
            category: this.radioType,
            type: list.type,
            vfUrl: arrayUrl.toString()
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  // this.getList()
                  this.$Message.success('提交成功');
                }
              })
            .finally(() => {
              this.isFetching = false
            })
        }, 0)
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-dubbing {

    &-title {
      margin: 10px 0;
      font-size: 18px;
    }

    &-item {
      display: flex;
      flex-flow: wrap;

      .-item-list {
        margin: 0 20px 20px 0;
        width: 350px
      }
    }

    &-btn {
      display: flex;
      align-items: center;

      .-btn {
        width: 100px;
        height: 40px;
      }
    }

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
