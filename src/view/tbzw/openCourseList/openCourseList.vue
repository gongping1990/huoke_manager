<template>
  <div class="p-openCourse">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-flex-a-j-center">
          <Row class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="radioType" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in courselList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </Row>
        </Col>
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
          <FormItem label="期数">
            {{addInfo.periods}}
          </FormItem>
          <FormItem label="生效课程">
            {{addInfo.periods}}
          </FormItem>
          <Form-item label="开营日期" class="ivu-form-item-required">
            <Date-picker style="width: 100%" :options="dateOption" type="date" placeholder="选择日期"
                         v-model="addInfo.opentime"></Date-picker>
          </Form-item>
          <FormItem label="排课天数" class="ivu-form-item-required">
            <div class="p-openCourse-btnWrap" v-for="(item, index) of courselList" :key="index">
              <button>{{item.name}}</button>
            </div>
          </FormItem>
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
        courselList: [],
        total: 0,
        radioType: 1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        weekList: [
          {
            id: '1',
            name: '星期一'
          },
          {
            id: '2',
            name: '星期二'
          },
          {
            id: '3',
            name: '星期三'
          },
          {
            id: '4',
            name: '星期四'
          },
          {
            id: '5',
            name: '星期五'
          },
          {
            id: '6',
            name: '星期六'
          },
          {
            id: '7',
            name: '星期天'
          }
        ],
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
          type: 2
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
          type: 2
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

    &-btnWrap {

    }
    .-c-tips {
      color: #39f
    }

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
      text-align: left;
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
  }
</style>
