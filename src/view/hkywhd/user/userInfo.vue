<template>
  <div class="p-userInfo">
    <Card>
      <Row>
        <Col :span="20">
          <div class="-p-header">
            <div class="-p-h-left">
              <img :src="userInfo.headimgurl"/>
            </div>
            <div class="-p-h-right">
              <div class="-r-name">{{userInfo.nickname}}</div>
              <div class="-r-dev">
                <span>id: {{userInfo.userId}}</span>
                <span><Icon type="ios-call"/>: {{userInfo.phone || '暂无'}}</span>
                <span><Icon type="ios-time-outline"/>: {{userInfo.createTime}}</span>
              </div>

              <div class="-r-btn">
                <RadioGroup v-model="tabType" type="button">
                  <Radio label="1">基础信息</Radio>
                  <Radio label="2">学习数据</Radio>
                </RadioGroup>
              </div>

              <div v-show="tabType === '1'">
                <div class="-r-dev" style="margin-top: 30px">
                  <div class="-r-dev-title">基础特征</div>
                  <span class="-r-dev-role">用户角色: {{studentInfo.nickname || '暂无'}}</span>
                </div>
                <div class="-r-dev" style="margin-top: 10px">
                  <div class="-r-dev-title">孩子信息</div>
                  <span class="-r-dev-role">孩子姓名: {{studentInfo.nickname || '暂无'}}</span>
                  <span class="-r-dev-role">孩子性别: {{studentInfo.sex === null ? '暂无' : studentInfo.sex ? '男' : '女'}}</span>
                  <span class="-r-dev-role">在读年级: {{studentInfo.gradeText || '暂无'}}</span>
                  <span class="-r-dev-role">所在城市: {{studentInfo.gradeText || '暂无'}}</span>
                  <span class="-r-dev-role">与孩子关系: {{studentInfo.gradeText || '暂无'}}</span>
                  <span class="-r-dev-role">是否陪伴孩子身边: {{studentInfo.gradeText || '暂无'}}</span>
                  <!--<Button @click="openModalChild" ghost type="primary" style="width: 100px;">完善孩子信息</Button>-->
                </div>
                <div class="-r-dev" style="margin-top: 10px">
                  <div class="-r-dev-title">兴趣标签</div>
                  <Tag>q1111</Tag>
                </div>
                <!--<div class="-r-dev" style="margin-top: 10px">-->
                  <!--<span>是否关注: {{userInfo.subscripbe ? '是' : '否'}}</span>-->
                  <!--<span>是否购买: {{userInfo.buyed ? '是' : '否'}}</span>-->
                  <!--<span>支付时间: {{userInfo.buyTime || '未购买'}}</span>-->
                <!--</div>-->
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row class="-c-tab g-t-left"  v-show="tabType === '2'">
        <Select v-model="searchInfo.appId" @on-change="changeRadio()" style="width: 300px">
          <Option v-for="(item,index) in appList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </Row>

      <div class="-c-tab" v-show="tabType === '2'">
        <Row>
          <div class="-c-text">上课数据</div>
          <Table :columns="!dataItem.label ? columns : columnsTwo" :data="dataList"></Table>
        </Row>
      </div>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange" v-show="tabType === '2'"></Page>
    </Card>
    <loading v-if="isFetching"></loading>

    <Modal
      class="p-userInfo"
      v-model="isOpenModalChild"
      @on-cancel="closeModal('addInfo')"
      width="500"
      title="完善信息">
      <Form ref="addInfo" :model="addInfo" :label-width="100">
        <FormItem label="孩子昵称">
          <Input type="text" v-model="addInfo.nickname" placeholder="请输入孩子昵称"></Input>
        </FormItem>
        <FormItem label="孩子性别" prop="sex">
          <Radio-group v-model="addInfo.sex">
            <Radio :label=1>男</Radio>
            <Radio :label=0>女</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="在读年级">
          <Select v-model="addInfo.grade">
            <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>

  </div>
</template>

