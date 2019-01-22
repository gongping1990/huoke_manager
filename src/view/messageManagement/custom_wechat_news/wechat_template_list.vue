<!-->
微信自定义模板消息推送页面
<-->
<template>
  <div class="p-wx">

    <Row class="g-search -c-tab">
      <Col :span="8" class="g-t-left">
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">公众号：</div>
          <Select v-model="form.appId" @on-change="getWxList(1)" class="-search-selectOne" filterable>
            <Option v-for="(item,index) in wxAccount" :label="item.name" :value="item.appid" :key="index"></Option>
          </Select>
        </div>
      </Col>
    </Row>

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
    props: ['type', 'appId'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        form: {
          appId: "",
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
        wxAccount: [],
        total: 0,
        isAddOpenModal: false,
        isFetching: false,
        keywordStorage: "",
        otherInfo: {
          title: '添加自定义微信',
          isCheckAllPeople: false,
          templateId: '',
          appId: '',
          type: this.type == '2' ? '4' : '2',
          isOther: this.type == '2'
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
      this.getWxAccountList();
    },
    methods: {
      getWxAccountList() {
        let paramUrl = ''
        paramUrl = this.type == '1' ? this.$api.user.getWxList : this.$api.custom.getAppList
        paramUrl()
          .then(response => {
            this.wxAccount = response.data.resultData;
            if (this.type == '2') {
              this.wxAccount.forEach(item => {
                item.appid = item.appId
              })
            }

            this.form.appId = this.wxAccount[0].appid
            this.getWxList();
          })
      },
      currentChange(val) {
        this.tab.page = val;
        this.getWxList();
      },
      //分页查询
      getWxList() {
        let paramUrl = ''
        this.isFetching = true

        paramUrl = this.type == '1' ? this.$api.user.getListCustomTemplate : this.$api.custom.getListCustomTemplate
        paramUrl({
          current: this.tab.page,
          size: this.tab.pageSize,
          appId: this.form.appId
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
        let params = ''

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

        params = this.type == '1' ? this.$api.user.addWxTask : this.$api.custom.addWxTask

        params({
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
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
