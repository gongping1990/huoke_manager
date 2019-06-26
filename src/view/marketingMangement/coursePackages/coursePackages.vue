<template>
  <div class="p-coursePackages">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">套餐名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-coursePackages"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑套餐' : '创建套餐'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="套餐名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="套餐价格" prop="sortnum">
            <Input type="text" v-model="addInfo.sortnum" placeholder="请输入套餐价格"></Input>
          </FormItem>
          <FormItem label="链接地址">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
          </FormItem>
          <Form-item label="套餐商品图" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.photo" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="套餐课程"  class="ivu-form-item-required">
            <div class="g-course-add-style" @click="isShowCourse=true">
              <span>+</span>
              <span>选择课程</span>
            </div>
            <div v-if="isShowCourse">
              <check-course :isShowModal="isShowCourse"
                            :checkCourseList="courseList"
                            :courseType="1"
                            @cancleCourseModal="isShowCourse = false"
                            @closeCourseModal="checkCourseOne"></check-course>
            </div>
            <div class="-c-course-wrap" v-if="courseList.length">
              <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
                <img :src="item.imgurl">
                <div class="-i-text">{{item.name}}</div>
                <div class="-i-del" @click="delCourse(item,index)">删除课程</div>
              </div>
            </div>
          </Form-item>
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
  import UploadImg from "../../../components/uploadImg";
  import CheckCourse from "../../../components/checkCourse";

  export default {
    name: 'coursePackages',
    components: {CheckCourse, UploadImg},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        selectInfo: '1',
        searchInfo: {},
        dataList: [],
        courseList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isShowCourse: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          sortnum: [
            {required: true, message: '请输入排序值', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '套餐名称',
            key: 'name'
          },
          {
            title: '包含课程',
            key: 'name'
          },
          {
            title: '原价总和',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '套餐价',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '详情地址',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '是否上架到课程详情',
            align: 'center',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.disabled ? 'default' : 'success'
                }
              }, params.row.disabled ? '否' : '是')
            }
          },
          {
            title: '操作',
            width: 190,
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
                      this.changeStatus(params.row)
                    }
                  }
                }, !params.row.disabled ? '上架到详情' : '下架'),
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
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      delImg() {
        this.addInfo.url = ''
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortnum = this.addInfo.sortnum.toString()
        } else {
          this.addInfo = {
            url: ''
          }
        }
      },
      checkCourseOne(params) {
        this.isShowCourse = false
        this.courseList= []
        params.forEach(item => {
          this.courseList.push({
            id: item.id,
            goodsId: item.goodsId,
            name: item.courseName,
            imgurl: item.coverUrl
          })
        })

        console.log(this.courseList,11111111)
      },
      delCourse(item, index) {
        this.courseList.splice(index, 1)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']
        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.addInfo.url = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.course.courseTypeList({
          current: this.tab.page,
          size: this.tab.pageSize,
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
            this.$api.course.delCourseType({
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
      changeStatus(data) {
        this.$api.course.changeCourseTypeStatus({
          id: data.id,
          disabled: !data.disabled
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      submitInfo(name) {
        if (!this.addInfo.url) {
          return this.$Message.error('请上传分类图片')
        } else if (this.addInfo.sortnum && (this.addInfo.sortnum < 1 || this.addInfo.sortnum > 99999)) {
          return this.$Message.error('排序值范围1-99999')
        }

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.course.updateCourseType(this.addInfo) : this.$api.course.addCourseType(this.addInfo)
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
  .p-coursePackages {
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
