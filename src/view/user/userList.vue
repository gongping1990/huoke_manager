<template>
  <div class="p-user">
    <Card>
      <Row>
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">手机号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo" class="-search-input" placeholder="请输入关键字" icon="ios-search" @on-click="getList"></Input>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'userList',
    data() {
      return {
        switch1: '',
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: '',
        selectInfo: '',
        dataList: [],
        total: 0,
        isFetching: false,
        columns: [
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headimgurl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            }
          },
          {
            title: '电话',
            key: 'phone'
          },
          {
            title: '创建时间',
            key: 'creatTime'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.disabled
                },
                on: {
                  'on-change': () => {
                    this.toChangeStatus(params.row)
                  }
                }
              })
            }
          },
          {
            title: '操作',
            width: 190,
            align: 'center',
            render: (h, params) => {
              return h('Button', {
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
                    this.toDetail(params.row)
                  }
                }
              }, '详情')
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo
        }

        this.isFetching = true
        this.$api.user.getUserPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      toDetail(param) {
        this.$router.push({
          name: 'userInfo',
          query:{
            id: param.userId
          }
        })
      },
      toChangeStatus(params) {
        console.log(params)

        this.$api.user.changeUserStatus({
          userId: params.userId,
          disabled: !params.disabled
        }).then(
          response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功')
              this.getList()
            }
          })
      }
    }
  };
</script>
<style lang="less">
  .p-user {
    .ivu-input {
      border: none !important;
    }

    .ivu-select-selection {
      border: none !important;
    }
  }
</style>

<style lang="less" scoped>
  .p-user {
    .-search {
      display: flex;
      align-items: center;
      border: 1px solid #dcdee2;
      border-radius: 4px;

      .-search-select {
        width: 150px;
      }

      .-search-center {
        color: #dcdee2;
      }

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
