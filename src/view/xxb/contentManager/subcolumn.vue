<template>
  <Card>
    <div class="p-tree">

      <div class="g-add-btn" @click="openModal('', '', '', '', true, 2)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Row class="-t-wrap">
        <Col :span="24" class="-t-top">
          <Col :span="8">栏目</Col>
          <Col :span="8">排序值</Col>
          <Col :span="8">栏目建设</Col>
        </Col>
        <Col :span="24" v-for="(item1,index) of firstChild" :key="index" class="-t-item -t-border">
          <Col :span="8" class="-t-child-padding g-flex-a-j-center">
            <div @click="openArrow(item1)" v-if="item1.children.length" class="g-cursor">
              <Icon v-if="!item1.isShowChild" type="md-arrow-dropright" size="20"/>
              <Icon v-else type="md-arrow-dropdown" size="20"/>
            </div>
            <div :class="{'-t-child-m-l': !item1.children.length}">{{item1.title}}</div>
          </Col>
          <Col :span="8" class="-t-item-text -t-theme-color">
            {{item1.sortNum}}
          </Col>
          <Col :span="8" class="g-t-center">
            <Button type="text" class="-t-theme-color" v-if="level==2" @click="openModal(item1, '', '', '', true, 3)">添加子栏目</Button>
            <Button type="text" class="-t-theme-color" @click="openModal(item1, '', '', '', false, 3)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item1)">删除</Button>
          </Col>

          <Col :span="24" v-show="item1.isShowChild && item1.children" v-for="(item2,index2) of item1.children"
               :key="index2" class="-t-item -t-border">
            <Col :span="8" class="-t-child-padding-two g-flex-a-j-center">
              <div @click="openArrow(item2)" v-if="item2.children.length" class="g-cursor">
                <Icon v-if="!item2.isShowChild" type="md-arrow-dropright" size="20"/>
                <Icon v-else type="md-arrow-dropdown" size="20"/>
              </div>
              <div :class="{'-t-child-m-l': !item2.children.length}">{{item2.title}}</div>
            </Col>
            <Col :span="8">
              <div class="-t-child-padding-two -t-o-color">{{item2.sortNum}}</div>
            </Col>
            <Col :span="8" class="g-text-right">
              <!--<Button type="text" class="-t-theme-color" @click="openModal(item2, item1, '', '', true,3)">添加子栏目</Button>-->
              <Button type="text" class="-t-theme-color" @click="openModal(item2, item1, '', '', false,3)">编辑</Button>
              <Button type="text" class="-t-red-color" @click="delItem(item2)">删除</Button>
            </Col>

            <!--<Col :span="24" v-show="item2.isShowChild && item2.children" v-for="(item3,index3) of item2.children"-->
            <!--:key="index3" class="-t-item -t-border">-->
            <!--<Col :span="8" class="-t-child-padding-three g-flex-a-j-center">-->
            <!--<div class="-t-child-m-l">{{item3.title}}</div>-->
            <!--</Col>-->
            <!--<Col :span="8">-->
            <!--<div class="-t-child-padding-three -t-g-color">{{item3.sortNum}}</div>-->
            <!--</Col>-->
            <!--<Col :span="8" class="g-text-right">-->
            <!--<Button type="text" class="-t-theme-color" @click="openModal(item3, item2, item1, '',false,4)">编辑</Button>-->
            <!--<Button type="text" class="-t-red-color" @click="delItem(item3)">删除</Button>-->
            <!--</Col>-->
            <!--</Col>-->
          </Col>
        </Col>
        <Col :span="24" v-if="!firstChild.length" class="-t-item">暂无数据</Col>
      </Row>

      <Modal
        class="p-tree"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="350"
        :title="addInfo.id ? '编辑栏目' : '新增栏目'">
        <Form ref="addInfo" :model="addInfo" :label-width="80">
          <FormItem label="上级栏目" v-if="!isFirstFloor">
            {{rootNode.title || '根目录'}}
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
  </Card>

</template>
<script>
  import {pattern} from '@/libs/regexp'
  import Loading from "@/components/loading";

  export default {
    name: 'xxb_subcolumn',
    components: {Loading},
    data() {
      return {
        firstChild: [],
        isOpenModal: false,
        isFetching: false,
        isSending: false,
        isFirstFloor: false,
        addInfo: {},
        storageInfo: [],
        rootNode: '',
        level: this.$route.query.level
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.isFetching = true

        this.$api.wzjh.columnList({
          subject: this.$route.query.subject,
          id:  this.$route.query.id
        })
          .then(
            response => {
              this.firstChild = response.data.resultData;
              this.storageInfo = this.$store.state.articeStorage

              for (let item1 of this.storageInfo) {
                for (let data1 of this.firstChild) {
                  if (item1.id === data1.id) {
                    data1.isShowChild = item1.isShowChild
                  }

                  if(item1.children.length) {
                    for (let item2 of item1.children) {
                      for (let data2 of data1.children) {
                        if (item2.id === data2.id) {
                          data2.isShowChild = item2.isShowChild
                        }
                      }
                    }
                  }
                }
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      openArrow(item) {
        this.$forceUpdate()
        item.isShowChild = !item.isShowChild
        this.storageInfo = this.firstChild
        this.$store.commit('changeArticeList',{
          data: this.firstChild
        })
      },
      openModal(data, data1, data2, data3, bool, num) { //当前层级信息、第三层级信息、第二级、第一层，true为新增，false为编辑、层级
        if(data && !data.isShowChild) {
          data.isShowChild = !data.isShowChild
          this.storageInfo = this.firstChild
          this.$store.commit('changeArticeList',{
            data: this.firstChild
          })
        }

        this.isOpenModal = true
        this.isFirstFloor = (data == '')
        this.rootNode = bool ? data : data1
        if (!bool) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sort = this.addInfo.sortNum
          this.addInfo.name = this.addInfo.title
        } else {
          this.addInfo = {
            type: num
          }
          switch (num) {
            case 2:
              this.addInfo.firstColumn = this.$route.query.id;
              break;
            case 3:
              this.addInfo.firstColumn = data1.id;
              this.addInfo.secondColumn = data.id;
              break;
          }
        }
        this.addInfo.subject = this.$route.query.subject
        this.$forceUpdate()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.wzjh.articleCategoryDelete({
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
          return this.$Message.error('请输入栏目名称')
        } else if (!this.addInfo.sort) {
          return this.$Message.error('请输入排序值')
        } else if (!pattern.positiveInteger.exec(this.addInfo.sort)) {
          return this.$Message.error('排序值为正整数')
        }
        this.isSending = true

        this.$api.wzjh.articleCategorySave(this.addInfo)
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
  }
</script>

<style scoped lang="less">
  .p-tree {

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
        /*margin-left: 20px;*/
        margin: 0 auto;
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
      /*padding-left: 30px !important;*/
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
