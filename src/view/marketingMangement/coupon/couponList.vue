<template>
  <div class="p-coupon">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="-c-flex-center">
        <Col :span="6">
          优惠券名称：
          <Input style="width: 50%" v-model="form.name" placeholder="输入关键词"></Input>
        </Col>
        <Col :span="14" class="-c-flex-center">优惠券状态：
          <Select style="width: 100px;" v-model="form.state" placeholder="请选择">
            <Option label="全部" value="-1"></Option>
            <Option label="未开始" value="0"></Option>
            <Option label="领取中" value="1"></Option>
            <Option label="已结束" value="2"></Option>
          </Select>

          <div class="-t-search">
            <Button type="primary" class="-p-modal-btn" @click="getList">搜索</Button>
            <Button type="primary" class="-p-modal-btn" @click="resetSearch">重置</Button>
          </div>
        </Col>
        <Col :span="4" class="-p-text-right">
          <Button type="primary" class="-p-modal-btn" @click="toJump">添加优惠券</Button>
        </Col>
      </Row>

      <Table class="-c-tab" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <loading v-if="isFetching"></loading>
    </Card>
  </div>
</template>

<script>
  import { copyUrl } from "@/config/env.js";
  import dayjs from 'dayjs'
  import Loading from "@/components/loading";

  export default {
    name: 'coupon',
    components: {Loading},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        form: {
          name: "",
          state: "-1"
        },
        dataList: [],
        total: 0,
        copy_url: '',
        isFetching: false,
        isAddOpenModal: false,
        statusArray: ['未开始','领取中','已结束'],
        columns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '面额',
            render: (h, params) => {
              return h("div", [
                h("div", params.row.denomination),
                h("div", params.row.useCondition ? `满减${params.row.moneyOff}` : '指定课程无门槛使用')
              ]);
            }
          },
          {
            title: '有效期',
            render: (h, params) => {
              return h("span",
                `${dayjs(params.row.useStartTime).format("YYYY-MM-DD")} -- ${dayjs(params.row.useEndTime).format("YYYY-MM-DD")}`);
            }
          },
          {
            title: '发行方式',
            render: (h, params) => {
              return h('span', params.row.releaseType ? '主动推送' : '用户领取')
            }
          },
          {
            title: '发行量',
            key: 'total'
          },
          {
            title: '每人限领',
            key: 'getTimePer'
          },
          {
            title: '已领取',
            render: (h, params) => {
              return h('span', params.row.total - params.row.surplusAmount)
            }
          },
          {
            title: '状态',
            render: (h, params) => {
              return h('span', this.statusArray[params.row.status])
            }
          },
          {
            title: '操作',
            width: 190,
            align: 'center',
            render: (h, params) => {
              if (true || params.row.status == '1' && !params.row.releaseType) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#20a0ff',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.toJump(params.row)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#20a0ff',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.copyUrl(params.row)
                      }
                    }
                  }, '复制链接'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#20a0ff'
                    },
                    on: {
                      click: () => {
                        this.delCustomSms(params.row.id)
                      }
                    }
                  }, '结束')
                ])
              } else if (params.row.status == '1' && params.row.releaseType) {
                return h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#20a0ff',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.copyUrl(params.row)
                    }
                  }
                }, '复制链接')
              }
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toJump(param) {
        this.$router.push({
          name: 'couponEdit',
          query:{
            id: param.id
          }
        })
      },
      resetSearch() {
        this.form = {
          name: "",
          state: "0"
        }
        this.getList()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.coupon.couponList({
          current: this.tab.page,
          size: this.tab.pageSize,
          status: this.form.state,
          name: this.form.name
        }).then(
          response => {
            this.dataList = response.data.resultData.records;
            this.total = response.data.resultData.total;
          }).finally(() => {
          this.isFetching = false
        })
      },
      copyUrl() {
        let url = copyUrl;
        this.copy_url = url;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      delCustomSms(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？',
          onOk: () => {
            this.$api.coupon.closeCoupon({
              id: param
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-coupon {

    .copy-input{
      position: absolute;
      opacity: 0;
    }
    .-c-flex-center {
      display: flex;
      align-items: center;
      text-align: left;
    }

    .-t-search {
      display: inline-block;
      margin-left: 20px;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
