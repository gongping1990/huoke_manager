<template>
  <div class="p-course-list">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="feedbackType ? columnsUnanswered : columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-course-list"
      v-model="isOpenModalSort"
      @on-cancel="isOpenModalSort = false"
      width="350"
      title="编辑排序值">
      <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
        <FormItem label="排序值">
          <Input type="text" v-model="sortNum" placeholder="请输入排序值"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalSort = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitSort()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <Modal
      class="p-course-list"
      v-model="isOpenModalPlay"
      @on-cancel="isOpenModalPlay = false"
      width="350"
      title="播放">
      <audio v-if="addInfo.type == 1" ref="playAudio" :src="addInfo.resUrl" autoplay controls></audio>
      <video v-if="addInfo.type == 2" ref="playVideo" :src="addInfo.resUrl" autoplay controls style="width: 100%"></video>
      <div slot="footer" class="g-flex-j-sa">
        <!--<Button @click="isOpenModalPlay = false" ghost type="primary" style="width: 100px;">取消</Button>-->
        <div @click="closeModalPlay" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <div v-if="isOpenModal">
      <class-edit :isOpen="isOpenModal" :dataInfo="addInfo" @closeEditModal="closeModal" @submitChildInfo="submitInfo"></class-edit>
    </div>

  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import ClassEdit from "./classEdit";

  export default {
    name: 'courseList',
    components: {ClassEdit},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          name: '',
          categoryId: '',
          startTime: '',
          endTime: ''
        },
        selectInfo: '1',
        dataList: [],
        dataTypeList: [],
        total: 0,
        feedbackType: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalSort: false,
        isOpenModalPlay: false,
        isSending: false,
        addInfo: {
          content: ''
        },
        sortNum: '',
        ruleValidate: {
          content: [
            {required: true, message: '请输入回复内容', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '课时名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '类型',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalPlay(params.row)
                  }
                }
              }, params.row.type == '1' ? '播放音频' : '播放视频')
            },
            align: 'center'
          },
          {
            title: '是否试听',
            render: (h, params) => {
              return h('div', params.row.tryout ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.disabled ? 'default' : 'success'
                }
              }, params.row.disabled ? '已禁用' : '已启用')
            },
            align: 'center'
          },
          {
            title: '排序值',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalSort(params.row)
                  }
                }
              }, params.row.sequence)
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.gmtModified).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 220,
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
                      this.changeTryOut(params.row)
                    }
                  }
                }, !params.row.tryout ? '开启试听' : '关闭试听'),
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
                      this.changeStatus(params.row)
                    }
                  }
                }, !params.row.disabled ? '禁用' : '启用'),
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)'
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
    },
    methods: {
      changeTryOut(data) {
        this.$api.course.changeTryOut({
          lessonId: data.id,
          tryout: !data.tryout
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('更改成功')
                this.getList()
              }
            })

      },
      changeStatus(data) {
        this.$api.course.changeDisabled({
          lessonId: data.id,
          disabled: !data.disabled
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('更改成功')
                this.getList()
              }
            })
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        if(data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {}
        }
      },
      openModalSort(data) {
        this.isOpenModalSort = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.sortNum = this.addInfo.sequence
      },
      openModalPlay(data) {
        this.isOpenModalPlay = true
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      closeModal() {
        this.isOpenModal = false
      },
      closeModalPlay() {
        if(this.addInfo.type == '1') {
          this.$refs.playAudio.pause()
        } else {
          this.$refs.playVideo.pause()
        }
        this.isOpenModalPlay = false
      },
      changeSelect() {
        this.tab.page = 1
        this.getList()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.course.delClassHour({
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
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.course.classHourList({
          current: this.tab.page,
          size: this.tab.pageSize,
          id: this.$route.query.courseId
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
      submitInfo(data) {
        let paramUrl = ''
        this.isSending = true
        console.log(data,'data')
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.addInfo.disabled =  this.addInfo.disabled == '1'
        this.addInfo.tryout = this.addInfo.tryout == '1'
        this.addInfo.courseId = this.$route.query.courseId

        paramUrl = this.addInfo.id ? this.$api.course.updateClassHour : this.$api.course.addClassHour
        paramUrl( this.addInfo)
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
      },
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入排序值')
        } else if (this.sortNum < 1 || this.sortNum > 99999) {
          return this.$Message.error('排序值范围1-99999')
        }
        this.$api.course.updateSortClassHour({
          id: this.addInfo.id,
          sequence: this.sortNum
        }).then(response => {
          if (response.data.code == '200') {
            this.$Message.success('修改成功');
            this.getList()
            this.isOpenModalSort = false
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-course-list {
    .-t-add-icon {
      top: 56px
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

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
