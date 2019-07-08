<template>
  <div class="p-gsw-course-list">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-gsw-course-list"
      v-model="isOpenModalPoetry"
      @on-cancel="closeModal('addInfoAdd')"
      width="700"
      :title="addInfo.name">
      <Form :model="addInfo" :label-width="70" class="ivu-form-item-required" v-if="isOpenModalPoetry">
        <Form-item label="诗词封面" class="-c-form-item ivu-form-item-required">
          <Upload
            style="display: inline-block"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="500"
            :on-success="handleSuccessCover"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传图片</Button>
          </Upload>
          <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          <div class="-c-course-wrap" v-if="addInfo.coverphoto">
            <div class="-c-course-item">
              <img :src="addInfo.coverphoto">
              <div class="-i-del" @click="addInfo.coverphoto= ''">删除</div>
            </div>
          </div>
        </Form-item>
        <FormItem label="诗词内容">
          <Editor v-model="addInfo.content"></Editor>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa" v-if="isOpenModalPoetry">
        <Button @click="closeModal('addInfoAdd')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitAdd('addInfoAdd')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <Modal
      class="p-gsw-course-list"
      v-model="isOpenModalAdd"
      @on-cancel="closeModal('addInfoAdd')"
      width="500"
      :title="addInfo.id ? '编辑诗词' : '新增诗词'">
      <Form :model="addInfo" ref="addInfoAdd" :label-width="70" :rules="ruleValidateAdd">
        <FormItem label="诗词名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入诗词名称"></Input>
        </FormItem>
        <FormItem label="作者" prop="author">
          <Input type="text" v-model="addInfo.author" placeholder="请输入作者"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sortnum">
          <InputNumber  class="g-width" :max="999" :min="0" v-model="addInfo.sortnum" placeholder="请输入排序值"></InputNumber>
        </FormItem>
      </Form>

      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfoAdd')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitAdd('addInfoAdd')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <div v-if="isOpenModalContent">
      <content-list :open="isOpenModalContent" :lessonId="lessonId"
                    @closeContentChild="closeModalContent"></content-list>
    </div>

  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Editor from "../../../components/editor";
  import ContentList from "./contentList";

  export default {
    name: 'courseList',
    components: {ContentList, Editor},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModalAdd: false,
        isOpenModalPoetry: false,
        isOpenModalContent: false,
        isSending: false,
        lessonId: '',
        addInfo: {
          content: '',
          coverphoto: '',
        },
        sortNum: '',
        ruleValidateAdd: {
          name: [
            {required: true, message: '请输入诗词名称', trigger: 'blur'},
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'},
          ],
          sortnum: [
            {required: true, type: 'number', message: '请输入排序值', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '诗词名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '作者',
            key: 'author',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '是否试听',
            render: (h, params) => {
              return h('div', params.row.isListen ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
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
                }, !params.row.isListen ? '开启试听' : '关闭试听'),
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
                      this.openModalPoetry(params.row)
                    }
                  }
                }, '诗词'),
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
                      this.openModalContent(params.row)
                    }
                  }
                }, '课时内容'),
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
        this.$api.poem.changeLessonStatus({
          lessonId: data.id,
          isListen: !data.isListen
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
        this.isOpenModalAdd = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortnum = +this.addInfo.sortnum
        } else {
          this.addInfo = {
            sortnum: null,
            content: ''
          }
        }
      },
      closeModalContent() {
        this.isOpenModalContent = !this.isOpenModalContent
      },
      openModalContent(data) {
        this.lessonId = data.id
        this.closeModalContent()
      },
      openModalPoetry(data) {
        this.addInfo.content = ''
        this.isOpenModalPoetry = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.addInfo.sortnum = +this.addInfo.sortnum
        console.log(this.addInfo, 11)
      },
      closeModal(name) {
        this.$refs[name].resetFields();
        this.isOpenModalAdd = false
        this.isOpenModalPoetry = false
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
      handleSuccessCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.coverphoto = res.resultData.url
        }
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.poem.delPoemLesson({
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
        this.$api.poem.getPoemLessonList({
          current: this.tab.page,
          size: this.tab.pageSize
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
      submitAdd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.coverphoto && this.isOpenModalPoetry) {
              return this.$Message.error('请上传封面图片')
            } else if ((!this.addInfo.content || this.addInfo.content == '<p><br></p>') && this.isOpenModalPoetry) {
              return this.$Message.error('请输入诗词内容')
            }

            let paramUrl = this.addInfo.id ? this.$api.poem.updatePoemLesson : this.$api.poem.addPoemLesson
            paramUrl(this.addInfo)
              .then(response => {
                if (response.data.code == '200') {
                  this.$Message.success('操作成功');
                  this.getList()
                  this.closeModal(name)
                  this.isOpenModalAdd = false
                }
              })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-gsw-course-list {
    .-c-tips {
      color: #39f;
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

      .-code {
        width: 100px;
        height: 100px;
      }
      .-item-audio {
        display: flex;
        align-items: center;
        width: 350px;

        .-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: #ffffff;
          background: rgba(255, 237, 116, 1);
        }
      }

      .-item-video {
        margin: 10px 0;
      }
    }

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
