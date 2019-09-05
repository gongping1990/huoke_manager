<template>
  <div class="p-distribution">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-distribution"
      v-model="isOpenModal"
      @on-cancel="closeModal"
      width="600"
      :title="openType === 1 ? '变更记录' : '设置'">

      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"
             v-if="openType ===1"></Table>

      <Page class="-p-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage" v-if="openType === 1"
            @on-change="detailCurrentChange"></Page>

      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90" v-if="openType === 2">

        <FormItem label="佣金比例(%)" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入佣金比例(%)"></Input>
        </FormItem>
      </Form>

      <div slot="footer" class="p-distribution-btn">
        <div @click="submitInfo" class="g-primary-btn"> 确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'fxgl_distributionMessage',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        version: '',
        countAllInstall: '',
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        openType: '',
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入佣金比例', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '课程名称',
            key: 'version',
            width: 200,
            align: 'center'
          },
          {
            title: '单独购价格',
            render: (h, params) => {
              return h('div', `￥ ${params.row.payAmount / 100}`)
            },
            align: 'center'
          },
          {
            title: '拼团价格',
            render: (h, params) => {
              return h('div', `￥ ${params.row.payAmount / 100}`)
            },
            align: 'center'
          },
          {
            title: '佣金比例',
            render: (h, params) => {
              return h('div', `${params.row.payAmount}%`)
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#1890FF',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row, 2)
                    }
                  }
                }, '设置'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#1890FF',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row, 1)
                    }
                  }
                }, '变更记录')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '更改前佣金比例',
            key: 'phoneModel',
            align: 'center'
          },
          {
            title: '更改后佣金比例',
            key: 'num',
            align: 'center'
          },
          {
            title: '操作人',
            key: 'num',
            align: 'center'
          },
          {
            title: '操作时间',
            key: 'num',
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getList()
      this.getCountAllInstall()
    },
    methods: {
      closeModal() {
        this.isOpenModal = false
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      openModal(data, num) {
        this.openType = num
        this.version = data.version
        this.isOpenModal = true
        this.getDetailList();
      },
      getDetailList() {
        this.isFetching = true
        this.$api.gswStatistics.listInstallStatistics({
          version: this.version,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      //分页查询
      getList() {
        this.isFetching = true
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize
        }

        this.$api.gswStatistics.listVersionStatistics(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getCountAllInstall() {
        this.$api.gswStatistics.countAllInstall()
          .then(
            response => {
              this.countAllInstall = response.data.resultData
            })
      },
      submitInfo() {
        if (this.openType === 1) {
          return this.closeModal()
        }

        if (!this.addInfo.name) {
          return this.$Message.error('请输入佣金比例')
        }

        if (this.isSending) return

        this.isSending = true
        this.$api.gswOperational.saveOperational({
          id: this.addInfo.id,
          name: this.addInfo.name
        }).then(
          response => {
            if (response.data.code == '200') {
              this.$Message.success('提交成功');
              this.getList()
              this.closeModal()
            }
          })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-distribution {

    .-num {
      font-size: 20px;
      font-weight: bold;
    }

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
