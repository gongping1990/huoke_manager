<template>
  <div class="p-permissionsList">

    <Card>
      <div class="g-add-btn" @click="openModal('',true, 1)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Row class="-t-wrap">
        <Col :span="24" class="-t-top">
          <Col :span="12">菜单名称</Col>
          <Col :span="12">操作</Col>
        </Col>
        <Col :span="24" v-for="(item1,index) of firstChild" :key="index" class="-t-item -t-border">
          <Col :span="12" class="-t-child-padding g-flex-a-j-center">
            <div @click="openArrow(item1)" class="g-cursor">
              <Icon v-if="!item1.isShowChild" type="md-arrow-dropright" size="20"/>
              <Icon v-else type="md-arrow-dropdown" size="20"/>
            </div>
            <div :class="{'-t-child-m-l': !item1.child.length}">{{item1.name}}</div>
          </Col>
          <Col :span="12" class="g-text-right">
            <Button type="text" class="-t-theme-color"  @click="openModal(item1,true, 2)">添加子菜单</Button>
            <Button type="text" class="-t-theme-color" @click="openModal(item1, false, 2)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item1)">删除</Button>
          </Col>

          <Col :span="24" v-show="item1.child" v-for="(item2,index2) of item1.child"
               :key="index2" class="-t-item -t-border">
            <Col :span="12" class="-t-child-padding-two g-flex-a-j-center">
              <div :class="{'-t-child-m-l': !item2.child.length}">{{item2.name}}</div>
            </Col>
            <Col :span="12" class="g-text-right">
              <Button type="text" class="-t-theme-color" @click="openModal(item2,false,3)">编辑</Button>
              <Button type="text" class="-t-red-color" @click="delItem(item2)">删除</Button>
            </Col>
          </Col>
        </Col>
        <Col :span="24" v-if="!firstChild.length" class="-t-item">暂无数据</Col>
      </Row>

    </Card>

    <Modal
      class="p-permissionsList"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      :title="addInfo.id ? '编辑菜单栏' : '新增菜单栏'">
      <Form ref="addInfo" :model="addInfo" :label-width="80">
        <FormItem label="菜单名称" prop="name" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.name" placeholder="请输入菜单名称"></Input>
        </FormItem>
        <FormItem label="页面路径" prop="path">
          <Input type="text" v-model="addInfo.path" placeholder="请输入页面路径"></Input>
        </FormItem>
        <FormItem label="类别" prop="type " class="ivu-form-item-required">
          <RadioGroup v-model="addInfo.type">
            <Radio label="0">目录</Radio>
            <Radio label="1">页面</Radio>
            <Radio label="2">按钮</Radio>
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
  import {pattern} from '@/libs/regexp'

  export default {
    name: 'treeTwo',
    data() {
      return {
        firstChild: [],
        isOpenModal: false,
        isFetching: false,
        isSending: false,
        addInfo: {},
        storageInfo: [],
        level: this.$route.query.level
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.isFetching = true

        this.$api.admin.roleListMenu({
          system: this.$store.state.nowAdminType
        })
          .then(
            response => {
              this.firstChild = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      openArrow(item) {
        item.isShowChild = !item.isShowChild
        this.storageInfo = this.firstChild
        this.$forceUpdate()
      },
      openModal(data, bool, num) { //当前层级信息、第三层级信息、第二级、第一层，true为新增，false为编辑、层级
        this.isOpenModal = true
        if (!bool) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        }
        this.$forceUpdate()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.admin.roleRemove({
              id: param.id
            })
              .then(
                response => {
                  if (response.data.code == "200") {
                    this.$Message.success("操作成功");
                    this.getList();
                  }
                })
          }
        })
      },
      closeModal() {
        this.isOpenModal = false
      },
      submitInfo(name) {
        if (!this.addInfo.name) {
          return this.$Message.error('请输入菜单名称')
        } else if (!this.addInfo.type) {
          return this.$Message.error('请选择类别')
        }
        this.isSending = true

        let param = ''

          param = this.addInfo.id ? this.$api.admin.roleAdd : this.$api.admin.roleAdd
          param({
            system: this.$store.state.nowAdminType,
            name: this.addInfo.name,
            type: this.addInfo.type,
            path: this.addInfo.path,
            pid: ''
          }).then(
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
  }
</script>

<style scoped lang="less">
  .p-permissionsList {

    .-t-add-icon {
      top: 36px;
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

    .-t-wrap {
      width: 100%;
      margin-top: 20px;
      border: 1px solid #dcdee2;

      .-t-border {
        border-top: 1px solid #dcdee2;
      }

      .-t-child-m-l {
        margin-left: 20px;
      }

      .-t-top {
        line-height: 40px;
        background-color: #f8f8f9;
        font-weight: bold;
        border-bottom: 1px solid #dcdee2;
      }

      .-t-notip {
        line-height: 48px;
      }

      .-t-flex {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
    .-t-child-padding {
      padding-left: 30px !important;
    }
    .-t-child-padding-two {
      padding-left: 50px !important;
    }
    .-t-child-padding-three {
      padding-left: 70px !important;
    }
    .-t-child-padding-four {
      padding-left: 90px !important;
    }

    .-t-item {
      line-height: 50px;
    }
    .-t-img {
      width: 24px;
      height: 18px
    }

    .-t-item-text {
      font-weight: bold;
    }

    .-t-theme-color {
      color: #5444E4;
    }
    .-t-red-color {
      color: rgb(218, 55, 75);
    }
    .-t-o-color {
      color: #ff9966;
    }
    .-t-g-color {
      color: #66d0a5
    }
  }

</style>
