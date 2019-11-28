<template>
  <div class="p-course">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">课程分类</div>
            <Select v-model="searchInfo.courseType" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in courseTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="13" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal('',1)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-course"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="600"
        :title="titleText[modalType]">
        <Form ref="addInfo" :model="addInfo" :label-width="110" v-if="modalType === 1">
          <FormItem label="课程类型">
            <RadioGroup v-model="addInfo.type">
              <Radio :label=0>单个课程</Radio>
              <Radio :label=1>多个课程</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="课程名称" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.descripte" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="排序值" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.sortNum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="课时总数" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.nums" placeholder="请输入课时总数"></Input>
          </FormItem>
          <FormItem label="购买链接" prop="salesUrl">
            <Input type="text" v-model="addInfo.salesUrl" placeholder="请输入购买链接"></Input>
          </FormItem>
          <FormItem label="课程分类" class="ivu-form-item-required">
            <Select v-model="addInfo.courseId">
              <Option v-for="(item,index) in courseTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
          <Form-item label="首页课程封面" class="ivu-form-item-required">
            <upload-img v-model="addInfo.coverPage" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="竖版课程封面" class="ivu-form-item-required">
            <upload-img v-model="addInfo.coverImgUrl" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="海报图片" class="ivu-form-item-required">
            <upload-img v-model="addInfo.posterUrl" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <Form ref="addInfo" :model="addInfo" :label-width="110" v-if="modalType === 2" class="ivu-form-item-required">
          <FormItem label="单独购价格" prop="ddgPrice">
            <Input type="text" v-model="addInfo.ddgPrice" placeholder="请输入单独购价格"></Input>
          </FormItem>
          <FormItem label="是否开启活动">
            <RadioGroup v-model="addInfo.open">
              <Radio :label=1>开启</Radio>
              <Radio :label=0>关闭</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="活动价格">
            <Input type="text" v-model="addInfo.activityPrice" placeholder="请输入活动价格"></Input>
          </FormItem>
          <FormItem label="邀请人数">
            <Input type="text" v-model="addInfo.invites" placeholder="请输入邀请人数"></Input>
          </FormItem>
          <FormItem label="解锁课时数">
            <Input type="text" v-model="addInfo.unlockNums" placeholder="请输入解锁课时数"></Input>
          </FormItem>
        </Form>
        <Form ref="addInfo" :model="addInfo" :label-width="110" v-if="modalType === 3" class="ivu-form-item-required">
          <FormItem label="推荐课程" prop="name">
            <div class="g-course-add-style" @click="isOpenModalData=true">
              <span>+</span>
              <span>选择课程</span>
            </div>
            <hkywhd_course-template v-model="isOpenModalData"
                                    :checkList="courseListModal"
                                    @checkCourseList="checkCourseList"
                                    :dataItem="dataItem"
                                    :typeList="courseTypeList"></hkywhd_course-template>
            <div class="-c-course-wrap" v-if="courseListModal.length">
              <div class="-c-course-item" v-for="(item, index) of courseListModal" :key="index">
                <img :src="item.coverPage">
                <div class="-i-text">{{item.name}}</div>
                <div class="-i-del" @click="delCourse(item,index)">删除课程</div>
              </div>
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
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";
  import Hkywhd_courseTemplate from "./courseTemplate";
  import {forEach} from "../../../libs/tools";

  export default {
    name: 'hkywhd_courseList',
    components: {Hkywhd_courseTemplate, UploadImg, DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        courseTypeList: [],
        courseListModal: [],
        titleText: {
          '1': '编辑课程',
          '2': '活动配置',
          '3': '课程推荐'
        },
        radioType: 1,
        modalType: 1,
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        dataItem: {},
        getStartTime: '',
        getEndTime: '',
        columns: [
          {
            title: '课程名称',
            key: 'name',
            tooltip: true,
            align: 'center'
          },
          {
            title: '课程封面',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.coverPage
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 100,
            align: 'center'
          },
          {
            title: '课程分类',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortNum',
            align: 'center'
          },
          {
            title: '课程类型',
            render: (h, params) => {
              return h('div', params.row.type ? '多个课程' : '单个课程')
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('span', `${params.row.gmtCreate}`)
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('span', `${params.row.gmtModified}`)
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 240,
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
                }, params.row.type ? '小课管理' : '课时管理'),
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
                      this.openModal(params.row, 2)
                    }
                  }
                }, '活动配置'),
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
                      this.openModal(params.row, 1)
                    }
                  }
                }, '编辑'),
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
                      this.openModal(params.row, 3)
                    }
                  }
                }, '课程推荐'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.listCourseType()
    },
    methods: {
      checkCourseList(data) {
        this.courseListModal = JSON.parse(JSON.stringify(data))
      },
      delCourse (item, index) {
        this.courseListModal.splice(index, 1)
      },
      toJump(data) {
        this.$router.push({
          name: data.type ? 'hkywhd_lessonList' : 'hkywhd_classHourList_direct',
          query: {
            tbookId: data.id
          }
        })
      },
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      openModal(data, num) {
        this.dataItem = data
        this.modalType = num
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.modalType === 2 && this.getActivityByTbookId(data)
          this.modalType === 3 && this.listSuggestedBook(data)
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.addInfo = {
            id: '',
            type: 0,
            coverImgUrl: '',
            posterUrl: '',
            coverPage: ''
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        // this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      listCourseType() {
        this.$api.hkywhdCourse.listAllOn()
          .then(response => {
            this.courseTypeList = response.data.resultData
            this.searchInfo.courseType = this.courseTypeList[0].id
            this.getList()
          })
      },
      getActivityByTbookId(data) {
        this.addInfo = {}
        this.$api.hkywhdActivity.getActivityByTbookId({
          tbookId: data.id
        })
          .then(response => {
            this.addInfo = response.data.resultData
            this.addInfo.tbookId = data.id
            this.addInfo.open = this.addInfo.open ? 1 : 0
            this.addInfo.ddgPrice = this.addInfo.ddgPrice / 100
            this.addInfo.activityPrice = this.addInfo.activityPrice / 100
          })
      },
      listSuggestedBook(data) {
        this.courseListModal = []
        this.$api.hkywhdTextbook.listSuggestedBook({
          bindBookId: data.id
        })
          .then(response => {
            let ArrayList = response.data.resultData
            ArrayList.forEach(item=>{
              this.courseListModal.push({
                ...item,
                id: item.suggestId
              })
            })
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.hkywhdTextbook.pageTextBookByQuery({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          courseId: this.searchInfo.courseType,
          start: this.getStartTime ? new Date(this.getStartTime).getTime() : '',
          end: this.getEndTime ? new Date(this.getEndTime).getTime() : ''
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
          content: '确认要删除？',
          onOk: () => {
            this.$api.hkywhdTextbook.removeTextBook({
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
        switch (+this.modalType) {
          case 1:
            this.submitInfoTypeOne(name)
            break
          case 2:
            this.submitInfoTypeTwo(name)
            break
          case 3:
            this.submitInfoTypeThree(name)
            break
        }
      },
      submitInfoTypeOne(name) {
        if (this.isSending) return

        if (!this.addInfo.name) {
          return this.$Message.error('请输入课程名称')
        } else if (!this.addInfo.descripte) {
          return this.$Message.error('请输入课程描述')
        } else if (!this.addInfo.sortNum) {
          return this.$Message.error('请输入排序值')
        } else if (!this.addInfo.nums) {
          return this.$Message.error('请输入课时总数')
        } else if (!this.addInfo.courseId) {
          return this.$Message.error('请输入课程分类')
        } else if (!this.addInfo.coverPage) {
          return this.$Message.error('首页课程封面')
        } else if (!this.addInfo.coverImgUrl) {
          return this.$Message.error('请上传竖版封面图')
        } else if (!this.addInfo.posterUrl) {
          return this.$Message.error('请上传海报图片')
        }

        this.isSending = true

        let paramsData = {
          name: this.addInfo.name,
          descripte: this.addInfo.descripte,
          nums: this.addInfo.nums,
          sortNum: this.addInfo.sortNum,
          type: this.addInfo.type,
          coverPage: this.addInfo.coverPage,
          coverImgUrl: this.addInfo.coverImgUrl,
          courseId: this.addInfo.courseId
        }

        let paramsUrl = this.addInfo.id ? this.$api.hkywhdTextbook.updateTextBook({
          id: this.addInfo.id,
          ...paramsData
        }) : this.$api.hkywhdTextbook.addTextBook(paramsData)

        paramsUrl
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
      },
      submitInfoTypeTwo(name) {
        if (this.isSending) return

        if (!this.addInfo.ddgPrice) {
          return this.$Message.error('请输入单独购价格')
        } else if (!this.addInfo.activityPrice) {
          return this.$Message.error('请输入活动价格')
        } else if (!this.addInfo.invites) {
          return this.$Message.error('请输入邀请人数')
        } else if (!this.addInfo.unlockNums) {
          return this.$Message.error('请输入解锁课时数')
        }

        this.isSending = true

        let paramsData = {
          ddgPrice: this.addInfo.ddgPrice * 100,
          tbookId: this.addInfo.tbookId,
          activityPrice: this.addInfo.activityPrice * 100,
          invites: this.addInfo.invites,
          unlockNums: this.addInfo.unlockNums,
          open: this.addInfo.open === 1
        }

        let paramsUrl = this.addInfo.id ? this.$api.hkywhdActivity.uptNewActivity({
          id: this.addInfo.id,
          ...paramsData
        }) : this.$api.hkywhdActivity.saveNewActivit(paramsData)

        paramsUrl
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
      },
      submitInfoTypeThree(name) {
        if (!this.courseListModal.length) {
          return this.$Message.error('请选择推荐课程')
        }

        if (this.isSending) return

        this.isSending = true
        let arrayStorage = []

        this.courseListModal.forEach(item=>{
          arrayStorage.push(item.id)
        })

        this.$api.hkywhdTextbook.editSuggestedBook({
          bindBookId: this.dataItem.id,
          suggestIds: arrayStorage
        })
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
    }
  };
</script>


<style lang="less" scoped>
  .p-course {

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tips {
      color: #39f
    }

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
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

    .-c-course-wrap {
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
          left: 84px;
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
