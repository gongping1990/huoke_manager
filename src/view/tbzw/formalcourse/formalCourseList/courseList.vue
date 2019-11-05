<template>
  <div class="p-forma-courseList">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-forma-courseList"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      width="700"
      :title="nowStatus == '1' ? '版本记录' : '排课设置'">
      <Timeline v-if="nowStatus == '1'">
        <TimelineItem v-for="(item, index) of versionList" :key="index">
          <p class="time">{{item.time | timeFormatter}}</p>
          <p class="content">{{item.names}}</p>
        </TimelineItem>
      </Timeline>
      <Form ref="addInfo" :model="addInfo" :label-width="80" v-else>
        <FormItem label="注意">
          <span class="-c-tips">请选择每周需要排课的天数，新建立即生效，更改5分钟后生效，更改不会影响已经排出的课时</span>
        </FormItem>
        <FormItem label="排课模式">
          <Radio-group v-model="addInfo.classType" @on-change="changeRadio">
            <Radio :label=1>每周三节</Radio>
            <Radio :label=2>每周五节</Radio>
            <Radio :label=3>每周七节</Radio>
          </Radio-group>
          <CheckboxGroup v-model="checkWeeks">
            <Checkbox v-for="item of weekList" :label="item.id" :key="item.id" :disabled="true">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="是否覆盖">
          <Radio-group v-model="addInfo.isPassed">
            <Radio :label=1>是</Radio>
            <Radio :label=0>否</Radio>
          </Radio-group>
          (<span class="-c-tips">已自定义排课的学生</span>)
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'tbzw_forma_courseList',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        nowStatus: '',
        isFetching: false,
        isOpenModal: false,
        addInfo: {
          classType: 1
        },
        checkWeeks: ['2','4','6'],
        weekList: [
          {
            id: '1',
            name: '星期一'
          },
          {
            id: '2',
            name: '星期二'
          },
          {
            id: '3',
            name: '星期三'
          },
          {
            id: '4',
            name: '星期四'
          },
          {
            id: '5',
            name: '星期五'
          },
          {
            id: '6',
            name: '星期六'
          },
          {
            id: '7',
            name: '星期天'
          }
        ],
        versionList: [],
        columns: [
          {
            title: '课程名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '课程封面',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.coverphoto
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '落地页链接',
            key: 'opentime',
            align: 'center'
          },
          {
            title: '排课时间',
            render: (h, params)=> {
              return h('span', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () =>{
                    this.openEdit(params.row,1)
                  }
                }
              }, params.row.name)
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 260,
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
                      this.openEdit(params.row, 2)
                    }
                  }
                }, '排课设置'),
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
                      this.toCourseContent(params.row)
                    }
                  }
                }, '课时内容'),
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
                }, '编辑')
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
      changeRadio () {
        switch (+this.addInfo.classType) {
          case 1:
            this.checkWeeks = ['2','4','6']
            break
          case 2:
            this.checkWeeks = ['1','2','3','4','5']
            break
          case 3:
            this.checkWeeks = ['1','2','3','4','5','6','7']
            break
        }
      },
      toCourseContent (data) {
        this.$router.push({
          name: 'tbzw_forma_courseContent',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },
      openModal(data) {
        this.$router.push({
          name: 'tbzw_forma_courseInfo',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },
      openEdit (data, num) {
        this.nowStatus = num
        this.isOpenModal = true
      },

      closeModal() {
        this.isOpenModal = false
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
        this.$api.tbzwCourse.courseQueryPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: 1
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

        this.$api.tbzwOperational.saveBanner({
          id: this.addInfo.id,
          cardimgurl : this.addInfo.cardimgurl,
          imgurl : this.addInfo.imgurl
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal()
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
  .p-forma-courseList {
    .-c-tips {
      color: #39f
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

  }
</style>
