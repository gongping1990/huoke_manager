<template>
  <div class="p-tree">
    <div class="g-add-btn -t-add-icon" @click="openModal('',1)">
      <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
    </div>

    <Row class="-t-wrap">
      <Col :span="24" class="-t-top">
        <Col :span="8">栏目</Col>
        <Col :span="6">排序值</Col>
        <Col :span="6">栏目建设</Col>
        <Col :span="4">内容建设</Col>
      </Col>
      <Col :span="24" v-for="(item1,index) of firstChild" :key="index"
           class="-t-item -t-border ">
        <Col :span="8" class="-t-child-padding">
          <arrow-file :nodeData="item1" :sort="2" ref="arrowChild"
                      @openChildData="openNextChildTwo(item1,index)"></arrow-file>
        </Col>
        <Col :span="6" class="-t-item-text -t-theme-color">
          {{item1.sortNum}}
        </Col>
        <Col :span="6" class="g-text-right">
          <Button type="text" class="-t-theme-color" @click="openModal(item1,2,index)">添加子栏目</Button>
          <Button type="text" class="-t-theme-color" @click="editModal('',item1,1)">编辑</Button>
          <Button type="text" class="-t-red-color" @click="delItem(item1.id,1)">删除</Button>
        </Col>
        <Col :span="4">
          <Button type="text" class="-t-theme-color" @click="goJump(item1)">文章管理</Button>
        </Col>
        <Col :span="24" v-show="item1.isShowChild" v-for="(item2,index2) of item1.children" :key="index2"
             class="-t-item -t-border">
          <Col :span="8" class="-t-child-padding-two">
            <arrow-file :nodeData="item2" :nodePinyin="item2.pinyin" :sort="3"></arrow-file>
          </Col>
          <Col :span="6">
            <div class="-t-child-padding-two">{{item2.sortNum}}</div>
          </Col>
          <Col :span="6" class="g-text-right">
            <Button type="text" class="-t-theme-color" @click="editModal(item1,item2,2)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item2.id,2)">删除</Button>
          </Col>
          <Col :span="4"></Col>
        </Col>
        <Col class="-t-border" :span="24" v-if="!item1.children.length && item1.isShowChild">暂无内容</Col>
      </Col>
      <Col :span="24" class="-t-notip" v-if="!firstChild.length">暂无栏目内容</Col>
    </Row>

    <Modal
      class="p-tree"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      :title="addInfo.id ? '编辑栏目' : '新增栏目'">
      <Form ref="addInfo" :model="addInfo" :label-width="80">
        <FormItem label="上级栏目" v-if="rootNode.num=='2'">
          {{rootNode.name}}
        </FormItem>
        <FormItem label="栏目名称" prop="name" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.name" placeholder="请输入栏目名称"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sort" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.sort" placeholder="请输入排序值"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import ArrowFile from "@/components/tree/arrowFileTemplate";
  import Loading from "@/components/loading";
  import {pattern} from '@/libs/regexp'
  import {getTagNavListFromLocalstorage} from "@/libs/util";

  export default {
    name: 'chapterTreeList',
    components: {Loading, ArrowFile},
    data() {
      return {
        firstChild: [],
        storageList: [],
        oldList: [],
        rootNode: '',
        isFetching: false,
        isOpenModal: false,
        isShowNextTwoChild: false,
        isSending: false,
        pinyinInfo: '',
        addInfo: {
          name: '',
          sort: ''
        },
        paramsInfo: this.$route.query,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      goJump (item1) {
        this.$router.push({
          name: 'articleManager',
          query: {
            ...this.paramsInfo,
            columnId: item1.id,
            columnName: item1.title,
            type: '1',
          }
        })
        localStorage.setItem('columnList', JSON.stringify(item1.children))
      },
      openNextChildTwo(data, index) {
        this.storageList = []
        this.firstChild[index].isShowChild = !this.firstChild[index].isShowChild
        this.firstChild = Object.assign([], this.firstChild)
        localStorage.setItem('chapterId', data.id)
        this.firstChild.forEach(item => {
          if (item.isShowChild) {
            this.storageList.push(item)
          }
        })
      },
      openModal(data, num, index) {
        let _self = this
        this.rootNode = {
          id: data.id,
          name: data.title,
          num: num
        }
        this.isOpenModal = true
        this.addInfo = {
          materialId: this.paramsInfo.teachingId,
          subject: this.paramsInfo.subjectId,
          type: num,
          name: '',
          sort: '',
        }
        if(data) {
          this.addInfo.firstColumn = data.id
        }

        if (num == '2' && !data.isShowChild) {
          setTimeout(() => {
            console.log(_self.$refs.arrowChild)
            _self.$refs.arrowChild[index].openNextChild()
          }, 0)
        }
      },
      editModal(first, data, num) {
        this.isOpenModal = true
        this.rootNode = {
          id: first.id,
          name: first.title,
          num: num
        }

        let item = JSON.parse(JSON.stringify(data))
        this.addInfo.materialId = item.materialId
        this.addInfo.subject = this.paramsInfo.subjectId
        this.addInfo.sort = item.sortNum
        this.addInfo.name = item.title
        this.addInfo.type = item.type
        this.addInfo.id = item.id
      },
      closeModal(name) {
        this.isOpenModal = false
      },
      getList(num) {
        this.isFetching = true
        this.$api.category.columnList({
          materialId: this.paramsInfo.teachingId,
        })
          .then(
            response => {
              this.firstChild = response.data.resultData;
              if (localStorage.chapterId) {
                if (!num) {
                  for (let data of this.firstChild) {
                    if (data.id == localStorage.chapterId) {
                      data.isShowChild = true
                    } else {
                      data.isShowChild = false
                    }
                  }
                }

                for (let data of this.storageList) {
                  for (let item of this.firstChild) {
                    if (data.id == item.id) {
                      item.isShowChild = true
                    }
                  }
                }
              } else {
                for (let data of this.storageList) {
                  for (let item of this.firstChild) {
                    if (data.id == item.id) {
                      item.isShowChild = true
                    }
                  }
                }
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param, num) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.category.delColumn({
              id: param
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
        let promiseDate = ''

        if (!this.addInfo.name) {
          return this.$Message.error('请输入栏目名称')
        } else if (!this.addInfo.sort) {
          return this.$Message.error('请输入排序值')
        } else if (!pattern.positiveInteger.exec(this.addInfo.sort)) {
          return this.$Message.error('排序值为正整数')
        }
        this.isSending = true

        this.$api.category.editColumn(this.addInfo)
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
  .p-tree {
    .-t-add-icon {
      top: 55px;
    }
    .-t-wrap {
      width: 100%;
      margin-top: 54px;
      border: 1px solid #dcdee2;

      .-t-border {
        border-top: 1px solid #dcdee2;
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
      padding-left: 20px !important;
    }

    .-t-child-padding-two {
      padding-left: 60px !important;
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
  }
</style>
