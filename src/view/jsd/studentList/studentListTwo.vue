<template>
  <div class="p-student">
    <Card>
      <div class="g-t-left p-student-teacher">当前选中：{{$route.query.name}}</div>
      <Row class="g-search -c-tab">
        <Col :span="7" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="searchInfo.courseId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of courseList" :label=item.name :value=item.id :key="item.id" ></Option>
            </Select>
          </div>
        </Col>
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">手机号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <Row class="p-student-flex -c-tab">
        <div class="-tip-div g-t-left">
          <Checkbox v-model="selectAllData" @on-change="changeAloneSelect">所有学生</Checkbox>
        </div>
        <div class="-tip-div g-text-right">
          <Button @click="openModal()" ghost type="primary" style="width: 100px;">移交学生</Button>
        </div>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList" ref="selection"
             @on-selection-change="changeSelectData"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>

    <Modal
      class="p-student"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      width="500"
      title="移交学生">
      <div class="p-student-title -c-tips">确认将选中的{{selectUserList.length}}个学生移交给</div>
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="教师名称" prop="teacherName">
          <Select v-model="addInfo.teacherId">
            <Option v-for="(item,index) in teacherList" :label="item.nickname" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <look-user-info v-model="isOpenUserInfo" :dataInfo="detailInfo"></look-user-info>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import LookUserInfo from "../todayWork/lookUserInfo";

  export default {
    name: 'studentListTwo',
    components: {LookUserInfo},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        searchInfo: {
          courseId: ''
        },
        selectInfo: '1',
        dataList: [],
        teacherList: [],
        courseList: [],
        detailInfo: {},
        addInfo: {
          courseType: ''
        },
        selectAllData: '',
        selectUserList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenUserInfo: false,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.pavatar
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            }
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '孩子昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '孩子性别',
            key: 'sex',
            render: (h, params)=> {
              return h('span', params.row.sex ? '男' : '女')
            },
            align: 'center'
          },
          {
            title: '与孩子关系',
            key: 'relationText',
            align: 'center'
          },
          {
            title: '在读年级',
            key: 'gradeText',
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
                      this.toDetail(params.row)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.listBase()
    },
    methods: {
      changeAloneSelect() {
        this.$refs.selection.selectAll(this.selectAllData);
      },
      changeSelectData(data) {
        this.selectUserList = []
        for (let item of data) {
          this.selectUserList.push(item.workId)
        }
      },
      openModal () {
        if (this.selectUserList.length) {
          this.addInfo.teacherId = ''
          this.isOpenModal = true
          this.selectTeacher()
        } else {
          this.$Message.error('请选中需要移交的学生')
        }

      },
      toDetail(param) {
        this.isOpenUserInfo = true
        this.detailInfo = param
        this.detailInfo.uid = this.detailInfo.puid
        console.log(this.detailInfo)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      listBase() {
        this.courseList = []
        this.$api.jsdJob.listBase({
          onlyme: true,
          teacherId: this.$route.query.teacherId
        })
          .then(response => {
            this.courseList = response.data.resultData
            this.searchInfo.courseId =  this.courseList.length && this.courseList[0].id
            this.getList()
          })
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
      //分页查询
      getList(num) {
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.searchInfo.courseId,
          teacherId: this.$route.query.teacherId
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.isFetching = true
        this.$api.jsdTeacher.listStudentByPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (!this.addInfo.teacherId) {
          return this.$Message.error('请选择需要移交的老师')
        }
        this.$api.jsdTeacher.moveUserToTeacher({
          courseId: this.searchInfo.courseId,
          userIds: this.$route.query.teacherId,
          targetTeacher: this.addInfo.teacherId,
        })
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
              this.getList()
              this.isOpenModal = false
            }
          })
      },
    }
  };
</script>


<style lang="less" scoped>
  .p-student {

    &-title {
      font-size: 18px;
      width: 90%;
      margin: 16px auto;
    }

    &-teacher {
      color: rgb(84, 68, 228);
    }

    &-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .-tip-div {
        width: 50%;
      }
    }

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
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


    .-p-v-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }
  }
</style>
