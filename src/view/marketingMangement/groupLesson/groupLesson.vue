<template>
  <div class="p-help">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">拼课状态：</div>
            <Select v-model="selectInfoOne" @on-change="getList" class="-search-selectOne">
              <Option v-for="(item,index) in statusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList"></Input>
          </div>
        </Col>
      </Row>
      <div class="g-add-btn g-add-top" @click="openModal">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-help"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      title="编辑拼课">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110">
        <FormItem label="关联课程" prop="courseId">
          <div class="g-course-add-style" @click="isShowCourseModal=true">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isEdit'
                          :isRadioModal="true"
                          @closeCourseModal="checkCourse"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <div v-if="!item.isOldCourse" class="-i-del" @click="delCourse(item,index)">删除课程</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="拼课人数" prop="priceYuan">
          <Input type="text" v-model="addInfo.priceYuan" placeholder="请输入拼课人数"></Input>
        </FormItem>
        <FormItem label="拼课时限" prop="priceYuan">
          <Input type="text" v-model="addInfo.priceYuan" placeholder="请输入拼课时限（小时）"></Input>
        </FormItem>
        <FormItem label="团长优惠" prop="showSaleNum">
          <Radio-group v-model="addInfo.useScope">
            <Radio :label=0>不启用</Radio>
            <Radio :label=1>启用</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="团长优惠价格" prop="showSaleNum" v-if="addInfo.useScope">
          <Input type="text" v-model="addInfo.showSaleNum" placeholder="请输入团长优惠价格(元)"></Input>
        </FormItem>
        <FormItem label="有效期" prop="showSaleNum">
          <Row>
            <Col span="11">
              <Form-item prop="date">
                <Date-picker :disabled="isEdit" style="width: 100%" type="datetime" placeholder="选择开始日期"
                             v-model="getStartTime" :options="dateStartOption"></Date-picker>
              </Form-item>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <Form-item prop="time">
                <Date-picker :disabled="isEdit" style="width: 100%" type="datetime" placeholder="选择结束日期"
                             v-model="getEndTime" :options="dateEndOption"></Date-picker>
              </Form-item>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="分享摘要" prop="showSaleNum">
          <Input type="textarea" :rows="4" v-model="addInfo.showSaleNum" placeholder="请输入分享摘要"></Input>
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
  import CheckCourse from "../../../components/checkCourse";

  export default {
    name: 'friendHelp',
    components: {CheckCourse},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: '',
        selectInfoOne: '',
        selectInfo: '',
        statusList: [
          {
            name: '全部',
            id: ''
          },{
            name: '未开始',
            id: '0'
          },{
            name: '进行中',
            id: '1'
          },{
            name: '已过期',
            id: '2'
          },{
            name: '已结束',
            id: '3'
          },
        ],
        dataList: [],
        courseList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isEdit: false,
        isShowCourseModal: false,
        getStartTime: '',
        getEndTime: '',
        addInfo: {
          courseId: '',
          priceYuan: '',
          showSaleNum: ''
        },
        dateStartOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        dateEndOption: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        ruleValidate: {
          priceYuan: [
            {required: true, message: '请输入单独购价格', trigger: 'blur'},
          ],
          showSaleNum: [
            {required: true, message: '请输入初始销量', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '课程名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '课程封面',
            key: 'name',
            align: 'center'
          },
          {
            title: '拼课时限',
            key: 'name',
            align: 'center'
          },
          {
            title: '拼课人数',
            key: 'name',
            align: 'center'
          },
          {
            title: '拼课购价格',
            key: 'name',
            align: 'center'
          },
          {
            title: '团长优惠价格',
            key: 'name',
            align: 'center'
          },
          {
            title: '拼课销量',
            key: 'name',
            align: 'center'
          },
          {
            title: '拼课状态',
            key: 'name',
            align: 'center'
          },
          {
            title: '有效期开始',
            key: 'name',
            align: 'center'
          },
          {
            title: '有效期结束',
            key: 'name',
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
                }, '结束')
              ])
            }
          }
        ],
      };
    },
    watch: {
      'useStartTime'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.courseList = []
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify({
          courseId: data.id,
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
        this.$api.goods.groupList()
          .then(
            response => {
              this.dataList = response.data.resultData.records;
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
        if (!this.addInfo.courseId) {
          return this.$Message.error('请选择关联课程')
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            console.log(this.addInfo, 1)
            let promiseDate = this.addInfo.courseId ? this.$api.course.updateSubject(this.addInfo) : this.$api.course.addSubject(this.addInfo)
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
      checkCourse(params) {
        this.isShowCourseModal = false;
        this.courseList = params
        this.addInfo.courseId = params.length && this.courseList[0].id
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-help {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

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

    .-c-course-wrap {
      margin-top: 10px;
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        width: 140px;
        overflow: hidden;
        margin: 10px 10px 10px 0;

        img {
          width: 100%;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
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
  }
</style>
