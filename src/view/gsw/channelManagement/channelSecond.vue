<template>
  <div class="p-channel">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">管理人员：</div>
              <Select v-model="selectInfoOne" @on-change="getList(1)" class="-search-selectOne">
                <Option value="0">全部</Option>
                <Option v-for="(item,index) in adminList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
        </Row>
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
        width="350"
        :title="addInfo.chid ? '编辑渠道' : '新增渠道'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="一级渠道">
            {{firstChannelName}}
          </FormItem>
          <FormItem label="渠道名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入渠道名称"></Input>
          </FormItem>
          <FormItem label="渠道管理员" prop="managerId">
            <Select v-model="addInfo.managerId">
              <Option v-for="(item,index) in adminList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-channel"
        v-model="isOpenModalCopy"
        footer-hide
        @on-cancel="isOpenModalCopy = false"
        width="800"
        title="渠道价值">
        <div class="g-text-right">
          <Button @click="openVersion()" ghost type="primary" style="width: 100px;">添加价值版本</Button>
        </div>

        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="-p-text-right" :total="totalModal" size="small" show-elevator :page-size="tabModal.pageSize"
              :current.sync="tabModal.currentPage"
              @on-change="currentChangeModal"></Page>
      </Modal>

      <Modal
        class="p-channel"
        v-model="isOpenValueVersion"
        @on-cancel="isOpenValueVersion = false"
        width="800"
        :title="versionInfo.version ? '编辑价值版本' : '新增价值版本'">
        <Form ref="addInfo" :model="versionInfo" :label-width="100" class="ivu-form-item-required">
          <FormItem label="价值有效期">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="versionInfo.version!=''"
                               v-model="versionInfo.getStartTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="getEndTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="versionInfo.getEndTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
            <div class="-c-tips">* 添加后，有效期开始时间不能更改，结束时间只能增加，不能减少</div>
          </FormItem>
          <FormItem :label="'位置'+ item.place" v-for="(item,index) of positionList" :key="index">
            <Row class="-p-item">
              <Col :span="12" class="-p-item">
                <span class="-p-item-text">预估曝光量：</span>
                <Input type="text" v-model="item.shownum" placeholder="请输入预估曝光量"></Input>
              </Col>
              <Col :span="12" class="-p-item">
                <span class="-p-item-text">预估价值：</span>
                <Input type="text" v-model="item.price" placeholder="请输入预估价值"></Input>
              </Col>
            </Row>
          </FormItem>

        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="isOpenValueVersion= false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfoVersion('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'channelManagement',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabModal: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        radioType: '1',
        selectInfoOne: '0',
        priceId: '',
        firstChannelName: this.$route.query.name,
        detailList: [],
        adminList: [],
        dataList: [],
        positionList: [],
        statusList: {
          '0': '未开始',
          '1': '进行中',
          '2': '已过期',
          '3': '已结束'
        },
        total: 0,
        totalModal: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalCopy: false,
        isOpenValueVersion: false,
        isSending: false,
        addInfo: {},
        versionInfo: {},
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
          name: [
            {required: true, message: '请输入渠道名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '渠道名称长度为20字', trigger: 'blur'}
          ],
          managerId: [
            {required: true, message: '请选择渠道管理员', trigger: 'change'},
          ]
        },
        columnsModal: [
          {
            title: '投放位置',
            render: (h,params)=> {
              return h('div', params.row.place.map(item=>{
                return h('div',item)
              }))
            },
            align: 'center'
          },
          {
            title: '预估曝光量',
            render: (h,params)=> {
              return h('div', params.row.shownum.map(item=>{
                return h('div',item)
              }))
            },
            align: 'center'
          },
          {
            title: '预估价值',
            render: (h,params)=> {
              return h('div', params.row.price.map(item=>{
                return h('div',item)
              }))
            },
            align: 'center'
          },
          {
            title: '有效期',
            render: (h, params) => {
              return h('div', `${dayjs(+params.row.startTime).format('YYYY-MM-DD')} - ${dayjs(+params.row.endTime).format('YYYY-MM-DD')}`)
            },
            width: 180,
            align: 'center'
          },
          {
            title: '状态',
            render: (h, params)=>{
              return h('div', this.statusList[params.row.status])
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: (params.row.status == '0' || params.row.status == '1') ? 'inline-block' : 'none',
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openVersion(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: (params.row.status == '0' || params.row.status == '1') ? 'inline-block' : 'none',
                    color: '#5444E4',
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
        ],
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '管理人员',
            key: 'uname',
            align: 'center'
          },
          {
            title: '累计页面访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '累计访问用户',
            key: 'uv',
            align: 'center'
          },
          {
            title: '累计试听申请用户',
            key: 'tryapplyuv',
            align: 'center'
          },
          {
            title: '累计付试听通过用户',
            key: 'trypasseduv',
            align: 'center'
          },
          {
            title: '累计试听后付费用户',
            key: 'payeduv',
            align: 'center'
          },
          {
            title: '累计付费金额',
            key: 'payedmoney',
            align: 'center'
          },
          {
            title: '操作',
            width: 250,
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
                      this.toDetail(params.row)
                    }
                  }
                }, '价值'),
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toPutJump(params.row)
                    }
                  }
                }, '投放记录'),
              ])
            }
          }
        ]
      };
    },
    watch: {
      'versionInfo.getStartTime'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      }
    },
    mounted() {
      this.getList()
      this.getUserList()
      this.initData()
    },
    methods: {
      initData () {
        switch (+this.$route.query.columnType) {
          case 0:
            this.positionList = [
              {
                place: '1',
                shownum: '',
                price: ''
              },
              {
                place: '2',
                shownum: '',
                price: ''
              },
              {
                place: '3',
                shownum: '',
                price: ''
              },
              {
                place: '4',
                shownum: '',
                price: ''
              },
              {
                place: '5',
                shownum: '',
                price: ''
              }
            ]
            break
          case 1:
            this.positionList = [
              {
                place: '1',
                shownum: '',
                price: ''
              }
            ]
            break
          case 2:
            this.positionList = [
              {
                place: '1',
                shownum: '',
                price: ''
              },
              {
                place: '2',
                shownum: '',
                price: ''
              }
            ]
            break
        }
      },
      toPutJump (data) {
        this.$router.push({
          path: '/gsw_putInChannel',
          query: {
            id: data.chid,
            type: this.$route.query.type,
            name: this.$route.query.name,
            columnType: this.$route.query.columnType,
            secondName: data.name,
          }
        })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？结束后，今日内仍将继续有效',
          onOk: () => {
            this.$api.gswChannel.channerPriceClose({
              chid: param.chid,
              version: param.version
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getChannelPrice();
                }
              })
          }
        })
      },
      toDetail(data) {
        this.priceId = data.chid
        this.isOpenModalCopy = true
        this.getChannelPrice()
      },
      openVersion(data) {
        this.isOpenValueVersion = true
        if (data) {
          this.versionInfo = JSON.parse(JSON.stringify(data))
          this.versionInfo.getStartTime = new Date(+this.versionInfo.startTime)
          this.versionInfo.getEndTime = new Date(+this.versionInfo.endTime)
          this.positionList = this.versionInfo.item
        } else {
          this.versionInfo = {
            version: ''
          }
          this.initData()
        }
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            name: ''
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
      currentChangeModal(val) {
        this.tabModal.page = val;
        this.getChannelPrice();
      },
      getChannelPrice() {
        this.$api.gswChannel.channerPriceList({
          current: this.tabModal.page,
          size: this.tabModal.pageSize,
          chid: this.priceId,
          productId: this.$route.query.type
        }).then(
          response => {
            this.detailList = response.data.resultData.records;
            for (let list of this.detailList) {
              list.place = []
              list.price = []
              list.shownum = []
              for (let item of list.item) {
                list.place.push(item.place)
                list.price.push(item.price)
                list.shownum.push(item.shownum)
              }
            }

            console.log(this.detailList,1)
          }
        )
      },
      getUserList() {
        this.$api.gswChannel.managerList({
          current: this.tab.page,
          size: 1000,
          type: 0
        })
          .then(
            response => {
              this.adminList = response.data.resultData.records;
              this.totalModal = response.data.resultData.total;
            })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.gswChannel.listPChannelCount({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          managerId: this.selectInfoOne == '0' ? '' : this.selectInfoOne,
          type: this.$route.query.columnType,
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
            this.isSending = true
            this.addInfo.type = this.$route.query.columnType
            let promiseDate = this.addInfo.chid ? this.$api.gswChannel.channerUpdate : this.$api.gswChannel.channerAdd
            promiseDate({
              id: this.addInfo.chid,
              type: this.$route.query.columnType,
              name: this.addInfo.name,
              managerId: this.addInfo.managerId
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
      },
      submitInfoVersion() {
        let isCheckOption = true

        isCheckOption = this.positionList.every(item=>{
          return item.shownum != '' && item.price!=''
        })

        if (!this.versionInfo.getStartTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.versionInfo.getEndTime) {
          return this.$Message.error('请输入结束时间')
        } else if (!isCheckOption) {
          return this.$Message.error('请输入完整的投放位置')
        }

        this.$api.gswChannel.channerPriceUpdate({
          chid: this.priceId,
          version: this.versionInfo.version,
          startTime: new Date(this.versionInfo.getStartTime).getTime(),
          endTime: new Date(this.versionInfo.getEndTime).getTime(),
          item: this.positionList
        })
          .then(
            response => {
              this.$Message.success('提交成功');
              this.getChannelPrice(1)
              this.isOpenValueVersion = false
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-channel {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

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

    .-p-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-text {
        text-align: right;
        width: 100px;
      }

    }
  }
</style>
