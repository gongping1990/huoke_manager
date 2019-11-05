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

      <Row class="g-search -c-tab">
        <Col :span="24" class="g-flex-a-j-center">
          <Row class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="courseType" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </Row>
        </Col>
      </Row>

      <div class="g-add-btn" @click="openModal()">
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
        <FormItem label="教师微信号" prop="teacherName" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.teacherName" placeholder="请输入微信号"></Input>
        </FormItem>
        <FormItem label="教师二维码" class="ivu-form-item-required" v-show="teacherType !== 0">
          <upload-img v-model="addInfo.cardimgurl" :option="uploadOption"></upload-img>
        </FormItem>
        <FormItem label="所属课程" prop="teacherName" v-show="teacherType !== 0">
          <Select v-model="courseType" @on-change="changeCourseList">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="卡片标题" prop="cardtitle" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.cardtitle" placeholder="请输入卡片标题"></Input>
        </FormItem>
        <FormItem label="卡片图片" class="ivu-form-item-required" v-show="teacherType !== 0">
          <upload-img v-model="addInfo.cardimgurl" :option="uploadOption"></upload-img>
        </FormItem>
        <FormItem label="回复链接" prop="href" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.href" placeholder="请输入回复链接"></Input>
        </FormItem>
        <FormItem label="链接大标题" prop="bigtitle" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.bigtitle" placeholder="请输入链接大标题"></Input>
        </FormItem>
        <FormItem label="链接小标题" prop="smalltitle" v-show="teacherType !== 0">
          <Input type="text" v-model="addInfo.smalltitle" placeholder="请输入链接小标题"></Input>
        </FormItem>
        <FormItem label="链接配图" class="ivu-form-item-required" v-show="teacherType !== 0">
          <upload-img v-model="addInfo.imgurl" :option="uploadOption"></upload-img>
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
      <audio ref="playAudio" :src="addInfo.authVoiceUrl"  controls></audio>
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
        <FormItem label="教师名称" prop="teacherName" v-show="relationshipType === 1">
          <Select v-model="courseType">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="isOpenModalConfirm = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: "teacherList",
    components: {UploadImg, UploadAudio},
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
        isFetching: false,
        dataList: [],
        courseList: [],
        addInfo: {},
        nowStatus:'',
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
          format: ['mp3', 'wma', 'arm']
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
            title: '二维码',
            render: (h,params)=>{
              return h('img',{
                attrs: {
                  src: params.row.headImage
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
            key: 'phone',
            align: 'center'
          },
          {
            title: '所属课程',
            key: 'phone',
            align: 'center'
          },
          {
            title: '绑定学生',
            key: 'phone',
            align: 'center'
          },
          {
            title: '当前状态',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.desabled ? 'default' : 'success'
                }
              }, params.row.desabled ? '已禁用' : '已启用')
            }
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openConfirm(params.row,1)
                    }
                  }
                }, params.row.desabled ? '启用' : '禁用'),
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
                      this.openConfirm(params.row,2)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
      }
    },
    mounted () {
      this.getCourseList()
    },
    methods: {
      changeCourseList () {
        this.openConfirm('', 3)
      },
      openConfirm (data, num) {
        this.nowStatus = num
        this.isOpenModalConfirm = true
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.textType = '1'
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.textType = '0'
          this.addInfo = {}
        }
      },
      closeModal() {
        if(this.addInfo.id) {
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
        } else if (!this.addInfo.teacherName ) {
          return this.$Message.error('请输入教师名称')
        } else if (!this.addInfo.voiceUrl ) {
          return this.$Message.error('请输入随堂检测音频')
        }
        let paramUrl = this.addInfo.id ? this.$api.composition.updateTeacher : this.$api.composition.saveTeacher
        paramUrl(this.addInfo)
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
        this.$api.composition.getTeacherList({
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
          content: '删除该老师后，新学生将无法再添加老师的微信。请将老师的旧学生移交给其他老师!',
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

    .g-add-btn {
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
  }
</style>
