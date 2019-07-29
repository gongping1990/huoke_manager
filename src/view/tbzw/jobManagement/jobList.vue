<template>
  <div class="p-job">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="gradeType" type="button" @on-change="getList()">
            <Radio :label=3>L1</Radio>
            <Radio :label=4>L2</Radio>
            <Radio :label=5>L3</Radio>
            <Radio :label=6>L4</Radio>
          </Radio-group>
        </Row>
        <Row class="g-t-left g-tab">
          <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
            <Radio :label=0>待批改</Radio>
            <Radio :label=1>已批改</Radio>
            <Radio :label=2>表扬</Radio>
          </Radio-group>
        </Row>
        <Row class="g-t-left g-tab">
          <Col :span="3" class="g-t-left" v-if="radioType!==0">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">用户评价：</div>
              <Select v-model="searchInfo.evaluate" @on-change="getList(1)" class="-search-selectOne">
                <Option v-for="(item,index) in evaluateList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5">
            <div class="-search">
              <Select v-model="selectInfo" class="-search-select">
                <Option value="1">用户昵称</Option>
                <Option value="2">老师名称</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList(1)"></Input>
            </div>
          </Col>
          <Col :span="16" class="g-flex-a-j-center">
            <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          </Col>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="radioType===0 ? columns : columnsTwo" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-job"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="批改作业">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70" class="ivu-form-item-required">
          <FormItem label="教师名称" prop="replyTeacher">
            <Input type="text" v-model="addInfo.replyTeacher" placeholder="请输入消息内容"></Input>
          </FormItem>
          <FormItem label="批改图片" prop="replyImg">
            <upload-img v-model="addInfo.replyImg" :option="uploadOption"></upload-img>
          </FormItem>
          <FormItem label="批改音频">
            <upload-audio ref="childAudio" v-model="addInfo.replyAudio" :option="uploadAudioOption"></upload-audio>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadImg from "../../../components/uploadImg";
  import UploadAudio from "../../../components/uploadAudio";
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'

  export default {
    name: 'jobList',
    components: {DatePickerTemplate, UploadAudio, UploadImg},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        evaluateList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '满意',
            id: '1'
          },
          {
            name: '一般',
            id: '2'
          },
          {
            name: '不满意',
            id: '3'
          },
          {
            name: '无',
            id: '0'
          }
        ],
        evaluateColumn: {
          '0': '不满意',
          '1': '一般',
          '2': '满意',
        },
        dataList: [],
        total: 0,
        gradeType: 3,
        radioType: 0,
        selectInfo: '1',
        getStartTime: '',
        getEndTime: '',
        searchInfo: {
          evaluate: '-1'
        },
        isFetching: false,
        isOpenModal: false,
        isEdit: false,
        addInfo: {},
        ruleValidate: {
          replyTeacher: [
            {required: true, message: '请输入教师名称', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '作业图片',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.workImg
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            align: 'center'
          },
          {
            title: '提交时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.workTime).format('YYYY-MM-DD HH:mm:ss'))
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
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
                      this.openModal(params.row, false)
                    }
                  }
                }, '批改'),
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
                      window.open(params.row.workImg)
                    }
                  }
                }, '下载'),
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
        columnsTwo: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '作业图片',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.workImg
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            align: 'center'
          },
          {
            title: '提交时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.workTime).format('YYYY-MM-DD HH:mm:ss'))
            },
            align: 'center'
          },
          {
            title: '老师名称',
            key: 'replyTeacher',
            align: 'center'
          },
          {
            title: '最后批改时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.replyTime).format('YYYY-MM-DD HH:mm:ss'))
            },
            align: 'center'
          },
          {
            title: '评价',
            render: (h, params) => {
              return h('div', [
                h('div',this.evaluateColumn[params.row.evaluation]),
                h('div',params.row.stumsg === null ? '' : `(${params.row.stumsg})`)
              ])
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 200,
            align: 'left',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: this.radioType === 3 ? 'none' : 'inline-block',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: (this.radioType === 2) || (this.radioType === 1 && params.row.praise) ? 'none' : 'inline-block',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.praiseItem(params.row)
                    }
                  }
                }, '加入表扬'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: this.radioType !== 2 ? 'none' : 'inline-block',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.praiseItem(params.row)
                    }
                  }
                }, '移出表扬'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: this.radioType === 2 ? 'none' : 'inline-block',
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
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.composition.removeHomework({
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
          this.addInfo = {}
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
      //分页查询
      getList(num) {
        this.isFetching = true
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          grade: this.gradeType,
          evaluation: this.searchInfo.evaluate == '-1' ? '' : this.searchInfo.evaluate,
          starttime: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          endtime: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.teachername = this.searchInfo.manner
        }

        if (num) {
          this.tab.currentPage = 1
        }

        if (this.radioType !== 2) {
          params.reply = this.radioType
        } else  {
          params.praise = true
        }

        this.$api.composition.listHomeworkByPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      praiseItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: this.radioType === 2 ? '确认要移出表扬吗？' : '确认要加入表扬吗',
          onOk: () => {
            this.$api.composition.praiseHomework({
              id: param.id,
              praise: this.radioType === 1
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
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.replyImg) {
              return this.$Message.error('请上传批改图片')
            }
            this.$api.composition.replyHomework(this.addInfo)
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-job {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tips {
      color: #39f
    }

    .-p-job-top {
      margin-top: 108px;
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
