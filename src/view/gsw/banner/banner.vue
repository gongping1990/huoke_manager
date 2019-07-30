<template>
  <div class="p-banner">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <Radio :label=3>未试听</Radio>
          <Radio :label=4>未购买</Radio>
        </Radio-group>
      </Row>
      <Row class="g-search -c-tab">
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
        <Col :span="18" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
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
        class="p-banner"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑banner' : '创建banner'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <Form-item label="弹窗图片" prop="url" class="ivu-form-item-required">
            <upload-img :isDisabled="addInfo.id!=''" v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortnum">
            <Select v-model="addInfo.sortnum">{{addInfo.sortnum}}
              <Option v-for="(item,index) of 9" :key="index" :value="item" :label="item"></Option>
            </Select>
          </FormItem>
          <FormItem label="链接地址" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
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
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-banner"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="500"
        title="数据详情">
        <Row>
          <Col :span="24" class="g-text-right">
            <Button type="primary" ghost @click="toExcel()">数据导出</Button>
          </Col>
        </Row>
        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
        <div slot="footer" class="p-banner-btn">
          <div @click="isOpenModalData = false" class="g-primary-btn"> 确 认</div>
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
    name: 'banner',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
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
        dateOption: {
          name: '有效时间',
          type: 'datetime'
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        detailList: [],
        radioType: 3,
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
        statusList: {
          '0': '未开始',
          '1': '进行中',
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
            title: '名称',
            key: 'name'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.url
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 100,
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortnum'
          },
          {
            title: '链接地址',
            key: 'href'
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
            title: '访问量',
            key: 'pv'
          },
          {
            title: '访问用户',
            key: 'uv'
          },
          {
            title: '状态',
            render: (h,params)=>{
              return h('div',this.statusList[params.row.status])
            }
          },
          {
            title: '操作',
            width: 240,
            align: 'right',
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
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
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
                      this.openModalData(params.row)
                    }
                  }
                }, '数据详情')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center'
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
      toExcel() {
        let downUrl = `${getBaseUrl()}/poem/operational/excelOperationalStatistics?operationalId=${this.operationalId}`
        window.open(downUrl, '_blank');
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
          this.getStartTime = ''
          this.getEndTime = ''
          this.addInfo = {
            id: '',
            sortnum: '',
            url: ''
          }
        }
      },
      openModalData (data) {
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
        }).finally(()=>{
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
          type: this.radioType,
          showTime: this.getStartTime ? dayjs(this.getStartTime).format("YYYY/MM/DD HH:mm:ss") : '',
          hideTime: this.getEndTime ? dayjs(this.getEndTime).format("YYYY/MM/DD HH:mm:ss") : ''
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
          content: '确认要删除图片吗？',
          onOk: () => {
            this.$api.gswOperational.removeOperational({
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
        if (!this.addInfo.url) {
          return this.$Message.error('请上传图片')
        } else if (!this.addInfo.showTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.addInfo.hideTime) {
          return this.$Message.error('请输入结束时间')
        }

        if (this.isSending) return

        this.addInfo.type  = 0
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.gswOperational.saveOperational({
              id: this.addInfo.id,
              hideTime: dayjs(this.addInfo.hideTime).format("YYYY/MM/DD HH:mm:ss"),
              showTime: dayjs(this.addInfo.showTime).format("YYYY/MM/DD HH:mm:ss"),
              name : this.addInfo.name,
              href : this.addInfo.href,
              url : this.addInfo.url,
              sortnum : this.addInfo.sortnum,
              type: this.radioType
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
  .p-banner {
    .g-add-top {
      top: 90px;
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
