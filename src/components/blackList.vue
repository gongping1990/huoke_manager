<!-->
微信自定义模板消息推送页面
<-->
<template>
  <div class="p-wx">

    <div class="g-add-btn g-add-top -p-w-top" @click="addOpenModal()">
      <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
    </div>

    <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"
           @on-selection-change="changeSelect"></Table>



    <Row class="g-search -c-tab">
      <Col :span="3" class="g-t-left">
        <Button ghost type="primary" @click="removeBlack()">移除黑名单</Button>
      </Col>
      <Col :span="21">
        <Page class="g-text-right"
              :total="total"
              size="small"
              show-elevator
              :page-size="tab.pageSize"
              :current.sync="tab.currentPage"
              @on-change="currentChange"></Page>
      </Col>
    </Row>

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
    name: 'blackList',
    props: ['type', 'appId'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        userIds: [],
        total: 0,
        isAddOpenModal: false,
        isFetching: false,
        otherInfo: {
          title: '黑名单',
          isCheckAllPeople: false,
          type: '3',
          isOther: this.type == '2',
          appId: this.type == '2' ? this.appId : ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户头像',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.headImgUrl
                },
                style: {
                  width: '36px',
                  height: '36px',
                  margin: '10px',
                  'border-radius': '50%'
                }
              })
            },
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
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
                    this.removeBlack(params.row.userId)
                  }
                }
              }, '移出')
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      changeSelect(data) {
        this.userIds = data.map((item)=>{
          return item.userId
        })
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        let paramUrl = ''
        let param = ''
        paramUrl = this.type == '1' ? this.$api.black.blackList : this.$api.custom.blackList
        param = {
          current: this.tab.page,
          size: this.tab.pageSize
        }
        this.isFetching = true
        if(this.type == '2') {
          param.black = true
          param.appId = this.appId
        }
        paramUrl(param)
          .then(response => {
            this.dataList = response.data.resultData.records;
            this.total = response.data.resultData.total;
          }).finally(() => {
          this.isFetching = false
        })
      },
      removeBlack(data) {
        if(data) {
          this.userIds.push(data)
        }
        if(!this.userIds.length) {
          return this.$Message.error('请选择需要移除的用户')
        }
        let paramUrl = ''
        paramUrl = this.type == '1' ? this.$api.black.delBlack : this.$api.custom.delBlack
        paramUrl(this.userIds)
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功')
              this.getList()
              this.userIds = []
            }
          })
      },
      addOpenModal() {
        this.isAddOpenModal = true

        setTimeout(() => {
          this.$refs.childMethod.init()
        }, 0)
      },
      closeModal() {
        this.isAddOpenModal = false;
      },
      submitMessage(param) {
        let paramUrl = ''
        paramUrl = this.type == '1' ? this.$api.black.addBlack : this.$api.custom.addBlack
        paramUrl(param.userIds)
          .then(response => {
            if (response.data.code == "200") {
              this.$Message.success("发送成功");
              this.isAddOpenModal = false;
              this.getList();
            }
          })
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-wx {
    .-p-w-top {
      top: 86px;
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
