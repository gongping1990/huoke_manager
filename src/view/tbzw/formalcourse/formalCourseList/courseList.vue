<template>
  <div class="p-forma-courseList">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-forma-courseList"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      :footer-hide="classType === 2"
      width="700"
      title="排课设置">
      <Form :model="addInfo" :label-width="100">
        <FormItem label="当前排课规则">
          <div class="-c-tips">{{storageInfo.wayOfTeach == '2' ? '人工排课' : '每周系统排课'}}</div>
        </FormItem>
        <FormItem label="注意">
          <span class="-c-tips">此弹窗内部只能更改排课规则的配置，不能更改当前课程的排课规则</span>
        </FormItem>
        <FormItem label="排课类别">
          <Radio-group v-model="classType" @on-change="changeClassType" >
            <Radio :label=1 :disabled="storageInfo.wayOfTeach == '2'">每周系统排课</Radio>
            <Radio :label=2 :disabled="storageInfo.wayOfTeach == '2'">人工排课</Radio>
          </Radio-group>
        </FormItem>
      </Form>
      <Form v-show="classType === 1" ref="addInfo" :model="addInfo" :label-width="100">
        <FormItem label="注意">
          <span class="-c-tips">请选择每周需要排课的天数，更改后只对未排课的课时生效，不会影响已排课的课时</span>
        </FormItem>
        <FormItem label="排课模式">
          <CheckboxGroup v-model="checkWeeks">
            <Checkbox v-for="item of weekList" :label="item.id" :key="item.id">{{item.name}}
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="是否覆盖">
          <Radio-group v-model="addInfo.cover">
            <Radio :label=1>是</Radio>
            <Radio :label=0>否</Radio>
          </Radio-group>
          (<span class="-c-tips">已自定义排课的学生</span>)
        </FormItem>
      </Form>
      <div v-show="classType === 2">
        <Row class="g-search p-forma-courseList-flex">
          <Col :span="8">
            <Row class="g-flex-a-j-center">
              <div class="-search-select-text-two">日期：</div>
              <DatePicker class="-search-select" type="month" style="width: 200px" v-model="searchDate"
                          @on-change="listTimeTableRules"></DatePicker>
            </Row>
          </Col>
          <Col :span="16" class="g-text-right">
            <Button @click="openModalSecond()" ghost type="primary" style="width: 100px;">新增排课</Button>
          </Col>
        </Row>
        <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="detailList"></Table>
      </div>

      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <Modal
      class="p-forma-courseList"
      v-model="isOpenAddModal"
      @on-cancel="isOpenAddModal = false"
      width="500"
      :title="secondInfo.id ? '编辑人工排课' : '新增人工排课'">
      <Form ref="addInfo" :model="secondInfo" :label-width="50">
        <FormItem label="日期" class="ivu-form-item-required">
          <DatePicker type="date" placeholder="请选择" :options="dateStartOption" style="width: 200px"
                      v-model="secondInfo.studyDate" @on-change="changeDate"></DatePicker>
        </FormItem>
        <FormItem label="课时" class="ivu-form-item-required">
          <Select v-model="secondInfo.lessonId" placeholder="请选择" @on-change="changeLesson"
                  :disabled="(secondInfo.studyDate == null) || (secondInfo.studyDate == '')">
            <Option v-for="item of lessonList"
                    :label="item.name"
                    :value="item.id" :key="item.id"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="isOpenAddModal = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'tbzw_forma_courseList',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        lessonList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenAddModal: false,
        classType: 1,
        storageInfo: {},
        searchDate: new Date(),
        addInfo: {
          type: 1
        },
        secondInfo: {
          studyDate: null
        },
        dateStartOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        checkWeeks: ['2', '4', '6'],
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
        columns: [
          {
            title: '课程名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '课程封面',
            align: 'center',
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
                    src: params.row.coverphoto
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '当前排课规则',
            key: 'ttr',
            align: 'center'
          },
          {
            title: '操作',
            width: 260,
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
                      this.openEdit(params.row, 2)
                    }
                  }
                }, '排课设置'),
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
                      this.toCourseContent(params.row)
                    }
                  }
                }, '课时内容'),
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
                }, '编辑')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '排课日期',
            key: 'studyDate',
            align: 'center'
          },
          {
            title: '课时名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '操作',
            width: 260,
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
                      this.openModalSecond(params.row)
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
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate () {
        this.secondInfo.lessonId = ''
      },
      changeLesson() {
        let nowDate = dayjs(this.secondInfo.studyDate).format('YYYY-MM-DD')
        this.lessonList.forEach(item => {
          if (this.secondInfo.lessonId === item.id && (nowDate === dayjs(item.studyDate).format('YYYY-MM-DD'))) {
            this.$Message.info({
              content: `${item.name}在${nowDate}已排课，是否覆盖？覆盖后，不会影响历史时间的排课记录。`,
              duration: 10
            })
          }
        })
      },
      changeClassType() {
        if (this.classType === 2) {
          this.listTimeTableRules()
        }
      },
      toCourseContent(data) {
        this.$router.push({
          name: 'tbzw_forma_courseContent',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },
      openModal(data) {
        this.$router.push({
          name: 'tbzw_forma_courseInfo',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },
      openEdit(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.storageInfo = JSON.parse(JSON.stringify(data))
        this.classType = this.addInfo.wayOfTeach
        this.changeClassType()
      },
      openModalSecond(data) {
        this.isOpenAddModal = true
        if (data) {
          this.secondInfo = data && JSON.parse(JSON.stringify(data))
        } else {
          this.secondInfo = {}
        }
        this.getQueryLessonPage()
      },
      closeModal() {
        this.isOpenModal = false
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwRules.removeTimeTableRules({
              lessonId: param.lessonId,
              planId: param.planId
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.listTimeTableRules();
                }
              })
          }
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.tbzwCourse.courseQueryPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: 1
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
      listTimeTableRules() {
        this.$api.tbzwRules.listTimeTableRules({
          courseId: this.addInfo.id,
          month: new Date(this.searchDate).getMonth() + 1,
          year: new Date(this.searchDate).getFullYear(),
        })
          .then(
            response => {
              this.detailList = response.data.resultData;
            })
      },
      getQueryLessonPage() {
        this.$api.composition.getQueryLessonPage({
          courseId: this.addInfo.id,
          current: 1,
          size: 10000
        })
          .then(
            response => {
              this.lessonList = response.data.resultData.records;
            })
      },
      submitInfo() {
        if (this.classType === 1) {
          this.$api.tbzwRules.editLessonRules({
            courseId: this.addInfo.id,
            cover: this.addInfo.cover === 1,
            rules: this.checkWeeks.toString(),
            type: this.addInfo.type
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
        } else {
          if (!this.secondInfo.studyDate) {
            return this.$Message.error('请选择日期')
          } else if (!this.secondInfo.lessonId) {
            return this.$Message.error('请选择课时')
          }
          this.$api.tbzwRules.editTimeTableRules({
            lessonId: this.secondInfo.lessonId,
            planId: this.secondInfo.planId,
            studyDate: dayjs(this.secondInfo.studyDate).format('YYYY-MM-DD')
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  this.$Message.success('提交成功');
                  this.listTimeTableRules()
                  this.isOpenAddModal = false
                }
              })
            .finally(() => {
              this.isSending = false
            })
        }
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-forma-courseList {

    .-search-select-text-two {
      min-width: 50px;
    }
    .-search-select {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .content {
      margin: 10px 0;
    }
    .-c-tips {
      color: #39f
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    &-flex {
      display: flex;
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
