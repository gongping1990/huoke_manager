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
      v-model="isOpenModalContent"
      @on-cancel="closeModalContent()"
      width="600"
      :title="modalTitleName[modalType]">
      <Form :model="detailInfo" :label-width="70" class="ivu-form-item-required" v-if="modalType!=6">
        <FormItem label="选择教师" v-if="modalType===1">
          <Select v-model="detailInfo.teacher" class="-search-selectOne">
            <Option v-for="(item,index) in teacherList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="引导音频" v-if="modalType===2">
          <upload-audio @successAudioUrl="successAudioUrl" :option="uploadAudioOption"></upload-audio>
        </FormItem>
        <FormItem label="问答题目" v-if="modalType===3">
          <choice-question ref="childOne" :type="1" @submitChoice="submitChoice"
                           :childList="dataItem.choiceItem"></choice-question>
        </FormItem>
        <FormItem label="检测题目" v-if="modalType===4">
          <choice-question ref="childTwo" :type="2" @submitChoice="submitChoice"
                           :childList="dataItem.choiceList"></choice-question>
        </FormItem>
        <FormItem label="作业名称" v-if="modalType===5">
          <Input type="text" v-model="detailInfo.jobName" placeholder="请输入作业名称"></Input>
        </FormItem>
        <FormItem label="作业要求" v-if="modalType===5">
          <Input type="textarea" :rows="4" v-model="detailInfo.jobRequirement" placeholder="请输入作业要求"></Input>
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
      width="500"
      :title="addInfo.id ? '编辑课时' : '新增课时'">
      <Form :model="addInfo" ref="addInfoAdd" :label-width="120" :rules="ruleValidateAdd">
        <FormItem label="课时类型" prop="contentType">
          <Radio-group v-model="addInfo.contentType">
            <Radio :label=1>小班课</Radio>
            <Radio :label=2>素材课</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="课时名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入课时名称"></Input>
        </FormItem>
        <FormItem label="排序值" prop="sortnum">
          <InputNumber :max="999" :min="0" v-model="addInfo.sortnum" placeholder="请输入排序值"></InputNumber>
        </FormItem>
        <FormItem label="答题时间点" prop="author">
          <Input type="text" v-model="addInfo.author" placeholder="请输入答题时间点(单位：秒)"></Input>
        </FormItem>
        <FormItem label="答题时长" prop="author">
          <Input type="text" v-model="addInfo.author" placeholder="请输入答题时长(单位：秒)"></Input>
        </FormItem>
        <FormItem label="答题公布时间点" prop="author">
          <Input type="text" v-model="addInfo.author" placeholder="请输入答题公布时间点(单位：秒)"></Input>
        </FormItem>
        <Form-item label="课程封面" class="-c-form-item ivu-form-item-required">
          <upload-img @successImgUrl="successImgUrl" :option="uploadOption"></upload-img>
        </Form-item>
        <Form-item label="课程视频" class="-c-form-item ivu-form-item-required">
          <upload-video @successVideoUrl="successVideoUrl" :option="uploadVideoOption"></upload-video>
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
          url: '',
          size: 200
        },
        uploadVideoOption: {
          tipText: '视频格式：mp4、wmv、rmvb、avi 视频大小：150M以内',
          url: '',
          size: 153600,
          format: ['mp4', 'wmv', 'rmvb', 'avi']
        },
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          url: '',
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
        total: 0,
        totalSource: 0,
        isFetching: false,
        isOpenModalAdd: false,
        isOpenModalContent: false,
        modalType: '',
        addInfo: {},
        detailInfo: {},
        dataItem: '',
        sortNum: '',
        ruleValidateAdd: {
          name: [
            {required: true, message: '请输入课时名称', trigger: 'blur'},
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
            title: '课时名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '类型',
            key: 'author',
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
            key: 'name',
            align: 'center'
          },
          {
            title: '评分',
            key: 'name',
            align: 'center'
          },
          {
            title: '评分时间',
            key: 'name',
            align: 'center'
          },
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      successImgUrl(url) {
        this.addInfo.coverphoto = url
        this.uploadOption.url = url
      },
      successVideoUrl(url) {
        this.addInfo.videoUrl = url
        this.uploadVideoOption.url = url
      },
      successAudioUrl(url) {
        this.addInfo.audioUrl = url
        this.uploadAudioOption.url = url
      },
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
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortnum = +this.addInfo.sortnum
          this.uploadOption.url = this.addInfo.coverphoto
        } else {
          this.uploadOption.url = null
          this.uploadVideoOption.url = null
          this.addInfo = {
            sortnum: null,
            contentType: 1,
            coverphoto: '',
          }
        }
      },
      closeModalContent() {
        console.log(121)
        this.detailInfo = {}
        this.dataItem = {
          choiceItem: [],
          choiceList: []
        }
        this.isOpenModalContent = false
      },
      openModalContent(data, type) {
        this.dataItem = data
        setTimeout(()=>{
          this.$refs.childOne.init()
        },0)

        {
          this.uploadAudioOption.url = null
          this.uploadAudioOption.url = null
        }
        this.modalType = type
        this.isOpenModalContent = true
      },
      closeModal(name) {
        this.$refs[name].resetFields();
        this.isOpenModalContent = false
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
              this.dataList[0].choiceItem = [
                {
                  name: '测试111',
                  optionList: [
                    {
                      value: '1',
                      isChecked: false,
                    },
                    {
                      value: '3',
                      isChecked: false,
                    },
                    {
                      value: '2',
                      isChecked: false,
                    }
                  ]
                }
              ]
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitChoice(data) {
        if (this.modalType === 3) {
          this.detailInfo.choiceItem = data
        } else {
          this.detailInfo.choiceList = data
        }
      },
      submitDetail() {
        console.log(this.detailInfo)
      },
      submitAdd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.coverphoto) {
              return this.$Message.error('请上传课程封面')
            } else if (!this.addInfo.videoUrl) {
              return this.$Message.error('请上传课程视频')
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
