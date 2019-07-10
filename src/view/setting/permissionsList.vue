<template>
  <div class="p-permissionsList">

    <Card>
      <Row class="g-search g-t-left">
        <RadioGroup v-model="radioType" @on-change="getList" type="button">
          <Radio :label="item.id" v-for="(item,index) of systemList" :key="index">{{item.name}}</Radio>
        </RadioGroup>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal('', '',true, 0)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Row class="-t-wrap">
        <Col :span="24" class="-t-top">
          <Col :span="12">菜单名称</Col>
          <Col :span="12">操作</Col>
        </Col>
        <Col :span="24" v-for="(item1,index) of firstChild" :key="index" class="-t-item -t-border">
          <Col :span="12" class="-t-child-padding g-flex-a-j-center">
            <div @click="openArrow(item1)" class="g-cursor" v-if="item1.child.length">
              <Icon v-if="!item1.isShowChild" type="md-arrow-dropright" size="20"/>
              <Icon v-else type="md-arrow-dropdown" size="20"/>
            </div>
            <div :class="{'-t-child-m-l': !item1.child.length}">{{item1.name}}</div>
          </Col>
          <Col :span="12" class="g-text-right">
            <Button type="text" class="-t-theme-color" @click="openModal(item1, '', true, 3)">添加子菜单</Button>
            <Button type="text" class="-t-theme-color" @click="openModal(item1, '', false, 0)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item1)">删除</Button>
          </Col>

          <Col :span="24" v-show="item1.isShowChild && item1.child" v-for="(item2,index2) of item1.child"
               :key="index2" class="-t-item -t-border">
            <Col :span="12" class="-t-child-padding-two g-flex-a-j-center">
              <div :class="{'-t-child-m-l': !item2.child.length}">{{item2.name}}</div>
            </Col>
            <Col :span="12" class="g-text-right">
              <Button type="text" class="-t-theme-color" @click="openModalRole(item2)">添加权限</Button>
              <Button type="text" class="-t-theme-color" @click="openModal(item2,item1,false,1)">编辑</Button>
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
        <FormItem label="上级菜单">
          {{nowIndex.name || '根目录'}}
        </FormItem>
        <FormItem label="菜单名称" prop="name" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.name" placeholder="请输入菜单名称"></Input>
        </FormItem>
        <FormItem label="页面路径" prop="path">
          <Input type="text" v-model="addInfo.path" placeholder="请输入页面路径"></Input>
        </FormItem>
        <FormItem label="页面图标" prop="icon" v-if="!nowIndex.name">
          <Input type="text" v-model="addInfo.icon" placeholder="请输入页面路径"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <Modal
      class="p-permissionsList"
      v-model="isOpenRole"
      @on-cancel="closeModal('addInfo')"
      width="700"
      title="设置权限">
      <Form ref="addInfo" :model="addInfo" :label-width="80">
        <FormItem label="权限接口" prop="path">
          <Checkbox-group v-model="addInfo.codes" class=" -c-tab">
            <Checkbox class="-c-item" :label="item.code" v-for="(item, index) in dataList" :key="index">
              {{item.desc}} — {{item.path}}
            </Checkbox>
          </Checkbox-group>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitRole()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
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
        isOpenRole: false,
        isFetching: false,
        isSending: false,
        nowIndex: '',
        addInfo: {},
        storageInfo: [],
        dataList: [],
        systemList: [],
        radioType: 1,
      }
    },
    mounted() {
      this.getList()
      this.getRoleList()

    },
    methods: {
      getRoleList() {
        this.isFetching = true
        this.$api.admin.listBizSystem()
          .then(
            response => {
              this.systemList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getPermissionList(item) {
        this.isFetching = true
        this.$api.admin.permissionsList({
          menuId: item.id,
          system: this.radioType
        })
          .then(
            response => {
              this.dataList = response.data.resultData[0].permissions
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getList() {
        this.firstChild = []
        this.isFetching = true

        this.$api.admin.roleListMenu({
          system: this.radioType
        })
          .then(
            response => {
              response.data.resultData.forEach(item => {
                this.firstChild.push({
                  ...item,
                  isShowChild: false
                })
              });
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
      openModal(data, data1, bool, num) { //当前层级信息、第一层，true为新增，false为编辑、层级
        this.isOpenModal = true
        this.nowIndex = {
          index: num,
          name: num != 3 ? data1.name : data.name
        }

        if (!bool) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {}
        }

        if(!num) {
          this.addInfo.pid = data.id
        } else {
          this.addInfo.pid = data1.id
        }
      },
      openModalRole(item) { //当前层级信息、第一层，true为新增，false为编辑、层级
        this.isOpenRole = true
        this.addInfo = JSON.parse(JSON.stringify(item))
        this.addInfo.codes = this.addInfo.permcodes
        this.getPermissionList(item)
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
        this.isOpenRole = false
      },
      submitInfo(name) {
        if (!this.addInfo.name) {
          return this.$Message.error('请输入菜单名称')
        }
        this.isSending = true

        let param = ''

        param = this.addInfo.id ? this.$api.admin.roleUpdate : this.$api.admin.roleAdd
        param({
          id: this.addInfo.id,
          system: this.$store.state.nowAdminType,
          name: this.addInfo.name,
          type:  this.nowIndex ? 0 : 1,
          path: this.addInfo.path,
          pid: this.addInfo.pid
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
      },
      submitRole(name) {
        if (!this.addInfo.codes.length) {
          return this.$Message.error('请选择相应权限')
        }
        this.isSending = true

        this.$api.admin.updateMenuPerm({
          codes : `${this.addInfo.codes}` ,
          menuId : this.addInfo.id
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

    .-c-item{
      display: block;
    }

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
