<template>
  <div class="p-coursePackage">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-coursePackage"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="600"
        :title="addInfo.id ? '编辑' : '创建'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="课程分类" prop="courseId">
            <Select v-model="addInfo.courseId">
              <Option :value="item.id" :label="item.name" v-for="item of courseTypeList" :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="排序值" prop="sortNum">
            <Input type="text" v-model="addInfo.sortNum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="原价" prop="orgPrice">
            <Input type="text" v-model="addInfo.orgPrice" placeholder="请输入原价"></Input>
          </FormItem>
          <FormItem label="单独购价格" prop="alonePrice">
            <Input type="text" v-model="addInfo.alonePrice" placeholder="请输入单独购价格"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="descripte">
            <Input type="text" v-model="addInfo.descripte" placeholder="请输入课程描述"></Input>
          </FormItem>
          <Form-item label="课程封面" class="ivu-form-item-required">
            <upload-img v-model="addInfo.coverImg" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="购买链接" prop="salesUrl">
            <Input type="text" v-model="addInfo.salesUrl" placeholder="请输入购买链接"></Input>
          </FormItem>
          <Form-item label="购买页图片" class="ivu-form-item-required">
            <upload-img-multiple v-model="addInfo.payImgUrl" :option="uploadOption"></upload-img-multiple>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-coursePackage"
        v-model="isOpenModalCourse"
        @on-cancel="isOpenModalCourse = false"
        width="500"
        title="关联课程">
        <Form ref="courseInfo" :model="courseInfo" :label-width="90">
          <FormItem label="关联课程" prop="name">
            <div class="g-course-add-style" @click="isOpenModalData=true">
              <span>+</span>
              <span>选择课程</span>
            </div>
            <xxb_course-template v-model="isOpenModalData"
                                 :checkList="courseListModal"
                                 @checkCourseList="checkCourseList"
                                 :dataItem="dataItem"
                                 :typeList="courseTypeList"></xxb_course-template>
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
          <Button @click="isOpenModalCourse =false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitModalCourse()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import myMinxin from '../../../utils/minxin'
  import UploadImg from "../../../components/uploadImg";
  import Xxb_courseTemplate from "../course/courseTemplate";
  import UploadImgMultiple from "../../../components/uploadImgMultiple";

  export default {
    name: 'bannerList',
    components: {UploadImgMultiple, Xxb_courseTemplate, UploadImg},
    mixins: [myMinxin],
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        courseTypeList: [],
        courseListModal: [],
        dataItem: '',
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalCourse: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        courseInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          sortNum: [
            {required: true, message: '请输入排序值', trigger: 'blur'},
          ],
          alonePrice: [
            {required: true, message: '请输入单独购价格', trigger: 'blur'},
          ],
          courseId: [
            {required: true, message: '请输入课程分类', trigger: 'change'},
          ],
          descripte: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
          ],
          orgPrice: [
            {required: true, message: '请输入原价', trigger: 'blur'},
          ],
          salesUrl: [
            {required: true, message: '请输入购买链接', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortNum',
            align: 'center'
          },
          {
            title: '关联课程',
            key: 'linkNames',
            align: 'center'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: !params.row.display ? 'default' : 'success'
                }
              }, !params.row.display ? '已禁用' : '已启用')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 220,
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
                      this.changeStatus(params.row)
                    }
                  }
                }, !params.row.display ? '启用' : '禁用'),
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
                      this.openModalCourse(params.row)
                    }
                  }
                }, '关联课程'),
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
                    color: 'rgba(218, 55, 75)'
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
      checkCourseList(data) {
        this.courseListModal = JSON.parse(JSON.stringify(data))
      },
      delCourse(item, index) {
        this.courseListModal.splice(index, 1)
      },
      openModalCourse(data) {
        this.dataItem = data
        this.listSuggestedBook(data)
        this.isOpenModalCourse = true
      },
      openModal(data) {
        this.isOpenModal = true
        this.getTypeList()
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortNum = this.addInfo.sortNum.toString()
          this.addInfo.payImgUrl = JSON.parse(this.addInfo.payImgUrl)
          this.addInfo.orgPrice = (this.addInfo.orgPrice / 100).toString()
          this.addInfo.alonePrice = (this.addInfo.alonePrice / 100).toString()
        } else {
          this.addInfo = {
            coverImg: '',
            payImgUrl: ''
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
      listSuggestedBook(data) {
        this.courseListModal = []
        this.$api.hkywhdTextbook.listSuggestedBook({
          bindBookId: data.id
        })
          .then(response => {
            let ArrayList = response.data.resultData
            ArrayList.forEach(item => {
              this.courseListModal.push({
                ...item,
                id: item.suggestId
              })
            })
            this.listBookInfoByCompose(data)
          })
      },
      listBookInfoByCompose(data) {
        this.courseListModal = []
        this.$api.xxbCompose.listBookInfoByCompose({
          composeId: data.id
        })
          .then(response => {
            this.courseListModal= response.data.resultData

            console.log(this.courseListModal,1)
          })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.xxbCompose.pageCompose({
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
      getTypeList() {
        this.courseTypeList = []
        this.courseTypeListAll = []
        this.$api.xxbCourse.queryPage({
          current: 1,
          size: 1000
        })
          .then(response => {
            let dataInfo = response.data.resultData.records
            dataInfo.forEach(item => {
              if (item.disabled) {
                this.courseTypeList.push(item)
              }
            })

          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.xxbCompose.removeCompose({
              composeId: param.id
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
        this.$api.xxbCompose.display({
          composeId: data.id
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      submitInfo(name) {
        if (this.addInfo.sortNum && (this.addInfo.sortNum < 1 || this.addInfo.sortNum > 99999)) {
          return this.$Message.error('排序值范围1-99999')
        } else if (!this.addInfo.coverImg) {
          return this.$Message.error('请上传课程封面')
        } else if (!this.addInfo.payImgUrl.length) {
          return this.$Message.error('请上传购买页图片')
        }

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.xxbCompose.saveComposeService({
              ...this.addInfo,
              orgPrice: this.addInfo.orgPrice*100,
              alonePrice: this.addInfo.alonePrice*100,
              payImgUrl: JSON.stringify(this.addInfo.payImgUrl)
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
      },
      submitModalCourse () {
        if (!this.courseListModal.length) {
          return this.$Message.error('请选择推荐课程')
        }

        if (this.isSending) return

        this.isSending = true
        let arrayStorage = []

        this.courseListModal.forEach(item => {
          arrayStorage.push(item.id)
        })

        this.$api.xxbCompose.saveLinkBook({
          composeId: this.dataItem.id,
          link: arrayStorage.toString()
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.isOpenModalCourse = false
                this.getList()
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
  .p-coursePackage {
    .-c-tips {
      color: #39f
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
