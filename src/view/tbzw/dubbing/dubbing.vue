<template>
  <div class="p-dubbing">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList">
          <Radio label='0'>通用</Radio>
          <Radio label='1'>app</Radio>
          <Radio label='2'>乐小狮作文</Radio>
          <Radio label='3'>乐小狮读写</Radio>
          <Radio label='4'>乐小狮写字</Radio>
        </Radio-group>
      </Row>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="audioList"></Table>
    </Card>

    <Modal
      class="p-dubbing"
      v-model="isOpenModalPlay"
      @on-cancel="closeModalPlay"
      footer-hide
      :title="dataItem.typeName"
    >
      <div class="p-dubbing-item" >
        <div v-if="!dataItem.toomany">
          <upload-audio v-model="dataItem.vfUrl"
                        :option="uploadAudioOption"
                        @successAudio="submitInfo(dataItem)"></upload-audio>
        </div>

        <div v-else>
          <div class="-item-list" v-for="(item, index1) of dataItem.vfUrls" :key="index1" >
            <upload-audio v-model="item.url" :option="uploadAudioOptionTwo"
                          @parentDel="delAudioTwo(index1)"
                          @successAudio="submitInfoTwo(dataItem)"></upload-audio>
          </div>
          <div class="p-dubbing-btn">
            <Button @click="addAudio(dataItem.vfUrls)" class="-btn" ghost type="primary" style="width: 100px;">添加音频</Button>
          </div>
        </div>
      </div>
    </Modal>

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
          format: ['mp3', 'wma', 'arm', 'mpeg'],
          backstageDel: false
        },
        uploadAudioOptionTwo: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm', 'mpeg'],
          backstageDel: true
        },
        radioType: '0',
        isSending: false,
        isFetching: false,
        isOpenModalPlay: false,
        audioList: [],
        dataItem: '',
        addInfo: {
          enable: 0
        },
        columns: [
          {
            title: '名称',
            key: 'typeName',
            align: 'center'
          },
          {
            title: '类型',
            key: 'typeName',
            render: (h, params)=>{
              return h('div', params.row.toomany ? '多个' : '单个')
            },
            align: 'center'
          },
          {
            title: '音频',
            render: (h, params) => {
              return h(
                "div",
                {
                  style: {
                    textAlign: "center",
                    color: "#5444E4",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row);
                    }
                  }
                },
                "播放音频"
              );
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row);
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      closeModalPlay() {
        // this.$refs.playAudio.load();
        this.isOpenModalPlay = false;
      },
      addAudio(list) {
        list.push({
          url: ''
        });
      },
      openModalPlay(data) {
        this.dataItem = JSON.parse(JSON.stringify(data));
        this.isOpenModalPlay = true;
      },
      getList() {
        this.isFetching = true;
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
            this.isFetching = false;
          });
      },
      delAudioTwo(index) {
        this.dataItem.vfUrls.splice(index, 1);
        this.submitInfoTwo(this.dataItem);
      },
      submitInfo(item) {
        if (this.isFetching) return;
        this.isFetching = true;
        setTimeout(() => {
          this.$api.tbzwDubbing.editDubbing({
            category: this.radioType,
            type: item.type,
            vfUrl: item.vfUrl
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  this.getList()
                  this.$Message.success('提交成功');
                }
              })
            .finally(() => {
              this.isFetching = false;
            });
        }, 0);
      },
      submitInfoTwo(list) {
        if (this.isFetching) return;
        this.isFetching = true;
        let arrayUrl = [];
        setTimeout(() => {
          for (let item of list.vfUrls) {
            arrayUrl.push(item.url);
          }
          this.$api.tbzwDubbing.editDubbing({
            category: this.radioType,
            type: list.type,
            vfUrl: arrayUrl.toString()
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  this.getList()
                  this.$Message.success('提交成功');
                }
              })
            .finally(() => {
              this.isFetching = false;
            });
        }, 0);
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
      margin-top: 20px;

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
