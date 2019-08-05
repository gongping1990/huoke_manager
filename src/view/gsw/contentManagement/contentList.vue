<template>
  <div class="p-popManage">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">活动名称</Option>
              <Option value="2">发布内容</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.antistop" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>

    <Modal
      class="p-course-list"
      v-model="isOpenModalPlay"
      @on-cancel="isOpenModalPlay = false"
      width="350"
      title="播放">
      <audio ref="playAudio" :src="addInfo.content" autoplay controls></audio>
      <div slot="footer" class="g-flex-j-sa">
        <div @click="closeModalPlay" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'contentList',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '有效时间',
          type: 'datetime'
        },
        dataList: [],
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        isFetching: false,
        isOpenModalPlay: false,
        addInfo: {},
        columns: [
          {
            title: '发布内容',
            render: (h, params) => {
              return h('div', [
                h('div', params.row.textTip),
                h('div', {
                  style: {
                    display: params.row.format == 2 ? 'inline-block' : 'none',
                    color: '#5444E4',
                    'margin-left': '10px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, `点击播放`),
                h('img', {
                  attrs: {
                    src: params.row.content
                  },
                  style: {
                    display: params.row.format == 1 ? 'inline-block' : 'none',
                    color: '#5444E4',
                    'margin-left': '10px',
                    cursor: 'pointer'
                  },
                }),
                h('span', {
                  style: {
                    display: params.row.format == 0 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  }
                }, params.row.content)
              ])
            }
          },
          {
            title: '回复（点评、评论、回复）',
            render: (h, params)=> {
              return h('div',[
                h('div', params.row.replyText),
                h('div', {
                  style: {
                    display: params.row.formatTwo == 2 ? 'inline-block' : 'none',
                    color: '#5444E4',
                    'margin-left': '10px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, `点击播放`),
                h('img', {
                  attrs: {
                    src: params.row.content
                  },
                  style: {
                    display: params.row.formatTwo == 1 ? 'inline-block' : 'none',
                    color: '#5444E4',
                    'margin-left': '10px',
                    cursor: 'pointer'
                  },
                }),
                h('span', {
                  style: {
                    display: params.row.formatTwo == 0 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  }
                }, params.row.content)
              ])
            }
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.timestamp).format('YYYY-MM-DD HH:mm:ss'))
            },
            align: 'center'
          },
          {
            title: '用户',
            key: 'uname',
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: !params.row.showed ? '#5444E4' : 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, !params.row.showed ? '启用' : '禁用')
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
      openModal(data) {
        this.addInfo = data
        this.isOpenModalPlay = true
      },
      closeModalPlay() {
        this.$refs.playAudio.pause()
        this.isOpenModalPlay = false
      },
      changeDate(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.getList(1)
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

        if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickname = this.searchInfo.antistop
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.keyword = this.searchInfo.antistop
        }

        this.$api.gswStudy.workComment({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          start: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime) : '',
          end: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime) : ''
        })
          .then(
            response => {
              let dataArray = ''
              dataArray = response.data.resultData.records;
              this.total = response.data.resultData.total;
              this.dataList =[]
              for (let item of dataArray) {
                this.dataList.push({
                  timestamp: item.timestamp,
                  uname: item.uname,
                  target: item.target,
                  format: item.format,
                  workStuName: item.workStuName,
                  content: item.content,
                  showed: item.showed,
                  formatTwo: item.source.source ? item.source.source.format : '',
                  replyText: item.source ? `${item.source.uname}${item.source.target != 0 ? (item.source.target == 1 ? '点评' : '回复') : ' 评论'}${item.source.source ? item.source.source.uname : `${item.source.workStuName}的作业`}` : item.workStuName,
                  textTip: `${item.uname}${item.target != 0 ? '评论':'回复'}${item.target != 0 ? (item.target == 1 ? `${item.workTeacher}老师` : item.source.uname) : `${item.workStuName}的作业`}：`
                })
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要进行此操作吗？`,
          onOk: () => {
            this.$api.gswStudy.workCommentShow({
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
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-popManage {
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
