<template>
  <div class="p-learnList">
    <Card>
      <Row class="g-search">
        <Col :span="12" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">选择学科：</div>
            <RadioGroup v-model="selectInfo" @on-change="getList(1)" type="button">
              <Radio v-for="(item,index) in subjectList" :label="item.key" :key="index">{{item.name}}</Radio>
            </RadioGroup>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-learnList"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      :title="addInfo.id ? '编辑栏目' : '新增栏目'">
      <Form ref="addInfo" :model="addInfo" :label-width="80">
        <FormItem label="栏目名称" prop="name" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.name" placeholder="请输入栏目名称"></Input>
        </FormItem>
        <FormItem label="栏目介绍" prop="intro" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.intro" placeholder="请输入栏目介绍"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sort" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.sort" placeholder="请输入排序值"></Input>
        </FormItem>
        <FormItem label="下属分类" class="ivu-form-item-required">
          <RadioGroup v-model="addInfo.childLevel">
            <Radio label="0">无</Radio>
            <Radio label="1">一级</Radio>
            <Radio label="2">二级</Radio>
          </RadioGroup>
        </FormItem>
        <Form-item label="栏目图片" class="-c-form-item ivu-form-item-required">
          <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
        </Form-item>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import Editor from "@/components/editor";
  import {pattern} from '@/libs/regexp'
  import UploadImg from "../../../../components/uploadImg";

  export default {
    name: 'friendHelp',
    components: {UploadImg, Editor},
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        subjectList: [
          {
            name: '语文',
            key: '1'
          },
          {
            name: '数学',
            key: '2'
          },
          {
            name: '英语',
            key: '3'
          }
        ],
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        selectInfo: localStorage.nowRadioType || '1',
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        columns: [
          {
            title: '栏目名称',
            key: 'title',
            align: 'center'
          },
          {
            title: '栏目介绍',
            key: 'intro',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortNum',
            align: 'center'
          },
          {
            title: '栏目图片',
            render:
              (h, params) => {
                return h('img', {
                  attrs: {
                    src: params.row.img
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                  }
                })
              },
            align: 'center'
          },
          {
            title: '下属栏目',
            render: (h,params)=> {
              return h('div', params.row.childLevel == '0' ? '无' : `${params.row.childLevel}级`)
            },
            key: 'creatTime'
          },
          {
            title: '操作',
            align: 'right',
            width: 270,
            render:
              (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#5444E4',
                      display: params.row.childLevel == '0' ? 'none' : ''
                    },
                    on: {
                      click: () => {
                        this.toChild(params.row)
                      }
                    }
                  }, '子栏目管理'),
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
                        this.goJump(params.row)
                      }
                    }
                  }, '文章管理'),
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
                      color: 'rgb(218, 55, 75)',
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
      }
        ;
    },
    computed: {},
    mounted() {
      this.getList()
    },
    methods: {
      toChild(item) {
        this.$router.push({
          name: 'subColumn',
          query: {
            id: item.id,
            level: item.childLevel,
            subject: this.selectInfo
          }
        })
      },
      goJump(item1) {
        this.$router.push({
          name: 'articleManagerTwo',
          query: {
            type: '2',
            level: item1.childLevel,
            subject: this.subjectList[this.selectInfo - 1].name,
            columnId: item1.id,
            columnName: item1.title
          }
        })
        localStorage.setItem('nowRadioType', this.selectInfo)
        localStorage.setItem('columnList', JSON.stringify(item1.children))
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sort = this.addInfo.sortNum
          this.addInfo.name = this.addInfo.title
          this.addInfo.childLevel = this.addInfo.childLevel.toString()
        } else {
          this.addInfo = {
            type: '1',
            img: '',
            childLevel: '0',
            subject: this.selectInfo
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.wzjh.columnList({
          subject: this.selectInfo,
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除模板吗？',
          onOk: () => {
            this.$api.wzjh.articleCategoryDelete({
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
      submitInfo(name) {
        if (!this.addInfo.name) {
          return this.$Message.error('请输入栏目名称')
        } else if (!this.addInfo.intro) {
          return this.$Message.error('请输入栏目介绍')
        } else if (!this.addInfo.sort) {
          return this.$Message.error('请输入排序值')
        } else if (!this.addInfo.img) {
          return this.$Message.error('请上传图片')
        } else if (!pattern.positiveInteger.exec(this.addInfo.sort)) {
          return this.$Message.error('排序值为正整数')
        }
        this.isSending = true

        this.$api.wzjh.articleCategorySave({
          id: this.addInfo.id,
          type: '1',
          img: this.addInfo.img,
          name: this.addInfo.name,
          intro: this.addInfo.intro,
          sort: this.addInfo.sort,
          childLevel: this.addInfo.childLevel,
          subject: this.selectInfo
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList(1)
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
  .p-learnList {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-h-margin {
      margin-bottom: 10px;
    }

    .-p-h-img {
      img {
        width: 50%;
      }
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {

      .-c-course-item {
        display: inline-block;
        position: relative;
        background-color: #EBEBEB;
        width: 200px;
        height: 90px;
        margin: 10px 10px 10px 0;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 4px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
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
</style>
