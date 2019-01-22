<template>
  <div class="p-subject">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-text-right">
          <Button type="primary" class="-p-modal-btn" ghost @click="toExcel">数据导出</Button>
          <div>(用户运营数据导出)</div>
        </Col>
      </Row>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-subject"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      title="编辑学科">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="学科名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入学科名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'userList',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: '',
        selectInfo: '',
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        indeterminate: true,
        checkAll: false,
        addInfo: {
          name: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入学科名称', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '学科名称',
            key: 'name',
            align: 'center'
          },
          // {
          //   title: '操作',
          //   align: 'center',
          //   render: (h, params) => {
          //     return h('div', [
          //       h('Button', {
          //         props: {
          //           type: 'text',
          //           size: 'small'
          //         },
          //         style: {
          //           color: '#5444E4'
          //         },
          //         on: {
          //           click: () => {
          //             this.openModal(params.row)
          //           }
          //         }
          //       }, '编辑'),
          //       h('Button', {
          //         props: {
          //           type: 'text',
          //           size: 'small'
          //         },
          //         style: {
          //           color: 'rgb(218, 55, 75)',
          //           marginRight: '5px'
          //         },
          //         on: {
          //           click: () => {
          //             this.delItem(params.row)
          //           }
          //         }
          //       }, '删除')
          //     ])
          //   }
          // }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toExcel() {
        let downUrl = `http://prep.prod.k12.vip/statistics/exportUserKeepData`
        window.open(downUrl, '_blank');
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify({
          courseId : data.id,
          name: data.name
        }))
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.course.teachSubjectList()
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该学科吗？',
          onOk: () => {
            this.$api.course.delSubject({
              courseId: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            console.log(this.addInfo,1)
            let promiseDate = this.addInfo.courseId  ? this.$api.course.updateSubject(this.addInfo) : this.$api.course.addSubject(this.addInfo)
            promiseDate
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-subject {
    .-p-text-right {
      text-align: right;
    }

    .-g-m-tip {
      color: #b3b5b8;
      display: flex;
      justify-content: space-between;
    }

    .-g-m-item:nth-of-type(even) {
      margin: 0;
      float: right;
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
