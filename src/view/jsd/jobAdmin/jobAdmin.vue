<template>
  <div class="p-jobAdmin">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="radioType" type="button" @on-change="changeJobType">
            <Radio :label=0>待批改</Radio>
            <Radio :label=1>不合格</Radio>
            <Radio :label=3>已批改</Radio>
            <Radio :label=4>表扬</Radio>
          </Radio-group>
        </Row>

        <Row v-if="radioType === 1 || radioType === 2" class="-p-margin-top g-t-left">
          <Radio-group v-model="unqualifiedType" type="button" @on-change="changeUnqualified">
            <Radio :label=1>未重做</Radio>
            <Radio :label=2>已重交</Radio>
          </Radio-group>
        </Row>

        <search-template ref="searchChild" :option="searchOption" @changeSearch="getSearchInfo"></search-template>

        <Row v-if="radioType === 0" class="p-jobAdmin-tip">
          <div class="-tip-div g-t-left">
            <Checkbox v-model="selectAllData" @on-change="changeAloneSelect">所有数据</Checkbox>
          </div>
          <div class="-tip-div g-text-right">
            <Button @click="openModal()" ghost type="primary" style="width: 100px;">分配作业</Button>
          </div>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="columsType[radioType]" :data="dataList" ref="selection"
             @on-selection-change="changeSelectData"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-jobAdmin"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="分配作业">
        <div class="p-jobAdmin-text">确认将{{selectAllData ? '所有' : `选中的${selectUserList.length}份`}}作业，分配给</div>
        <Form ref="addInfo" :model="addInfo" :label-width="70">
          <FormItem label="教师名称" class="ivu-form-item-required">
            <Select v-model="addInfo.teacherId" class="-search-selectOne">
              <Option v-for="(item,index) in teacherList" :label="item.nickname" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
        </div>
      </Modal>

      <Modal
        class="p-jobAdmin"
        v-model="isOpenModalPlay"
        @on-cancel="closeModalPlay"
        footer-hide
        width="350"
        title="播放">
        <audio ref="playAudio" :src="playAudioUrl" controls></audio>
      </Modal>

      <job-record-template v-model="isOpenJobRecord" :dataInfo="detailInfo"></job-record-template>

    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'
  import UploadImgMultiple from "../../../components/uploadImgMultiple";
  import SearchTemplate from "../../../components/searchTemplate";
  import JobRecordTemplate from "../../../components/jobRecordTemplate";

  export default {
    name: 'jobAdmin',
    components: {JobRecordTemplate, SearchTemplate, UploadImgMultiple, DatePickerTemplate, UploadAudio},
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
        searchOption: {
          isAppId: true,
          isWorkType: true,
          isPay: true,
          isUserType: true,
          isTeacher: true
        },
        evaluateColumn: {
          '0': '不满意',
          '1': '一般',
          '2': '满意',
        },
        dataList: [],
        teacherList: [],
        selectUserList: [],
        total: 0,
        radioType: 0,
        unqualifiedType: 1,
        selectInfo: '1',
        getStartTime: '',
        getEndTime: '',
        selectAllData: false,
        searchInfo: {},
        isFetching: false,
        isOpenModal: false,
        isOpenModalPlay: false,
        isOpenJobRecord: false,
        isEdit: false,
        addInfo: {},
        detailInfo: {},
        playAudioUrl: '',
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            tooltip: true,
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
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
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '老师名称',
            key: 'replyTeacher',
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            tooltip: true,
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
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
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '批改时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.replyTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '评价内容',
            key: 'evaluationText',
            align: 'center'
          },
          {
            title: '老师名称',
            key: 'replyTeacher',
            align: 'center'
          },
          {
            title: '操作',
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
                      this.openJobRecord(params.row)
                    }
                  }
                }, '作业记录')
              ])
            }
          }
        ],
        columnsThree: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            tooltip: true,
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
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
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '批改时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.replyTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '老师名称',
            key: 'replyTeacher',
            align: 'center'
          },
          {
            title: '操作',
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
                      this.openJobRecord(params.row)
                    }
                  }
                }, '作业记录')
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
          '2': this.columnsThree,
          '4': this.columnsTwo,
        }
      }
    },
    mounted() {
      this.getList()
      this.getTeacherList()
    },
    methods: {
      changeAloneSelect() {
        this.$refs.selection.selectAll(this.selectAllData);
      },
      changeSelectData(data) {
        this.selectUserList = []
        for (let item of data) {
          this.selectUserList.push(item.workId)
        }
      },
      changeJobType() {
        // this.radioType === 1 && this.changeUnqualified()
        // this.searchInfo = {}
        setTimeout(() => {
          this.$refs.searchChild.initSearch()
        }, 100);

        if (this.radioType === 0 || this.radioType === 1 || this.radioType === 2) {
          this.searchOption = {
            isAppId: true,
            isWorkType: true,
            isPay: true,
            isUserType: true,
            isTeacher: true
          }
        } else {
          this.searchOption = {
            isAppId: true,
            isWorkType: true,
            isPay: true,
            isUserType: true,
            isSituation: true,
            isComment: true,
            isFeedback: true
          }
        }
        this.getList(1)
      },
      changeUnqualified() {
        // this.searchInfo = {}
        setTimeout(() => {
          this.$refs.searchChild.initSearch()
        }, 100);
        this.radioType = this.unqualifiedType
        this.getList(1)
      },
      getSearchInfo(data) {
        this.searchInfo = data
        this.getList(1)
      },
      getAudioInfo(data) {
        this.addInfo.replyDuration = (data / 1000).toFixed()
      },
      jobPrise(data) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要进行此操作吗？`,
          onOk: () => {
            this.$api.jsdJob.praiseHomework({
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
      changePassed() {
        this.$forceUpdate()
      },
      openModalPlay(data) {
        this.playAudioUrl = data
        this.isOpenModalPlay = true
      },
      openJobRecord(data) {
        this.isOpenJobRecord = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
        this.detailInfo.appId = this.searchInfo.appId || '7'
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
            this.$api.jsdJob.removeHomework({
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
        this.addInfo = {
          replyImg: [],
          replyText: '',
          replyAudio: ''
        }
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.isPassed = this.radioType != 1 ? 1 : 0
        }
        console.log(this.addInfo)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getTeacherList() {
        this.$api.jsdTeacher.listTeachByPage({
          current: 1,
          size: 10000,
          type: 0
        }).then(response => {
          let arrayT = response.data.resultData.records
          arrayT.forEach(item=> {
            if (!item.desabled) {
              this.teacherList.push(item)
            }
          })
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          system: this.searchInfo.appId || '7',
          evaluation: this.searchInfo.evaluation == '-1' ? '' : this.searchInfo.evaluation,
          payed: this.searchInfo.pay == '-1' ? '' : this.searchInfo.pay,
          evaluationed: this.searchInfo.evaluationed == '-1' ? '' : this.searchInfo.evaluationed,
          hasComment: this.searchInfo.hasComment == '-1' ? '' : this.searchInfo.hasComment,
          hmBegin: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          hmEnd: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : "",
          teacherId: this.searchInfo.teacherId == '-1' ? '' : this.searchInfo.teacherId,
          status: this.radioType == 4 ? '' : this.radioType,
          praise: this.radioType == 4
        }

        if (this.searchInfo.workType == '1' && this.searchInfo) {
          params.lname = this.searchInfo.manner
        } else if (this.searchInfo.workType == '2' && this.searchInfo) {
          params.hmkeyword = this.searchInfo.manner
        }

        if (this.searchInfo.userType == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.mannerTwo
        }

        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.jsdJob.listManagerWorkByPage(params)
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
        if (!this.addInfo.teacherId) {
          return this.$Message.error('请选择需要分配的教师')
        }

        this.$api.jsdJob.reAllotJob({
          range: this.selectAllData ? 1 : 0,
          system: this.addInfo.appId || '7',
          teacherId: this.addInfo.teacherId,
          workIds: this.selectAllData ? '' : this.selectUserList
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
  .p-jobAdmin {

    &-text {
      font-size: 16px;
      margin-bottom: 20px;
    }

    &-flex {
      display: flex;
      margin-top: 20px;

      .-item-wrap {
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;

        &-top {
          display: flex;
          justify-content: space-between;

          .-name-left {
            font-size: 16px;
          }

          .-name-right {
            cursor: pointer;
            font-weight: normal;
            color: #5444e4;
          }
        }

        &-center {
          margin: 2px 0;
          font-size: 18px;
          display: flex;
          justify-content: center;
        }
      }

      .-mask-wrap {
        display: flex;
        justify-content: space-between;
        width: 580px;
        margin: 20px 0;
        font-size: 14px;
        font-weight: bold;

        &-top {
          .-name-left {
            font-size: 16px;
          }
        }

        &-center {
          margin: 2px 0;
          font-size: 18px;
          display: flex;
          justify-content: center;
        }

        &-down {
          text-align: center;
        }
      }
    }

    &-tip {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 20px;

      .-tip-div {
        width: 50%;
      }
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
      margin-top: 20px;
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-p-margin-top {
      margin-top: 20px;
    }
  }
</style>
