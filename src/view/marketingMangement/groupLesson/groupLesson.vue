<template>
  <div class="p-groupLesson">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">拼课状态：</div>
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
      class="p-groupLesson"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="600"
      title="编辑拼课">
      <Form ref="addInfo" :model="addInfo" :label-width="110">
        <FormItem label="关联课程" class="ivu-form-item-required">
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
              <div>
                <img :src="item.courseImgUrl">
                <div v-if="!isEdit" class="-i-del" @click="delCourse(item,index)">删除课程</div>
              </div>
              <div class="-i-text">{{item.courseName}}</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="拼课人数" class="ivu-form-item-required">
          <Input type="text" :disabled="isEdit" v-model="addInfo.groupPersonNum" placeholder="请输入拼课人数"></Input>
        </FormItem>
        <FormItem label="拼课时限" class="ivu-form-item-required">
          <Input type="text" :disabled="isEdit" v-model="addInfo.groupWaitTime" placeholder="请输入拼课时限（小时）"></Input>
        </FormItem>
        <FormItem label="拼课价格" class="ivu-form-item-required">
          <Input type="text" :disabled="isEdit" v-model="addInfo.groupPriceYuan" placeholder="请输入拼课时限（元）"></Input>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </FormItem>
        <FormItem label="团长优惠" class="ivu-form-item-required">
          <Radio-group v-model="addInfo.limit">
            <Radio :label=0 :disabled="isEdit">不启用</Radio>
            <Radio :label=1 :disabled="isEdit">启用</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="团长优惠价格" v-if="addInfo.limit" class="ivu-form-item-required">
          <Input type="text" :disabled="isEdit" v-model="addInfo.groupFirstPriceYuan"
                 placeholder="请输入团长优惠价格(元)"></Input>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </FormItem>
        <FormItem label="有效期" class="ivu-form-item-required">
          <Row>
            <Col span="11">
              <Form-item prop="date">
                <Date-picker :disabled="isEdit" style="width: 100%" type="datetime" placeholder="选择开始日期"
                             v-model="getStartTime" :options="dateStartOption"></Date-picker>
              </Form-item>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <Form-item prop="time">
                <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                             v-model="getEndTime" :options="dateEndOption"></Date-picker>
              </Form-item>
            </Col>
          </Row>
          <span class="-c-tips">* 添加拼课后，有效期开始时间不能更改，结束时间只能增加，不能减少</span>
        </FormItem>
        <FormItem label="分享摘要">
          <Input type="textarea" :disabled="isEdit" :rows="4" v-model="addInfo.shareText" placeholder="请输入分享摘要"></Input>
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
  import {pattern} from '@/libs/regexp'
  import dayjs from 'dayjs'

  export default {
    name: 'friendHelp',
    components: {CheckCourse},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
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
            return date && date.valueOf() < Date.now() - 86400000;
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
                  src: params.row.courseImgUrl
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
            title: '拼课时限',
            key: 'groupWaitTime',
            align: 'center'
          },
          {
            title: '拼课人数',
            key: 'groupPersonNum',
            align: 'center'
          },
          {
            title: '拼课购价格',
            key: 'groupPriceYuan',
            align: 'center'
          },
          {
            title: '团长优惠价格',
            key: 'groupFirstPriceYuan',
            align: 'center'
          },
          {
            title: '拼课销量',
            key: 'amount',
            align: 'center'
          },
          {
            title: '拼课状态',
            render: (h, params) => {
              return h('div', this.initStatus(params.row.showStatus))
            },
            align: 'center'
          },
          {
            title: '有效期开始',
            key: 'showTime',
            align: 'center',
            width: 100
          },
          {
            title: '有效期结束',
            key: 'endTime',
            align: 'center',
            width: 100
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.showStatus == '0' || params.row.showStatus == '1') {
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
        if (!this.isEdit) {
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
          this.addInfo.limit = this.addInfo.groupFirstPriceYuan ? 1 : 0
          this.getStartTime = new Date(this.addInfo.showTime)
          this.getEndTime = new Date(this.addInfo.endTime)
          this.addInfo.goodsId = this.addInfo.id
          this.courseList.push({
            courseImgUrl: this.addInfo.courseImgUrl,
            courseName: this.addInfo.courseName
          })
          this.dateEndOption = {
            disabledDate(date) {
              return date && date.valueOf() < (new Date(_self.addInfo.endTime).getTime())
            }
          }
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.isEdit = false
          this.addInfo = {
            limit: 0
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
        this.$api.goods.groupList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo,
          groupStatus: this.selectInfoOne,
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
          content: '确认结束该拼课吗？',
          onOk: () => {
            this.$api.goods.closeGroup({
              groupBuyId: param.groupBuyId
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
        } else if (!this.addInfo.groupPersonNum) {
          return this.$Message.error('请输入拼课人数')
        } else if (this.addInfo.groupPersonNum > 999 || this.addInfo.groupPersonNum < 2) {
          return this.$Message.error('拼课人数范围为 2-999')
        } else if (!this.addInfo.groupWaitTime) {
          return this.$Message.error('请输入拼课时限')
        } else if (this.addInfo.groupWaitTime > 99 || this.addInfo.groupWaitTime < 0) {
          return this.$Message.error('拼课时限范围为 1-99')
        } else if (!this.addInfo.groupPriceYuan) {
          return this.$Message.error('请输入拼课价格')
        } else if (this.addInfo.groupPriceYuan > 99999 || this.addInfo.groupPriceYuan < 0) {
          return this.$Message.error('拼课价格范围为 1-99999')
        } else if (!pattern.positive.exec(this.addInfo.groupPriceYuan)) {
          return this.$Message.error('拼课价格保留两位小数')
        } else if (this.addInfo.limit && !this.addInfo.groupFirstPriceYuan) {
          return this.$Message.error('请输入团长优惠价格')
        } else if (this.addInfo.limit && (this.addInfo.groupFirstPriceYuan > 99999 || this.addInfo.groupFirstPriceYuan < 0)) {
          return this.$Message.error('团长优惠价格范围为 1-99999')
        } else if (this.addInfo.limit && !pattern.positive.exec(this.addInfo.groupFirstPriceYuan)) {
          return this.$Message.error('团长优惠价格保留两位小数')
        } else if (!this.getStartTime) {
          return this.$Message.error('请输入课程开始时间')
        } else if (!this.getEndTime) {
          return this.$Message.error('请输入课程结束时间')
        }

        this.isSending = true
        this.addInfo.showTime = dayjs(this.getStartTime).format("YYYY/MM/DD HH:mm:ss")
        this.addInfo.endTime = dayjs(this.getEndTime).format("YYYY/MM/DD HH:mm:ss")
        this.addInfo.groupFirstPriceYuan = this.addInfo.limit ? this.addInfo.groupFirstPriceYuan : ''

        let promiseDate = this.addInfo.groupBuyId ? this.$api.goods.updateGroup(this.addInfo) : this.$api.goods.addGroup(this.addInfo)
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
  .p-groupLesson {
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
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
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
