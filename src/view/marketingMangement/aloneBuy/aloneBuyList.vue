<template>
  <div class="p-alone">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">

    <Card>
      <Row class="g-search">
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>
      <div class="g-add-btn g-add-top" @click="openModal('',3)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-alone"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="450"
      :title="openTypeList[openType]">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
        <FormItem label="优惠券面额" v-if="openType == '1'"  class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.denomination" placeholder="请输入优惠券面额"></Input>
        </FormItem>
        <FormItem label="关联课程" prop="courseId"  class="ivu-form-item-required" v-if="openType != '3'">
          <div class="g-course-add-style" @click="isShowCourseModal=true">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course-two :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isEdit'
                          :course-type="openType == '3' ? 0 : 1"
                          :isRadioModal="openType == '3'"
                          :categoryId="addInfo.categoryId"
                          @cancleCourseModal="isShowCourseModal = false"
                          @closeCourseModal="checkCourse"></check-course-two>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.imgurl">
              <div class="-i-text">{{item.name}}</div>
              <div v-if="!isEdit  || openType!='3'" class="-i-del" @click="delCourse(item,index)">删除课程</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="关联课程" prop="courseId"  class="ivu-form-item-required" v-if="openType == '3'">
          <div class="g-course-add-style" @click="isShowCourseModal=true" v-if="!courseList.length">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isEdit'
                          :course-type="0"
                          :isRadioModal="true"
                          @cancleCourseModal="isShowCourseModal = false"
                          @closeCourseModal="checkCourse"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.imgurl">
              <div class="-i-text">{{item.name}}</div>
              <div v-if="!isEdit  || openType!='3'" class="-i-del" @click="delCourse(item,index)">删除课程</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="单独购价格" prop="priceYuan" v-if="openType == '3'">
          <Input type="text" v-model="addInfo.priceYuan" placeholder="请输入单独购价格"></Input>
        </FormItem>
        <FormItem label="初始销量" prop="showSaleNum" v-if="openType == '3'">
          <Input type="text" v-model="addInfo.showSaleNum" placeholder="请输入初始销量"></Input>
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
  import {copyUrl} from "@/libs/index"
  import CheckCourseTwo from "../../../components/checkCourseTwo";
  import CheckCourse from "../../../components/checkCourse";

  export default {
    name: 'aloneBuy',
    components: {CheckCourse, CheckCourseTwo},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: '',
        selectInfo: '1',
        openType: '',
        openTypeList: {
          '1': '毕业礼包',
          '2': '售前推荐',
          '3': '编辑单独购'
        },
        dataList: [],
        courseList: [],
        dataItem:'',
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isEdit: false,
        isShowCourseModal: false,
        copy_url: '',
        addInfo: {
          courseId: '',
          priceYuan: '',
          showSaleNum: ''
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
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.coverUrl
                },
                style: {
                  width: '100px',
                  height: '60px',
                  margin: '10px'
                }
              })
            },
            align: 'center'
          },
          {
            title: '单独购价格',
            key: 'priceYuan',
            align: 'center'
          },
          {
            title: '单独购销量',
            key: 'amount',
            align: 'center'
          },
          {
            title: '是否上架',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.disabled ? 'default' : 'success'
                }
              }, !params.row.disabled ? '是' : '否')
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 320,
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
                      this.openModal(params.row, 1)
                    }
                  }
                }, '毕业礼包'),
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
                }, '售前推荐'),
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
                      this.copyUrlFn(params.row)
                    }
                  }
                }, '复制链接'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: !params.row.disabled ? 'rgb(218, 55, 75)' : '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, !params.row.disabled ? '下架' : '上架')
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
      copyUrlFn(row) {
        let url = `${copyUrl()}/${row.goodsId}?type=0`;
        this.copy_url = url;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      delCourse(item, index) {
        this.courseList.splice(index, 1)
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认更改该商品状态？',
          onOk: () => {
            this.$api.goods.changeAloneStatus({
              goodsId: param.goodsId
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
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data, num) {
        this.openType = num
        this.courseList = []
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        switch (num) {
          case 1 :
            this.getGraduateGiftPack(data)
            break;
          case 2:
            this.getPreSaleRecommend(data)
            break
          case 3:
            if (data) {
              this.isEdit = true
              this.addInfo.priceYuan = this.addInfo.priceYuan.toString()
              this.addInfo.showSaleNum = this.addInfo.showSaleNum.toString()
              this.courseList.push({
                imgurl: this.addInfo.coverUrl,
                name: this.addInfo.name
              })
            } else {
              this.isEdit = false
              this.addInfo = {
                courseId: '',
                priceYuan: '',
                showSaleNum: ''
              }
            }
            break
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.goods.aloneList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //分页查询
      getGraduateGiftPack(data) {
        this.$api.graduategiftpack.getGraduateGiftPack({
          goodsId: data.goodsId
        })
          .then(
            response => {
              this.dataItem = response.data.resultData
              this.addInfo.denomination = this.dataItem.denomination;
              if (this.dataItem.courseIds) {
                this.dataItem.courseIds.forEach(item=>{
                  this.courseList.push({
                    ...item,
                    id: item.goodsId
                  })
                });
              }
              this.$forceUpdate()
            })
      },
      getPreSaleRecommend(data) {
        this.$api.graduategiftpack.getPreSaleRecommend({
          goodsId: data.goodsId
        })
          .then(
            response => {
              response.data.resultData.courseIds.forEach(item=>{
                this.courseList.push({
                  ...item,
                  id: item.goodsId
                })
              });
            })
      },
      submitInfo(name) {
        if (!this.addInfo.courseId && this.openType == '3') {
          return this.$Message.error('请选择关联课程')
        } else if (!this.addInfo.denomination && this.openType == '1') {
          return this.$Message.error('请输入优惠券面额')
        }
        switch (this.openType) {
          case 1:
            this.courseList.forEach(item=>{
              delete item.id
            })
            this.$api.graduategiftpack.editGraduateGiftPack({
              id: this.dataItem.id,
              goodsId: this.addInfo.goodsId,
              denomination: this.addInfo.denomination,
              courseIds: this.courseList
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
            break
          case 2:
            this.courseList.forEach(item=>{
              delete item.id
            })
            this.$api.graduategiftpack.editPreSale({
              goodsId: this.addInfo.goodsId,
              courseIds: this.courseList
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
            break
          case 3:
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.isSending = true
                let promiseDate = this.addInfo.goodsId ? this.$api.goods.updateAlone(this.addInfo) : this.$api.goods.addAlone(this.addInfo)
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
            break
        }
      },
      checkCourse(params) {
        this.isShowCourseModal = false;
        this.courseList = []
        console.log(params,'121212')
        params.forEach(item => {
          this.courseList.push({
            id: item.goodsId,
            goodsId: item.goodsId,
            name: item.name,
            imgurl: item.imgurl || item.coverUrl || item.courseImgUrl
          })
        })
        this.addInfo.courseId = params.length && params[0].id
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-alone {
    .copy-input {
      position: absolute;
      opacity: 0;
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
