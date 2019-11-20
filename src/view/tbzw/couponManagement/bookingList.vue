<template>
  <div class="p-bookingList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">活动名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">活动状态：</div>
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
        class="p-bookingList"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="800"
        :title="addInfo.id ? '编辑预约信息' : '创建预约信息'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="130">
          <FormItem label="注意" class="-c-tips">
            添加活动后，预约人数为0时，可以更改所有活动信息。预约人数大于0时，活动关联的付费体验课班级不可更改，活动开始时间不可更改。每个付费体验课班级只能被一个预约活动关联，请谨慎操作。
          </FormItem>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="关联付费体验课班级" class="ivu-form-item-required">
            <div class="p-bookingList-formItemWrap" v-for="(item, index) of coursePeriodsList" :key="index">
              <div class="-item-name">{{item.courseName}}</div>
              <Select class="-item-select" v-model="item.periodsId" :disabled="addInfo.reservenum>0">
                <Option v-for="list of item.periodsList" :label=list.periods :value=list.activeId
                        :key="list.activeId"></Option>
              </Select>
            </div>
          </FormItem>
          <FormItem label="优惠信息" class="ivu-form-item-required">
            <div class="p-bookingList-formDataItem" v-for="(item,index) of addInfo.discountList" :key="index">
              <div class="item-wrap">
                <span>满足人数</span>
                <Input class="-item-input" type="text" v-model="item.personnum" placeholder="人数"></Input>
              </div>
              <div class="item-wrap">
                <span>优惠金额</span>
                <Input class="-item-input" type="text" v-model="item.money" placeholder="金额"></Input>
              </div>
              <div class="item-wrap">
                <span>购课地址</span>
                <Input class="-item-input -item-input-two" type="text" v-model="item.buyHref"
                       placeholder="购课地址"></Input>
              </div>
              <div class="g-error g-cursor" @click="delActiveInfo(index)">删除</div>
            </div>
            <Button v-if="addInfo.discountList.length<3" @click="addActiveInfo" ghost type="primary"
                    style="width: 100px;">
              新增优惠等级
            </Button>
          </FormItem>
          <FormItem label="虚拟预约用户" prop="vusers">
            <Button @click="openUserModal()" ghost type="primary" style="width: 100px;">+添加用户</Button>
            <div class="p-bookingList-formUser">
              <div class="-formUser-item" v-for="(item,index) of userImgList" :key="index">
                <img class="-img" :src="item.avatar"/>
                <div class="-name">{{item.nickname}}</div>
              </div>
            </div>
            <div class="-c-tips">为了营造真实的活动氛围，请选择在真实在群内的运营人员来充当虚拟预约用户</div>
          </FormItem>
          <FormItem label="预约活动时间" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="reserveStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" @on-change="changeStartClick"
                               v-model="addInfo.reserveStartTime" :options="dateStartOption"
                               :disabled="addInfo.reservenum>0"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="reserveStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期" @on-change="changeStartClick"
                               v-model="addInfo.reserveEndTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="抢课结束时间" prop="buyedEndTime">
            <Date-picker style="width: 100%" type="datetime" placeholder="选择抢课结束时间"
                         v-model="addInfo.buyedEndTime" :options="dateEndOptionTwo"></Date-picker>
          </FormItem>
          <FormItem label="活动规则" prop="ruleText">
            <Input type="textarea" v-model="addInfo.ruleText" :rows="4" placeholder="请输入活动规则"></Input>
          </FormItem>
          <FormItem label="分享大标题">
            <Input type="text" v-model="addInfo.maintitle" placeholder="请输入分享大标题"></Input>
          </FormItem>
          <FormItem label="分享小标题">
            <Input type="text" v-model="addInfo.subtitle" placeholder="请输入分享小标题"></Input>
          </FormItem>
          <Form-item label="链接配图">
            <upload-img v-model="addInfo.linkImg" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

    </Card>

    <Modal
      class="p-bookingList"
      v-model="isOpenModalDetail"
      @on-cancel="isOpenModalDetail = false"
      footer-hide
      width="800"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>
    </Modal>

    <virtual-user-template v-model="isOpenModalUser" @changeUsers="chioceUsers"
                           :propList="userImgList"></virtual-user-template>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";
  import VirtualUserTemplate from "./virtualUserTemplate";

  export default {
    name: 'flashScreen',
    components: {VirtualUserTemplate, UploadImg, DatePickerTemplate},
    data() {
      return {
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
            name: '进行中'
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
        dataList: [],
        detailList: [],
        userImgList: [],
        coursePeriodsList: [],
        selectInfo: '1',
        searchInfo: {
          payed: '-1'
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalDetail: false,
        isOpenModalUser: false,
        isSending: false,
        addInfo: {
          discountList: []
        },
        copy_url: '',
        statusList: {
          '0': '未开始',
          '5': '进行中',
          '3': '已结束',
          '4': '已过期'
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
        dateEndOptionTwo: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '团购名称长度为20字', trigger: 'blur'}
          ],
          vusers: [
            {required: true, type: 'array', message: '请选择虚拟用户', min: 1, trigger: 'change'},
          ],
          ruleText: [
            {required: true, message: '请输入活动规则', trigger: 'blur'},
          ],
          reserveStartTime: [
            {required: true, type: 'date', message: '请输入活动开始时间', trigger: 'blur'},
          ],
          reserveEndTime: [
            {required: true, type: 'date', message: '请输入活动结束时间', trigger: 'blur'},
          ],
          buyedEndTime: [
            {required: true, type: 'date', message: '请输入抢课结束时间', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '活动名称',
            key: 'name',
            tooltip: true,
            align: 'center'
          },
          {
            title: '关联班级',
            key: 'courseList',
            render: (h, params) => {
              return h('div', {
                style: {
                  padding: '5px 0'
                }
              }, params.row.courseList.map(item => {
                return h('div', `${item.courseName},${item.stage ? `第${item.stage}期` : '不参加'}`)
              }))
            },
            width: 250,
            align: 'center'
          },
          {
            title: '优惠信息',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '优惠信息',
                  placement: 'bottom'
                }
              }, [
                h('div', {
                  style: {
                    color: '#3399FF',
                    cursor: 'pointer'
                  }
                }, '查看详情'),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', params.row.discountList.map((item, index) => {
                    return h('div',
                      {
                        style: {
                          textAlign: 'left',
                          paddingBottom: '10px'
                        }
                      },
                      [
                        h('div', `优惠等级${index + 1}:`),
                        h('div', `1、满${item.personnum}人`),
                        h('div', `2、优惠${item.money}`),
                        h('div', `3、地址：${item.buyHref}`),
                      ])
                  }))
                ])
              ])
            },
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'reservenum',
            align: 'center'
          },
          {
            title: '活动时间',
            render: (h, params) => {
              return h('span', `${dayjs(+params.row.reserveStartTime).format('YYYY-MM-DD HH:mm')} - ${ dayjs(+params.row.reserveEndTime).format('YYYY-MM-DD HH:mm')}`)
            },
            width: 300,
            align: 'center'
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
                    color: '#5444E4'
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
                    display: !params.row.closed ? 'inline-block' : 'none',
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
                    display: params.row.closed ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.endItem(params.row)
                    }
                  }
                }, '结束'),
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '预约页面PV',
            key: 'name',
            align: 'center'
          },
          {
            title: '预约页面UV',
            key: 'groupEndTime',
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '预约率',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '下单人数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '成功订单数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '预约-付费转化率',
            width: 150,
            key: 'payUserCount',
            align: 'center'
          }
        ]
      };
    },
    watch: {
      'addInfo.reserveStartTime'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      },
      'addInfo.reserveEndTime'(_new, _old) {
        this.dateEndOptionTwo = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      chioceUsers(data) {
        this.userImgList = data
      },
      changeStartClick() {
        let data1 = new Date(this.addInfo.reserveStartTime).getTime()
        let data2 = new Date(this.addInfo.reserveEndTime).getTime()
        let data3 = new Date(this.addInfo.buyedEndTime).getTime()

        if (data1 > data2) {
          this.addInfo.reserveEndTime = ''
        }

        if ((data1 > data3) || (data2 > data3)) {
          this.addInfo.buyedEndTime = ''
        }
      },
      delActiveInfo(index) {
        this.addInfo.discountList.splice(index, 1)
      },
      addActiveInfo() {
        this.addInfo.discountList.push({
          personnum: '',
          money: '',
          buyHref: ''
        })
      },
      copyUrl(param) {
        this.copy_url = param.url
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      openUserModal() {
        this.isOpenModalUser = true
      },
      openModal(data) {
        this.coursePeriodsList = []
        this.userImgList = []
        this.isOpenModal = true

        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.reserveStartTime = new Date(+this.addInfo.reserveStartTime)
          this.addInfo.reserveEndTime = new Date(+this.addInfo.reserveEndTime)
          this.addInfo.buyedEndTime = new Date(+this.addInfo.buyedEndTime)
          this.addInfo.vusers.forEach(item => {
            this.userImgList.push({
              id: item.id,
              avatar: item.avatar,
              nickname: item.name
            })
          })
        } else {
          this.addInfo = {
            id: '',
            linkImg: '',
            reservenum: 0,
            discountList: [
              {
                personnum: '',
                money: '',
                buyHref: ''
              }
            ],
            courseList: []
          }
        }
        this.listActiveByPayExperience()
      },
      openModalDetail(data) {
        this.isOpenModalDetail = true
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
      getDetailList(num) {
        this.isFetching = true
        if (num) {
          this.tabDetail.currentPage = 1
        }
        this.$api.tbzwReserveBuy.listByPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          state: this.searchInfo.payed
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
      listActiveByPayExperience() {
        this.$api.tbzwActiveconfig.listActiveByPayExperience()
          .then(
            response => {
              this.coursePeriodsList = response.data.resultData;
              this.coursePeriodsList.forEach(item => {
                item.periodsList.unshift({
                  periods: '不参加',
                  activeId: '-1'
                })
              })
              if (this.addInfo.id) {
                this.addInfo.courseList.forEach(item => {
                  this.coursePeriodsList.forEach(list => {
                    list.periodsList.forEach(data => {
                      if (item.courseId === list.courseId) {
                        if (!item.stage) {
                          list.periodsId = '-1'
                        } else {
                          if (item.stage === data.periods) {
                            list.periodsId = data.activeId
                          }
                        }
                      }
                    })
                  })
                })
              }
            })
      },
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.tbzwReserveBuy.listByPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          status: this.searchInfo.payed === '-1' ? '' : this.searchInfo.payed
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.dataList.forEach((item, index) => {
                item.discountList.forEach((list) => {
                  item[`discount${index + 1}`] = list
                })
              })
              this.total = response.data.resultData.total;
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
            this.$api.tbzwReserveBuy.reserveBuyClose({
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
        this.addInfo.vusers = []
        this.addInfo.courseList = []

        let passCourse = this.coursePeriodsList.every((item) => {
          return item.periodsId
        })

        let passDiscountList = this.addInfo.discountList.every((item) => {
          return item.buyHref && item.money && item.personnum
        })

        if (!passCourse) {
          return this.$Message.error('请选择关联付费体验课期数')
        } else if (!passDiscountList) {
          return this.$Message.error('优惠信息字段不能为空')
        }

        this.coursePeriodsList.forEach(item => {
          item.periodsList.forEach(list => {
            if (item.periodsId === list.activeId) {
              this.addInfo.courseList.push({
                courseId: item.courseId,
                courseName: item.courseName,
                stage: item.periodsId === '-1' ? '' : list.periods
              })
            }
          })
        })

        this.userImgList.forEach(item => {
          this.addInfo.vusers.push({
            id: item.id,
            avatar: item.avatar,
            name: item.nickname
          })
        })

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let paramsData = {
              name: this.addInfo.name,
              discountList: this.addInfo.discountList,
              courseList: this.addInfo.courseList,
              reserveEndTime: new Date(this.addInfo.reserveEndTime).getTime(),
              reserveStartTime: new Date(this.addInfo.reserveStartTime).getTime(),
              buyedEndTime: new Date(this.addInfo.buyedEndTime).getTime(),
              ruleText: this.addInfo.ruleText,
              maintitle: this.addInfo.maintitle,
              subtitle: this.addInfo.subtitle,
              linkImg: this.addInfo.linkImg,
              vusers: this.addInfo.vusers
            }
            let paramsUrl = this.addInfo.id ? this.$api.tbzwReserveBuy.reserveBuyUpdate({
              id: this.addInfo.id,
              ...paramsData
            }) : this.$api.tbzwReserveBuy.reserveBuyAdd(paramsData)
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
  .p-bookingList {

    &-formItemWrap {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .-item-name {
        display: inline-block;
        margin-right: 20px;
      }

      .-item-select {
        width: 70%;
      }

    }

    &-formDataItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .item-wrap {
        /*width: 20%;*/
      }

      .-item-input {
        display: inline-block;
        margin-left: 10px;
        width: 50px;
      }

      .-item-input-two {
        width: 260px;
      }
    }

    &-formUser {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;

      .-formUser-item {
        text-align: center;
        width: 80px;
        padding: 10px 10px 0 0;
        cursor: pointer;

        .-img {
          cursor: pointer;
          margin: 0 auto;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .-name {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          height: 20px;
          line-height: 20px;
        }
      }
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
