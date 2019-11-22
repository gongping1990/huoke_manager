<template>
  <div class="p-putIn">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-flex-a-j-center">
          <div class="-search-select-text">投放位置</div>
          <Select class="-search-selectOne" v-model="selectInfo" @on-change="getList(1)">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-putIn"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑投放' : '创建投放'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">

          <FormItem label="投放名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入投放名称"></Input>
          </FormItem>
          <FormItem label="课程原价" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入课程原价"></Input>
          </FormItem>
          <FormItem label="课程活动价格" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入课程活动价格"></Input>
          </FormItem>
          <Form-item label="胶囊位图片" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="弹窗图片" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="公众号图片" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="公众二维码" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-putIn"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="500"
        title="数据详情">
        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
        <div slot="footer" class="p-putIn-btn">
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
        courseList: [],
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
            title: '投放名称',
            key: 'name'
          },
          {
            title: '中转页访问量',
            key: 'sortnum'
          },
          {
            title: '按钮点击次数',
            key: 'href'
          },
          {
            title: '二维码识别次数',
            key: 'pv'
          },
          {
            title: '是否关闭',
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
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '关闭'),
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
            title: '中转页访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '按钮点击次数',
            key: 'pv',
            align: 'center'
          },
          {
            title: '二维码识别次数',
            key: 'pv',
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
  .p-putIn {
    .-c-tips {
      color: #39f
    }
    .-search-select-text {
      min-width: 80px;
      text-align: left;
    }
    .-search-selectOne {
      border: 1px solid #dcdee2;
      border-radius: 4px;
      text-align: left;
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
