<template>
  <div class="p-correctionConfig">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left p-correctionConfig-search">
          <div>
            <span>状态： {{statusType ? '启用' : '停用'}}</span>
            <Button @click="changeButtonType()" ghost type="primary" class="-btn">{{!statusType ? '启用' : '停用'}}</Button>
          </div>

          <Select v-model="addInfo.courseId" @on-change="getList(1)" class="-search-selectOne" style="width: 300px">
            <Option v-for="(item,index) in appList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </Row>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-correctionConfig"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="700"
        :title="addInfo.id ? '编辑规则' : '创建规则'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="规则名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入规则名称"></Input>
          </FormItem>
          <FormItem label="满足条件" class="ivu-form-item-required">
            <div class="p-correctionConfig-item" v-for="item of conditionList" :key="item.id">
              <Input class="-input" type="text" v-model="item.one"></Input>
              <Select class="-input" v-model="item.two">
                <Option label="<" value="1"></Option>
                <Option label="<=" value="2"></Option>
              </Select>
              <span class="-input">{{item.name}}</span>
              <Select class="-input" v-model="item.three">
                <Option label="<" value="1"></Option>
                <Option label="<=" value="2"></Option>
              </Select>
              <Input class="-input" type="text" v-model="item.four"></Input>
            </div>
          </FormItem>

          <FormItem label="点评内容" class="ivu-form-item-required">
            <div v-for="(item, index) of replyContentList" :key="index" style="margin-bottom: 10px">
              <Input type="textarea" :rows="4" v-model="item.text" placeholder="请输入点评内容" style="width: 90%"></Input>
              <span v-if="index !== 0" class="g-error g-cursor" @click="delContent(index)">删除</span>
            </div>
            <span class="-c-tips">评语内容至少填写1个，如填写多个评语，批改符合条件的作业时，将从所填评语中随机选择1个</span>
            <Button @click="addContent()" ghost type="primary" style="width: 100px;">添加评语</Button>
          </FormItem>

        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

    </Card>
  </div>
</template>

<script>
  export default {
    name: 'jsd_correctionConfig',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        operationalId: '',
        appList: [],
        conditionList: [
          {
            id: 2,
            name: '准确度',
            one: '',
            two: '',
            three: '',
            four: ''
          },
          {
            id: 1,
            name: '流畅度',
            one: '',
            two: '',
            three: '',
            four: ''
          },
          {
            id: 3,
            name: '完整度',
            one: '',
            two: '',
            three: '',
            four: ''
          },
          {
            id: 0,
            name: '平均值',
            one: '',
            two: '',
            three: '',
            four: ''
          }
        ],
        replyContentList: [
          {
            text: ''
          }
        ],
        total: 0,
        statusType: false,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入规则名称', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '规则名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '条件',
            align: 'center',
            render: (h, params) => {
              return params.row.replyRuleText.map(item => {
                return h('div', item)
              })
            }
          },
          {
            title: '点评内容',
            align: 'center',
            key: 'replyCount',
            render: (h, params) => {
              return h('div', `${params.row.replyContent.length}条`)
            }
          },
          {
            title: '操作',
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
                    color: 'rgba(218, 55, 75)',
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
      };
    },
    mounted() {
      this.listBase()
    },
    methods: {
      addContent() {
        this.replyContentList.push({
          text: ''
        })
      },
      delContent(index) {
        this.replyContentList.splice(index, 1)
      },
      openModal(data) {
        this.isOpenModal = true

        if (data) {
          this.replyContentList = []
          this.conditionList = []
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.replyContent.forEach(item => {
            this.replyContentList.push({
              text: item
            })
          })
          this.addInfo.replyRule.forEach(item => {
            let itemArray = item.split('-')
            let nameList = ['平均值', '流畅度', '准确度', '完整度']
            this.conditionList.push({
              id: itemArray[2],
              name: nameList[itemArray[2]],
              one: itemArray[0],
              two: itemArray[1],
              three: itemArray[3],
              four: itemArray[4]
            })
          })
        } else {
          this.replyContentList = [
            {
              text: ''
            }
          ]
          this.conditionList = [
            {
              id: 2,
              name: '准确度',
              one: '',
              two: '',
              three: '',
              four: ''
            },
            {
              id: 1,
              name: '流畅度',
              one: '',
              two: '',
              three: '',
              four: ''
            },
            {
              id: 3,
              name: '完整度',
              one: '',
              two: '',
              three: '',
              four: ''
            },
            {
              id: 0,
              name: '平均值',
              one: '',
              two: '',
              three: '',
              four: ''
            }
          ]
          this.addInfo = {
            id: '',
            replyContent: [],
            replyRule: [],
            courseId: this.addInfo.courseId
          }
        }
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
            this.addInfo.courseId = this.appList[0].id
            this.getList()
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.jsdJob.listRuleByPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.addInfo.courseId
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
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.jsdJob.removeRule({
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
      changeButtonType(param) {
        this.$Modal.confirm({
          title: '提示',
          content: this.statusType ? '确认要停用？' : this.dataList.length ? '确认要启用？' : '请先添加至少1条自动批改规则',
          onOk: () => {

            if (!this.dataList.length && !this.statusType) return

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
        if (this.isSending) return
        this.addInfo.replyRule = []
        this.addInfo.replyContent = []
        this.addInfo.courseId = this.appList[0].id
        this.$refs[name].validate((valid) => {
          if (valid) {
            let passCondition = this.conditionList.every((item) => {
              return (item.one !== '' && item.two !== '' && item.three !== '' && item.four !== '')
            })
            let passContent = this.replyContentList.every((item) => {
              return (item.text !== '')
            })

            if (!passCondition) {
              return this.$Message.error('请输入完整的条件')
            } else if (!passContent) {
              return this.$Message.error('请输入完整评语')
            }

            for (let item of this.conditionList) {
              this.addInfo.replyRule.push(`${item.one}-${item.two}-${item.id}-${item.three}-${item.four}`)
            }

            for (let item of this.replyContentList) {
              this.addInfo.replyContent.push(item.text)
            }

            for (let item of this.appList) {
              if (this.addInfo.courseId === item.id) {
                this.addInfo.system = item.system
              }
            }
            this.isSending = true

            this.$api.jsdJob.addOrUpdateRule({
              id: this.addInfo.id,
              name: this.addInfo.name,
              courseId: this.addInfo.courseId,
              replyContent: this.addInfo.replyContent,
              replyRule: this.addInfo.replyRule,
              system: this.addInfo.system
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
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-correctionConfig {

    &-search {
      display: flex;

      .-btn {
        width: 100px;
        margin-left: 10px;
      }
    }

    &-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .-input {
        width: 100px;
        text-align: center;
      }
    }

    .-search-selectOne {
      margin-left: 20px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tips {
      color: #39f
    }

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
