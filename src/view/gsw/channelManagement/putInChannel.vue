<template>
  <div class="p-channel">
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
        <Col :span="15" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          <Button ghost type="primary" style="width: 100px;">导出数据</Button>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-channel"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑投放记录' : '新增投放记录'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="当前选中">
            {{$route.query.name}}-{{$route.query.secondName}}
          </FormItem>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="投放位置" prop="place">
            <Select v-model="addInfo.place" @on-change="channerPriceGet">
              <Option v-for="(item,index) in adminList" :label="item.place" :value="item.place" :key="index"></Option>
            </Select>
          </FormItem>
          <FormItem label="投放日期" prop="startDate">
            <Date-picker style="width: 100%" type="datetime" placeholder="选择日期" :disabled="!addInfo.place"
                         v-model="addInfo.startDate" @on-change="channerPriceGet"></Date-picker>
          </FormItem>
          <FormItem label="预估曝光量">
            {{priceInfo.shownum || 0}}
          </FormItem>
          <FormItem label="预估价值">
            {{priceInfo.price || 0}}
          </FormItem>
          <FormItem label="选择页面" prop="page">
            <Radio-group v-model="addInfo.page">
              <Radio label='1' disabled>试听页面</Radio>
              <Radio label='2' disabled>购买页面</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="投放方式" prop="showType">
            <Select v-model="addInfo.showType">
              <Option v-for="(item,index) in deliveryModeList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </FormItem>
          <FormItem label="投放人员" prop="optuid">
            <Select v-model="addInfo.optuid">
              <Option v-for="(item,index) in deliveryPersonnelList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <put-in-list-template ref="putInList" v-model="isOpenDataModal" :id="putInId"></put-in-list-template>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import PutInListTemplate from "./putInListTemplate";

  export default {
    name: 'putInChannel',
    components: {PutInListTemplate, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '投放日期',
          type: 'datetime'
        },
        copy_url: '',
        dataList: [],
        adminList: [],
        deliveryModeList: [
          {
            id: '1',
            name: '软文'
          },
          {
            id: '2',
            name: '海报'
          },
          {
            id: '3',
            name: '链接'
          },
          {
            id: '0',
            name: '其他'
          }
        ],
        deliveryPersonnelList: [],
        putInId: '',
        selectInfo: '1',
        searchInfo: {
          fromDate: '',
          toDate: ''
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalCopy: false,
        isSending: false,
        isOpenDataModal: false,
        addInfo: {},
        priceInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '活动名称长度为20字', trigger: 'blur'}
          ],
          place: [
            {required: true, message: '请选择投放位置', trigger: 'change'},
          ],
          startDate: [
            {required: true, type: 'date', message: '请选择投放日期', trigger: 'change'},
          ],
          showType: [
            {required: true, message: '请选择投放方式', trigger: 'change'},
          ],
          page: [
            {required: true, message: '请选择投放页面', trigger: 'change'},
          ],
          optuid: [
            {required: true, message: '请选择投放人员', trigger: 'change'},
          ],

        },
        columns: [
          {
            title: '投放信息',
            render: (h,params)=>{
              return h('div',params.row.info.map((item,index)=>{
                return h('div',`${this.infoList[index]}：${item}`)
              }))
            },
            width: 160
          },
          {
            title: '二维码',
            render: (h,params)=>{
              return h('div',{
                style: {
                  position: 'relative',
                }
              },[
                h('img', {
                  attrs: {
                    src: params.row.qrcode
                  },
                  style: {
                    width: '60px',
                    height: '60px',
                    margin: '10px'
                  }
                }),
                h('Icon', {
                  props: {
                    type: 'md-download'
                  },
                  style: {
                    position: 'absolute',
                    bottom: '17px',
                    right: '15px',
                    fontSize: '16px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      window.open(params.row.qrcode)
                    }
                  }
                })
              ])
            },
            align: 'center',
            width: 120
          },
          {
            title: '投放人',
            key: 'uname',
            align: 'center',
            width: 120
          },
          {
            title: '活动名称',
            key: 'showname',
            align: 'center',
            width: 120
          },
          {
            title: '累计页面访问量',
            key: 'pv',
            align: 'center',
            width: 120
          },
          {
            title: '累计访问用户',
            key: 'uv',
            align: 'center',
            width: 120
          },
          {
            title: '累计试听申请用户',
            key: 'tryapplyuv',
            align: 'center',
            width: 140
          },
          {
            title: '累计付试听通过用户',
            key: 'trypasseduv',
            align: 'center',
            width: 160
          },
          {
            title: '累计试听后付费用户',
            key: 'payeduv',
            align: 'center',
            width: 160
          },
          {
            title: '累计付费金额',
            key: 'paymoney',
            align: 'center',
            width: 120
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('span', `${dayjs(+params.row.createTime).format('YYYY-MM-DD HH:mm:ss')}`)
            },
            width: 150,
            align: 'center'
          },
          {
            title: '操作',
            width: 220,
            align: 'center',
            fixed: 'right',
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openDataModal(params.row)
                    }
                  }
                }, '数据详情'),
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
              ])
            }
          }
        ],
        infoList: {
          '0': '投放日期',
          '1': '投放位置',
          '2': '投放方式',
          '3': '预估曝光量',
          '4': '预估价值',
        }
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      initData() {
        switch (+this.$route.query.columnType) {
          case 0:
            this.adminList = [
              {
                place: '1'
              },
              {
                place: '2'
              },
              {
                place: '3'
              },
              {
                place: '4'
              },
              {
                place: '5'
              }
            ]
            break
          case 1:
            this.adminList = [
              {
                place: '1'
              }
            ]
            break
          case 2:
            this.adminList = [
              {
                place: '1'
              },
              {
                place: '2'
              }
            ]
            break
        }
      },
      copyUrlFn(row) {
        this.copy_url = row.href;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      download(data) {
        window.open(data.channelqrcode, '_blank');
      },
      changeDate(data) {
        this.searchInfo.fromDate = data.startTime
        this.searchInfo.toDate = data.endTime
        this.getList(1)
      },
      openDataModal(data) {
        this.putInId = data.id
        this.isOpenDataModal = true
      },
      openModal(data) {
        this.priceInfo = {}
        this.initData()
        this.gswChannelUser()
        this.isOpenModal = true
        if (data) {
          this.channerAdGet(data)
        } else {
          this.addInfo = {
            name: ''
          }
        }
        this.addInfo.page = this.$route.query.type
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      channerPriceGet() {
        if(!this.addInfo.startDate) return
        this.$api.gswChannel.channerPriceGet({
          chid: this.$route.query.id,
          date: new Date(this.addInfo.startDate).getTime(),
          place: this.addInfo.place
        }).then(
          response => {
            this.priceInfo = response.data.resultData;
          }
        )
      },
      channerAdGet(data) {
        this.$api.gswChannel.channerAdGet({
          id : data.id
        }).then(
          response => {
            this.addInfo = response.data.resultData;
            this.addInfo.showType = this.addInfo.showType.toString()
            this.addInfo.place = this.addInfo.place.toString()
            this.addInfo.startDate = new Date(+this.addInfo.startDate)
            this.addInfo.page = this.$route.query.type
            this.priceInfo.shownum = this.addInfo.shownum
            this.priceInfo.price = this.addInfo.price
          }
        )
      },
      gswChannelUser() {
        this.$api.gswChannel.managerList({
          current: 1,
          size: 1000,
          type: 1
        }).then(
          response => {
            this.deliveryPersonnelList = response.data.resultData.records;
          }
        )
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.gswChannel.channerAdList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          chid: this.$route.query.id,
          productId: this.$route.query.type
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
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.priceInfo.shownum || !this.priceInfo.price) {
              return this.$Message.error('无效投放，请重新选择日期')
            }
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.gswChannel.channerAdUpdate : this.$api.gswChannel.channerAdAdd
            promiseDate({
              id: this.addInfo.id,
              chid: this.$route.query.id,
              productId: this.$route.query.type,
              place: this.addInfo.place,
              name: this.addInfo.name,
              href: this.addInfo.page == '1' ? 'http://poem.k12.vip/subscribe' : 'http://poem.k12.vip/newDetail',
              optuid: this.addInfo.optuid,
              showType: this.addInfo.showType,
              startDate: new Date(this.addInfo.startDate).getTime(),
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList(1)
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
  .p-channel {
    .copy-input {
      position: absolute;
      opacity: 0;
    }

    .-c-tips {
      color: #39f
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
