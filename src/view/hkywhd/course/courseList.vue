<template>
  <div class="p-course">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">课程分类</div>
            <Select v-model="searchInfo.status" @on-change="getList(1)" class="-search-selectOne">
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
        :title="addInfo.id ? '编辑课程' : '创建课程'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110" v-show="modalType === 1">
          <FormItem label="课程类型" prop="name">
            <RadioGroup v-model="addInfo.courseType">
              <Radio :label=1>单个课程</Radio>
              <Radio :label=2>多个课程</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="课程名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="排序值" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="课时总数" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入课时总数"></Input>
          </FormItem>
          <FormItem label="课程分类" prop="href">
            <Select v-model="addInfo.courseId">
              <Option v-for="(item,index) in courseTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
          <Form-item label="首页课程封面" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="竖版课程封面" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110" v-show="modalType === 2">
          <FormItem label="单独购价格" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入单独购价格"></Input>
          </FormItem>
          <FormItem label="是否开启活动" prop="name">
            <RadioGroup v-model="addInfo.courseType">
              <Radio :label=1>开启</Radio>
              <Radio :label=0>关闭</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="活动价格" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动价格"></Input>
          </FormItem>
          <FormItem label="邀请人数" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入邀请人数"></Input>
          </FormItem>
          <FormItem label="解锁课时数" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入解锁课时数"></Input>
          </FormItem>
        </Form>
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110" v-show="modalType === 3">
          <FormItem label="推荐课程" prop="name">
            <div class="g-course-add-style" @click="isOpenModalData=true">
              <span>+</span>
              <span>选择课程</span>
            </div>
            <hkywhd_course-template v-model="isOpenModalData"></hkywhd_course-template>
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
        getStartTime: '',
        getEndTime: '',
        statusList: {
          '0': '未开始',
          '1': '进行中',
          '2': '已过期',
          '3': '已结束'
        },
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
          ]
        },
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
                    src: params.row.url
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
            key: 'href',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'href',
            align: 'center'
          },
          {
            title: '课程类型',
            key: 'href',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('span', `${params.row.showTime}`)
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('span', `${params.row.hideTime}`)
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
                      this.endItem(params.row)
                    }
                  }
                }, '课时管理'),
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
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
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
                      this.openModal(params.row, 3)
                    }
                  }
                }, '课程推荐')
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      openModal(data, num) {
        this.modalType = num
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.addInfo = {
            id: '',
            url: ''
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
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
        this.$api.gswOperational.listOperational({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          type: this.radioType,
          showTime: this.getStartTime ? dayjs(this.getStartTime).format("YYYY/MM/DD HH:mm:ss") : '',
          hideTime: this.getEndTime ? dayjs(this.getEndTime).format("YYYY/MM/DD HH:mm:ss") : ''
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
            this.$api.gswOperational.removeOperational({
              operationalId: param.id
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
        if (!this.addInfo.url) {
          return this.$Message.error('请上传图片')
        }

        if (this.isSending) return

        this.addInfo.type  = 0
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.gswOperational.saveOperational({
              id: this.addInfo.id,
              hideTime: dayjs(this.addInfo.hideTime).format("YYYY/MM/DD HH:mm:ss"),
              showTime: dayjs(this.addInfo.showTime).format("YYYY/MM/DD HH:mm:ss"),
              name : this.addInfo.name,
              href : this.addInfo.href,
              url : this.addInfo.url,
              type: this.radioType
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
  }
</style>
