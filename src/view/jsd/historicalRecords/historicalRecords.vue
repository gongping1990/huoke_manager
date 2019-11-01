<template>
  <div class="p-job">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeJobType">
          <Radio :label=3>已批改</Radio>
          <Radio :label=4>表扬</Radio>
        </Radio-group>
      </Row>

      <search-template ref="searchChild" :option="searchOption" @changeSearch="getSearchInfo"></search-template>

      <Table :loading="isFetching" :columns="columns" :data="dataList"></Table>

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
              <Radio :label=1 disabled>合格</Radio>
              <Radio :label=0 disabled>不合格</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="教师名称" prop="replyTeacher" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.replyTeacher" placeholder="请输入教师名称"></Input>
          </FormItem>
          <FormItem label="批改图片" v-if="addInfo.isPassed === 1">
            <upload-img-multiple v-model="addInfo.replyImg" :option="uploadOption"></upload-img-multiple>
          </FormItem>
          <FormItem label="批改音频" v-if="addInfo.isPassed === 1">
            <upload-audio ref="childAudio" v-model="addInfo.replyAudio" :option="uploadAudioOption"
                          @otherAudioInfo="getAudioInfo"></upload-audio>
          </FormItem>
          <FormItem label="批改文案" v-if="addInfo.isPassed === 1">
            <Input type="textarea" :rows="5" v-model="addInfo.replyText" placeholder="请输入批改文案"></Input>
          </FormItem>
          <FormItem label="综合评分" v-if="addInfo.isPassed === 1" :class="{'ivu-form-item-required': addInfo.isPassed === 1}">
            <p class="-c-tips">此评分主要用于其他老师在查看作业记录时，能快速的对用户的作业情况有一个大致的了解，用户不可见</p>
            <div class="p-job-score">
              <div class="p-job-scoreItem" v-for="(item, index) of addInfo.scores" :key="index">
                <span>{{item.name}}</span>
                <InputNumber class="-input" :max="100" type="text" v-model="item.score" placeholder="满分一百分"></InputNumber>
              </div>
            </div>

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

      <job-record-template v-model="isOpenDetail" :dataInfo="detailInfo"></job-record-template>

      <look-user-info v-model="isOpenUserInfo" :dataInfo="detailInfo"></look-user-info>

    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'
  import UploadImgMultiple from "../../../components/uploadImgMultiple";
  import JobDetailModel from "../../../components/jobDetailModel";
  import SearchTemplate from "../../../components/searchTemplate";
  import JobRecordTemplate from "../../../components/jobRecordTemplate";
  import LookUserInfo from "../todayWork/lookUserInfo";

  export default {
    name: 'jsd_historicalRecords',
    components: {LookUserInfo, JobRecordTemplate, SearchTemplate, UploadImgMultiple, DatePickerTemplate, UploadAudio},
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
        evaluateColumn: {
          '0': '不满意',
          '1': '一般',
          '2': '满意',
        },
        searchOption: {
          isAppId: true,
          isWorkType: true,
          isPay: true,
          isUserType: true,
          isComment: true,
          isSituation: true,
          isFeedback: true
        },
        dataList: [],
        total: 0,
        radioType: 3,
        getStartTime: '',
        getEndTime: '',
        searchInfo: {},
        isFetching: false,
        isOpenModal: false,
        isOpenModalPlay: false,
        isOpenDetail: false,
        isOpenUserInfo: false,
        isEdit: false,
        addInfo: {},
        detailInfo: {},
        playAudioUrl: '',
        columns: [
          {
            title: '用户昵称',
            render: (h, params) => {
              return h('Button', {
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
              }, params.row.nickName)
            },
            align: 'center'
          },
          {
            title: '课时名称',
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
            title: '操作',
            width: 300,
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
                      this.changePraise(params.row)
                    }
                  }
                }, this.radioType == 4 ? '移出表扬' : '加入表扬'),
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
                }, '修改评价'),
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
                      this.openDetail(params.row)
                    }
                  }
                }, '作业记录'),
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
    mounted() {
    },
    methods: {
      toDetail(data) {
        this.isOpenUserInfo = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
      },
      changeJobType() {
        setTimeout(() => {
          this.$refs.searchChild.initSearch()
        }, 100);
        this.getList(1)
      },
      getSearchInfo(data) {
        this.searchInfo = data
        this.getList(1)
      },
      getAudioInfo(data) {
        this.addInfo.replyDuration = (data / 1000).toFixed()
      },
      changePassed() {
        this.$forceUpdate()
      },
      openModalPlay(data) {
        this.playAudioUrl = data
        this.isOpenModalPlay = true
      },
      openDetail(data) {
        this.isOpenDetail = true
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
              courseId: this.searchInfo.appId || '7',
              id: param.workId
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
      changePraise(param) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要${this.radioType == 4 ? '移出表扬' : '加入表扬'}？`,
          onOk: () => {
            this.$api.jsdJob.praise({
              courseId: this.searchInfo.appId,
              praise: this.radioType === 3,
              id: param.workId
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
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.isPassed = 1
          this.viewWork()
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
      viewWork() {
        this.$api.jsdJob.viewWork({
          system: this.searchInfo.system,
          workId: this.addInfo.workId
        })
          .then(response => {
            this.addInfo.scores = response.data.resultData.scores;
            this.$forceUpdate()
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.searchInfo.appId,
          evaluation: this.searchInfo.evaluation == '-1' ? '' : this.searchInfo.evaluation,
          payed: this.searchInfo.pay == '-1' ? '' : this.searchInfo.pay,
          evaluationed: this.searchInfo.evaluationed == '-1' ? '' : this.searchInfo.evaluationed,
          hasComment: this.searchInfo.hasComment == '-1' ? '' : this.searchInfo.hasComment,
          hmBegin: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          hmEnd: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : "",
          status: this.radioType == 4 ? '' : this.radioType
        }

        if (this.searchInfo.workType == '1' && this.searchInfo) {
          params.lname = this.searchInfo.manner
        } else if (this.searchInfo.workType == '2' && this.searchInfo) {
          params.hmkeyword = this.searchInfo.manner
        }

        if (this.searchInfo.userType == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.mannerTwo
        } else if (this.searchInfo.userType == '2' && this.searchInfo) {
          params.phone = this.searchInfo.mannerTwo
        }

        if (this.radioType == 4) {
          params.praise = true
        }

        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.jsdJob.listTeacherWorkByPage(params)
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

        this.$api.jsdJob.replyHomework({
          id: this.addInfo.workId,
          courseId: this.searchInfo.appId,
          replyImg: `${this.addInfo.replyImg}`,
          replyTeacher: this.addInfo.replyTeacher,
          replyText: this.addInfo.replyText,
          replyAudio: this.addInfo.replyAudio,
          replyDuration: this.addInfo.replyDuration,
          score: this.addInfo.scores,
          status: this.addInfo.isPassed == 1 ? '3' : '1'
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


    &-score {
      display:flex;
      flex-direction:row;
      flex-wrap:wrap;
    }

    &-scoreItem {
      margin-top: 10px;
      width: 50%;

      span{
        text-align: center;
        display: inline-block;
        width: 20%;
      }

      .-input {
        width: 75%;
        margin-left: 10px;
      }
    }

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
