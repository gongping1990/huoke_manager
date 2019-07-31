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
          <Button  ghost type="primary" style="width: 100px;">导出数据</Button>
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
          <FormItem label="投放位置" prop="position">
            <Select v-model="addInfo.position">
              <Option v-for="(item,index) in adminList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
          <FormItem label="投放日期" prop="date">
            <Date-picker style="width: 100%" type="datetime" placeholder="选择日期"
                         v-model="addInfo.date"></Date-picker>
          </FormItem>
          <FormItem label="预估曝光量">
            {{addInfo.num || 0}}
          </FormItem>
          <FormItem label="预估价值">
            {{addInfo.prize || 0}}
          </FormItem>
          <FormItem label="选择页面" prop="page">
            <Radio-group v-model="addInfo.page">
              <Radio label='1'>试听页面</Radio>
              <Radio label='2'>购买页面</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="投放方式" prop="mode">
            <Select v-model="addInfo.mode">
              <Option v-for="(item,index) in deliveryModeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
          <FormItem label="投放人员" prop="personne">
            <Select v-model="addInfo.personne">
              <Option v-for="(item,index) in deliveryPersonnelList" :label="item.name" :value="item.id" :key="index"></Option>
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
        width="600"
        title="复制链接">
        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>
      </Modal>

      <put-in-list-template v-model="isOpenDataModal" :id="putInId" :list="dataList"></put-in-list-template>
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
        radioType: '1',
        detailList: [],
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
            id: '4',
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
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '活动名称长度为20字', trigger: 'blur'}
          ],
          position: [
            {required: true, message: '请选择投放位置', trigger: 'change'},
          ],
          date: [
            {required: true, type: 'date', message: '请选择投放日期', trigger: 'change'},
          ],
          mode: [
            {required: true, message: '请选择投放方式', trigger: 'change'},
          ],
          page: [
            {required: true, message: '请选择投放页面', trigger: 'change'},
          ],
          personne: [
            {required: true, message: '请选择投放人员', trigger: 'change'},
          ],

        },
        columnsModal: [
          {
            title: '学科名称',
            key: 'subjectName',
            align: 'center'
          },
          {
            title: '渠道链接',
            key: 'channelurl',
            align: 'center'
          },
          {
            title: '渠道二维码',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.channelqrcode
                },
                style: {
                  width: '60px',
                  height: '60px',
                  margin: '10px'
                }
              })
            },
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
                      this.download(params.row)
                    }
                  }
                }, '下载二维码')
              ])
            }
          }
        ]
      };
    },
    computed: {
      columns() {
        let array = []

        if (this.$route.query.type == '1') {
          array = [
            {
              title: '投放信息',
              key: 'name',
              align: 'center'
            },
            {
              title: '投放人',
              key: 'name',
              align: 'center'
            },
            {
              title: '活动名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计页面访问量',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计访问用户',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计试听申请用户',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计付试听通过用户',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计试听后付费用户',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计付费金额',
              key: 'name',
              align: 'center'
            },
            {
              title: '创建时间',
              render: (h, params) => {
                return h('span', `${params.row.gmtCreate}`)
              },
              width: 150,
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
                  }, '推广链接'),
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
          ]
        } else {
          array = [
            {
              title: '投放信息',
              key: 'name',
              align: 'center'
            },
            {
              title: '投放人',
              key: 'name',
              align: 'center'
            },
            {
              title: '活动名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计页面访问量',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计访问用户',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计付费用户',
              key: 'name',
              align: 'center'
            },
            {
              title: '累计付费金额',
              key: 'name',
              align: 'center'
            },
            {
              title: '创建时间',
              render: (h, params) => {
                return h('span', `${params.row.gmtCreate}`)
              },
              width: 120,
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
                  }, '推广链接'),
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
          ]
        }
        return array
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      copyUrlFn(row) {
        this.copy_url = row.channelurl;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      download (data) {
        window.open(data.channelqrcode, '_blank');
      },
      changeDate(data) {
        this.searchInfo.fromDate = data.startTime
        this.searchInfo.toDate = data.endTime
        this.getList(1)
      },
      toDetail(data) {
        this.isOpenModalCopy = true
        this.getChannelDetail(data)
      },
      openDataModal () {
        console.log(1111)
          this.isOpenDataModal = true
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            name: '',
            type: this.radioType
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
      getChannelDetail (data) {
        this.$api.gswChannel.listByChannelDetails({
          channelId: data.id
        }).then(
          response => {
            this.detailList = response.data.resultData;
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
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.gswChannel.updateChannel(this.addInfo) : this.$api.gswChannel.addChannel(this.addInfo)
            promiseDate
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
    .copy-input{
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
