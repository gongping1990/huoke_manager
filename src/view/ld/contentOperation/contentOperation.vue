<template>
  <div class="p-contentOperation">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList()">
          <Radio :label=0>全部内容</Radio>
          <Radio :label=1>人气之星</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">推荐：</div>
            <Select v-model="searchInfo.recommend" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in dataTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left" v-if="radioType == 1">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">举报：</div>
            <Select v-model="searchInfo.report" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in dataTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">课文名称</Option>
              <Option value="2">用户昵称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="16" class="g-flex-a-j-center" v-if="radioType == 0">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
        <Col :span="13" class="g-flex-a-j-center" v-if="radioType == 1">
          <span class="-p-time">创建时间：</span>
          <DatePicker type="daterange"
                      placement="bottom-end"
                      placeholder="选择日期"
                      class="-search-selectOne"
                      style="width: 200px;"
                      @on-change="changeDateTwo"></DatePicker>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-contentOperation"
      v-model="isOpenModalPlay"
      @on-cancel="isOpenModalPlay = false"
      footer-hide
      width="350"
      title="播放">
      <audio ref="playAudio" :src="addInfo.voiceUrl" autoplay controls></audio>
    </Modal>

    <Modal
      class="p-contentOperation"
      v-model="isOpenModalSort"
      @on-cancel="isOpenModalSort = false"
      footer-hide
      width="350"
      title="举报历史">
      <Timeline>
        <TimelineItem>
          <p class="time">1976年</p>
          <p class="content">Apple I 问世</p>
        </TimelineItem>
        <TimelineItem>
          <p class="time">1984年</p>
          <p class="content">发布 Macintosh</p>
        </TimelineItem>
        <TimelineItem>
          <p class="time">2007年</p>
          <p class="content">发布 iPhone</p>
        </TimelineItem>
        <TimelineItem>
          <p class="time">2010年</p>
          <p class="content">发布 iPad</p>
        </TimelineItem>
        <TimelineItem>
          <p class="time">2011年10月5日</p>
          <p class="content">史蒂夫·乔布斯去世</p>
        </TimelineItem>
      </Timeline>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'contentOperation',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          manner: '',
          recommend: '0',
          report: '-1',
          startTime: '',
          endTime: ''
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        addInfo: {},
        selectInfo: '1',
        dataList: [],
        semesterList: {
          '1': '上学期',
          '2': '下学期'
        },
        dataTypeList: [
          {
            name: '全部',
            id: '0'
          },
          {
            name: '是',
            id: '1'
          },
          {
            name: '否',
            id: '2'
          }
        ],
        total: 0,
        radioType: 0,
        isFetching: false,
        isOpenModalPlay: false,
        isOpenModalSort: false,
        isSending: false,
        columns: [
          {
            title: '课文名称',
            key: 'coursename',
            align: 'center'
          },
          {
            title: '用户名称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '年级（学期）',
            render: (h, params) => {
              return h('div', this.semesterList[params.row.semester])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'gmtCreate',
            align: 'center'
          },
          {
            title: '赞（次）',
            key: 'likes',
            align: 'center'
          },
          {
            title: '分享（次）',
            key: 'sharenum',
            align: 'center'
          },
          {
            title: '被举报',
            key: 'report',
            align: 'center'
          },
          {
            title: '是否推荐',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: !params.row.recommend ? 'default' : 'success'
                }
              }, !params.row.recommend ? '否' : '是')
            },
            align: 'center'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.status ? 'default' : 'success'
                }
              }, params.row.status ? '已禁用' : '已启用')
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 190,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '播放'),
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
                      this.changeStatus(params.row)
                    }
                  }
                }, params.row.status ? '启用' : '禁用'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgb(218, 55, 75)',
                  },
                  on: {
                    click: () => {
                      this.toRecommend(params.row)
                    }
                  }
                }, !params.row.recommend ? '推荐' : '取消推荐'),
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModalSort(data) {
        this.isOpenModalSort = true
      },
      changeDate(data) {
        this.searchInfo.startTime = data.startTime
        this.searchInfo.endTime = data.endTime
        this.getList(1)
      },
      changeDateTwo(data) {
        this.searchInfo.startTime = data[1]
        this.searchInfo.endTime = data[2]
        this.getList(1)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.addInfo = data
        this.isOpenModalPlay = true
        console.log(data)
      },
      changeStatus (data) {
        this.$api.work.changeWorkChange({
          id: data.id,
          disabled: data.status ? '0' : '1'
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      toRecommend (data) {
        this.$api.work.workRecommend({
          id: data.id,
          recommend: data.recommend ? '0' : '1'
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : ''
        endTime = this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''

        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.work.workList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          workListMode: this.radioType,
          recommend: this.searchInfo.recommend,
          startDate: startTime,
          endDate: endTime,
          username: this.selectInfo == '2' ? this.searchInfo.manner : '',
          coursename: this.selectInfo == '1' ? this.searchInfo.manner : ''
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-contentOperation {

    .-search-select-text {
      min-width: 50px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-p-t-add-btn {
      top: 90px;
    }
    .-p-time {
      margin-left: 10px;
    }

    .-date-search {
      margin-left: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-c-tips {
      color: #39f
    }
  }
</style>
