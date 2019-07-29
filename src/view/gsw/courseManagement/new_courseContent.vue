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
      :title="addInfo.name || '编辑'">
      <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
        <Form-item label="诗词封面" class="-c-form-item" v-show="nowType === 1">
          <upload-img v-model="addInfo.coverphoto" :option="uploadOption"></upload-img>
        </Form-item>
        <FormItem label="诗词内容" v-if="nowType === 1">
          <Editor ref="editor" v-model="addInfo.content"></Editor>
        </FormItem>
        <FormItem label="上传视频" class="ivu-form-item-required" v-show="nowType === 2">
          <upload-video ref="childVideo" v-model="detailInfo.videoUrl" :option="uploadVideoOption"></upload-video>
        </FormItem>
        <FormItem label="视频图片" class="ivu-form-item-required" v-show="nowType === 2">
          <upload-img v-model="detailInfo.videoImg" :option="uploadOption"></upload-img>
        </FormItem>
        <FormItem label="作业类型" v-if="nowType===3">
          <Radio-group v-model="detailInfo.type">
            <Radio :label=1>朗读</Radio>
            <Radio :label=2>书写</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="作业要求" v-if="nowType===3">
          <Input type="textarea" :rows="4" v-model="detailInfo.homeworkRequire" placeholder="请输入作业要求（字数不超过80字）"
                 :maxlength='80'></Input>
        </FormItem>
        <FormItem label="朗诵内容" v-if="nowType===3 && detailInfo.type === 1">
          <Editor ref="editor" v-model="detailInfo.content"></Editor>
        </FormItem>
        <FormItem v-if="nowType === 4">
          <choice-question ref="childOne" :type="2" @submitChoice="submitChoice"
                           :childList="choiceList"></choice-question>
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
      <Form :model="addInfo" ref="addInfoAdd" :label-width="70" class="ivu-form-item-required">
        <FormItem label="诗词名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入诗词名称"></Input>
        </FormItem>
        <FormItem label="作者" prop="author">
          <Input type="text" v-model="addInfo.author" placeholder="请输入作者"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sortnum">
          <InputNumber :max="999" :min="0" v-model="addInfo.sortnum" placeholder="请输入排序值"></InputNumber>
        </FormItem>
      </Form>

      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfoAdd')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitAdd('addInfoAdd')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Editor from "../../../components/editor";
  import UploadAudio from "../../../components/uploadAudio";
  import UploadVideo from "../../../components/uploadVideo";
  import UploadImg from "../../../components/uploadImg";
  import ChoiceQuestion from "../../tbzw/courseManagement/choiceQuestion";

  export default {
    name: 'courseList',
    components: {ChoiceQuestion, UploadImg, UploadVideo, UploadAudio, Editor},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        tab: {
          page: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        uploadVideoOption: {
          tipText: '视频格式：mp4、wmv、rmvb、avi 视频大小：150M以内',
          size: 153600,
          format: ['mp4', 'wmv', 'rmvb', 'avi']
        },
        dataList: [],
        choiceList: [],
        total: 0,
        isFetching: false,
        isOpenModalAdd: false,
        isOpenModalPoetry: false,
        isSending: false,
        lessonId: '',
        addInfo: {
          content: '',
          coverphoto: '',
          videoImg: '',
        },
        detailInfo: '',
        sortNum: '',
        nowType: '',
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
            width: 400,
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
                      this.openModalPoetry(params.row, 1)
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
                      this.openModalPoetry(params.row, 2)
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
                      this.openModalPoetry(params.row, 3)
                    }
                  }
                }, '作业'),
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
                      this.openModalPoetry(params.row, 4)
                    }
                  }
                }, '课后练习'),
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
      submitChoice(data) {
        this.choiceList = data || []
      },
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
        this.nowType = 4
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
      openModalPoetry(data, type) {
        this.$refs.editor && this.$refs.editor.setHtml(data.content)
        this.nowType = type
        this.addInfo.content = ''
        this.isOpenModalPoetry = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.addInfo.sortnum = +this.addInfo.sortnum
        if (type === 2 || type === 3) {
          this.getLessonContent(data.id)
        }

        if (type === 4) {
          this.getListByLessonQuestion(data)
        }
      },
      closeModal(name) {
        this.isOpenModalAdd = false
        this.isOpenModalPoetry = false
        if (this.nowType === 2) {
          setTimeout(() => {
            this.$refs.childVideo.load()
          }, 0)
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
      getListByLessonQuestion(data) {
        this.$api.poem.listQuestion({
          lessonId: data.id
        })
          .then(
            response => {
              this.choiceList = response.data.resultData;

              setTimeout(() => {
                this.$refs.childOne.init()
              }, 0)
            })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.poem.getPoemLessonList({
          type: 2,
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
      //分页查询
      getLessonContent(data) {
        this.isFetching = true
        this.$api.poem.getLessonContent({
          lessonId: data
        })
          .then(
            response => {
              this.detailInfo = response.data.resultData;
              this.detailInfo.type = this.detailInfo.type ? this.detailInfo.type : 2
              this.$refs.editor && this.$refs.editor.setHtml(this.detailInfo.content)
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitAdd(name) {
        if (!this.addInfo.name && this.isOpenModalAdd && this.nowType == '4') {
          return this.$Message.error('请输入诗词名称')
        } else if (!this.addInfo.author && this.isOpenModalAdd && this.nowType == '4') {
          return this.$Message.error('请输入作者')
        } else if (!this.addInfo.sortnum && this.isOpenModalAdd && this.nowType == '4') {
          return this.$Message.error('请输入排序值')
        } else if (!this.addInfo.coverphoto && this.isOpenModalPoetry && this.nowType == '1') {
          return this.$Message.error('请上传封面图片')
        } else if ((!this.addInfo.content || this.addInfo.content == '<p><br></p>') && this.isOpenModalPoetry && this.nowType == '1') {
          return this.$Message.error('请输入诗词内容')
        } else if (!this.detailInfo.videoUrl && this.isOpenModalPoetry && this.nowType == '2') {
          return this.$Message.error('请上传视频')
        } else if (!this.detailInfo.videoImg && this.isOpenModalPoetry && this.nowType == '2') {
          return this.$Message.error('请上传视频封面图片')
        } else if (!this.detailInfo.type && this.isOpenModalPoetry && this.nowType == '3') {
          return this.$Message.error('请选择作业类型')
        } else if (!this.detailInfo.homeworkRequire && this.isOpenModalPoetry && this.nowType == '3') {
          return this.$Message.error('请输入作业要求')
        } else if (!this.detailInfo.content && this.isOpenModalPoetry && this.nowType == '3' && this.detailInfo.type == '1') {
          return this.$Message.error('请输入朗读内容')
        }

        let paramUrl

        switch (+this.nowType) {
          case 1:
            paramUrl = this.addInfo.id ? this.$api.poem.updatePoemLesson({
              ...this.addInfo,
              type: this.addInfo.id ? '' : 2
            }) : this.$api.poem.addPoemLesson({
              ...this.addInfo,
              type: this.addInfo.id ? '' : 2
            })
            break
          case 2:
            paramUrl = this.$api.poem.editLessonContent({
              id: this.detailInfo.id,
              lessonId: this.detailInfo.lessonId,
              videoUrl: this.detailInfo.videoUrl,
              videoImg: this.detailInfo.videoImg
            })
            break
          case 3:
            paramUrl = this.$api.poem.editLessonContentByHomeWork({
              id: this.detailInfo.id,
              type: this.detailInfo.type,
              lessonId: this.detailInfo.lessonId,
              homeworkRequire: this.detailInfo.homeworkRequire,
              content: this.detailInfo.content
            })
            break
          case 4:
            paramUrl = this.$api.poem.saveQuestion(this.choiceList)
            break
        }

        paramUrl
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
              this.getList()
              this.closeModal(name)
              this.isOpenModalAdd = false
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
