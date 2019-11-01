<template>
  <div class="p-userInfo">
    <Card>
      <Row>
        <Col :span="24">
          <div class="-p-header">
            <div class="-p-h-left">
              <img :src="userInfo.headimgurl"/>
            </div>
            <div class="-p-h-right">
              <div class="-r-name">{{userInfo.nickname}}</div>
              <div class="-r-dev">
                <span>id: {{userInfo.uid}}</span>
                <span><Icon type="ios-call"/>: {{userInfo.phone || '暂无'}}</span>
                <span><Icon type="ios-time-outline"/>: {{userInfo.createTime}}</span>
              </div>
              <div class="-r-dev" style="margin-top: 10px">
                <span>孩子昵称: {{studentInfo.nickname || '暂无'}}</span>
                <span>孩子性别: {{studentInfo.sex ? searchInfo.sex === 1 ? '男' : '女' : '暂无'}}</span>
                <span>与孩子关系: {{studentInfo.relationText || '暂无'}}</span>
                <span>在读年级: {{studentInfo.gradeText || '暂无'}}</span>
                <span>所在城市: {{studentInfo.areasText || '暂无'}}</span>
                <Button @click="openModalChild" ghost type="primary" style="width: 100px;">完善孩子信息</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row class="-c-tab g-t-left">
        <Select v-model="searchInfo.appId" @on-change="changeRadio" style="width: 300px">
          <Option v-for="(item,index) in appList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
        <div class="-p-center-item">
          <div class="-c-text">购买数据</div>
          <div>
            <span>是否关注: {{userInfo.subscripbe ? '是' : '否'}}</span>
            <span>是否购买: {{userInfo.buyed ? '是' : '否'}}</span>
            <span>支付时间: {{userInfo.buyedTime}}</span>
          </div>
        </div>
        <div class="-p-center-item">
          <div class="-c-text">学习数据</div>
          <div>
            <span>开课日期: {{userInfo.learnStartDate}}</span>
            <span>课程进度: {{userInfo.learnProgress}}</span>
            <span>交作业课时数: {{userInfo.homeworkLesson}}</span>
            <span>老师批改作业数: {{userInfo.teacherReply}}</span>
            <span>累计打卡: {{userInfo.totalCards}}</span>
            <span>最近连续打卡: {{userInfo.continuousCards}}</span>
            <span>最长连续打卡: {{userInfo.maxContinuousCards}}</span>
          </div>
        </div>
      </Row>

      <div class="-c-tab">
        <Row>
          <div class="-c-text">上课作业记录</div>
          <Table :columns="columns" :data="dataList"></Table>
        </Row>
      </div>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>
    <loading v-if="isFetching"></loading>

    <job-record-template v-model="isOpenModal" :dataInfo="detailInfo" :type="2"></job-record-template>

    <Modal
      class="p-userInfo"
      v-model="isOpenModalChild"
      @on-cancel="closeModal('addInfo')"
      width="500"
      title="完善信息">
      <Form ref="addInfo" :model="addInfo" :label-width="100">
        <FormItem label="孩子昵称" prop="nickname">
          <Input type="text" v-model="addInfo.nickname" placeholder="请输入孩子昵称"></Input>
        </FormItem>
        <FormItem label="孩子性别" prop="sex">
          <Radio-group v-model="addInfo.sex">
            <Radio :label=1>男</Radio>
            <Radio :label=2>女</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="与孩子关系" prop="relation">
          <Select v-model="addInfo.relation">
            <Option v-for="(item,index) in relationList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="在读年级" prop="grade">
          <Select v-model="addInfo.grade">
            <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="所在城市">
          <Cascader :data="addressList" v-model="addInfo.areasId" @on-change="changeCascarder"></Cascader>
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
  import areaList from '@/libs/area'
  import Loading from "@/components/loading";
  import dayjs from 'dayjs'
  import JobRecordTemplate from "../../../components/jobRecordTemplate";

  export default {
    name: 'tbzwUserInfo',
    components: {JobRecordTemplate, Loading},
    props: ['userId', 'sortNum', 'courseId'],
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        userInfo: {},
        detailInfo: {},
        studentInfo: {},
        searchInfo: {
          appId: '7'
        },
        addInfo: {
          nickname: '',
          sex: '',
          relation: '',
          grade: '',
          areasId: []
        },
        addressList: areaList.list,
        dataList: [],
        appList: [],
        relationList: [
          {
            key: 1,
            name: '爸爸'
          },
          {
            key: 2,
            name: '妈妈'
          },
          {
            key: 3,
            name: '爷爷'
          },
          {
            key: 4,
            name: '奶奶'
          },
          {
            key: 5,
            name: '外公'
          },
          {
            key: 6,
            name: '外婆'
          },
          {
            key: 0,
            name: '亲友'
          }
        ],
        gradeList: [
          {
            name: '一年级',
            key: 2
          },
          {
            name: '二年级',
            key: 3
          },
          {
            name: '三年级',
            key: 4
          },
          {
            name: '四年级',
            key: 5
          },
          {
            name: '五年级',
            key: 6
          },
          {
            name: '六年级',
            key: 7
          },
          {
            name: '初中',
            key: 8
          },
          {
            name: '幼儿园',
            key: 1
          },
          {
            name: '其他',
            key: 0
          }
        ],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalChild: false,
        isSending: false,
        columns: [
          {
            title: '课时名称',
            key: 'lessonName'
          },
          {
            title: '首次完成上课时间',
            render: (h, params) => {
              return h('div', params.row.firstLearnTime ? dayjs(+params.row.firstLearnTime).format("YYYY-MM-DD HH:mm") : '暂无')
            }
          },
          {
            title: '最后交作业时间',
            render: (h, params) => {
              return h('div', params.row.lastSubmitTime ? dayjs(+params.row.lastSubmitTime).format("YYYY-MM-DD HH:mm") : '暂无')
            }
          },
          {
            title: '老师最后批改时间',
            render: (h, params) => {
              return h('div', params.row.lastReplyTime ? dayjs(+params.row.lastReplyTime).format("YYYY-MM-DD HH:mm") : '暂无')
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
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
                    this.openModal(params.row)
                  }
                }
              }, '作业记录')
            }
          }
        ],
      };
    },
    mounted() {
      this.listBase()
    },
    methods: {
      changeCascarder(value, selectedData) {
        this.addInfo.areasText = selectedData[2].__label
        console.log(selectedData[2].__label)
      },
      changeRadio() {
        this.searchInfo.appId = this.searchInfo.appId || this.courseId
        if(localStorage.isJump !== '1') {
          this.tab.currentPage = 1
          this.getLearnDTO()
          this.listLessonProgress(1)
        }
      },
      openModalChild() {
        if (!this.addInfo.id) {
          this.addInfo = {
            nickname: '',
            sex: '',
            relation: '',
            grade: '',
            areasId: []
          }
        }
        this.isOpenModalChild = true
      },
      closeModal(name) {
        this.isOpenModalChild = false
        this.getStudent()
        this.$refs[name].resetFields()
      },
      openModal(data) {
        this.isOpenModal = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
        this.detailInfo.appId = this.searchInfo.appId
        this.detailInfo.uid = this.$route.query.id || this.userId
      },
      currentChange(val) {
        this.listLessonProgress(val);
      },
      listBase() {
        this.appList = []
        this.tab.currentPage = this.sortNum ? Math.ceil(this.sortNum / 10) : 1
        this.$api.jsdJob.listBase({
          onlyme: true
        })
          .then(response => {
            this.appList = response.data.resultData
            this.searchInfo.appId = this.courseId || this.appList[0].id
            if (this.$route.query.id || this.userId) {
              this.getLearnDTO()
              this.getStudent()
            }
            this.listLessonProgress()
            localStorage.setItem('isJump', '2')
          })
      },
      //分页查询
      getLearnDTO() {
        this.isFetching = true
        this.$api.jsdJob.getLearnDTO({
          uid: this.$route.query.id || this.userId,
          courseId: this.searchInfo.appId
        })
          .then(
            response => {
              this.userInfo = response.data.resultData;
              this.userInfo.learnStartDate = this.userInfo.learnStartDate ? dayjs(+this.userInfo.learnStartDate).format('YYYY-MM-DD') : '暂无'
              this.userInfo.buyedTime = this.userInfo.buyedTime ? dayjs(+this.userInfo.buyedTime).format('YYYY-MM-DD HH:mm') : '暂无'
              this.userInfo.createTime = dayjs(+this.userInfo.createTime).format('YYYY-MM-DD HH:mm')
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listLessonProgress(page) {
        if (this.sortNum) {
          this.tab.page = page || Math.ceil(this.sortNum / 10)
        }
        this.$api.jsdJob.listLessonProgress({
          uid: this.$route.query.id || this.userId,
          courseId: this.searchInfo.appId,
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
        this.$forceUpdate()
      },
      getStudent() {
        this.$api.tbzwStudent.getStudent({
          puid: this.$route.query.id || this.userId,
        })
          .then(
            response => {
              if (response.data.resultData) {
                this.addInfo = response.data.resultData
                if (!Array.isArray(this.addInfo.areasId)) {
                  this.addInfo.areasId = this.addInfo.areasId.split(',')
                }
              } else {
                this.addInfo = {
                  nickname: '',
                  sex: '',
                  relation: '',
                  grade: '',
                  gradeText: '',
                  areasIdText: '',
                  areasId: []
                }
              }

              this.studentInfo = JSON.parse(JSON.stringify(this.addInfo))
            })
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let params = {
              puid: this.$route.query.id || this.userId,
              areasId: `${this.addInfo.areasId}`,
              relation: this.addInfo.relation,
              grade: this.addInfo.grade,
              sex: this.addInfo.sex,
              areasText: this.addInfo.areasText,
              nickname: this.addInfo.nickname
            }
            let promiseDate = this.addInfo.id ? this.$api.tbzwStudent.updateStudent({
              id: this.addInfo.id,
              ...params
            }) : this.$api.tbzwStudent.addStudent(params)
            promiseDate
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getStudent()
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      },
    }
  };
</script>
<style lang="less" scoped>
  .p-userInfo {

    .-p-header {
      display: flex;

      .-p-h-left {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .-p-h-right {
        margin-left: 20px;
        text-align: left;

        .-r-name {
          font-size: 30px;
          font-weight: bold;
        }

        .-r-dev {
          color: #b3b5b8;

          span {
            padding-right: 20px;
          }
        }
      }
    }

    .-p-center-item {
      margin-top: 20px;

      span {
        color: #b3b5b8;
        padding-right: 20px;
      }
    }
    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0 20px 90px;

      .-c-text {
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
      }
    }
  }
</style>
