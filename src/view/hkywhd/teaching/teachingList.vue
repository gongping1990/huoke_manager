<template>
  <div class="p-teach">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadioType">
          <Radio :label=1>课程列表</Radio>
          <Radio :label=2>活动配置</Radio>
          <Radio :label=3>历史记录</Radio>
        </Radio-group>
      </Row>
      <Row v-show="radioType === 1" class="-c-tab">
        <Col :span="3">
          <Select v-model="selectInfo" @on-change="getList">
            <Option value='0'>全部年级</Option>
            <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </Col>
      </Row>
      <div v-show="radioType === 1" class="g-add-btn -t-add-icon" @click="openModal">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table v-show="radioType === 1" class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
      <div v-show="radioType === 2" >
        <Form class="g-t-left ivu-form-item-required -c-tab p-teach-form" ref="addInfo" :model="addInfo"
              :label-width="100">
          <FormItem label="单独购价格" prop="ddgPrice">
            <Input type="text" v-model="activeInfo.ddgPrice" placeholder="请输入单独购价格" :disabled="!isShowEdit"></Input>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <Form-item label="是否开启" class=" -c-form-item ">
            <Radio-group v-model="activeInfo.open">
              <Radio :label=1 :disabled="!isShowEdit">开启</Radio>
              <Radio :label=0 :disabled="!isShowEdit">关闭</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="活动价格" prop="activityPrice">
            <Input type="text" v-model="activeInfo.activityPrice" placeholder="请输入活动价格" :disabled="!isShowEdit"></Input>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </Form-item>
          <FormItem label="邀请人数" prop="invites">
            <Input type="text" v-model="activeInfo.invites" placeholder="请输入邀请人数" :disabled="!isShowEdit"></Input>
          </FormItem>
          <!--<FormItem label="活动时限" prop="activityTimelimit">-->
            <!--<Input type="text" v-model="activeInfo.activityTimelimit" placeholder="请输入活动时限（小时）" :disabled="!isShowEdit"></Input>-->
          <!--</FormItem>-->
          <FormItem label="解锁课时数" >
            <Input type="text" v-model="activeInfo.unlockNums" placeholder="请输入解锁课时数" :disabled="!isShowEdit"></Input>
          </FormItem>
          <FormItem>
            <div class="-c-flex">
              <Button @click="isShowEdit = true" ghost type="primary" class="-c-btn" v-if="!isShowEdit">进入编辑</Button>
              <Button @click="isShowEdit = false" ghost type="primary" style="width: 100px" class="-c-btn" v-else>取消</Button>
              <div v-if="isShowEdit" @click="submitInfoActive('addInfo')" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' :
                '确 认'}}
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
      <Table v-show="radioType === 3" class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="dataListTwo"></Table>
    </Card>

    <Modal
      class="p-subject"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      title="编辑课程">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="课程名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入学科名称"></Input>
        </FormItem>
        <FormItem label="教材版本" prop="edition">
          <Select v-model="addInfo.edition">
            <Option v-for="(item,index) in teachVersion" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用年级" prop="grade">
          <Select v-model="addInfo.grade">
            <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用学期" prop="semester">
          <Select v-model="addInfo.semester">
            <Option v-for="(item,index) in semesterList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用学科" prop="courseId">
          <Select v-model="addInfo.courseId">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="课时总数" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入课时总数"></Input>
        </FormItem>
        <FormItem label="课程描述" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入课程描述"></Input>
        </FormItem>
        <FormItem label="竖版课程封面">
          <upload-img v-model="addInfo.coverImgUrl" :option="uploadOption"></upload-img>
        </FormItem>
        <FormItem label="首页课程封面">
          <upload-img v-model="addInfo.coverImgUrl" :option="uploadOption"></upload-img>
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
  import dayjs from 'dayjs'
  import UploadImg from "../../../components/uploadImg";
  export default {
    name: 'teachingList',
    components: {UploadImg},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        selectInfo: '0',
        dataList: [],
        dataListTwo: [],
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        total: 0,
        radioType: 1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        indeterminate: true,
        isShowEdit: false,
        teachVersion: [],
        gradeList: [
          {
            name: '一年级',
            key: 1
          },
          {
            name: '二年级',
            key: 2
          },
          {
            name: '三年级',
            key: 3
          },
          {
            name: '四年级',
            key: 4
          },
          {
            name: '五年级',
            key: 5
          },
          {
            name: '六年级',
            key: 6
          }
        ],
        semesterList: [
          {
            name: '上学期',
            key: 1
          },
          {
            name: '下学期',
            key: 2
          }
        ],
        courseList: [],
        addInfo: {
          name: '',
          edition: '',
          grade: '',
          semester: '',
          courseId: '',
        },
        activeInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入教材名称',  trigger: 'blur'}
          ],
          edition: [
            {required: true, message: '请选择教材版本', type: 'number', trigger: 'change'}
          ],
          grade: [
            {required: true, message: '请选择年级', type: 'number', trigger: 'change'}
          ],
          semester: [
            {required: true, message: '请选择学期', type: 'number', trigger: 'change'}
          ],
          courseId: [
            {required: true, message: '请选择学科', trigger: 'change'}
          ],

        },
        columns: [
          {
            title: '教材名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '教材版本',
            key: 'editionText',
            align: 'center'
          },
          {
            title: '适用年级',
            key: 'gradeText',
            align: 'center'
          },
          {
            title: '适用学科',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '适用学期',
            key: 'semesterText',
            align: 'center'
          },
          {
            title: '操作',
            width:200,
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
                      this.toJump(params.row)
                    }
                  }
                }, '章节管理'),
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgb(218, 55, 75)',
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
        columnsTwo: [
          {
            title: '修改内容（修改前 -> 修改后）',
            render: (h, params)=> {
              return h('div',[
                h('div', `活动${params.row.open}`),
                h('div', `单独购价格${params.row.ddgPrice}`),
                h('div', `活动价格${params.row.activityPrice}`),
                h('div', `邀请人数${params.row.invites}`),
                h('div', `活动时限${params.row.activityTimelimit}`),
                h('div', `活动价解锁课时数${params.row.unlockNums}`),
              ])
            },
            align: 'center'
          },
          {
            title: '操作人',
            key: 'compiler',
            align: 'center'
          },
          {
            title: '操作时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getList()
      this.getSubjectList()
      this.getEditionList()
    },
    methods: {
      changeRadioType () {
        switch (+this.radioType) {
          case 1:
            this.getList()
            break
          case 2:
            this.getActivityById()
            break
          case 3:
            this.pageByActivityLog()
            break
        }
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      toJump (data) {
        localStorage.setItem('chapterId','')
        this.$router.push({
          name: 'hkywhd_teachMain',
          query: {
            bookId: data.id,
            courseName: data.courseName,
            courseId: data.courseId,
            gradeText: data.gradeText,
            grade: data.grade,
            editionText: data.editionText,
            edition: data.edition,
            semesterText: data.semesterText,
            semester: data.semester
          }
        })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.hkywhdBook.teachingList({
          grade: this.selectInfo == '0' ? '' : this.selectInfo
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getSubjectList() {

        this.$api.hkywhdCourse.teachSubjectList()
          .then(
            response => {
              this.courseList = response.data.resultData;
            })
          .finally(() => {

          })
      },
      pageByActivityLog() {
        this.$api.hkywhdActivity.pageByActivityLog({
          current: this.tab.page,
          size: this.tab.pageSize,
        })
          .then(
            response => {
              this.dataListTwo = response.data.resultData.records;
            })
          .finally(() => {

          })
      },
      getActivityById() {

        this.$api.hkywhdActivity.getActivityById()
          .then(
            response => {
              this.activeInfo = response.data.resultData;
              this.activeInfo.open = this.activeInfo.open ? 1 : 0
              this.activeInfo.activityPrice = (+this.activeInfo.activityPrice/100).toFixed(2)
              this.activeInfo.ddgPrice = (+this.activeInfo.ddgPrice/100).toFixed(2)
            })
          .finally(() => {

          })
      },
      getEditionList() {
        this.$api.hkywhdCourse.editionList()
          .then(
            response => {
              let array = Object.keys(response.data.resultData).map(key=> response.data.resultData[key])
              array.forEach((item,index) => {
                this.teachVersion.push({
                  name: item,
                  key: index+1
                })
              } )
            })
          .finally(() => {

          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该教材吗？',
          onOk: () => {
            this.$api.hkywhdBook.delTeaching({
              id: param.id
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
            let promiseDate = this.addInfo.id ? this.$api.hkywhdBook.updateTeaching(this.addInfo) : this.$api.hkywhdBook.addTeaching(this.addInfo)
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
      },
      submitInfoActive() {
        if (!this.activeInfo.activityPrice) {
          return this.$Message.error('请输入活动价格')
        } else if (!this.activeInfo.ddgPrice) {
          return this.$Message.error('请输入单独购价格')
        } else if (!this.activeInfo.invites) {
          return this.$Message.error('请输入邀请人数')
        } else if (!this.activeInfo.unlockNums) {
          return this.$Message.error('请输入活动价解锁课时数')
        }
        this.isSending = true
        let promiseDate = this.activeInfo.id ? this.$api.hkywhdActivity.uptActivity({
          ...this.activeInfo,
          ddgPrice: this.activeInfo.ddgPrice*100,
          activityPrice: this.activeInfo.activityPrice*100
        }) : this.$api.hkywhdActivity.saveActivity({
          ...this.activeInfo,
          ddgPrice: this.activeInfo.ddgPrice*100,
          activityPrice: this.activeInfo.activityPrice*100
        })
        promiseDate
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.isShowEdit = false
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
  .p-teach {

    &-form {
      width: 50%;
    }

    .-p-text-right {
      text-align: right;
    }

    .-t-add-icon {
      top: 100px;
    }

    .-g-m-tip {
      color: #b3b5b8;
      display: flex;
      justify-content: space-between;
    }

    .-c-flex {
      display: flex;
      justify-content: space-around;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-c-tips {
      color: #39f
    }
  }
</style>
