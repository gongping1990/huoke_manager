<template>
  <div class="p-course">
    <Card>
      <Row class="g-search">
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

      <div class="g-add-btn g-add-top" @click="openModal('')">
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
        width="500"
        :title="addInfo.id ? '编辑课程' : '创建课程'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110">
          <FormItem label="课程名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="descripte">
            <Input type="text" v-model="addInfo.descripte" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortNum">
            <Input type="text" v-model="addInfo.sortNum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="课时总数" prop="nums">
            <Input type="text" v-model="addInfo.nums" placeholder="请输入课时总数"></Input>
          </FormItem>
          <Form-item label="竖版课程封面" prop="coverImgUrl" class="ivu-form-item-required">
            <upload-img v-model="addInfo.coverImgUrl" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
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

  export default {
    name: 'hkywhd_lessonList',
    components: {UploadImg, DatePickerTemplate},
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
        radioType: 1,
        selectInfo: '1',
        searchInfo: {
          getStartTime: '',
          getEndTime: '',
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        addInfo: {},
        statusList: {
          '0': '未开始',
          '1': '进行中',
          '2': '已过期',
          '3': '已结束'
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '课程名称长度为20字', trigger: 'blur'}
          ],
          descripte: [
            {required: true, message: '请输入课程描述', trigger: 'blur'}
          ],
          sortNum: [
            {required: true, message: '请输入排序值', trigger: 'blur'}
          ],
          nums: [
            {required: true, message: '请输入课时总数', trigger: 'blur'}
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
                    src: params.row.coverImgUrl
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
            title: '排序值',
            key: 'sortNum',
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
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toJump (data) {
        this.$router.push({
          name: 'hkywhd_classHourList',
          query: {
            tbookId: data.id
          }
        })
      },
      changeDate(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.getList(1)
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.nums = this.addInfo.nums.toString()
          this.addInfo.sortNum = this.addInfo.sortNum.toString()
        } else {
          this.searchInfo.getStartTime = ''
          this.searchInfo.getEndTime = ''
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
        this.$api.hkywhdTextbook.pageStepsTextBookByQuery({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          tbookId: this.$route.query.tbookId,
          start: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : '',
          end: this.searchInfo.getEndTime ?  new Date(this.searchInfo.getEndTime).getTime() : ''
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

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.coverImgUrl) {
              return this.$Message.error('请上传竖版课程封面')
            }

            this.isSending = true

            let paramsData = {
              name : this.addInfo.name,
              descripte : this.addInfo.descripte,
              nums : this.addInfo.nums,
              sortNum : this.addInfo.sortNum,
              coverImgUrl : this.addInfo.coverImgUrl,
              tbookId : this.$route.query.tbookId
            }

            let paramsUrl =  this.addInfo.id ? this.$api.hkywhdTextbook.updateStepsTextBook({
              id: this.addInfo.id,
              ...paramsData
            }) : this.$api.hkywhdTextbook.saveStepsTextBook(paramsData)

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
