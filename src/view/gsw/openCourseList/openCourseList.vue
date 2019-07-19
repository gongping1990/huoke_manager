<template>
  <div class="p-openCourse">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <Radio :label=1>试听</Radio>
          <Radio :label=2>购课</Radio>
        </Radio-group>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-openCourse"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="添加学习营">
        <Form ref="addInfo" :model="addInfo" :label-width="90">
          <Form-item label="开营日期" class="ivu-form-item-required">
            <Date-picker style="width: 100%" :options="dateOption" type="date" placeholder="选择日期"
                         v-model="addInfo.opentime"></Date-picker>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'openCourse',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        radioType: 1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        dateOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        columns: [
          {
            title: '期数',
            key: 'periods'
          },
          {
            title: '报名人数',
            key: 'count'
          },
          {
            title: '开营日期',
            key: 'opentime',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'gmtCreate',
            align: 'center'
          },
          {
            title: '操作',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
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
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
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
      openModal() {
        this.isOpenModal = true
        this.addInfo = {}
      },
      closeModal() {
        this.isOpenModal = false
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.gswActive.listActiveConfig({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: this.radioType,
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.gswActive.removeActive({
              activeConfigId: param.id
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
      submitInfo() {
        if (!this.addInfo.opentime) {
          return this.$Message.error("请选择开营时间");
        }
        if (this.isSending) return
        this.isSending = true
        this.$api.gswActive.addActiveConfig({
          opentime: dayjs(this.addInfo.opentime).format("YYYY-MM-DD"),
          type: this.radioType
        })
          .then(
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
  .p-openCourse {
    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
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
