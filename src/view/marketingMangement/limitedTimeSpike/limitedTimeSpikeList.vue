<template>
  <div class="p-help">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">秒杀状态：</div>
            <Select v-model="selectInfoOne" @on-change="getList(1)" class="-search-selectOne">
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
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-help"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="600"
      :title="addInfo.id ? '编辑限时秒杀': '添加限时秒杀'">
      <Form ref="addInfo" :model="addInfo" :label-width="90">
        <FormItem label="关联课程" prop="goodsId" class="ivu-form-item-required">
          <div class="g-course-add-style" @click="isShowCourseModal=true" v-if="!courseList.length">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isEdit'
                          :isRadioModal="true" :courseType="1"
                          @cancleCourseModal="isShowCourseModal = false"
                          @closeCourseModal="checkCourse"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <div v-if="!isEdit" class="-i-del" @click="delCourse(item,index)">删除</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="秒杀价格" prop="priceYuan" class="ivu-form-item-required">
          <InputNumber :disabled="isEdit" :min="0" v-model="addInfo.priceYuan" placeholder="请输入秒杀价格"></InputNumber>
        </FormItem>
        <FormItem label="最大限制" class="ivu-form-item-required">
          <Radio-group v-model="addInfo.limit">
            <Radio :label=0 :disabled="isEdit">不启用</Radio>
            <Radio :label=1 :disabled="isEdit">启用</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="限制人数" prop="maxStock" v-if="addInfo.limit" class="ivu-form-item-required">
          <InputNumber v-model="addInfo.maxStock" placeholder="请输入限制人数" :disabled="isEdit"></InputNumber>
        </FormItem>
        <FormItem label="有效期" class="ivu-form-item-required">
          <Row>
            <Col span="11">
              <Form-item prop="getStartTime">
                <Date-picker :disabled="isEdit" style="width: 100%" type="datetime" placeholder="选择开始日期"
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
          <span class="-c-tips">* 添加秒杀后，有效期开始时间不能更改，结束时间只能增加，不能减少</span>
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
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: '',
        selectInfoOne: '-1',
        selectInfo: '1',
        statusList: [
          {
            name: '全部',
            id: '-1'
          }, {
            name: '未开始',
            id: '0'
          }, {
            name: '进行中',
            id: '1'
          }, {
            name: '已过期',
            id: '3'
          }, {
            name: '已结束',
            id: '2'
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
          limit: 0
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
        columns: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '课程封面',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.courseImage
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
            title: '秒杀价格',
            key: 'priceYuan',
            align: 'center'
          },
          {
            title: '最大限制(人数)',
            render: (h, params) => {
              return h('div', params.row.maxStock == '-1' ? '无限制' : params.row.maxStock)
            },
            align: 'center'
          },
          {
            title: '秒杀销量',
            key: 'killAmount',
            align: 'center'
          },
          {
            title: '秒杀状态',
            render: (h, params) => {
              return h('div', this.initStatus(params.row.status))
            },
            align: 'center'
          },
          {
            title: '有效期开始',
            render: (h, params) => {
              return h('div', dayjs(+params.row.startTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '有效期结束',
            render: (h, params) => {
              return h('div', dayjs(+params.row.endTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.status == 0 || params.row.status == 1) {
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
          }
        ],
      };
    },
    watch: {
      'getStartTime'(_new, _old) {
        if(!this.isEdit) {
          this.dateEndOption = {
            disabledDate(date) {
              return date && date.valueOf() < new Date(_new).getTime();
            }
          }
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      delCourse(item, index) {
        this.courseList.splice(index, 1)
      },
      initStatus(data) {
        let name = ''
        for (let item of this.statusList) {
          if (item.id == data) {
            name = item.name
          }
        }
        return name
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
          this.addInfo.limit = this.addInfo.maxStock == '0' ? 0 : 1
          this.addInfo.priceYuan = +this.addInfo.priceYuan
          this.addInfo.maxStock = +this.addInfo.maxStock
          this.getStartTime = new Date(+this.addInfo.startTime)
          this.getEndTime = new Date(+this.addInfo.endTime)
          this.courseList.push({
            courseImgUrl: this.addInfo.courseImage,
            courseName: this.addInfo.courseName
          })
          this.dateEndOption = {
            disabledDate(date) {
              return date && date.valueOf() < (_self.addInfo.endTime)
            }
          }
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.isEdit = false
          this.addInfo = {
            limit: 0,
            priceYuan: null,
            maxStock: null
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if(num) {
          this.tab.currentPage = 1
        }
        this.$api.seckill.getList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseName: this.searchInfo,
          status: this.selectInfoOne == '-1' ? '' : this.selectInfoOne
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
          content: '确认结束限时秒杀吗？',
          onOk: () => {
            this.$api.seckill.closeSecKill({
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
        if (!this.addInfo.goodsId) {
          return this.$Message.error('请选择关联课程')
        } else if (this.addInfo.limit && !this.addInfo.maxStock) {
          return this.$Message.error('请输入限制人数')
        } else if (this.addInfo.priceYuan == null) {
          return this.$Message.error('请输入秒杀价格')
        } else if (!this.getStartTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.getEndTime) {
          return this.$Message.error('请输入结束时间')
        }
        this.isSending = true
        this.addInfo.startTime = new Date(this.getStartTime).getTime()
        this.addInfo.endTime = new Date(this.getEndTime).getTime()
        this.addInfo.maxStock = this.addInfo.limit ? this.addInfo.maxStock : '0'
        let paramUrl = ''
        paramUrl = !this.addInfo.id ?  this.$api.seckill.addSecKill :  this.$api.seckill.upadteSecKill
        paramUrl(this.addInfo)
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
      checkCourse(params) {
        this.isShowCourseModal = false;
        this.courseList = params
        this.addInfo.goodsId = params.length && this.courseList[0].id
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

    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*width: 140px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
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
