<template>
  <div class="p-gsw-course-list">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="gradeType" type="button" @on-change="getList(1)">
            <Radio :label=3>三年级</Radio>
            <Radio :label=4>四年级</Radio>
            <Radio :label=5>五年级</Radio>
            <Radio :label=6>六年级</Radio>
          </Radio-group>
        </Row>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-gsw-course-list"
      v-model="isOpenModalContent"
      @on-cancel="closeModalContent()"
      width="600"
      :title="modalTitleName[modalType]">
      <Form :model="detailInfo" :label-width="70" class="ivu-form-item-required" v-if="modalType!=6">
        <FormItem label="选择教师" v-if="modalType===1">
          <Select v-model="detailInfo.teacher">
            <Option v-for="(item,index) in teacherList" :label="item.teacherName" :value="item.id"
                    :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="引导音频" v-show="modalType===2">
          <upload-audio ref="childAudio" v-model="detailInfo.guideAudio" :option="uploadAudioOption"></upload-audio>
        </FormItem>
        <FormItem label="问答题目" v-if="modalType===3">
          <choice-question ref="childOne" :type="1" @submitChoice="submitChoice"
                           :childList="choiceList"></choice-question>
        </FormItem>
        <FormItem label="检测题目" v-if="modalType===4">
          <choice-question ref="childOne" :type="2" @submitChoice="submitChoice"
                           :childList="choiceList"></choice-question>
        </FormItem>
        <FormItem label="作业名称" v-if="modalType===5">
          <Input type="text" v-model="detailInfo.homework" placeholder="请输入作业名称（字数不超过150字）" :maxlength="150"></Input>
        </FormItem>
        <FormItem label="作业要求" v-if="modalType===5">
          <Input type="textarea" :rows="4" v-model="detailInfo.homeworkClaim" placeholder="请输入作业要求（字数不超过500字）"
                 :maxlength='500'></Input>
        </FormItem>
      </Form>

      <div v-else>
        <Table class="-c-tab" :columns="columnsSource" :data="sourceList"></Table>
        <Page class="g-text-right" :total="totalSource" size="small" show-elevator :page-size="tabSource.pageSize"
              @on-change="currentChangeSource"></Page>
      </div>

      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModalContent()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitDetail('detailInfo')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <Modal
      class="p-gsw-course-list"
      v-model="isOpenModalAdd"
      @on-cancel="closeModal('addInfoAdd')"
      width="700"
      :title="addInfo.id ? '编辑课时' : '新增课时'">
      <Form :model="addInfo" ref="addInfoAdd" :label-width="120" :rules="ruleValidateAdd">
        <FormItem label="课时类型" prop="type">
          <Radio-group v-model="addInfo.type">
            <Radio :label=1 :disabled="isEdit">小班课</Radio>
            <Radio :label=2 :disabled="isEdit">素材课</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="课时名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入课时名称"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sortnum">
          <InputNumber :max="999" :min="0" v-model="addInfo.sortnum" placeholder="请输入排序值"></InputNumber>
        </FormItem>
        <Form-item label="课程封面" class="-c-form-item ivu-form-item-required">
          <upload-img v-model="addInfo.coverphoto" :option="uploadOption"></upload-img>
        </Form-item>
        <Form-item label="课程视频" class="-c-form-item ivu-form-item-required" v-show="addInfo.type === 1">
          <upload-video ref="childVideo" v-model="addInfo.videoUrl" :option="uploadVideoOption"></upload-video>
        </Form-item>
        <Form-item label="课时内容" class="-c-form-item ivu-form-item-required" v-show="addInfo.type === 2">
          <Editor v-model="addInfo.content" :uploadImgServer="baseUrl"></Editor>
        </Form-item>
      </Form>

      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfoAdd')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitAdd('addInfoAdd')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Editor from "../../../components/editor";
  import UploadImg from "../../../components/uploadImg";
  import UploadVideo from "../../../components/uploadVideo";
  import Operation from "iview/src/components/transfer/operation";
  import UploadAudio from "../../../components/uploadAudio";
  import ChoiceQuestion from "./choiceQuestion";


  export default {
    name: 'courseList',
    components: {ChoiceQuestion, UploadAudio, Operation, UploadVideo, UploadImg, Editor},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        tab: {
          page: 1,
          pageSize: 10
        },
        tabSource: {
          page: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过200kb',
          size: 200
        },
        uploadVideoOption: {
          tipText: '视频格式：mp4、wmv、rmvb、avi 视频大小：150M以内',
          size: 153600,
          format: ['mp4', 'wmv', 'rmvb', 'avi']
        },
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        modalTitleName: {
          '1': '授课教师',
          '2': '课前引导',
          '3': '课中回答',
          '4': '随堂检测',
          '5': '作业',
          '6': '素材评价',
        },
        dataList: [],
        sourceList: [],
        teacherList: [],
        choiceList: [],
        total: 0,
        totalSource: 0,
        gradeType: 3,
        isFetching: false,
        isEdit: false,
        isOpenModalAdd: false,
        isOpenModalContent: false,
        modalType: '',
        addInfo: {
          videoUrl: ''
        },
        detailInfo: {
          guideAudio: '1'
        },
        dataItem: '',
        sortNum: '',
        ruleValidateAdd: {
          name: [
            {required: true, message: '请输入课时名称', trigger: 'blur'},
          ],
          sortnum: [
            {required: true, type: 'number', message: '请输入排序值', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '课时名称',
            key: 'name',

            align: 'center'
          },
          {
            title: '类型',
            render: (h, params) => {
              return h('div', params.row.type === 1 ? '小班课' : '素材课')
            },
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '补充内容',
            align: 'center',
            width: 340,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type === 1 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalContent(params.row, 1)
                    }
                  }
                }, '授课教师'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type === 1 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalContent(params.row, 2)
                    }
                  }
                }, '课前引导'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type === 1 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalContent(params.row, 3)
                    }
                  }
                }, '课中问答'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type === 1 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalContent(params.row, 4)
                    }
                  }
                }, '随堂检测'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type === 1 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalContent(params.row, 5)
                    }
                  }
                }, '作业'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.type === 2 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalContent(params.row, 6)
                    }
                  }
                }, '素材评价')
              ])
            }
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
        ],
        columnsSource: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '评分',
            key: 'score',
            align: 'center'
          },
          {
            title: '评分时间',
            key: 'gmtCreate',
            align: 'center'
          },
        ]
      };
    },
    mounted() {
      this.getList()
      this.getTeacherList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      currentChangeSource(val) {
        this.tabSource.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModalAdd = true
        if (data) {
          this.isEdit = true
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortnum = +this.addInfo.sortnum
        } else {
          this.isEdit = false
          this.addInfo = {
            grade: this.gradeType,
            sortnum: null,
            type: 1,
            coverphoto: '',
          }
        }
      },
      closeModalContent() {
        if (this.modalType === 2) {
          setTimeout(() => {
            this.$refs.childAudio.load()
          }, 0)
        }
        this.isOpenModalContent = false
      },
      openModalContent(data, type) {
        this.isOpenModalContent = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
        this.dataItem = data
        this.modalType = type
        this.detailInfo.teacher = this.dataItem.teacherId

        switch (this.modalType) {
          case 3:
            this.getListByLessonQuestion()
            break
          case 4:
            this.getListByLessonQuestion()
            break
          case 6:
            this.getListByLessonScore()
            break
        }
      },
      closeModal(name) {
        if (this.addInfo.id && (this.addInfo.type === 1)) {
          setTimeout(() => {
            this.$refs.childVideo.load()
          }, 0)
        }
        this.$refs[name].resetFields();
        this.isOpenModalAdd = false
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.composition.removeLessonById({
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
        this.$api.composition.getQueryLessonPage({
          current: this.tab.page,
          size: this.tab.pageSize,
          grade: this.gradeType
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
      getTeacherList() {
        this.$api.composition.getTeacherList({
          current: this.tab.page,
          size: 10000
        })
          .then(
            response => {
              this.teacherList = response.data.resultData.records;
            })
      },
      getListByLessonScore() {
        this.$api.composition.listByLessonScore({
          current: this.tabSource.page,
          size: this.tabSource.pageSize,
          lessonId: this.dataItem.id
        })
          .then(
            response => {
              this.sourceList = response.data.resultData.records;
            })
      },
      getListByLessonQuestion() {
        this.$api.composition.listByLessonQuestion({
          type: this.modalType === 3 ? 1 : 2,
          lessonId: this.dataItem.id
        })
          .then(
            response => {
              this.choiceList = response.data.resultData;

              this.choiceList.forEach(list => {
                list.optionJson = JSON.parse(list.optionJson)
              })
              setTimeout(() => {
                this.$refs.childOne.init()
              }, 0)
            })
      },
      submitChoice(data) {
        this.choiceList = data || []
      },
      submitDetail() {
        switch (this.modalType) {
          case 1:
            this.submitTeacher()
            break
          case 2:
            this.submitUploadGuideAudio()
            break
          case 3:
            this.submitSaveLessonQuestion()
            break
          case 4:
            this.submitSaveLessonQuestion()
            break
          case 5:
            this.saveHomeWork()
            break

        }
      },
      submitTeacher() {
        if (!this.detailInfo.teacher) {
          return this.$Message.error('请选择教师')
        }
        this.$api.composition.updateLessonTeacher({
          lessonId: this.dataItem.id,
          teacherId: this.detailInfo.teacher
        })
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
              this.getList()
              this.closeModalContent()
              this.isOpenModalAdd = false
            }
          })
      },
      submitUploadGuideAudio() {
        if (!this.detailInfo.guideAudio) {
          return this.$Message.error('请上传引导音频')
        }
        this.$api.composition.uploadGuideAudio({
          lessonId: this.dataItem.id,
          auideAudio: this.detailInfo.guideAudio
        })
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
              this.getList()
              this.closeModalContent()
              this.isOpenModalAdd = false
            }
          })
      },
      submitSaveLessonQuestion() {
        let isCheckQuestion = true
        let isCheckOptionBool = false
        let isCheckoptionJsonLength = true
        let isCheckOptionOK = false
        let choiceDataList = []

        this.choiceList.forEach(item => {
          if (!item.answerPoint || !item.answerTime|| !item.name || !item.publishPoint) {
            isCheckQuestion = false
          }

          if (!item.optionJson.length) {
            isCheckoptionJsonLength = false
          }

          if (item.optionJson.length) {
            isCheckOptionBool = item.optionJson.some(list => {
              return list.isChecked == true
            })
            isCheckOptionOK = item.optionJson.every(list => {
              return list.value != ''
            })
          }
        })

        if (!this.choiceList.length) {
          return this.$Message.error('请新增题目')
        } else if (!isCheckQuestion) {
          return this.$Message.error('请填写完整的答题字段')
        } else if (!isCheckoptionJsonLength) {
          return this.$Message.error('请新增选项')
        } else if (!isCheckOptionBool) {
          return this.$Message.error('请选择一个正确的答案')
        } else if (!isCheckOptionOK) {
          return this.$Message.error('选择题不能有空选项')
        }

        choiceDataList = JSON.parse(JSON.stringify(this.choiceList))

        choiceDataList.forEach(item => {
          item.optionJson = JSON.stringify(item.optionJson)
        })

        this.$api.composition.saveLessonQuestion({
          lessonId: this.dataItem.id,
          questionList: choiceDataList,
          type: this.modalType === 3 ? 1 : 2
        })
          .then(response => {
            if (response.data.code == '200') {
              this.closeModalContent()
              this.$Message.success('操作成功');
            }
          })
      },
      saveHomeWork() {
        if (!this.detailInfo.homework) {
          return this.$Message.error('请输入作业名称')
        } else if (!this.detailInfo.homeworkClaim) {
          return this.$Message.error('请输入作业要求')
        }

        this.$api.composition.saveHomeWork({
          lessonId: this.dataItem.id,
          homework: this.detailInfo.homework,
          homeworkClaim: this.detailInfo.homeworkClaim
        })
          .then(response => {
            if (response.data.code == '200') {
              // this.$Message.success('操作成功');
              this.getList()
              this.closeModalContent()
              this.isOpenModalAdd = false
            }
          })
      },
      submitAdd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.coverphoto) {
              return this.$Message.error('请上传课程封面')
            } else if (this.addInfo.type === 1 && !this.addInfo.videoUrl) {
              return this.$Message.error('请上传课程视频')
            } else if (this.addInfo.type === 2 && (!this.addInfo.content || this.addInfo.content === '<p><br></p>')) {
              return this.$Message.error('请输入课时内容')
            }

            let paramUrl = this.addInfo.id ? this.$api.composition.updateLesson : this.$api.composition.saveLesson
            paramUrl({
              id: this.addInfo.id,
              grade: this.addInfo.grade,
              name: this.addInfo.name,
              sortnum: this.addInfo.sortnum,
              type: this.addInfo.type,
              videoUrl: this.addInfo.videoUrl,
              content: this.addInfo.content,
              coverphoto: this.addInfo.coverphoto
            })
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
