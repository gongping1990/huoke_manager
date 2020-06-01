<template>
  <div class="p-teacherList">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="teacherType" type="button" @on-change="getCourseList()">
          <Radio :label=0>授课教师</Radio>
          <Radio :label=1>正式课助教老师</Radio>
          <Radio :label=2>体验课销售老师</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab" v-if="teacherType !== 0">
        <Col :span="24" class="g-flex-a-j-center">
          <Row class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="courseType" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </Row>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" :class="{'p-teacherList-top': teacherType !== 0}" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="teacherType ? columnsTwo : columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-teacherList"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      :title="addInfo.id ? '编辑教师' : '创建教师'">
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="教师头像" prop="name" class="-p-v-content">
          <div class="g-flex-j-sa -p-v-top">
            <div class="-p-upload">
              <Upload
                :action="baseUrl"
                :show-upload-list="false"
                :before-upload=" beforeUpload"
                :max-size="100"
                :on-success="handleSuccess"
                :on-exceeded-size="handleSize"
                :on-error="handleErr">
                <div class="-p-upload-img"
                     :style="{backgroundImage: 'url('+addInfo.headImage+')',backgroundRepeat:'no-repeat', backgroundSize: 'cover'}">
                  <Icon size="30" type="ios-camera"/>
                </div>
              </Upload>
            </div>
            <div class="-p-text">
              <div class="-p-v-text" :class="{'g-success': textType=='2','g-error': textType=='3'}">
                {{textStatus[textType]}}
                <Icon size="18" v-if="textType=='2'" type="ios-checkmark-circle"/>
                <Icon size="18" v-if="textType=='3'" type="ios-close-circle"/>
              </div>
              <div class="-p-v-tip">上传仅支持jpg、png格式，大小不超过100k</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="教师名称" prop="teacherName">
          <Input type="text" v-model="addInfo.teacherName" placeholder="请输入教师名称"></Input>
        </FormItem>
        <FormItem label="随堂音频" prop="introduce" v-show="teacherType === 0">
          <upload-audio ref="childAudio" v-model="addInfo.voiceUrl" :option="uploadAudioOption"></upload-audio>
        </FormItem>
        <FormItem label="教师微信号" prop="wxno" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.wxno" placeholder="请输入微信号"></Input>
        </FormItem>
        <FormItem label="教师二维码" class="ivu-form-item-required" v-show="teacherType !== 0">
          <upload-img v-model="addInfo.ercode" :option="uploadOption"></upload-img>
        </FormItem>
        <FormItem label="所属课程" v-show="teacherType !== 0">
          <Select v-model="addInfo.courseId" @on-open-change="changeCourseList">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="卡片标题" prop="cardTitle" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.cardTitle" placeholder="请输入卡片标题"></Input>
        </FormItem>
        <FormItem label="卡片图片" class="ivu-form-item-required" v-show="teacherType !== 0">
          <upload-img v-model="addInfo.cardImg" :option="uploadOption"></upload-img>
        </FormItem>
        <FormItem label="回复链接" prop="replyHref" v-show="teacherType !== 0">
          {{addInfo.replyHref || '暂无'}}
          <div class="-c-tips">此链接为用户在小程序内添加老师时，客服消息发送给用户的链接，无需填写，老师添加成功后自动生成</div>
        </FormItem>
        <FormItem label="链接大标题" prop="hrefMainTitle" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.hrefMainTitle" placeholder="请输入链接大标题"></Input>
        </FormItem>
        <FormItem label="链接小标题" prop="hrefSubTitle" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.hrefSubTitle" placeholder="请输入链接小标题"></Input>
        </FormItem>
        <FormItem label="链接配图" class="ivu-form-item-required" v-show="teacherType !== 0">
          <upload-img v-model="addInfo.hrefImg" :option="uploadOption"></upload-img>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <Modal
      class="p-teacherList"
      v-model="isOpenModalPlay"
      @on-cancel="closeModalPlay"
      footer-hide
      width="350"
      title="播放">
      <audio ref="playAudio" :src="addInfo.authVoiceUrl" controls></audio>
    </Modal>

    <Modal
      class="p-teacherList"
      v-model="isOpenModalConfirm"
      @on-cancel="isOpenModalConfirm = false"
      width="500"
      title="提示">
      <div class="p-teacherList-title -c-tips">{{confirmTitle[nowStatus]}}</div>
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="关系处理" prop="teacherName" v-show="nowStatus===1">
          <Radio-group v-model="relationshipType">
            <Radio :label=1>移交给其他老师</Radio>
            <Radio :label=2>保持老师学生的关系</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="教师名称" v-show="relationshipType === 1">
          <Select v-model="addInfo.teacherId">
            <Option v-for="(item,index) in formatTeacherList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="isOpenModalConfirm = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitOtherTeacher()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

    <subscription-message-template v-model="isOpenMessage" :dataItem="dataItem" :type="1"></subscription-message-template>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";
  import UploadImg from "../../../components/uploadImg";
  import SubscriptionMessageTemplate from "../../../components/subscriptionMessageTemplate";

  export default {
    name: "teacherList",
    components: {SubscriptionMessageTemplate, UploadImg, UploadAudio},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        isOpenModal: false,
        isOpenModalPlay: false,
        isOpenModalConfirm: false,
        isOpenMessage: false,
        isFetching: false,
        dataItem: '',
        dataList: [],
        courseList: [],
        formatTeacherList: [],
        addInfo: {},
        nowStatus: '',
        relationshipType: 1,
        total: 0,
        teacherType: 0,
        courseType: 0,
        textType: '0',
        textStatus: ['上传用户对象', '更换头像', '上传成功', '上传失败'],
        confirmTitle: {
          '1': '禁用该老师后，新学生将无法再添加老师的微信，老师的旧学生将如何处理？',
          '2': '删除该老师后，新学生将无法再添加老师的微信，请将老师的旧学生移交给其他老师!',
          '3': '你正在更改老师的所属课程，更改前请将老师的旧学生移交给其他老师!',
        },
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm', 'mpeg']
        },
        columns: [
          {
            title: '用户头像/名称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headImage
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.teacherName)
              ])
            }
          },
          {
            title: '随堂音频',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalPlay(params.row)
                  }
                }
              }, '播放音频')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
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
        ],
        columnsTwo: [
          {
            title: '用户头像/名称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.avatar
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.name)
              ])
            }
          },
          {
            title: '二维码',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.ercode
                },
                style: {
                  width: '36px',
                  height: '36px',
                  margin: '10px'
                }
              })
            },
            align: 'center'
          },
          {
            title: '微信号',
            key: 'wxno',
            align: 'center'
          },
          {
            title: '所属课程',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '绑定学生',
            key: 'students',
            align: 'center'
          },
          {
            title: '当前状态',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.disabled ? 'default' : 'success'
                }
              }, params.row.disabled ? '已禁用' : '已启用')
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: this.teacherType === 2 ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openMessage(params.row)
                    }
                  }
                }, '订阅消息'),
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
                      this.openConfirm(params.row, 1)
                    }
                  }
                }, params.row.disabled ? '启用' : '禁用'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
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
                      this.openConfirm(params.row, 2)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
      }
    },
    watch : {
      isOpenMessage (_n) {
        !_n && this.getList()
        console.log(111)
      }
    },
    mounted() {
      this.getCourseList()
    },
    methods: {
      openMessage (data) {
        this.dataItem = data
        this.isOpenMessage = true
      },
      changeCourseList(bool) {
        if (this.addInfo.id && bool && this.addInfo.students != 0) {
          this.openConfirm('', 3)
        }
      },
      openConfirm(data, num) {
        this.nowStatus = num
        this.relationshipType = 1
        this.formatTeacherList = []
        this.dataList.forEach(item => {
          if ((item.id !== (data.id || this.addInfo.id)) && !item.disabled) {
            this.formatTeacherList.push(item)
          }
        })
        if (this.nowStatus !== 3) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        }

        if (data.students != '0' && !data.disabled) {
          this.isOpenModalConfirm = true
        } else {
          this.delItemTwo(data)
        }
      },
      openModal(data) {
        this.isOpenModal = true
        this.formatTeacherList = []
        if (data) {
          this.textType = '1'
          this.addInfo = JSON.parse(JSON.stringify(data))
          if (this.teacherType !== 0) {
            this.addInfo.headImage = this.addInfo.avatar
            this.addInfo.teacherName = this.addInfo.name
            this.dataList.forEach(item => {
              if ((item.id !== this.addInfo.id) && !item.disabled) {
                this.formatTeacherList.push(item)
              }
            })
          }
        } else {
          this.textType = '0'
          this.addInfo = {}
          if (this.teacherType !== 0) {
            this.addInfo.courseId = this.courseType
          }
        }
      },
      closeModal() {
        if (this.addInfo.id) {
          setTimeout(() => {
            this.$refs.childAudio.loadAuido()
          }, 0)
        }
        this.isOpenModal = false
      },
      openModalPlay(data) {
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.isOpenModalPlay = true
      },
      closeModalPlay() {
        this.$refs.playAudio.load()
        this.isOpenModalPlay = false
      },
      submitInfo() {
        if (!this.addInfo.headImage) {
          return this.$Message.error('请上传头像')
        } else if (!this.addInfo.teacherName) {
          return this.$Message.error('请输入教师名称')
        } else if (!this.addInfo.voiceUrl && this.teacherType === 0) {
          return this.$Message.error('请输入随堂检测音频')
        } else if (!this.addInfo.wxno && this.teacherType !== 0) {
          return this.$Message.error('请输入微信号')
        } else if (!this.addInfo.ercode && this.teacherType !== 0) {
          return this.$Message.error('请上传教师二维码')
        } else if (!this.addInfo.courseId && this.teacherType !== 0) {
          return this.$Message.error('请选择所属课程')
        } else if (!this.addInfo.cardTitle && this.teacherType !== 0) {
          return this.$Message.error('请输入卡片标题')
        } else if (!this.addInfo.cardImg && this.teacherType !== 0) {
          return this.$Message.error('请上传卡片图片')
        } else if (!this.addInfo.hrefMainTitle && this.teacherType !== 0) {
          return this.$Message.error('请输入链接大标题')
        } else if (!this.addInfo.hrefSubTitle && this.teacherType !== 0) {
          return this.$Message.error('请输入链接小标题')
        } else if (!this.addInfo.hrefImg && this.teacherType !== 0) {
          return this.$Message.error('请上传链接配图')
        }

        let paramUrl = ''
        let paramData = {
          headImage: this.addInfo.headImage,
          teacherName: this.addInfo.teacherName,
          voiceUrl: this.addInfo.voiceUrl
        }
        let paramDataTwo = {
          avatar: this.addInfo.headImage,
          name: this.addInfo.teacherName,
          wxno: this.addInfo.wxno,
          ercode: this.addInfo.ercode,
          courseId: this.addInfo.courseId,
          cardTitle: this.addInfo.cardTitle,
          cardImg: this.addInfo.cardImg,
          replyHref: this.addInfo.replyHref,
          hrefMainTitle: this.addInfo.hrefMainTitle,
          hrefSubTitle: this.addInfo.hrefSubTitle,
          hrefImg: this.addInfo.hrefImg,
        }

        if (this.teacherType === 0) {
          paramUrl = this.addInfo.id ? this.$api.composition.updateTeacher({
            id: this.addInfo.id,
            ...paramData
          }) : this.$api.composition.saveTeacher(paramData)
        } else {
          paramUrl = this.addInfo.id ? this.$api.jsdKfteacher.edit({
            id: this.addInfo.id,
            ...paramDataTwo
          }) : this.$api.jsdKfteacher.add(paramDataTwo)
        }

        paramUrl
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
              this.getList()
              this.closeModal()
              this.isOpenModal = false
            }
          })
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getCourseList() {
        this.$api.tbzwCourse.courseQueryPage({
          current: 1,
          size: 1000,
          type: this.teacherType ? this.teacherType : ''
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
              this.courseType = this.courseList.length && this.courseList[0].id
              this.getList()
            })
      },
      //分页查询
      getList() {
        this.isFetching = true
        let paramsUrl = this.teacherType === 0 ?
          this.$api.composition.getTeacherList({
            current: this.tab.page,
            size: this.tab.pageSize
          }) : this.$api.jsdKfteacher.list({
            courseId: this.courseType
          })

        paramsUrl.then(
          response => {
            if (this.teacherType === 0) {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            } else {
              this.dataList = response.data.resultData
            }
          })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.composition.removeTeacherById({
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
      delItemTwo(param) {
        this.$Modal.confirm({
          title: '提示',
          content: this.nowStatus === 1 ? `确认要${param.disabled ? '启用' : '禁用'}该老师吗？` : '确认要删除该老师吗？',
          onOk: () => {
            this.changeUrlFn(param)
          }
        })
      },
      changeUrlFn(param) {
        let paramsUrl = ''

        if (this.nowStatus === 1) {
          paramsUrl = param.disabled ? this.$api.jsdKfteacher.enable({
            id: param.id
          }) : this.$api.jsdKfteacher.disabled({
            id: param.id,
            teacherId: this.addInfo.teacherId
          })
        } else if (this.nowStatus === 2) {
          paramsUrl = this.$api.jsdKfteacher.remove({
            id: param.id,
            teacherId: this.addInfo.teacherId
          })
        }
        paramsUrl.then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      submitOtherTeacher() {
        if (!this.addInfo.teacherId && this.relationshipType === 1) {
          return this.$Message.error('请选择需要转交的老师')
        }
        if (this.nowStatus === 3) {
          this.$api.jsdKfteacher.moveToTeacher({
            courseId: this.addInfo.courseId,
            srcTeacher: this.addInfo.id,
            targetTeacher: this.addInfo.teacherId
          }).then(
            response => {
              if (response.data.code == "200") {
                this.$Message.success("操作成功");
                this.getList()
                this.addInfo.students = 0
                this.addInfo.teacherId = ''
              }
            })
        } else {
          this.changeUrlFn(this.addInfo)
        }
        this.isOpenModalConfirm = false
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']

        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.textType = '2'
          this.addInfo.headImage = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.textType = '3'
        this.$Message.error('上传失败，请重新上传')
      },
    }
  }
</script>

<style scoped lang="less">
  .p-teacherList {

    &-title {
      font-size: 18px;
      width: 90%;
      margin: 16px auto;
    }

    &-top {
      top: 115px;
    }

    .-p-v-content {

      .-p-v-top {
        padding: 20px 0;
        align-items: center;
      }

      .-p-upload {

        &-img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #ebebeb;
          border: 1px solid #d9dadb;
          color: rgba(179, 181, 184, 1);
          cursor: pointer;
        }

        &-img:hover {
          color: #5444E4;
        }
      }

      .-p-text {
        margin-left: 20px;

        .-p-v-text {
          font-size: 15px;
        }
      }
      .-p-v-tip {
        color: rgba(179, 181, 184, 1);
      }
    }

    .-p-v-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
      text-align: left;
    }
    .-c-tips {
      color: #39f
    }

  }
</style>
