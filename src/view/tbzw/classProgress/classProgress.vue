<template>
  <div class="p-classProgress">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">课程进度</Option>
              <Option value="3">累计打卡</Option>
              <Option value="4">最近连续打卡</Option>
              <Option value="5">最长连续打卡</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.public" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <job-record-template v-model="isOpenModal" :dataInfo="1"></job-record-template>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import JobRecordTemplate from "../../../components/jobRecordTemplate";

  export default {
    name: 'tbzw_classProgress',
    components: {JobRecordTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        selectInfo: '1',
        searchInfo: {},
        addInfo: {},
        columns: [
          {
            title: '用户昵称',
            key: 'content'
          },
          {
            title: '电话号码',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '课程进度',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '累计打卡',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '最近连续打卡',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '最长连续打卡',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '交作业课时数',
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
                    this.openModal(params.row)
                  }
                }
              }, params.row.sortnum)
            },
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal (data) {
        this.isOpenModal = true
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

        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize
        }

        switch (+this.selectInfo) {
          case 1:
            params.nickname = this.searchInfo.public
            break
          case 2:
            params.nickname = this.searchInfo.public
            break
          case 3:
            params.nickname = this.searchInfo.public
            break
          case 4:
            params.nickname = this.searchInfo.public
            break
          case 5:
            params.nickname = this.searchInfo.public
            break
        }

        this.$api.composition.getBroadcastList(params)
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
  .p-classProgress {
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
