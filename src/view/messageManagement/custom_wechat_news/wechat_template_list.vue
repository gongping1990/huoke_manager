<!-->
微信自定义模板消息推送页面
<-->
<template>
  <div class="p-wx">

    <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    <Page class="g-text-right"
          :total="total"
          size="small"
          show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>

    <div v-if="isAddOpenModal">
      <user-selection ref="childMethod"
                      @close="closeModal"
                      @submitModal="submitMessage"
                      :otherInfo="otherInfo"
                      ></user-selection>
    </div>
  </div>
</template>

<script>
  import qs from "qs";
  import UserSelection from "@/components/userSelection";

  export default {
    components: {UserSelection},
    name: 'wechatTemplateList',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        form: {
          startTime: "",
          endTime: "",
          state: "3"
        },
        addInfo: {
          condition: "",
          userIds: [],
          sendTime: "",
          sendType: "",
          first: "",
          remark: ""
        },
        dataList: [],
        total: 0,
        isAddOpenModal: false,
        isFetching: false,
        keywordStorage: "",
        otherInfo: {
          title: '添加自定义微信',
          isCheckAllPeople: false,
          templateId: '',
          appId: '',
          type: '2'
        },
        columns: [
          {
            title: '模板ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '模板参数',
            render: (h, params) => {
              return h('pre', params.row.param)
            }
          },
          {
            title: '内容示例',
            render: (h, params) => {
              return h('pre', params.row.content)
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4'
                },
                on: {
                  click: () => {
                    this.addOpenModal(params.row)
                  }
                }
              }, '添加任务')
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getWxList();
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getWxList();
      },
      //分页查询
      getWxList() {
        this.isFetching = true
        this.$api.user.getListCustomTemplate({
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(response => {
            this.dataList = response.data.resultData.records;
            this.total = response.data.resultData.total;
          }).finally(() => {
          this.isFetching = false
        })
      },

      addOpenModal(data) {
        this.addInfo = {
          condition: "",
          userIds: [],
          sendTime: "",
          sendType: "",
          first: "",
          remark: "",
          appId: data.appId
        };
        this.otherInfo.templateId = data.id;
        this.otherInfo.appId = data.appId;

        this.keywords = [];

        this.isAddOpenModal = true

        setTimeout(() => {
          this.$refs.childMethod.init()
        }, 0)
      },
      closeModal() {
        this.isAddOpenModal = false;
      },
      submitMessage(param) {

        this.addInfo = Object.assign(this.addInfo, param)

        if (!this.addInfo.userIds.length && (this.addInfo.condition == '')) {
          return this.$Message.error("请选择用户");
        } else if (this.addInfo.sendType == "") {
          return this.$Message.error("请选择发送类别");
        } else if (this.addInfo.first == "") {
          return this.$Message.error("请输入first");
        } else if (this.addInfo.first.length > 100) {
          return this.$Message.error("first长度不能超过100字");
        } else if (this.addInfo.remark == "") {
          return this.$Message.error("请输入remark");
        } else if (this.addInfo.remark.length > 100) {
          return this.$Message.error("remark长度不能超过100字");
        } else if (this.addInfo.sendType == "2" && this.addInfo.sendTime == "") {
          return this.$Message.error("请输入定时发送时间");
        }

        // delete this.addInfo.radioType

        this.$api.user.addWxTask({
          id: this.otherInfo.templateId,
          ...this.addInfo
        })
          .then(response => {
            if (response.data.code == "200") {
              this.$Message.success("发送成功");
              this.addInfo = {
                condition: "",
                userIds: [],
                sendTime: "",
                sendType: "",
                first: "",
                remark: ""
              };
              this.isAddOpenModal = false;
              this.getWxList();
            }
          })
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-wx {
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
