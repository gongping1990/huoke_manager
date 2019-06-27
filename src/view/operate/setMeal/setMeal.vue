<template>
  <div class="p-capsule">
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
        <Col :span="18" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-capsule"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="600"
        :title="addInfo.id ? '编辑推荐位' : '创建推荐位'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="推荐位图片" >
            <upload-img v-model="addInfo.img" :option="uploadOption" :isDisabled="isEdit"></upload-img>
          </FormItem>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sort">
            <Select v-model="addInfo.sort">
              <Option v-for="item in sortnumList" :value="item" :key="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="链接地址">
            <Input type="text" v-model="addInfo.link" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="有效期"  class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="addInfo.id!=''"
                               v-model="getStartTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="getEndTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="getEndTime" :options="dateEndOption"></Date-picker>
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
        class="p-capsule"
        v-model="isOpenModalDetail"
        @on-cancel="isOpenModalDetail = false"
        width="500"
        title="数据详情">
        <Row>
          <Col :span="24" class="g-text-right">
            <Button type="primary" ghost @click="toExcel()">数据导出</Button>
          </Col>
        </Row>

        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="-p-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
        <div slot="footer" class="p-capsule-btn">
          <div @click="isOpenModalDetail = false" class="g-primary-btn"> 确 认</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import CheckCourse from "../../../components/checkCourse";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'operationalLocation',
    components: {UploadImg, CheckCourse, DatePickerTemplate},
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
        dataList: [],
        sortnumList: [1,2,3,4,5,6,7,8,9],
        detailList: [],
        selectInfo: '1',
        searchInfo: {},
        dateOption: {
          name: '有效期',
          type: 'datetime'
        },
        total: 0,
        totalDetail: 0,
        isEdit: false,
        isFetching: false,
        isOpenModal: false,
        isOpenModalDetail: false,
        isSending: false,
        addInfo: {},
        capsuleId: '',
        getStartTime: '',
        getEndTime: '',
        statusList: ['未开始','进行中','已过期','已结束'],
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
            {required: true, message: '请输入活动', trigger: 'blur'},
            {type: 'string', max: 20, message: '活动名称长度为20字', trigger: 'blur'}
          ],
          sort: [
            {required: true, type:'number', message: '请输入排序值', trigger: 'change'}
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.img
                  },
                  style: {
                    width: '200px',
                    height:'60px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sort',
            align: 'center'
          },
          {
            title: '有效期时间',
            render: (h, params) => {
              return h('span', `${dayjs(+params.row.startTime).format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(+params.row.endTime).format('YYYY-MM-DD HH:mm:ss')}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'link',
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
          },
          {
            title: '状态',
            render: (h,params)=>{
              return h('div',this.statusList[params.row.timeStatus])
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 240,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: (params.row.timeStatus != 0 && params.row.timeStatus != 1) ? 'none' : 'inline-block',
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
                    display: (params.row.timeStatus != 0 && params.row.timeStatus != 1) ? 'none' : 'inline-block',
                    color: '#5444E4',
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModalDetail(params.row)
                    }
                  }
                }, '数据详情'),
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
                }, '删除')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '日期',
            key: 'inTime',
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
        ],
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
        let downUrl = `${getBaseUrl()}/sch/capsule/download?capsuleId=${this.capsuleId}`
        window.open(downUrl, '_blank');
      },
      changeDate(data) {
        this.searchInfo.fromDate = data.startTime
        this.searchInfo.toDate = data.endTime
        this.getList(1)
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.isEdit = true
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.getStartTime = new Date(+this.addInfo.startTime)
          this.getEndTime = new Date(+this.addInfo.endTime)
        } else {
          this.isEdit = false
          this.getStartTime = ''
          this.getEndTime = ''
          this.addInfo = {
            id: '',
            sort: null
          }
        }
      },
      openModalDetail(data) {
        this.isOpenModalDetail = true
        this.getDetailList(data)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      getDetailList(data) {
        this.capsuleId = data.id
        this.$api.capsule.listByCapsuleCount({
          capsuleId: data.id,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.packages.packageRecommendPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          startTime: this.searchInfo.fromDate ? new Date(this.searchInfo.fromDate).getTime() : '',
          endTime: this.searchInfo.toDate ? new Date(this.searchInfo.toDate).getTime() : ''
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
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.packages.deletePackageRecommend({
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
      endItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认结束吗？',
          onOk: () => {
            this.$api.packages.endPackageRecommend({
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
        if (!this.getStartTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.getEndTime) {
          return this.$Message.error('请输入结束时间')
        }

        if (this.isSending) return
        this.addInfo.startTime = new Date(this.getStartTime).getTime()
        this.addInfo.endTime = new Date(this.getEndTime).getTime()

        if (this.addInfo.id) {
          delete this.addInfo.courseNum
        } else {
          delete this.addInfo.id
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.packages.saveOrUpdatePackageRecommend(this.addInfo)
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
  .p-capsule {

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {
      margin-top: 10px;
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        width: 140px;
        overflow: hidden;
        margin: 10px 10px 10px 0;

        img {
          width: 100%;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
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
