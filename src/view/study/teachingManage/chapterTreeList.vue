<template>
  <div class="p-tree">
    <Row class="-t-wrap">
      <Col :span="24" class="-t-top -t-border">
        <Col :span="12">章节结构</Col>
        <Col :span="6">排序值</Col>
        <Col :span="6">操作</Col>
      </Col>
      <Col :span="24" class="-t-item -t-flex -t-border">
        <Col :span="12">
          <arrow-file nodeName="根节点" :sort="1" @openChildData="openNextChild"></arrow-file>
        </Col>
        <Col :span="6"> &nbsp;</Col>
        <Col :span="6" class="g-t-left">
          <Button type="text" class="-t-theme-color" @click="openModal('',1)">添加子章节</Button>
        </Col>
      </Col>
      <Col :span="24" v-for="(item1,index) of firstChild" :key="index" v-if="isShowNextOneChild"
           class="-t-item -t-border ">
        <Col :span="12" class="-t-child-padding">
          <arrow-file :nodeName="item1.name" :sort="2" @openChildData="openNextChildTwo(item1,index)"></arrow-file>
        </Col>
        <Col :span="6">
          {{item1.sortNum}}
        </Col>
        <Col :span="6" class="g-t-left">
          <Button type="text" class="-t-theme-color" @click="openModal(item1,2)">添加子章节</Button>
          <Button type="text" class="-t-theme-color" @click="editModal('',item1,1)">编辑</Button>
          <Button type="text" class="-t-red-color" @click="delItem(item1.id,1)">删除</Button>
        </Col>
        <Col :span="24" v-show="item1.isShowChild" v-for="(item2,index2) of item1.lessons" :key="index2"
             class="-t-item -t-border">
          <Col :span="12" class="-t-child-padding-two">
            <arrow-file :nodeName="item2.name" :sort="3"></arrow-file>
          </Col>
          <Col :span="6">
            {{item2.sortNum}}
          </Col>
          <Col :span="6" class="g-t-left">
            <Button type="text" class="-t-theme-color" style="visibility: hidden">添加子章节</Button>
            <Button type="text" class="-t-theme-color" @click="editModal(item1,item2,2)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item2.id,2)">删除</Button>
          </Col>
        </Col>
        <Col class="-t-border" :span="24" v-if="!item1.lessons.length && item1.isShowChild">暂无课时内容</Col>
      </Col>
      <Col :span="24" v-if="!firstChild.length">暂无章节内容</Col>
    </Row>

    <Modal
      class="p-tree"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      title="编辑章节">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="80">
        <FormItem label="上级章节" v-if="rootNode.num=='2'">
          {{rootNode.name}}
        </FormItem>
        <FormItem label="章节名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入章节名称"></Input>
        </FormItem>
        <FormItem label="排序值" prop="name">
          <Input type="text" v-model="addInfo.sortNum" placeholder="请输入排序值"></Input>
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
  import Loading from "../../../components/loading";
  import { pattern } from '@/libs/regexp'
  export default {
    name: 'chapterTreeList',
    components: {Loading, ArrowFile},
    data() {
      return {
        firstChild: [],
        oldList: [],
        rootNode: '',
        isFetching: false,
        isOpenModal: false,
        isShowNextOneChild: false,
        isShowNextTwoChild: false,
        isSending: false,
        addInfo: {
          name: '',
          sortNum: ''
        },
        paramsInfo: this.$route.query,
        ruleValidate: {
          name: [
            {required: true, message: '请输入章节名称', trigger: 'blur'}
          ],
          sortNum: [
            {required: true, message: '请输入排序值', trigger: 'blur'}
          ]
        },
      };
    },
    mounted() {
      this.getList()
    },
    computed: {},
    methods: {
      openNextChild(data) {
        this.isShowNextOneChild = !this.isShowNextOneChild
        this.firstChild.forEach(item => {
          item.isShowChild = false
        })
      },
      openNextChildTwo(data, index) {
        this.firstChild[index].isShowChild = !this.firstChild[index].isShowChild
        this.firstChild = Object.assign([], this.firstChild)
        this.oldList = this.firstChild
      },
      openModal(data, num) {
        this.isOpenModal = true
        this.addInfo = {
          name: '',
          sortNum: ''
        }
        this.rootNode = {
          id: data.id,
          name: data.name,
          num: num
        }
      },
      editModal(first, data, num) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.rootNode = {
          id: data.id,
          chapterId: first.id,
          name: first.name,
          num: num
        }
        console.log(this.rootNode)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      getList() {
        this.isFetching = true
        this.$api.book.treeList({
          courseId: this.paramsInfo.courseId,
          grade: this.paramsInfo.grade,
          edition: this.paramsInfo.edition,
          semester: this.paramsInfo.semester
        })
          .then(
            response => {
              this.firstChild = response.data.resultData;

              if (this.oldList.length) {
                for (let data of this.firstChild) {
                  for (let item of this.oldList) {
                    if(data.id === item.id) {
                      data.isShowChild = item.isShowChild
                    }
                  }
                }
              } else {
                this.firstChild.forEach(item => {
                  item.isShowChild = false
                })
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
            let delInterface = num == '1' ? this.$api.book.delChapter({
              id: param
            }) : this.$api.book.delLesson({
              id: param
            })
            delInterface
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

      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let promiseDate = ''

            if (!pattern.positiveInteger.exec(this.addInfo.sortNum)) {
              return this.$Message.error('排序值为正整数')
            }
            this.isSending = true
            this.addInfo.bookId = this.paramsInfo.bookId

            if (this.rootNode.num == '1') {
              promiseDate = this.addInfo.id ? this.$api.book.updateChapter(this.addInfo) : this.$api.book.addChapter(this.addInfo)
            } else {
              this.addInfo.chapterId = this.addInfo.id ? this.rootNode.chapterId : this.rootNode.id
              promiseDate = this.addInfo.id ? this.$api.book.updateLesson(this.addInfo) : this.$api.book.addLesson(this.addInfo)
            }

            promiseDate
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
  .p-tree {
    .-t-wrap {
      width: 100%;
      border: 1px solid #F5F5F5;

      .-t-border {
        border-top: 1px solid #F5F5F5;
      }

      .-t-top {
        line-height: 30px;
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

    .-t-theme-color {
      color: #5444E4;
    }
    .-t-red-color {
      color: rgb(218, 55, 75);
    }
  }
</style>
