<!-->
短信模板消息推送管理页面
<-->
<template>
  <div class="p-sms">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator
            :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <div v-if="isOpenModal">
        <sms-record-template :isOpen="isOpenModal"
                             :data="nowSmsId"
                             :type="1"
                             @closeModal="closeModal"></sms-record-template>
      </div>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import SmsRecordTemplate from "../../../components/smsRecordTemplate";

  export default {
    components: {SmsRecordTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isOpenModal: false,
        isFetching: false,
        nowSmsId: '',
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
            title: '内容示例',
            render: (h, params) => {
              return h('pre', params.row.content)
            },
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
                    this.openModal(params.row.id)
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
      this.getSmsList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getSmsList();
      },

      //分页查询
      getSmsList() {
        this.isFetching = true
        this.$api.user.getSmsList({
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
      openModal(wxId) {
        this.nowSmsId = wxId
        this.isOpenModal = true
      },
      closeModal (){
        this.isOpenModal = false
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-sms {
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
