<template>
  <div class="p-score">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-score"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.courseId ? '编辑版本' : '新增评分版本'">
        <Form ref="addInfo" :model="addInfo" :label-width="20">
          <FormItem class="p-score-formItem" v-for="(item,index) of scoreStorageList" :key="index">
            <span>{{index+1}}、</span>
            <Input class="-input" type="text" v-model="item.name" placeholder="请填写名称，默认满分100分"></Input>
            <span v-if="nowStatus === 1" class="-del" @click="delScoreList(index)">删除</span>
          </FormItem>
        </Form>
        <div class="g-t-center" v-if="nowStatus === 1">
          <Button class="-btn" @click="addScoreList" ghost type="primary" style="width: 100px;">新增维度</Button>
        </div>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>


      <Modal
        class="p-score"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="500"
        title="版本记录">
        <Timeline v-if="versionList.length">
          <TimelineItem v-for="(item, index) of versionList" :key="index">
            <p class="time">{{item.time | timeFormatter}}</p>
            <p class="content">{{item.names}}</p>
          </TimelineItem>
        </Timeline>
        <div class="g-t-center" v-else>暂无版本记录~~</div>
        <div slot="footer" class="p-score-btn">
          <div @click="isOpenModalData = false" class="g-primary-btn"> 确 认</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'jsd_adminTeacher',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        versionList: [],
        scoreStorageList: [
          {
            name: ''
          }
        ],
        nowStatus: '',
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        columns: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '评分维度',
            key: 'evaluate',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', params.row.createTime ? dayjs(+params.row.createTime).format('YYYY-MM-DD HH:mm') : '-')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 320,
            align: 'center',
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
                      this.openModal(params.row, 1)
                    }
                  }
                }, '添加新版本'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: params.row.evaluate ? 'inline-block' : 'none',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row, 2)
                    }
                  }
                }, '编辑'),
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
                      this.openModalData(params.row)
                    }
                  }
                }, '版本记录'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    display: params.row.evaluate ? 'inline-block' : 'none',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '取消评分')
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    filters: {
      timeFormatter(value) {
        return (dayjs(+value).format('YYYY-MM-DD HH:mm'));
      }
    },
    methods: {
      addScoreList () {
        this.scoreStorageList.push({
          name: ''
        })
      },
      delScoreList(index) {
        this.scoreStorageList.splice(index, 1)
      },
      openModal(data, num) {
        this.nowStatus = num
        this.isOpenModal = true
        if (num === 2) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.scoreStorageList = this.addInfo.folist
        } else {
          this.scoreStorageList = [
            {
              name: ''
            }
          ]
          this.addInfo = {
            courseId: data.courseId,
          }
        }
      },
      openModalData(data) {
        this.isOpenModalData = true
        this.listBase(data)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      listBase(data) {
        this.$api.jsdEvaluate.listAllVersion({
          courseId: data.courseId
        })
          .then(response => {
            this.versionList = response.data.resultData
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.jsdEvaluate.listAllCourse()
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认取消评分？',
          onOk: () => {
            this.$api.jsdEvaluate.disabled({
              courseId: param.courseId
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
        let passContent = this.scoreStorageList.every((item) => {
          return (item.name !== '')
        })

        if (!passContent) {
          return this.$Message.error('每一项版本名称不能为空')
        }

        let param = ''

        this.$api.jsdEvaluate.updateWithCourse({
          courseId: this.addInfo.courseId,
          evaluates: this.scoreStorageList
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal(name)
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-score {
    .-c-tips {
      color: #39f
    }

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    &-formItem {
      .-input {
        margin: 0 10px;
        width: 80%;
      }

      .-del {
        color: #DA374B ;
        cursor: pointer;
      }
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
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
