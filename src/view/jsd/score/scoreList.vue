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
        :title="addInfo.id ? '编辑版本' : '新增评分版本'">
        <Form ref="addInfo" :model="addInfo" :label-width="20">
          <FormItem class="p-score-formItem" v-for="(item,index) of scoreStorageList" :key="index">
            <span>{{index+1}}、</span>
            <Input class="-input" type="text" v-model="item.value" placeholder="请填写名称，默认满分100分"></Input>
            <span v-if="nowStatus === 1" class="-del" @click="delScoreList(index)">删除</span>
          </FormItem>
        </Form>
        <div class="g-t-center">
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
        <div slot="footer" class="p-adminTeacher-btn">
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
        scoreStorageList: [
          {
            value: ''
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
            key: 'nickname',
            align: 'center'
          },
          {
            title: '评分维度',
            key: 'username',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createDate',
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
      this.listBase()
    },
    methods: {
      addScoreList () {
        this.scoreStorageList.push({
          value: ''
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
        } else {
          this.scoreStorageList = [
            {
              value: ''
            }
          ]
          this.addInfo = {
            id: '',
          }
        }
      },
      openModalData() {
        this.isOpenModalData = true
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      listBase() {
        this.appList = []
        this.$api.jsdJob.listBase()
          .then(response => {
            this.appList = response.data.resultData
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.jsdTeacher.listTeachByPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: 0
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认取消评分？',
          onOk: () => {
            this.$api.jsdTeacher.removeTeacher({
              userId: param.id
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
          return (item.value !== '')
        })

        if (!passContent) {
          return this.$Message.error('每一项版本名称不能为空')
        }

        let param = ''

        param = this.addInfo.id ? this.$api.jsdTeacher.updateTeacher : this.$api.jsdTeacher.addTeacher
        param({
          id: this.addInfo.id,
          nickname: this.addInfo.nickname,
          username: this.addInfo.username,
          password: this.addInfo.password,
          headimgurl: this.addInfo.headimgurl,
          amount: this.addInfo.amount,
          courses: `${this.addInfo.courses}`
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
