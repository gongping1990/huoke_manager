<template>
  <div class="p-couponList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="g-search">
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

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
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
          <FormItem label="注意" prop="name" class="-c-tips">
            添加优惠券后，只能修改发行量，且发行量只能增加，不能减少
          </FormItem>
          <FormItem label="优惠券名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入优惠券名称"></Input>
          </FormItem>
          <FormItem label="优惠券面额" prop="name">
            <Input-number class="g-width" :min="0" :step="1" v-model="addInfo.denomination"
                          placeholder="请输入优惠券面额（元）"></Input-number>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="发行量" prop="name">
            <Input-number class="g-width" :max="1000000" :min="0" :step="1" v-model="addInfo.denomination"
                          placeholder="请输入发行量"></Input-number>
            <span class="-c-tips">* 添加优惠券后，发行量只能增加，不能减少，总共不超过1,000,000张</span>
          </FormItem>
          <FormItem label="有效期" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.showTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="getEndTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="addInfo.hideTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="领取时间" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.showTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="getEndTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="addInfo.hideTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="分享大标题" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="分享小标题" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
          </FormItem>
          <Form-item label="领取海报" prop="url">
            <upload-img :isDisabled="addInfo.id!=''" v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'flashScreen',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabDetail: {
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
            id: '1',
            name: '领取中'
          },
          {
            id: '2',
            name: '已结束'
          },
          {
            id: '3',
            name: '未开始'
          },
          {
            id: '4',
            name: '已过期'
          }
        ],
        dataList: [],
        detailList: [],
        operationalId: '',
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        getStartTime: '',
        getEndTime: '',
        copy_url: '',
        statusList: {
          '0': '未开始',
          '1': '领取中',
          '2': '已过期',
          '3': '已结束'
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
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '活动名称长度为20字', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '优惠券名称',
            key: 'name'
          },
          {
            title: '面额',
            key: 'href'
          },
          {
            title: '领取时间',
            render: (h, params) => {
              return h('span', `${params.row.showTime} - ${params.row.hideTime}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '有效期时间',
            render: (h, params) => {
              return h('span', `${params.row.showTime} - ${params.row.hideTime}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '发行量',
            key: 'pv'
          },
          {
            title: '已领取',
            key: 'uv'
          },
          {
            title: '已使用',
            key: 'uv'
          },
          {
            title: '领取状态',
            render: (h, params) => {
              return h('div', this.statusList[params.row.status])
            }
          },
          {
            title: '操作',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.status < 2 ? 'inline-block' : 'none',
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
                    display: params.row.status > 2 ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.endItem(params.row)
                    }
                  }
                }, '结束'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.copyUrl(params.row)
                    }
                  }
                }, '复制链接')
              ])
            }
          }
        ]
      };
    },
    watch: {
      'getStartTime'(_new, _old) {
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
      copyUrl(param) {
        if (param.page === 1) {
          this.copy_url = 'http://composition.k12.vip/'
        }

        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            id: '',
            url: ''
          }
        }
      },
      openModalData(data) {
        this.isOpenModalData = true
        this.operationalId = data.id
        this.getDetailList(data)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getDetailList(data) {
        this.isFetching = true
        this.$api.gswOperational.getOperationalStatistics({
          operationalId: data.id
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.gswOperational.listOperational({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          type: 0
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
      endItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？',
          onOk: () => {
            this.$api.gswOperational.finishOperational({
              operationalId: param.id
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

        this.addInfo.type = 0
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.gswOperational.saveOperational({
              id: this.addInfo.id,
              hideTime: dayjs(this.addInfo.hideTime).format("YYYY/MM/DD HH:mm:ss"),
              showTime: dayjs(this.addInfo.showTime).format("YYYY/MM/DD HH:mm:ss"),
              name: this.addInfo.name,
              href: this.addInfo.href,
              url: this.addInfo.url,
              type: 0
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
