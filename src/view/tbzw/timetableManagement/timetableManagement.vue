<template>
  <div class="p-timetableAdjustment">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="searchInfo.courseId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of courseList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Row>

        <Row class="g-t-left g-tab">
          <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
            <Radio :label=3>交作业解锁</Radio>
            <Radio :label=1>每周系统排课</Radio>
            <Radio :label=2>人工排课</Radio>
          </Radio-group>
        </Row>

        <Row class="p-timetableAdjustment-tip" v-show="radioType === 1">
          <div class="-tip-div g-t-left">
            <Checkbox  v-model="selectAllData" @on-change="changeAloneSelect">全选所有用户</Checkbox>
          </div>
          <div class="-tip-div g-text-right">
            <Button @click="$router.push('/tbzw_timetableAdjustment')" ghost type="primary">调整排课规则</Button>
            <Button @click="openModal()" ghost type="primary">转移到人工排课</Button>
          </div>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="columnsType" :data="dataList" ref="selection"
             @on-selection-change="changeSelectData"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import dayjs from 'dayjs'

  export default {
    name: 'jobAdmin',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        courseList: [],
        selectUserList: [],
        total: 0,
        radioType: 1,
        unqualifiedType: 1,
        selectInfo: '1',
        getStartTime: '',
        getEndTime: '',
        selectAllData: false,
        searchInfo: {},
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headimgurl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            },
            align: 'center'
          },
          {
            title: '开课日期',
            key: 'startDate',
            align: 'center'
          },
          {
            title: '当前排课规则',
            key: 'rulesDes',
            tooltip: true,
            align: 'center'
          },
          {
            title: '排课数',
            key: 'pkNum',
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headimgurl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            },
            align: 'center'
          },
          {
            title: '开课日期',
            key: 'startDate',
            align: 'center'
          },
          {
            title: '转入时间',
            key: 'switchTime',
            tooltip: true,
            align: 'center'
          },
          {
            title: '排课数',
            key: 'pkNum',
            align: 'center'
          }
        ],
        columnsThree: [
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headimgurl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            },
            align: 'center'
          },
          {
            title: '开课日期',
            key: 'startDate',
            align: 'center'
          },
          {
            title: '解锁数',
            key: 'pkNum',
            align: 'center'
          }
        ]
      };
    },
    computed : {
      columnsType () {
        switch (this.radioType) {
          case 1:
            return this.columns
          case 2:
            return this.columnsTwo
          case 3:
            return this.columnsThree
        }
      }
    },
    mounted() {
      this.courseQueryPage()
    },
    methods: {
      changeAloneSelect() {
        this.$refs.selection.selectAll(this.selectAllData);
      },
      changeSelectData(data) {
        this.selectUserList = []
        for (let item of data) {
          this.selectUserList.push(item.userId)
        }
      },
      openModal() {
        if (!this.selectUserList.length) {
          return this.$Message.error('请选择需要转移的用户')
        }

        this.$Modal.confirm({
          title: '提示',
          content: `确认将${this.selectAllData ? '所有' : `选中的${this.selectUserList.length}个`}用户转移到人工排课？更改次日生效，此操作不可逆，请谨慎操作！`,
          onOk: () => {
            this.$api.tbzwRules.switchUserTtr({
              allUser: this.selectAllData,
              courseId: this.searchInfo.courseId,
              userIds: this.selectAllData ? [] : this.selectUserList
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
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      courseQueryPage() {
        this.$api.tbzwCourse.courseQueryPage({
          current: 1,
          size: 1000,
          type: 1
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
              this.searchInfo.courseId = this.courseList[0].id
              this.getList()
            })
      },
      //分页查询
      getList(num) {
        this.isFetching = true

        if (num) {
          this.tab.currentPage = 1
        }

        let paramUrl = this.radioType === 1 ? this.$api.tbzwRules.pageUserTtr : this.$api.tbzwRules.pageUserDateTtr
        paramUrl({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.searchInfo.courseId,
          ttr: this.radioType+1
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
      submitInfo(name) {

        this.$api.tbzwRules.switchUserTtr({
          range: this.selectAllData ? 1 : 0,
          courseId: this.searchInfo.appId,
          teacherId: this.addInfo.teacherId,
          workIds: this.selectAllData ? [] : this.selectUserList
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
  .p-timetableAdjustment {

    .-search-select-text-two {
      min-width: 60px;
    }
    .-search-selectOne {
      width: 300px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

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
