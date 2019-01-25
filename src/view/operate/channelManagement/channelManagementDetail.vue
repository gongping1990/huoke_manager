<template>
  <div class="p-channel">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">

    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.name" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="19" class="g-text-right">
          <Button type="primary" ghost class="-p-modal-btn" @click="toExcel()">数据导出</Button>
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
  import {copyUrl,getBaseUrl} from  "@/libs/index"

  export default {
    name: 'channelManagementDetail',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        selectInfo: '1',
        searchInfo: {
          name: ''
        },
        total: 0,
        copy_url: '',
        isFetching: false,
        columns: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.courseImg
                },
                style: {
                  width: '100px',
                  height: '60px',
                  margin: '10px'
                }
              })
            },
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center'
          },
          {
            title: '付费用户',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '付款金额',
            key: 'payMoney',
            align: 'center'
          },
          {
            title: '付费转化率',
            key: 'paymentRate',
            align: 'center'
          },
          {
            title: '操作',
            width: 250,
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
                      this.copyUrlFn(params.row)
                    }
                  }
                }, '复制推广链接')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toExcel() {
        let downUrl = `${getBaseUrl()}/channel/download?channelId=${this.$route.query.id}&name=${this.searchInfo.name}`
        window.open(downUrl, '_blank');
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if(num) {
          this.tab.currentPage = 1
        }
        this.$api.channel.getInfoList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          channelId: this.$route.query.id,
          name: this.searchInfo.name
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      copyUrlFn(row) {
        this.copy_url = row.channeHref;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
    }
  };
</script>


<style lang="less" scoped>
  .p-channel {
    .copy-input{
      position: absolute;
      opacity: 0;
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
