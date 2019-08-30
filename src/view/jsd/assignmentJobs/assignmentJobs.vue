<template>
  <div class="p-assignmentJobs">
    <Card>
      <Row class="g-search">

        <search-template :option="searchOption" @changeSearch="getSearchInfo"></search-template>

        <Row class="p-assignmentJobs-tip">
          <div class="-tip-div g-t-left">
            <Checkbox v-model="selectAllData" @on-change="changeAloneSelect">所有数据</Checkbox>
          </div>
          <div class="-tip-div g-text-right">
            <Button @click="openModal()" ghost type="primary" style="width: 100px;">分配作业</Button>
          </div>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="columns" :data="dataList" ref="selection"
             @on-selection-change="changeSelectData"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-assignmentJobs"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="分配作业">
        <div class="p-assignmentJobs-text">确认将{{selectAllData ? '所有' : `选中的${selectUserList.length}份`}}作业，分配给</div>
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
        class="p-assignmentJobs"
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
  import dayjs from 'dayjs'
  import SearchTemplate from "../../../components/searchTemplate";

  export default {
    name: 'jsd_assignmentJobs',
    components: {SearchTemplate},
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
            title: '操作',
            render: (h, params) => {
              return h('div', [
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
        ]
      };
    },
    mounted() {
      this.getList()
      this.getTeacherList()
    },
    methods: {
      changeAloneSelect () {
        this.$refs.selection.selectAll(this.selectAllData);
      },
      changeSelectData(data) {
        this.selectUserList = []
        for (let item of data) {
          this.selectUserList.push(item.workId)
        }
      },
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.jsdJob.removeHomework({
              id: param.workId,
              system: this.searchInfo.appId || '7'
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
        if (!this.selectUserList.length) {
          return this.$Message.error('请选择需要分配的作业')
        }
        this.isOpenModal = true
        this.getTeacherList()
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
        this.teacherList = []
        this.$api.jsdTeacher.selectTeacher({
          system: this.searchInfo.appId || '7',
        }).then(response => {
          this.teacherList = response.data.resultData
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true

        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          system: this.searchInfo.appId || '7',
          hmBegin: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          hmEnd: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : "",
          alloted: false
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
          system: this.searchInfo.appId || '7',
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
  .p-assignmentJobs {

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
