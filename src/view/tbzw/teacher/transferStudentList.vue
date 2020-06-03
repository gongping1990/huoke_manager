<template>
  <div>
    <Modal
      class="p-transferStudentList"
      v-model="isOpenDetail"
      @on-cancel="closeModal"
      width="750"
      title="学生列表">
      <div class="p-transferStudentList-content">
        <Row class="p-transferStudentList-flex g-search">
          <Col :span="7">
            <div class="-search">
              <Select v-model="searchInfo.type" class="-search-select">
                <Option value="0">手机号码</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.phone" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList"></Input>
            </div>
          </Col>
          <div class="-tip-div g-text-right">
            <Button @click="openModal()" ghost type="primary" style="width: 100px;">移交学生</Button>
          </div>
        </Row>

        <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList" @on-selection-change="changeSelectData"></Table>

        <Page class="g-text-right" style="width: 100%" :total="total" size="small" show-elevator :page-size="tab.pageSize"
              :current="tab.page" @on-change="currentChange"></Page>
      </div>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>

    <Modal
      class="p-transferStudentList"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      width="500"
      title="移交学生">
      <div class="p-transferStudentList-title g-tips">确认将选中的{{selectUserList.length}}个学生移交给</div>
      <Form :model="addInfo" :label-width="80" class="ivu-form-item-required">
        <FormItem label="教师名称" prop="teacherName">
          <Select v-model="addInfo.teacherId">
            <Option v-for="(item,index) in teacherList" :label="item.nickname" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>

</template>

<script>
  import Loading from "../../../components/loading";

  export default {
    name: 'transferStudentList',
    components: {Loading},
    props: ['value', 'propList', 'dataItem'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        total: 0,
        isOpenDetail: false,
        isOpenModal: false,
        isFetching: false,
        searchInfo: {
          type: '0',
          phone: ''
        },
        addInfo: {},
        dataList: [],
        teacherList: [],
        choiceList: [],
        selectUserList: [],
        columns: [
          {
            title: '用户',
            key: 'nickname',
            tooltip: true,
            align: 'center'
          },
          {
            title: '电话',
            key: 'phone',
            tooltip: true,
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
                      this.openModal(params.row)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ]
      }
    },
    mounted() {
    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        _n && this.getList()
        _n && this.selectTeacher()
      },
    },
    methods: {
      openModal () {
        this.isOpenModal = true
      },
      changeSelectData(data) {
        this.selectUserList = []
        for (let item of data) {
          this.selectUserList.push(item.puid)
        }
      },
      choiceUser(item) {
        item.isShow = !item.isShow
        this.$forceUpdate()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      selectTeacher() {
        this.$api.jsdTeacher.selectTeacher({
          courseId: this.searchInfo.courseId,
          teacherId: this.$route.query.teacherId
        })
          .then(response => {
            this.teacherList = response.data.resultData
          })
      },
      getList() {
        this.isFetching = true
        this.$api.jsdKfteacher.selectTeacher({
          courseId: this.dataItem.courseId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;

              if (this.propList.length) {
                this.propList.forEach(list => {
                  this.dataList.forEach(item => {
                    if (list.id === item.id) {
                      item.isShow = true
                    }
                  })
                })
              } else {
                this.dataList.forEach(item => {
                  item.isShow = false
                })
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      },
      submitInfo() {
        this.choiceList = []
        this.dataList.forEach(item => {
          if (item.isShow) {
            this.choiceList.push(item)
          }
        })
        this.closeModal()
        this.$emit('changeUsers', this.choiceList)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-transferStudentList {

    &-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    &-flex {
      width: 100%;
    }

    &-title {
      font-size: 18px;
      width: 90%;
      margin: 16px auto;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

  }
</style>
