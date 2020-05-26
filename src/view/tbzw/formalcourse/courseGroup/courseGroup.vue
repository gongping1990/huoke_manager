<template>
  <div class="p-courseGroup">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-courseGroup"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑课程组' : '创建课程组'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="100">
          <FormItem label='课程组名称' prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课程组名称"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-courseGroup"
        v-model="isOpenModalPrice"
        @on-cancel="isOpenModalPrice = false"
        width="500"
        title="连报价格">
        <Form :label-width="100">
          <div v-for="(item, index) of priceList" :key="index">
            <FormItem label='连报数量'>
              {{item.total}}
            </FormItem>
            <FormItem label='连报价格'>
              <Input type="text" v-model="item.price" placeholder="请输入连报价格"></Input>
            </FormItem>
          </div>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="isOpenModalPrice = false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitPrice()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs';

  export default {
    name: 'gsw_channelType',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        priceList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isOpenModalPrice: false,
        addInfo: {},
        dataItem: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入课程组名称', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '课程组名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '包含课程',
            key: 'include',
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModalPrice(params.row);
                    }
                  }
                }, '连报价格'),
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row);
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        columnsPrice: [
          {
            title: '连报数量',
            key: 'total',
            align: 'center'
          },
          {
            title: '连报总价',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(PoptipInputTem, {
                  props: {
                    dataProp: params.row
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    changeInput: (data) => {
                      this.submitPrice(data);
                    }
                  }
                }, params.row.price)
              ]);
            }
          }
        ]
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true;
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data));
        } else {
          this.addInfo = {};
        }
      },
      openModalPrice(data) {
        this.isOpenModalPrice = true;
        this.dataItem = JSON.parse(JSON.stringify(data));
        this.priceList = this.dataItem.offers;
        this.priceList.map(item=>{
          return item.price = item.price / 100
        })
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.tbzwGroupConfig.pageByCourseGroup({
          current: this.tab.page,
          size: this.tab.pageSize,
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      delItem(param, person, index) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwGroupConfig.removeCourseGroupById({
              id: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              });
          }
        });
      },
      submitInfo(name) {
        if (this.isSending) return;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true;
            this.$api.tbzwGroupConfig.editCourseGroup({
              id: this.addInfo.id,
              name: this.addInfo.name
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList();
                    this.closeModal(name);
                  }
                })
              .finally(() => {
                this.isSending = false;
              });
          }
        });
      },
      submitPrice() {
        let pass = true

        pass = this.priceList.every(item=>{
          return item.price !== ''
        })

        if (!pass) {
          return this.$Message.error('请输入连报价格')
        }

        this.priceList.forEach(item => {
          item.price = item.price * 100
        });

        this.$api.tbzwGroupConfig.editOffer({
          id: this.dataItem.id,
          offers: this.priceList
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.isOpenModalPrice = false
              this.getList();
            }
          });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-courseGroup {

    &-left {
      padding-left: 30px;
      display: flex;
      justify-content: left;
    }

    .-c-tips {
      color: #39f
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
