<template>
  <div class="p-couponList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <Radio :label=0>小语轻作文</Radio>
          <Radio :label=1>乐小狮作文</Radio>
          <Radio :label=2>乐小狮作文2.0</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">优惠券名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">领取状态：</div>
            <Select v-model="searchInfo.payed" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of receiveStatus" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
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

      <Modal
        class="p-couponList"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="600"
        :title="addInfo.id ? '编辑优惠券' : '创建优惠券'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="注意" class="-c-tips">
            添加优惠券后，只能修改发行量、分享大标题、分享小标题、链接配图，且发行量只能增加，不能减少，如其他参数填写错误，请结束后重新添加
          </FormItem>
          <FormItem label="适用课程">
            <div class="p-couponList-formItemWrap">
              <div class="-item-name" v-for="(item,index) of applicableCourseList" :key="index">{{item}}</div>
            </div>
          </FormItem>
          <FormItem label="优惠券名称" prop="couponName">
            <Input type="text" v-model="addInfo.couponName" :disabled="addInfo.id!=''" placeholder="请输入优惠券名称"></Input>
          </FormItem>
          <FormItem label="优惠券面额" prop="couponAmount">
            <Input-number class="g-width" :min="0" :step="1" v-model="addInfo.couponAmount" :disabled="addInfo.id!=''"
                          placeholder="请输入优惠券面额（元）"></Input-number>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="发行量" prop="couponNum">
            <Input-number class="g-width" :max="1000000" :min="0" :step="1" v-model="addInfo.couponNum"
                          placeholder="请输入发行量"></Input-number>
            <span class="-c-tips">* 添加优惠券后，发行量只能增加，不能减少，总共不超过1,000,000张</span>
          </FormItem>
          <FormItem label="有效期" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="expiryStartDate">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="true"
                               v-model="addInfo.receiveStartDate" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="expiryEndDate">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.expiryEndDate" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="领取时间" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="receiveStartDate">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="addInfo.id!=''"  @on-change="changeStartClick"
                               v-model="addInfo.receiveStartDate" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="receiveEndDate">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.receiveEndDate" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="分享大标题">
            <Input type="text" v-model="addInfo.bigTitle" placeholder="请输入分享大标题"></Input>
          </FormItem>
          <FormItem label="分享小标题">
            <Input type="text" v-model="addInfo.title" placeholder="请输入分享小标题"></Input>
          </FormItem>
          <Form-item label="链接配图">
            <upload-img v-model="addInfo.playbill" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>

    <Modal
      class="p-couponList"
      v-model="isOpenModalDetail"
      @on-cancel="isOpenModalDetail = false"
      footer-hide
      width="800"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>
    </Modal>

    <coupon-log-template v-model="isOpenModalLog" :couponId="dataItem"></coupon-log-template>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";
  import CouponLogTemplate from "./couponLogTemplate";

  export default {
    name: 'flashScreen',
    components: {CouponLogTemplate, UploadImg, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        receiveStatus: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '0',
            name: '未开始'
          },
          {
            id: '1',
            name: '领取中'
          },
          {
            id: '2',
            name: '已结束'
          },
          {
            id: '3',
            name: '已过期'
          }
        ],
        radioType: 0,
        dataList: [],
        detailList: [],
        selectInfo: '1',
        searchInfo: {
          payed: '-1'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalDetail: false,
        isOpenModalLog: false,
        isSending: false,
        addInfo: {},
        dataItem: {},
        copy_url: '',
        statusList: {
          '0': '未开始',
          '1': '领取中',
          '2': '已结束',
          '3': '已过期'
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
          couponName: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '优惠券名称长度为20字', trigger: 'blur'}
          ],
          couponAmount: [
            {required: true, type: 'number', message: '请输入优惠券金额', trigger: 'blur'},
          ],
          couponNum: [
            {required: true, type: 'number', message: '请输入优惠券发行量', trigger: 'blur'},
          ],
          expiryEndDate: [
            {required: true, type: 'date', message: '请输入有效期结束时间', trigger: 'blur'},
          ],
          receiveStartDate: [
            {required: true, type: 'date', message: '请输入领取开始时间', trigger: 'blur'},
          ],
          receiveEndDate: [
            {required: true, type: 'date', message: '请输入领取结束时间', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '优惠券名称',
            key: 'couponName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '优惠券金额',
            render: (h, params) => {
              return h('span', (+params.row.couponAmount / 100).toFixed(2))
            },
            key: 'couponAmount',
            align: 'center'
          },
          {
            title: '满减金额',
            render: (h, params) => {
              return h('span', (+params.row.fullReductionAmount / 100).toFixed(2))
            },
            key: 'couponAmount',
            align: 'center'
          },
          {
            title: '领取时间',
            render: (h, params) => {
              return h('span', `${params.row.receiveStartDate} - ${params.row.receiveEndDate}`)
            },
            width: 160,
            align: 'center'
          },
          {
            title: '有效期时间',
            render: (h, params) => {
              return h('span', `${params.row.expiryStartDate} - ${params.row.expiryEndDate}`)
            },
            width: 160,
            align: 'center'
          },
          {
            title: '发行量',
            key: 'couponNum',
            align: 'center'
          },
          {
            title: '已领取',
            render: (h,p)=> {
              return h('div',{
                style: {
                  cursor: 'pointer',
                  color: '#5444E4'
                },
                on: {
                  click: () => {
                    this.openModalLog(p.row,1)
                  }
                }
              }, p.row.receives)
            },
            align: 'center'
          },
          {
            title: '已使用',
            render: (h,p)=> {
              return h('div',{
                style: {
                  cursor: 'pointer',
                  color: '#5444E4'
                },
                on: {
                  click: () => {
                    this.openModalLog(p.row,2)
                  }
                }
              }, p.row.uses)
            },
            align: 'center'
          },
          {
            title: '领取状态',
            render: (h, params) => {
              return h('div', this.statusList[params.row.type])
            }
          },
          {
            title: '操作',
            width: 260,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                  },
                  on: {
                    click: () => {
                      this.openModalDetail(params.row)
                    }
                  }
                }, '数据统计'),
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
                      this.copyUrl(params.row)
                    }
                  }
                }, '复制链接'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type < 2 ? 'inline-block' : 'none',
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
                    display: params.row.type > 1 ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.endItem(params.row)
                    }
                  }
                }, '结束')
              ])
            }
          }
        ],
        columnsModal: [
         {
           title: '领取页面PV',
           key: 'pv',
           align: 'center'
         },
         {
           title: '领取页面UV',
           key: 'uv',
           align: 'center'
         },
         {
           title: '页面分享次数',
           key: 'shareNum',
           align: 'center'
         },
         {
           title: '领取人数',
           key: 'getNum',
           align: 'center'
         },
         {
           title: '下单人数',
           key: 'orderNum',
           align: 'center'
         },
         {
           title: '成功订单数',
           key: 'successOrderNum',
           align: 'center'
         },
         {
           title: '付费转化率',
           render: (h, params)=> {
             return h('div', `${params.row.payPercent*100}%`)
           },
           align: 'center'
         }
       ]
      };
    },
    watch: {
      'addInfo.receiveStartDate'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      }
    },
    computed: {
      applicableCourseList() {
        let list = []
        if (this.radioType === 0) {
          list = ['小语轻作文']
        } else {
          list = ['乐小狮作文高段', '乐小狮作文中段', '乐小狮作文低段']
        }
        return list
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModalLog (data) {
        this.dataItem = data.id
        this.isOpenModalLog = true
      },
      openModalDetail(data) {
        this.dataItem = data
        this.isOpenModalDetail = true
        this.getCouponData()
      },
      changeStartClick () {
        let data1 = new Date(this.addInfo.receiveStartDate).getTime()
        let data2 = new Date(this.addInfo.receiveEndDate).getTime()
        let data3 = new Date(this.addInfo.expiryEndDate).getTime()

        if (data1 > data2) {
          this.addInfo.receiveEndDate = ''
        }

        if (data1 > data3) {
          this.addInfo.expiryEndDate = ''
        }
      },
      copyUrl(param) {
        this.copy_url = param.couponUrl
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.couponAmount = +this.addInfo.couponAmount / 100
          this.addInfo.couponNum = +this.addInfo.couponNum
        } else {
          this.addInfo = {
            id: '',
            couponAmount: null,
            couponNum: null,
            playbill: ''
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
        this.$api.tbzwCoupon.pageCouponConfig({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          couponName: this.searchInfo.nickname,
          type: this.searchInfo.payed,
          couponType: [1,3,4][this.radioType],
          newCourseCoupon: this.radioType === 1
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
      getCouponData() {
        this.isFetching = true
        this.$api.tbzwCoupon.getCouponData({
          id: this.dataItem.id,
        })
          .then(
            response => {
              this.detailList = [response.data.resultData];
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      endItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？',
          onOk: () => {
            this.$api.tbzwCoupon.finishCoupon({
              couponId: param.id
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

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (new Date(this.addInfo.expiryEndDate).getTime() < new Date(this.addInfo.receiveEndDate).getTime()) {
              return this.$Message.error('有效期时间不能小于领取时间')
            }
            this.isSending = true
            this.$api.tbzwCoupon.editCouponConfig({
              id: this.addInfo.id,
              type: this.radioType === 0 ? 1 : 3,
              expiryStartDate: dayjs(this.addInfo.receiveStartDate).format("YYYY/MM/DD HH:mm:ss"),
              expiryEndDate: dayjs(this.addInfo.expiryEndDate).format("YYYY/MM/DD HH:mm:ss"),
              receiveStartDate: dayjs(this.addInfo.receiveStartDate).format("YYYY/MM/DD HH:mm:ss"),
              receiveEndDate: dayjs(this.addInfo.receiveEndDate).format("YYYY/MM/DD HH:mm:ss"),
              couponName: this.addInfo.couponName,
              couponNum: this.addInfo.couponNum,
              couponAmount: this.addInfo.couponAmount * 100,
              bigTitle: this.addInfo.bigTitle,
              playbill: this.addInfo.playbill,
              title: this.addInfo.title
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
  .p-couponList {

    &-formItemWrap{
      display: flex;

      .-item-name {
        display: inline-block;
        padding: 4px 8px;
        line-height: 18px;
        color: #ffffff;
        border-radius: 20px;
        background: #00c9ff;
        margin-left: 10px;
      }
    }
    .g-add-top {
      top: 110px;
    }
    .copy-input {
      position: absolute;
      opacity: 0;
    }

    .-search-select-text-two {
      margin-left: 20px;
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
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

  }
</style>
