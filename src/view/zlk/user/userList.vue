<template>
  <div class="p-user">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">用户类别：</div>
            <Select v-model="searchInfo.subscribe" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of userTypeList" :label=item.name :value=item.id :key="item.id" ></Option>
            </Select>
          </div>
        </Col>
        <Col :span="6">
          <div class="-search">
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

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import Operation from "iview/src/components/transfer/operation";

  export default {
    name: 'zlkUserList',
    components: {Operation},
    data() {
      return {
        switch1: '',
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        searchInfo: {
          subscribe: '-1'
        },
        userTypeList: [
          {
            id: '-1',
            name: '全部用户'
          },
          {
            id: '1',
            name: '老师'
          },
          {
            id: '2',
            name: '学生'
          },
          {
            id: '3',
            name: '家长'
          },
          {
            id: '4',
            name: '其他'
          },
          {
            id: '5',
            name: '暂无身份'
          }
        ],
        selectInfo: '1',
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
                    src: params.row.headImgUrl
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
            title: '身份',
            key: 'phone'
          },
          {
            title: '电话',
            key: 'phone'
          },
          {
            title: '创建时间',
            key: 'phone'
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
      getList(num) {
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          subscribe: this.searchInfo.subscribe != '-1' ? (this.searchInfo.subscribe == '1') : ''
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.isFetching = true
        this.$api.user.getPrepUserList(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-user {
    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
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