<script>

  import Loading from "@/components/loading";
  import dayjs from 'dayjs'

  export default {
    name: 'hkywhd_userInfo',
    components: {Loading},
    props: ['userId'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        userInfo: {},
        studentInfo: '',
        addInfo: {},
        searchInfo: {
          appId: '7'
        },
        dataList: [],
        dataItem: '',
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
        appList: [],
        total: 0,
        tabType: '1',
        isFetching: false,
        isOpenModal: false,
        isOpenModalChild: false,
        columns: [
          {
            title: '课时名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否完成学习',
            render: (h, params) => {
              return h('div', [
                h('div', `生字：${params.row.studyNewword ? '是' : '否'}`),
                h('div', `朗读：${params.row.studyReaded ? '是' : '否'}`),
                h('div', `精读：${params.row.studyCarefulRead ? '是' : '否'}`)
              ])
            },
            align: 'center'
          },
          {
            title: '是否通关',
            render: (h, params) => {
              return h('div',[
                h('div', `生字：${params.row.clearanceNewword ? '是' : '否'}`),
                h('div', `朗读：${params.row.clearanceReaded ? '是' : '否'}`),
                h('div', `精读：${params.row.clearanceCarefulRead ? '是' : '否'}`)
              ])
            },
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '课时名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否完成学习',
            render: (h, params) => {
              return h('div', params.row.clearanceNewword ? '是' : '否')
            },
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.listBase()
    },
    methods: {
      changeRadio () {
        console.log(this.searchInfo.appId,111)
        this.appList.forEach(item=> {
          if(item.id === this.searchInfo.appId) {
            this.dataItem = item
          }
        })

        if (this.dataItem.label) {
          this.listByLessonStudyData()
        } else {
          this.listLessonProgress()
        }
      },
      openModalChild() {
        if (!this.addInfo.id) {
          this.addInfo = {
            nickname: '',
            sex: null,
            grade: ''
          }
        }
        this.isOpenModalChild = true
      },
      closeModal(name) {
        this.isOpenModalChild = false
        this.getStudent()
        this.$refs[name].resetFields()
      },
      openModal() {
        this.isOpenModal = true
      },
      currentChange(val) {
        this.tab.page = val;
        this.listLessonProgress();
      },
      listBase() {
        this.appList = []
        this.$api.hkywhdOrder.listBuyedBook({
          uid: this.$route.query.id || this.userId
        })
          .then(response => {
            this.appList = response.data.resultData
            this.searchInfo.appId = this.appList.length && this.appList[0].id
            this.searchInfo.tbookId = this.appList.length && this.appList[0].tbookId
            this.searchInfo.type = this.appList.length && this.appList[0].type

            if(this.$route.query.id || this.userId) {
              this.listLessonProgress()
              this.changeRadio()
              this.getStudent()
            }
          })
      },
      //分页查询
      listLessonProgress() {
        let params = {
          userId: this.$route.query.id || this.userId,
        }

        if (this.searchInfo.type) {
          params.tbookId = this.searchInfo.tbookId
        } else {
          params.bookId = this.searchInfo.appId
        }

        this.$api.hkywhdStatistics.getUserLearnStatistics(params)
          .then(
            response => {
              this.userInfo = response.data.resultData
              this.dataList = response.data.resultData.dataList;
              this.userInfo.learnStartDate = this.userInfo.learnStartDate ? dayjs(+this.userInfo.learnStartDate).format('YYYY-MM-DD') : '暂无'
              this.userInfo.buyedTime =  this.userInfo.buyedTime ? dayjs(+this.userInfo.buyedTime).format('YYYY-MM-DD HH:mm') : '暂无'
            })
      },
      listByLessonStudyData() {
        this.$api.hkywhdHomePage.listByLessonStudyData({
          userId: this.$route.query.id || this.userId,
          bookId: this.searchInfo.appId
        })
          .then(
            response => {
              this.dataList = response.data.resultData.dataList;
            })
      },
      getStudent() {
        this.$api.tbzwStudent.getStudent({
          puid: this.$route.query.id || this.userId,
        })
          .then(
            response => {
              if (response.data.resultData) {
                this.addInfo = response.data.resultData
              } else {
                this.addInfo = {
                  nickname: '',
                  sex: null,
                  grade: '',
                  gradeText: '',
                }
              }

              this.studentInfo = JSON.parse(JSON.stringify(this.addInfo))
            })
      },
      submitInfo(name) {
        this.isSending = true
        let params = {
          puid: this.$route.query.id || this.userId,
          grade: this.addInfo.grade,
          sex: this.addInfo.sex,
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

        .-r-btn {
          margin-top: 10px;
        }
        .-r-name {
          font-size: 30px;
          font-weight: bold;
        }

        .-r-dev {
          color: #b3b5b8;

          &-title {
            font-weight: bold;
            font-size: 18px;
            color: #2b2828;
          }

          &-role {
            margin-top: 10px;
            display: block;
            color: #2b2828;
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
