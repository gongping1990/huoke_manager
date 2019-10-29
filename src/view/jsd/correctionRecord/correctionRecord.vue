<template>
  <div class="p-correctionRecord">
    <Card>
      <Row class="g-search">
        <search-template :option="searchOption" @changeSearch="getSearchInfo"></search-template>
      </Row>

      <Table :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>


      <Modal
        class="p-correctionRecord"
        v-model="isOpenModalPlay"
        @on-cancel="closeModalPlay"
        footer-hide
        width="350"
        title="播放">
        <audio ref="playAudio" :src="playAudioUrl" controls></audio>
      </Modal>
    </Card>

    <job-record-template v-model="isOpenModal" :dataInfo="addInfo"></job-record-template>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import dayjs from 'dayjs'
  import SearchTemplate from "../../../components/searchTemplate";
  import JobRecordTemplate from "../../../components/jobRecordTemplate";

  export default {
    name: 'jsd_assignmentJobs',
    components: {JobRecordTemplate, SearchTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchOption: {
          isAppId: true,
          isWorkType: true,
          isPay: true,
          isExamine: true,
          isUserType: true
        },
        dataList: [],
        teacherList: [],
        selectUserList: [],
        total: 0,
        selectInfo: '1',
        selectAllData: false,
        searchInfo: {},
        isFetching: false,
        isOpenModal: false,
        isOpenModalPlay: false,
        isEdit: false,
        addInfo: {},
        detailInfo: {},
        playAudioUrl: '',
        examineList: ['待审核','审核通过','不通过'],
        columns: [
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
            title: '审核老师',
            key: 'replyTeacher',
            align: 'center'
          },
          {
            title: '审核情况',
           render: (h, params)=>{
             return h('div', this.examineList[params.row.status+1])
           },
            align: 'center'
          },
          {
            title: '审核时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.reviewtime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '批改时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.lastReplyTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '作业记录')
              ])
            }
          }
        ]
      };
    },
    mounted() {},
    methods: {
      getSearchInfo(data) {
        this.selectAllData = false
        this.selectUserList = []
        this.searchInfo = data
        this.getList(1)
      },
      getAudioInfo(data) {
        this.addInfo.replyDuration = (data / 1000).toFixed()
      },
      openModalPlay(data) {
        this.playAudioUrl = data
        this.isOpenModalPlay = true
      },
      closeModalPlay() {
        this.$refs.playAudio.load()
        this.isOpenModalPlay = false
      },
      openModal(data) {
        this.addInfo = data
        this.isOpenModal = true
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
          courseId: this.searchInfo.appId || '7',
          hmBegin: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          hmEnd: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : "",
          alloted: false,
          reviewStatus: this.searchInfo.reviewStatus
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
    }
  };
</script>


<style lang="less" scoped>
  .p-correctionRecord {

    &-text {
      font-size: 16px;
      margin-bottom: 20px;
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

    .-c-tab {
      margin: 20px 0;
    }

  }
</style>
