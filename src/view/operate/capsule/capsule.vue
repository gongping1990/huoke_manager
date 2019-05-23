<template>
  <div class="p-capsule">
    <Card>
      <Row class="g-search">
        <!--<Col :span="5">-->
        <!--<div class="-search">-->
        <!--<Select v-model="selectInfo" class="-search-select">-->
        <!--<Option value="1">运营位名称</Option>-->
        <!--</Select>-->
        <!--<span class="-search-center">|</span>-->
        <!--<Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"-->
        <!--@on-click="getList(1)"></Input>-->
        <!--</div>-->
        <!--</Col>-->
        <Col :span="18" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-capsule"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="600"
        :title="addInfo.id ? '编辑胶囊位' : '创建胶囊位'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90" class="ivu-form-item-required">
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="有效期">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期"
                               v-model="getStartTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="getEndTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="getEndTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <Form-item label="推荐课程" prop="type">
            <Radio-group v-model="addInfo.type">
              <Radio :label=1 :disabled="addInfo.id!=''">拼课</Radio>
              <Radio :label=2 :disabled="addInfo.id!=''">助力</Radio>
              <Radio :label=3 :disabled="addInfo.id!=''">秒杀</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="选择课程">
            <div class="g-course-add-style" @click="isShowCourse=true">
              <span>+</span>
              <span>选择课程</span>
            </div>
            <div v-if="isShowCourse">
              <check-course :isShowModal="isShowCourse"
                            :checkCourseList="courseList"
                            :isUpdate='isOpenModal'
                            :courseType="2"
                            :goodsType="addInfo.type"
                            @cancleCourseModal="isShowCourse = false"
                            @closeCourseModal="checkCourseOne"></check-course>
            </div>
            <div class="-c-course-wrap" v-if="courseList.length">
              <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
                <img :src="item.imgurl">
                <div class="-i-text">{{item.name}}</div>
                <div v-if="!item.isOldCourse" class="-i-del" @click="delCourse(item,index)">删除课程</div>
              </div>
            </div>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-capsule"
        v-model="isOpenModalDetail"
        @on-cancel="isOpenModalDetail = false"
        width="500"
        title="数据详情">
        <Row>
          <Col :span="24" class="g-text-right">
            <Button type="primary" ghost @click="toExcel()">数据导出</Button>
          </Col>
        </Row>

        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="-p-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
        <div slot="footer" class="p-capsule-btn">
          <div @click="isOpenModalDetail = false" class="g-primary-btn"> 确 认</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import CheckCourse from "../../../components/checkCourse";

  export default {
    name: 'operationalLocation',
    components: {CheckCourse, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        courseList: [],
        selectInfo: '1',
        searchInfo: {},
        dateOption: {
          name: '有效期',
          type: 'datetime'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalDetail: false,
        isShowCourse: false,
        isSending: false,
        addInfo: {},
        capsuleId: '',
        getStartTime: '',
        getEndTime: '',
        dateStartOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        dateEndOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '活动名称长度为20字', trigger: 'blur'}
          ],
          sortnum: [
            {required: true, message: '请输入排序值', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '活动名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '课程数量',
            key: 'courseNum',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center'
          },
          {
            title: '有效期时间',
            render: (h, params) => {
              return h('span', `${params.row.showTime} - ${params.row.hideTime}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '操作',
            width: 210,
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
                      this.openModalDetail(params.row)
                    }
                  }
                }, '数据详情'),
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
        columnsModal: [
          {
            title: '日期',
            key: 'inTime',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center'
          }
        ],
      };
    },
    watch: {
      'getStartTime'(_new, _old) {
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
      toExcel() {
        let downUrl = `${getBaseUrl()}/capsule/download?capsuleId=${this.capsuleId}`
        window.open(downUrl, '_blank');
      },
      checkCourseOne(params) {
        this.isShowCourse = false
        this.courseList= []
        console.log(params)
        params.forEach(item => {
          this.courseList.push({
            goodsId: item.goodsId,
            name: item.courseName,
            imgurl: item.coverUrl
          })
        })
      },
      changeDate(data) {
        this.searchInfo.fromDate = data.startTime
        this.searchInfo.toDate = data.endTime
        this.getList(1)
      },
      delCourse(item, index) {
        this.courseList.splice(index, 1)
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.getInfo(data)
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.addInfo = {
            type: 1,
            id: ''
          }
          this.courseList = []
        }
      },
      openModalDetail(data) {
        this.isOpenModalDetail = true
        this.getDetailList(data)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      getDetailList(data) {
        this.capsuleId = data.id
        this.$api.capsule.listByCapsuleCount({
          capsuleId: data.id,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        })
      },
      getInfo(data) {
        this.$api.capsule.getHCapsuleDetails({
          capsuleId: data.id
        }).then(res => {
          this.addInfo = res.data.resultData
          this.courseList = this.addInfo.goodsDetails
          this.getStartTime = new Date(this.addInfo.showTime)
          this.getEndTime = new Date(this.addInfo.hideTime)
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.capsule.listByHCapsule({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          beginDate: this.searchInfo.fromDate ? dayjs(this.searchInfo.fromDate).format("YYYY/MM/DD HH:mm:ss") : '',
          endDate: this.searchInfo.toDate ? dayjs(this.searchInfo.toDate).format("YYYY/MM/DD HH:mm:ss") : ''
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
            this.$api.capsule.delCapsule({
              capsuleId: param.id
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
        if (!this.courseList.length) {
          return this.$Message.error('请选择课程')
        } else if (!this.getStartTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.getEndTime) {
          return this.$Message.error('请输入结束时间')
        }

        if (this.isSending) return
        this.addInfo.showTime = dayjs(this.getStartTime).format("YYYY/MM/DD HH:mm:ss")
        this.addInfo.hideTime = dayjs(this.getEndTime).format("YYYY/MM/DD HH:mm:ss")
        this.addInfo.goodsDetails = []

        if(this.addInfo.id) {
          delete this.addInfo.courseNum

          for (let item of this.courseList) {
            this.addInfo.goodsDetails.push({
              goodsId: item.id || item.goodsId,
              name: item.name,
              imgurl: item.imgurl
            })
          }
        } else {
          delete this.addInfo.id
          this.addInfo.goodsDetails = this.courseList
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.capsule.updateHCapsule(this.addInfo) : this.$api.capsule.saveHCapsule(this.addInfo)
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
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-capsule {

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    .-c-tips {
      color: #39f
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
