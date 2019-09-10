<template>
  <div class="p-distribution">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-distribution"
      v-model="isOpenModal"
      @on-cancel="closeModal"
      width="650"
      :title="openType === 1 ? '变更记录' : '设置'">

      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"
             v-if="openType ===1"></Table>

      <Page class="g-t-center" :total="totalDetail" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage" v-if="openType === 1"
            @on-change="detailCurrentChange"></Page>

      <Form ref="addInfo" :model="addInfo" :label-width="140" v-if="openType === 2">

        <FormItem label="推广人佣金比例(%)" prop="promoterRatio">
          <Input type="text" v-model="addInfo.promoterRatio" placeholder="请输入推广人佣金比例(%)"></Input>
        </FormItem>
        <FormItem label="加盟商佣金比例(%)" prop="franchiseeRatio">
          <Input type="text" v-model="addInfo.franchiseeRatio" placeholder="请输入加盟商佣金比例(%)"></Input>
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
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        openType: '',
        addInfo: {},
        columns: [
          {
            title: '课程名称',
            key: 'courseName',
            width: 200,
            align: 'center'
          },
          {
            title: '单独购价格',
            render: (h, params) => {
              return h('div', `￥ ${params.row.ddgPrice / 100}`)
            },
            align: 'center'
          },
          {
            title: '拼团价格',
            render: (h, params) => {
              return h('div', `￥ ${params.row.ptPrice / 100}`)
            },
            align: 'center'
          },
          {
            title: '推广人佣金比例',
            render: (h, params) => {
              return h('div', `${params.row.promoterRatio}%`)
            },
            align: 'center'
          },
          {
            title: '加盟商佣金比例',
            render: (h, params) => {
              return h('div', `${params.row.franchiseeRatio}%`)
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
            title: '推广人佣金比例（更改前->更改后）',
            key: 'promoterRatio',
            align: 'center'
          },
          {
            title: '加盟商佣金比例（更改前->更改后）',
            key: 'franchiseeRatio',
            align: 'center'
          },
          {
            title: '操作人',
            key: 'gmtCreater',
            align: 'center'
          },
          {
            title: '操作时间',
            key: 'gmtCreate',
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getList()
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
        this.version = data.courseId
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.isOpenModal = true
        this.getDetailList();
      },
      getDetailList() {
        this.isFetching = true
        this.$api.jsdDistributie.pageDistributieRatioLog({
          courseId: this.version,
          system: this.addInfo.system,
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

        this.$api.jsdDistributie.listDistributieRatio()
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (this.openType === 1) {
          return this.closeModal()
        }

        if (!this.addInfo.promoterRatio) {
          return this.$Message.error('请输入推广人佣金比例')
        } else if (!this.addInfo.franchiseeRatio ) {
          return this.$Message.error('请输入加盟商佣金比例')
        }

        if (this.isSending) return

        this.isSending = true
        this.$api.jsdDistributie.editDistributieRatio({
          courseId: this.version,
          system: this.addInfo.system,
          franchiseeRatio: this.addInfo.franchiseeRatio,
          promoterRatio: this.addInfo.promoterRatio
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
