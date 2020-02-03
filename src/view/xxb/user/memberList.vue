<template>
  <div class="p-memberList">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="p-memberList-radio">
          <RadioGroup v-model="searchInfo.type" type="button" @on-change="changeRadio">
            <Radio :label=1>会员列表</Radio>
            <Radio :label=2>裂变配置</Radio>
          </RadioGroup>

          <div class="-search" v-if="searchInfo.type === 1">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">手机号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" v-if="searchInfo.type === 1" :loading="isFetching" :columns="columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage" v-if="searchInfo.type === 1"
            @on-change="currentChange"></Page>

      <div v-show="searchInfo.type === 2" class="-c-tab g-t-left">
        <Form :model="addInfo" :label-width="100">
          <FormItem label="会员延长天数">
            <Input v-model="addInfo.delay" placeholder="请输入会员延长天数" style="width: 50%"></Input>
            <p class="-c-tips">指会员每邀请1位新用户关注公众号，系统自动给会员延长的学习特权天数</p>
          </FormItem>
        </Form>
        <div @click="submitInfo()" class="subBtn g-primary-btn">确 认</div>
      </div>
    </Card>

    <Modal
      class="p-memberList"
      v-model="isShow"
      @on-cancel="isShow = false"
      footer-hide
      width="800"
      title="邀请记录">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="dataDetailList"></Table>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import Operation from "iview/src/components/transfer/operation";
  import xxbLookUserInfo from "./xxbLookUserInfo";
  import myMinxin from "../../../utils/minxin";

  export default {
    name: 'memberList',
    components: {xxbLookUserInfo, Operation},
    mixins: [myMinxin],
    data() {
      return {
        switch1: '',
        searchInfo: {
          type: 1
        },
        selectInfo: '1',
        addInfo: {},
        dataList: [],
        dataDetailList: [],
        detailInfo: '',
        isFetching: false,
        isShow: false,
        columns: [
          {
            title: '会员头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headImgUrl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickName)
              ])
            }
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '邀请人',
            key: 'invitedUserNickName',
            align: 'center'
          },
          {
            title: '开始时间',
            key: 'startTime',
            tooltip: true,
            align: 'center'
          },
          {
            title: '到期时间',
            key: 'endTime',
            tooltip: true,
            align: 'center'
          },
          {
            title: '邀请人数',
            render: (h, p) => {
              return h('div', {
                style: {
                  cursor: 'pointer',
                  color: '#5444E4'
                },
                on: {
                  click: () => {
                    this.toDetail(p.row)
                  }
                }
              }, p.row.invitedUserCount)
            },
            align: 'center'
          }
        ],
        columnsModal: [
          {
            title: '用户昵称',
            key: 'beInvitedUserNickName',
            align: 'center'
          },
          {
            title: '延长天数',
            key: 'days',
            align: 'center'
          },
          {
            title: '是否是会员',
            render: (h, params) => {
              return h('span', params.row.member ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '延长前到期时间',
            key: 'beforeEndTime',
            align: 'center'
          },
          {
            title: '延长后到期时间',
            key: 'afterEndTime',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'gmtCreate',
            render: (h, params)=>{
              return h('div', dayjs(+params.row.gmtCreate).format('YYYY-MM-DD'))
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeRadio () {
        if (this.radioType === 1) {
          this.getList();
        } else {
          this.getDelay()
        }
      },
      toDetail(param) {
        this.isShow = true
        this.getDetailList(param)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickName = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.isFetching = true
        this.$api.xxbUserMember.getUserMemberList(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getDetailList(data) {
        this.$api.xxbUserMember.getUserInvitedList({
          current: 1,
          size: 1000,
          userId: data.userId
        })
          .then(
            response => {
              this.dataDetailList = response.data.resultData.records;
              this.dataDetailList.forEach(item=>{
                item.days = parseInt((new Date(item.afterEndTime).getTime() - new Date(item.beforeEndTime).getTime()) / (24 * 60 * 60 * 1000))
              })
            })
      },
      getDelay() {
        this.$api.xxbUserMember.getDelay()
          .then(
            response => {
              this.addInfo.delay = response.data.resultData;
              this.$forceUpdate()
            })
      },
      submitInfo() {
        this.$api.xxbUserMember.updateDelay({
          delay: this.addInfo.delay
        })
          .then(response => {
              this.$Message.success('操作成功')
            })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-memberList {
    &-radio {
      display: flex;
    }
    .-search {
      margin-left: 20px;
    }
    .-search-select-text-two {
      min-width: 120px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tips {
      color: #39f
    }

    .-c-tab {
      margin: 20px 0;
    }

    .subBtn {
      margin-left: 20%;
    }
  }
</style>
