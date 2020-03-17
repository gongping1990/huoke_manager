<template>
  <div class="p-learnList">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-flex-a-j-center">
          <Row class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text">当前选中：</div>
            <Select v-model="searchInfo.cityId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in cityList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </Row>
        </Col>
      </Row>
      <Row class="g-search g-t-left g-tab">
        <Radio-group v-model="searchInfo.subjectType" type="button" @on-change="getList()">
          <Radio :label=0>幼升小</Radio>
          <Radio :label=1>小升初</Radio>
          <Radio :label=2>中考</Radio>
          <Radio :label=3>高考</Radio>
        </Radio-group>
      </Row>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

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
        <FormItem label="排序值" prop="sort" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.sort" placeholder="请输入排序值"></Input>
        </FormItem>
        <FormItem label="下属分类" class="ivu-form-item-required">
          <RadioGroup v-model="addInfo.childLevel">
            <Radio label="0">无</Radio>
            <Radio label="1">一级</Radio>
            <!--<Radio label="2">二级</Radio>-->
          </RadioGroup>
        </FormItem>
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
  import {pattern} from '@/libs/regexp'

  export default {
    name: 'learnList',
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        cityList: [],
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        searchInfo: {
          cityId: '',
          subjectType: 0
        },
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
            title: '排序值',
            key: 'sortNum',
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
            align: 'center',
            width: 270,
            render:
              (h, params) => {
                return h('div', {
                  style: {
                    textAlign: 'right'
                  }
                }, [
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
          name: 'xxb_subcolumn',
          query: {
            id: item.id,
            level: item.childLevel,
            subject: this.selectInfo
          }
        })
      },
      goJump(item1) {
        this.$router.push({
          name: 'xxb_articleManager',
          query: {
            type: '2',
            level: item1.childLevel,
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
          content: '确认删除吗？',
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
        } else if (!this.addInfo.sort) {
          return this.$Message.error('请输入排序值')
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
    .g-add-btn {
      top: 125px;
    }
    .-search-select-text {
      min-width: 80px;
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
  }
</style>
