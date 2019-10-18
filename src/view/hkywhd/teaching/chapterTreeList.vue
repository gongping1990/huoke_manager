<template>
  <div class="p-tree">
    <Row class="-t-wrap">
      <Col :span="24" class="-t-top -t-border">
        <Col :span="8">章节结构</Col>
        <Col :span="4">排序值</Col>
        <Col :span="3">状态</Col>
        <Col :span="3">是否试听</Col>
        <Col :span="6">操作</Col>
      </Col>
      <Col :span="24" class="-t-item -t-flex -t-border">
        <Col :span="8" class="-t-child-padding">
          <arrow-file :nodeData="{name:'根节点'}" :sort="1"></arrow-file>
        </Col>
        <Col :span="10"> &nbsp;</Col>
        <Col :span="6" class="g-t-left">
          <Button type="text" class="-t-theme-color" @click="openModal('',1)">添加子章节</Button>
        </Col>
      </Col>
      <Col :span="24" v-for="(item1,index) of firstChild" :key="index"
           class="-t-item -t-border ">
        <Col :span="8" class="-t-child-padding">
          <arrow-file :nodeData="item1" :sort="2" ref="arrowChild"
                      @openChildData="openNextChildTwo(item1,index)"></arrow-file>
        </Col>
        <Col :span="4" class="-t-item-text -t-theme-color">
          {{item1.sortNum}}
        </Col>
        <Col :span="3" class="-t-item-text -t-theme-color">&nbsp;</Col>
        <Col :span="3" class="-t-item-text -t-theme-color">&nbsp;</Col>
        <Col :span="6" class="g-t-left">
          <Button type="text" class="-t-theme-color" @click="openModal(item1,2,index)">添加子章节</Button>
          <Button type="text" class="-t-theme-color" @click="editModal('',item1,1)">编辑</Button>
          <Button type="text" class="-t-red-color" @click="delItem(item1.id,1)">删除</Button>
        </Col>
        <Col :span="24" v-show="item1.isShowChild" v-for="(item2,index2) of item1.lessons" :key="index2"
             class="-t-item -t-border">
          <Col :span="8" class="-t-child-padding-two">
            <arrow-file :nodeData="item2" :nodePinyin="item2.pinyin" :sort="3"></arrow-file>
          </Col>
          <Col :span="4">
            <div class="-t-child-padding-two">{{item2.sortNum}}</div>
          </Col>
          <Col :span="3">
            <Tag :color="item2.disabled ? 'default' : 'success'">{{item2.disabled ? '已禁用' : '已启用'}}</Tag>
          </Col>
          <Col :span="3">
            <Tag :color="!item2.listen ? 'default' : 'success'">{{!item2.listen ? '否' : '是'}}</Tag>
          </Col>
          <Col :span="6" class="g-t-left">
            <Button type="text" class="-t-theme-color" @click="toDetail(item1,item2)">&nbsp;&nbsp;&nbsp;&nbsp;课程内容
            </Button>
            <Button type="text" class="-t-theme-color" @click="editModal(item1,item2,2)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item2.id,2)">删除</Button>
            <Button type="text" class="-t-theme-color" @click="changeLessonStatus(item2)">{{item2.disabled ? '启用' : '禁用'}}</Button>
            <Button type="text" class="-t-theme-color" @click="changeListenStatus(item2)">{{!item2.listen ? '开启试听' : '关闭试听'}}</Button>
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
      <Form ref="addInfo" :model="addInfo" :label-width="80">
        <FormItem label="上级章节" v-if="rootNode.num=='2'">
          {{rootNode.name}}
        </FormItem>
        <FormItem label="章节名称" prop="name" class="ivu-form-item-required">
          <Input type="text" v-model="addInfo.name" placeholder="请输入章节名称" @on-blur="changePinYin"></Input>
        </FormItem>
        <FormItem label="章节拼音" v-show="rootNode.num=='2'">
          <Input type="text" v-model="pinyinInfo" placeholder="请输入章节拼音"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sort" class="ivu-form-item-required">
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
  import Loading from "@/components/loading";
  import {pattern} from '@/libs/regexp'

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
          sortNum: ''
        },
        paramsInfo: this.$route.query,
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeLessonStatus (item) {
        this.$api.hkywhdBook.changeStatus({
          id: item.id
        }).then((response)=>{
          if (response.data.code == "200") {
            this.$Message.success("操作成功");
            this.getList();
          }
        })
      },
      changeListenStatus (item) {
        this.$api.hkywhdBook.listen({
          id: item.id
        }).then((response)=>{
          if (response.data.code == "200") {
            this.$Message.success("操作成功");
            this.getList();
          }
        })
      },
      toDetail(item1, item2) {
        this.$router.push({
          name: 'courseInfo',
          query: {
            ...this.paramsInfo,
            chapterName: item1.name,
            chapterId: item1.chapterId,
            lessonName: item2.name,
            lessonId: item2.id
          }
        })
      },
      changePinYin() {
        this.pinyinInfo = pinyinUtil.getPinyin(this.addInfo.name)
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
        this.isOpenModal = true
        this.addInfo = {
          name: '',
          sortNum: '',
          pinyin: ''
        }
        this.rootNode = {
          id: data.id,
          name: data.name,
          num: num
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
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.pinyinInfo = this.addInfo.pinyin
        this.rootNode = {
          id: data.id,
          chapterId: first.id,
          name: first.name,
          num: num
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.pinyinInfo = ''
      },
      getList(num) {
        this.isFetching = true
        this.$api.hkywhdBook.treeList({
          courseId: this.paramsInfo.courseId,
          grade: this.paramsInfo.grade,
          edition: this.paramsInfo.edition,
          semester: this.paramsInfo.semester
        })
          .then(
            response => {
              this.firstChild = response.data.resultData;
              if (localStorage.chapterId) {
                if(!num) {
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
            let delInterface = num == '1' ? this.$api.hkywhdBook.delChapter({
              id: param
            }) : this.$api.hkywhdBook.delLesson({
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
        let promiseDate = ''

        if (!this.addInfo.name) {
          return this.$Message.error('请输入章节名称')
        } else if (!this.addInfo.sortNum) {
          return this.$Message.error('请输入排序值')
        } else if (!pattern.positiveInteger.exec(this.addInfo.sortNum)) {
          return this.$Message.error('排序值为正整数')
        }
        this.isSending = true
        this.addInfo.bookId = this.paramsInfo.bookId

        if (this.rootNode.num == '1') {
          promiseDate = this.addInfo.id ? this.$api.hkywhdBook.updateChapter(this.addInfo) : this.$api.hkywhdBook.addChapter(this.addInfo)
        } else {
          this.addInfo.pinyin = this.pinyinInfo
          this.addInfo.chapterId = this.addInfo.id ? this.rootNode.chapterId : this.rootNode.id
          promiseDate = this.addInfo.id ? this.$api.hkywhdBook.updateLesson(this.addInfo) : this.$api.hkywhdBook.addLesson(this.addInfo)
        }

        promiseDate
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

    .-t-item-text {
      font-weight: bold;
    }

    .-t-theme-color {
      padding: 0 10px;
      color: #5444E4;
    }
    .-t-red-color {
      padding: 0 10px;
      color: rgb(218, 55, 75);
    }
  }
</style>
