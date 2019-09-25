<template>
  <div class="p-distribution">

    <Card>
      <div class="g-add-btn" @click="openModal('',3)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-distribution"
      v-model="isOpenModal"
      @on-cancel="closeModal"
      width="650"
      :title="titleList[openType]">

      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"
             v-if="openType ===1"></Table>

      <Page class="g-t-center" :total="totalDetail" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage" v-if="openType === 1"
            @on-change="detailCurrentChange"></Page>

      <Form ref="addInfo" :model="addInfo" :label-width="140" v-if="openType === 2">
        <FormItem label="课程名称">
          {{addInfo.courseName}}
        </FormItem>
        <FormItem label="单独购价格">
          {{addInfo.ddgPrice / 100}} 元
        </FormItem>
        <FormItem label="拼团价格">
          {{addInfo.ptPrice / 100}} 元
        </FormItem>
        <FormItem label="推广人佣金比例(%)" prop="promoterRatio">
          <Input type="text" v-model="addInfo.promoterRatio" placeholder="请输入推广人佣金比例(%)"></Input>
        </FormItem>
        <FormItem label="加盟商佣金比例(%)" prop="franchiseeRatio">
          <Input type="text" v-model="addInfo.franchiseeRatio" placeholder="请输入加盟商佣金比例(%)"></Input>
        </FormItem>
      </Form>

      <Form ref="addInfo" :model="addInfo" :label-width="100" v-if="openType === 3 || openType === 4">
        <FormItem label="选择课程" class="ivu-form-item-required">
          <Select v-model="addInfo.courseId" class="-search-selectOne">
            <Option v-for="(item,index) in courseList" :label="item.courseName" :value="item.courseId" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="课程购买链接" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.salesUrl" placeholder="请输入课程购买链接"></Input>
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
        titleList: {
          '1': '佣金设置',
          '2': '变更记录',
          '3': '添加分销课程',
          '4': '编辑分销课程'
        },
        dataList: [],
        detailList: [],
        courseList: [],
        version: '',
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        openType: '',
        addInfo: {
          courseId: ''
        },
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
                    color: '#1890FF',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row, 4)
                    }
                  }
                }, '编辑'),
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
                }, '佣金设置'),
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
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        }
        this.isOpenModal = true
        this.getDetailList();
        this.getCourseList()
      },
      getDetailList() {
        this.isFetching = true
        this.$api.jsdDistributie.pageDistributieRatioLog({
          distributieRatioId: this.addInfo.id,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      getCourseList() {
        this.$api.jsdDistributie.listByCourse()
          .then(response => {
          this.courseList = response.data.resultData
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
        let paramUrl = ''
        if (this.openType === 1) {
          return this.closeModal()
        }

        if (!this.addInfo.promoterRatio && this.openType === 2) {
          return this.$Message.error('请输入推广人佣金比例')
        } else if (!this.addInfo.franchiseeRatio && this.openType === 2) {
          return this.$Message.error('请输入加盟商佣金比例')
        } else if (!this.addInfo.courseId && (this.openType === 3 || this.openType === 4)) {
          return this.$Message.error('请选择课程')
        } else if (!this.addInfo.salesUrl && (this.openType === 3 || this.openType === 4)) {
          return this.$Message.error('请输入课程链接')
        }

        if (this.isSending) return

        this.isSending = true

        switch (+this.openType) {
          case 2:
            paramUrl = this.$api.jsdDistributie.editDistributieRatio({
              id: this.addInfo.id,
              franchiseeRatio: this.addInfo.franchiseeRatio,
              promoterRatio: this.addInfo.promoterRatio
            })
            break
          case 3:
          case 4:
            this.courseList.forEach(item=>{
              if(this.addInfo.courseId === item.courseId) {
                this.addInfo.system = item.system
              }
            })

            paramUrl =  this.$api.jsdDistributie.editDistributieCourse({
              id: this.addInfo.id,
              salesUrl: this.addInfo.salesUrl,
              system: this.addInfo.system,
              courseId: this.addInfo.courseId
            })
            break
        }

        paramUrl.then(
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
