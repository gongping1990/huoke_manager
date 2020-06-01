<template>
  <div class="p-course">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-course"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="800"
        :title="addInfo.id ? '编辑课时' : '创建课时'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110">
          <FormItem label="课时名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课时名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortNum">
            <Input type="text" v-model="addInfo.sortNum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="初始播放量">
            <Input type="text" v-model="addInfo.initialPlays" placeholder="请输入初始播放量"></Input>
          </FormItem>
          <!--<FormItem label="是否试听" prop="tryout" class="ivu-form-item-required">-->
          <!--<Radio-group v-model="addInfo.tryout">-->
          <!--<Radio :label=1>能试听</Radio>-->
          <!--<Radio :label=0>不能试听</Radio>-->
          <!--</Radio-group>-->
          <!--</FormItem>-->
          <Form-item label="课时类型" class="-c-form-item ivu-form-item-required">
            <Radio-group v-model="addInfo.type" @on-change="changeLessonType">
              <Radio :label=0>音频</Radio>
              <Radio :label=1>视频</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="上传音频" prop="audio" class="-c-form-item ivu-form-item-required" v-show="addInfo.type=== 0">
            <upload-audio ref="childChoiceAudio" v-model="addInfo.radioUrl" :option="uploadAudioOption"></upload-audio>
          </Form-item>
          <Form-item label="上传视频" prop="video" class="-c-form-item ivu-form-item-required" v-show="addInfo.type=== 1">
            <upload-video ref="childChoiceVideo" v-model="addInfo.radioUrl" :option="uploadVideoOption"></upload-video>
          </Form-item>
          <Form-item label="课时文稿" class="-c-form-item">
            <editor ref="editor" v-model="addInfo.manuscript" :uploadImgServer="baseUrl" style="width: 580px"></editor>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";
  import UploadAudio from "../../../components/uploadAudio";
  import UploadVideo from "../../../components/uploadVideo";
  import Editor from "../../../components/editor";

  export default {
    name: 'hkywhd_classHourList',
    components: {Editor, UploadVideo, UploadAudio, UploadImg, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm', 'mpeg']
        },
        uploadVideoOption: {
          tipText: '视频格式：mp4、wmv、rmvb、avi 视频大小：150M以内',
          size: 153600,
          format: ['mp4', 'wmv', 'rmvb', 'avi']
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入课时名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '课时名称长度为20字', trigger: 'blur'}
          ],
          sortNum: [
            {required: true, message: '请输入排序值', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '课时名称',
            key: 'lessonName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortNum',
            align: 'center'
          },
          {
            title: '课时类型',
            render: (h, params) => {
              return h('div', params.row.type ? '视频' : '音频')
            },
            align: 'center'
          },
          {
            title: '是否试听',
            render: (h, params) => {
              return h('div', params.row.listen ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('span', `${params.row.gmtCreate}`)
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('span', `${params.row.gmtModified}`)
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 240,
            align: 'center',
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
                }, params.row.listen ? '关闭试听' : '开启试听'),
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
      this.getList()
    },
    methods: {
      changeLessonType() {
        this.addInfo.radioUrl = ''
      },
      changeTryOut(data) {
        this.$api.hkywhdTextlesson.updatelisten({
          lessonId: data.lessonId
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('更改成功')
                this.getList()
              }
            })

      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortNum = this.addInfo.sortNum.toString()
          this.addInfo.name = this.addInfo.lessonName
        } else {
          this.addInfo = {
            lessonId: '',
            type: 0,
            manuscript: ''
          }
        }

        this.$refs.editor && this.$refs.editor.setHtml(this.addInfo.manuscript)
        this.$forceUpdate()
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.hkywhdTextlesson.pageTextLessonDetail({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          bookId: this.$route.query.tbookId,
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
          content: '确认要删除？',
          onOk: () => {
            this.$api.hkywhdTextlesson.removeTextLesson({
              lessonId: param.lessonId
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
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.radioUrl) {
              return this.$Message.error('请上传音视频')
            }

            if (this.addInfo.manuscript == '<p><br></p>') {
              this.addInfo.manuscript = ''
            }

            this.isSending = true

            let paramsData = {
              name: this.addInfo.name,
              sortNum: this.addInfo.sortNum,
              type: this.addInfo.type,
              radioUrl: this.addInfo.radioUrl,
              manuscript: this.addInfo.manuscript,
              initialPlays: this.addInfo.initialPlays,
              bookId: this.$route.query.tbookId
            }

            let paramsUrl = this.addInfo.lessonId ? this.$api.hkywhdTextlesson.updateTextLesson({
              id: this.addInfo.lessonId,
              ...paramsData
            }) : this.$api.hkywhdTextlesson.addTextLesson(paramsData)

            paramsUrl
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
  .p-course {

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
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

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
