<template>
  <div class="p-booking">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="gradeType" type="button" @on-change="getList(1)">
            <Radio :label=3>三年级</Radio>
            <Radio :label=4>四年级</Radio>
            <Radio :label=5>五年级</Radio>
            <Radio :label=6>六年级</Radio>
          </Radio-group>
        </Row>

        <Row class="g-t-left g-tab">
          <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
            <Radio :label=0>待审核</Radio>
            <Radio :label=1>已通过</Radio>
            <Radio :label=2>未通过</Radio>
          </Radio-group>
        </Row>

        <Row class="g-t-left g-tab">
          <Col :span="5">
            <div class="-search">
              <Select v-model="selectInfo" class="-search-select">
                <Option value="1">用户昵称</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList(1)"></Input>
            </div>
          </Col>
          <Col :span="16" class="g-flex-a-j-center">
            <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>

          </Col>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="radioType === 1 ? columns : columnsTwo" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadImg from "../../../components/uploadImg";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'bookingList',
    components: {DatePickerTemplate, UploadImg},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过200kb',
          url: '',
          size: 200
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        dataList: [],
        total: 0,
        selectInfo: '1',
        searchInfo: {},
        radioType:0,
        gradeType:3,
        isFetching: false,
        columns: [
          {
            title: '用户昵称',
            key: 'content'
          },
          {
            title: '预约课程年级',
            key: 'content'
          },
          {
            title: '预约时间',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认要通过审核吗？',
                    'ok-text': "通过",
                    'cancel-text': "不通过"
                  },
                  style: {
                    cursor: 'pointer',
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    'on-ok': () => {
                      console.log(1)
                    },
                    'on-cancel': ()=>{
                      console.log(2)
                    }
                  }
                }, '审核')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '用户昵称',
            key: 'content'
          },
          {
            title: '预约课程年级',
            key: 'content'
          },
          {
            title: '预约时间',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '最新审核时间',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认重置为不通过？'
                  },
                  style: {
                    cursor: 'pointer',
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    'on-ok': () => {
                      console.log(1)
                    },
                    'on-cancel': ()=>{
                      console.log(2)
                    }
                  }
                }, '不通过')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate (data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.getList(1)
      },
      successImgUrl(url) {
        this.addInfo.coverphoto = url
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortnum = this.addInfo.sortnum.toString()
        } else {
          this.addInfo = {}
        }
        setTimeout(() => {
          this.$refs.childImg.init()
        }, 0)
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
        this.$api.composition.reservatRecordPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          grade: this.gradeType,
          status: this.radioType,
          nickname: this.searchInfo.nickname,
          startTime: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          endTime: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : ""
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
            this.$api.composition.removeBroadcast({
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
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.composition.updateBroadcast(this.addInfo) : this.$api.composition.saveBroadcast(this.addInfo)
            promiseDate
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
  .p-booking {
    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
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
      margin-top: 20px;
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
