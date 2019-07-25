<template>
  <div class="p-channel">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">管理人员：</div>
              <Select v-model="selectInfoOne" @on-change="getList(1)" class="-search-selectOne">
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
        :title="addInfo.id ? '编辑渠道' : '新增渠道'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="一级渠道">
           {{firstChannelName}}
          </FormItem>
          <FormItem label="渠道名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入渠道名称"></Input>
          </FormItem>
          <FormItem label="渠道管理员" prop="userId">
            <Select v-model="addInfo.userId">
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
        width="700"
        title="渠道价值">
        <div class="g-text-right">
          <Button  @click="openVersion()" ghost type="primary" style="width: 100px;">添加价值版本</Button>
        </div>

        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>
      </Modal>

      <Modal
        class="p-channel"
        v-model="isOpenValueVersion"
        @on-cancel="isOpenValueVersion = false"
        width="700"
        :title="versionInfo.id ? '编辑价值版本' : '新增价值版本'">
        <Form ref="addInfo" :model="versionInfo" :label-width="90">
          <FormItem label="价值有效期">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="versionInfo.id!=''"
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
          <FormItem label="投放位置（头条）">
            <div>

            </div>
            <Input type="text" v-model="versionInfo.name" placeholder="请输入渠道名称"></Input>
            <Input type="text" v-model="versionInfo.name" placeholder="请输入渠道名称"></Input>
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
        copy_url: '',
        radioType: '1',
        selectInfoOne: '',
        firstChannelName: this.$route.query.name,
        detailList: [],
        adminList: [],
        dataList: [],
        statusList: {
          '0': '未开始',
          '1': '进行中',
          '2': '已结束',
          '3': '已过期'
        },
        total: 0,
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
          userId: [
            {required: true, message: '请选择渠道管理员', trigger: 'change'},
          ]
        },
        columnsModal: [
          {
            title: '投放位置',
            key: 'subjectName',
            align: 'center'
          },
          {
            title: '预估曝光量',
            key: 'channelurl',
            align: 'center'
          },
          {
            title: '预估价值',
            key: 'channelurl',
            align: 'center'
          },
          {
            title: '有效期',
            render: (h, params) => {
              return h('div', dayjs(+params.row.workTime).format('YYYY-MM-DD HH:mm:ss'))
            },
            align: 'center'
          },
          {
            title: '状态',
            key: 'channelurl',
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
        ]
      };
    },
    computed: {
      columns () {
        let array = []

        if (this.$route.query.type == '1') {
          array = [
            {
              title: '名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '管理人员',
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
                        this.toSecondJump(params.row)
                      }
                    }
                  }, '投放记录'),
                ])
              }
            }
          ]
        } else {
          array = [
            {
              title: '名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '管理人员',
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
                        this.toSecondJump(params.row)
                      }
                    }
                  }, '二级渠道'),
                ])
              }
            }
          ]
        }
        return array
      }
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
    },
    methods: {
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？结束后，今日内仍将继续有效',
          onOk: () => {
            this.$api.materia.delMaterial({
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
      toDetail(data) {
        this.isOpenModalCopy = true
        this.getChannelDetail(data)
      },
      openVersion (data) {
        this.isOpenValueVersion = true
        if (data) {
          this.versionInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.versionInfo = {
            id: ''
          }
        }
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
        this.$api.poem.listByChannelDetails({
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

        this.$api.poem.listByChannel({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: this.radioType
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
            let promiseDate = this.addInfo.id ? this.$api.poem.updateChannel(this.addInfo) : this.$api.poem.addChannel(this.addInfo)
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
      },
      submitInfoVersion () {

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
