<!-->
微信模板消息推送管理页面
<-->
<template>
  <div class="p-wx">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">公众号：</div>
            <Select v-model="form.appId" @on-change="selectChange" class="-search-selectOne" filterable>
              <Option v-for="(item,index) in wxAccount" :label="item.name" :value="item.appid" :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator
            :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>
    
    <div v-if="isOpenModal">
      <wx-record-template :isOpen="isOpenModal"
                          :data="nowWxId"
                          :type="1"
                          @closeModal="closeModalRecord">
      </wx-record-template>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import WxRecordTemplate from "../../../components/wxRecordTemplate";

  export default {
    components: {WxRecordTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        form: {
          appId: '-1'
        },
        dataList: [],
        wxAccount: [],
        total: 0,
        isOpenModal: false,
        isFetching: false,
        nowWxId: '',
        columns: [
          {
            title: '模板ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '触发条件',
            key: 'triggering',
            align: 'center'
          },
          {
            title: '模板参数',
            render: (h, params) => {
              return h('pre', params.row.param)
            },
          },
          {
            title: '内容示例',
            render: (h, params) => {
              return h('pre', params.row.content)
            },
          },
          {
            title: '链接地址',
            key: 'url',
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
                    this.openModal(params.row.templateId)
                  }
                }
              }, '发送记录')
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getWxList()
      this.getWxAccountList()
    },
    methods: {
      closeModalRecord() {
        this.isOpenModal = false;
      },
      selectChange() {
        this.tab.page = 1
        this.getWxList()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getWxList();
      },
      //分页查询
      getWxList() {
        this.isFetching = true
        this.$api.user.getWxTemplateList({
          current: this.tab.page,
          size: this.tab.pageSize,
          appid: this.form.appId == '-1' ? '' : this.form.appId
        })
          .then(response => {
            this.dataList = response.data.resultData.records;
            this.total = response.data.resultData.total;
          }).finally(() => {
          this.isFetching = false
        })
      },
      getWxAccountList() {
        this.$api.user.getWxList()
          .then(response => {
            this.wxAccount = response.data.resultData;
            this.wxAccount.unshift({
              name: '全部',
              appid: '-1'
            })
          })
      },
      openModal(wxId) {
        this.nowWxId = wxId
        this.isOpenModal = true
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-wx {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }
    .-c-tab {
      margin: 20px 0;
    }
    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }

  }
</style>
