<template>
  <div class="p-distributionCourse">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-flex-a-j-center">
          <Radio-group v-model="radioType" type="button" @on-change="getList">
            <Radio :label=2>付费体验课</Radio>
            <Radio :label=1>正式课</Radio>
          </Radio-group>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-distributionCourse"
      v-model="isOpenModalData"
      @on-cancel="closeModal('addInfo')"
      title="收益比例">
      <Form ref="addInfo" :model="addInfo" :label-width="80" :rules="ruleValidate">
        <FormItem label="收益比例" prop="scale">
          <Input type="text" v-model="addInfo.scale" placeholder="请输入收益比例"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";

  export default {
    name: 'fxgl_distributionCourse',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        radioType: 2,
        addInfo: {},
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModalData: false,
        columns: [
          {
            title: '课程名称',
            key: 'cname',
            align: 'center'
          },
          {
            title: '收益比例',
            render: (h, params) => {
              return h('div', params.row.sacle ? `${params.row.sacle}%` : '-');
            },
            align: 'center'
          },
          {
            title: '分销状态',
            render: (h, p) => {
              return h('div', p.row.enable ? '已开启' : '已关闭');
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openConfirm(params.row, 1);
                    }
                  }
                }, params.row.enable ? '关闭分销' : '开启分销'),
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
                      this.openModal(params.row);
                    }
                  }
                }, '收益比例')
              ]);
            }
          }
        ],
        ruleValidate: {
          scale: [
            {required: true, message: '请输入收益比例', trigger: 'blur'},
          ]
        },
      };
    },
    computed: {},
    mounted() {
      this.getList();
    },
    methods: {
      openModal(data) {
        this.isOpenModalData = true;
        this.addInfo = JSON.parse(JSON.stringify(data));
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      closeModal(name) {
        this.isOpenModalData = false;
        this.$refs[name].resetFields();
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.tbzwDistribution.listCourse({
          type: this.radioType
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      openConfirm(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要改变吗？',
          onOk: () => {
            this.$api.tbzwDistribution.enableCourse({
              cid: param.cid
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
            this.$api.tbzwDistribution.updateCourseDistribution({
              cid: this.addInfo.cid,
              scale: this.addInfo.scale
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList();
                    this.closeModal(name);
                  }
                });
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-distributionCourse {

    .-c-tab {
      margin: 29px 0;
    }

    .-p-o-flex {
      display: flex;
      justify-content: space-around;
    }

    .-c-tips {
      color: #39f
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

  }
</style>
