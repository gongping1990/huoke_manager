<template>
  <div class="p-job">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left ">
          <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
            <Radio :label=0>待批改</Radio>
            <Radio :label=1>不合格</Radio>
            <Radio :label=3>已批改</Radio>
            <Radio :label=4>表扬</Radio>
          </Radio-group>
        </Row>
        <Row class="g-t-left g-tab">
          <Col :span="3" class="g-t-left" v-if="radioType===3">
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

      <Table :loading="isFetching" :columns="columsType[radioType]" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-job"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="750"
        title="批改作业">
        <Form ref="addInfo" :model="addInfo" :label-width="70">
          <FormItem label="是否合格">
            <Radio-group v-model="addInfo.isPassed" @on-change="changePassed">
              <Radio :label=1>合格</Radio>
              <Radio :label=0>不合格</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="教师名称" prop="replyTeacher" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.replyTeacher" placeholder="请输入教师名称"></Input>
          </FormItem>
          <FormItem label="批改图片" v-if="addInfo.isPassed === 1">
            <upload-img-multiple v-model="addInfo.replyImg" :option="uploadOption"></upload-img-multiple>
          </FormItem>
          <FormItem label="批改音频" v-if="addInfo.isPassed === 1">
            <upload-audio ref="childAudio" v-model="addInfo.replyAudio" :option="uploadAudioOption"></upload-audio>
          </FormItem>
          <FormItem label="批改文案" v-if="addInfo.isPassed === 1">
            <Input type="textarea" :rows="5" v-model="addInfo.replyText" placeholder="请输入批改文案"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
        </div>
      </Modal>

      <Modal
        class="p-job"
        v-model="isOpenModalPlay"
        @on-cancel="closeModalPlay"
        footer-hide
        width="350"
        title="播放">
        <audio ref="playAudio" :src="playAudioUrl" controls></audio>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'
  import UploadImgMultiple from "../../../components/uploadImgMultiple";

  export default {
    name: 'jobList',
    components: {UploadImgMultiple, DatePickerTemplate, UploadAudio},
    data() {
      return {
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
        radioType: 0,
        selectInfo: '1',
        getStartTime: '',
        getEndTime: '',
        searchInfo: {
          evaluate: '-1'
        },
        isFetching: false,
        isOpenModal: false,
        isOpenModalPlay: false,
        isEdit: false,
        addInfo: {},
        playAudioUrl: '',
        columns: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params)=> {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            align: 'center'
          },
          {
            title: '作业内容',
            width: 300,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.workImgSrc.length ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                       window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
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
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params)=> {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业内容',
            width: 300,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.workImgSrc.length ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                       window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
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
            title: '批改内容',
            width: 300,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.replyImg.length ? params.row.replyImg.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                       window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.replyAudioAuthorUrl)
                    }
                  }
                }, '播放音频')
              ])
            },
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
                h('div', this.evaluateColumn[params.row.evaluation]),
                h('div', params.row.stumsg === null ? '' : `(${params.row.stumsg})`)
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
                    display: this.radioType == 4 ? 'none' : 'inline-block',
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
                      this.jobPrise(params.row)
                    }
                  }
                }, this.radioType == '4' ? '移除表扬' : '加入表扬')
              ])
            }
          }
        ],
        columnsThree: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params)=> {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            align: 'center'
          },
          {
            title: '作业内容',
            width: 300,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.workImgSrc.length ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                       window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
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
            title: '状态',
            render: (h, params) => {
              return h('div', params.row.status==1 ? '待重做' : '已重做')
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
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '批改'),
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
      };
    },
    computed: {
      columsType() {
        return {
          '0': this.columns,
          '3': this.columnsTwo,
          '1': this.columnsThree,
          '4': this.columnsTwo,
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      jobPrise (data) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要进行此操作吗？`,
          onOk: () => {
            this.$api.gswStudy.jobPraise({
              id: data.id,
              praise: !data.praise
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
      changePassed () {
        this.$forceUpdate()
      },
      openModalPlay(data) {
        this.playAudioUrl = data
        this.isOpenModalPlay = true
      },
      closeModalPlay() {
        this.$refs.playAudio.load()
        this.isOpenModalPlay = false
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.poem.removeHomework({
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
          this.addInfo.isPassed = this.radioType != 1 ? 1 : 0
        } else {
          this.addInfo = {
            replyImg: [],
            replyText: ''
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
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
          grade: 3,
          evaluation: this.searchInfo.evaluate == '-1' ? '' : this.searchInfo.evaluate,
          starttime: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          endtime: this.getEndTime ? new Date(this.getEndTime).getTime() : "",
          status: this.radioType == 4 ? '' :  this.radioType,
          praise: this.radioType == 4
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.teachername = this.searchInfo.manner
        }

        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.poem.listHomeworkByPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
              for (let item of this.dataList) {
                item.workImgSrc = item.workImgSrc ? item.workImgSrc.split(',') : []
                item.replyImg = item.replyImg ? item.replyImg.split(',') : []
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        if (!this.addInfo.replyTeacher) {
          return this.$Message.error('请输入教师名称')
        } else if (this.addInfo.replyImg.length > 3) {
          return this.$Message.error('最多上传三张图片')
        }

        this.$api.poem.replyHomework({
          id: this.addInfo.id,
          replyImg: `${this.addInfo.replyImg}`,
          replyTeacher: this.addInfo.replyTeacher,
          replyText: this.addInfo.replyText,
          replyAudio: this.addInfo.replyAudio,
          isPassed: this.addInfo.isPassed == 1
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal(name)
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
