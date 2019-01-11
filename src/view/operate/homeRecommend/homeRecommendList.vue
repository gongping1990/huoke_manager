<template>
  <div class="p-homeRecommend">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-homeRecommend"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="600"
      :title="addInfo.id ? '编辑首页推荐' : '新增首页推荐'">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="100">
        <FormItem label="推荐位名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入推荐位名称"></Input>
        </FormItem>
        <FormItem label="展示模板">
          <Radio-group v-model="addInfo.mode">
            <Radio :label=1>1行一个</Radio>
            <Radio :label=2>1行两个</Radio>
          </Radio-group>
          <div class="-p-h-img"><img :src="imgUrl"/></div>
        </FormItem>
        <FormItem label="首页展示数量" prop="showNum">
          <Select v-model="addInfo.showNum">
            <Option v-for="(item,index) in numList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="排序值" prop="sortNum">
          <Input type="text" v-model="addInfo.sortNum" placeholder="请输入排序值"></Input>
        </FormItem>
        <FormItem label="推荐课程" prop="courseGoodsIds" class="ivu-form-item-required">
          <div class="g-course-add-style -p-h-margin" @click="isShowCourseModal=true">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isEdit'
                          :isRadioModal="false" :courseType="1"
                          @cancleCourseModal="isShowCourseModal = false"
                          @closeCourseModal="checkCourse"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <div class="-i-del" @click="delCourse(item,index)">删除</div>
            </div>
          </div>
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
  import dayjs from 'dayjs'

  export default {
    name: 'friendHelp',
    components: {CheckCourse},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        courseList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isEdit: false,
        isShowCourseModal: false,
        numList: [
          {
            id: '2',
            name: '2'
          },
          {
            id: '4',
            name: '4'
          },
          {
            id: '6',
            name: '6'
          },
          {
            id: '8',
            name: '8'
          },
          {
            id: '10',
            name: '10'
          }
        ],
        addInfo: {
          mode: 1,
          courseGoodsIds: []
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '展示模板',
            render: (h, params) => {
              return h('div', params.row.mode == '1' ? '一行一个' : '一行两个')
            },
            align: 'center'
          },
          {
            title: '首页展示数量',
            key: 'showNum',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortNum',
            align: 'center'
          },
          {
            title: '推荐课程',
            key: 'courseNum',
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
                }, '删除')
              ])
            }
          }
        ],
        ruleValidate: {
          name: [
            {required: true, message: '请输入推荐课名称', trigger: 'blur'}
          ],
          showNum: [
            {required: true, message: '请选择首页展示数量', trigger: 'change'}
          ],
          sortNum: [
            {required: true, message: '请输入排序值', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {
      imgUrl() {
        return this.addInfo.mode == '2' ? require('../../../assets/images/home-r-two.png') : require('../../../assets/images/home-r-one.png')
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      delCourse(item, index) {
        this.courseList.splice(index, 1)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.courseList = []
        this.isOpenModal = true
        if (data) {
          let _self = this
          this.isEdit = true
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.showNum = this.addInfo.showNum.toString()
          this.addInfo.sortNum = this.addInfo.sortNum.toString()
          this.addInfo.courseGoodsList.forEach(item => {
            this.courseList.push({
              courseImgUrl: item.coverUrl,
              courseName: item.name,
              id: item.goodsId
            })
          })

        } else {
          this.isEdit = false
          this.addInfo = {
            mode: 1,
            courseGoodsIds: []
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.config.homeRecommendList({
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除模板吗？',
          onOk: () => {
            this.$api.config.delHomeRecommend({
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
        this.addInfo.courseGoodsIds = []

        this.$refs[name].validate((valid) => {
          if (valid) {
            let paramUrl = ''

            if (!this.courseList.length) {
              return this.$Message.error('请选择推荐课程')
            }
            this.isSending = true

            if(this.addInfo.id) {
              delete this.addInfo.courseGoodsList
              delete this.addInfo.courseNum
              delete this.addInfo._index
              delete this.addInfo._rowKey
            }

            this.courseList.forEach(item => {
              this.addInfo.courseGoodsIds.push(item.id)
            })

            paramUrl = this.addInfo.id ? this.$api.config.updateHomeRecommend(this.addInfo) : this.$api.config.addHomeRecommend(this.addInfo)
            paramUrl
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
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-homeRecommend {
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

    .-p-h-margin {
      margin-bottom: 10px;
    }

    .-p-h-img {
      img {
        width: 50%;
      }
    }

    .-c-tab {
      margin: 20px 0;
    }

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
        margin-right: 10px;

        img {
          width: 140px;
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
