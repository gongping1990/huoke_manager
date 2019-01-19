<template>
  <Modal
    class="p-class-edit"
    v-model="isOpenModal"
    @on-cancel="closeModal('addInfo')"
    width="700"
    :title="addInfo.id ? '编辑课时' : '新增课时'">
    <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
      <FormItem label="课时名称" prop="name">
        <Input type="text" v-model="addInfo.name" placeholder="请输入课时名称"></Input>
      </FormItem>
      <FormItem label="排序值" prop="sequence">
        <InputNumber :max="999" :min="1" v-model="addInfo.sequence" placeholder="请输入排序值"></InputNumber>
      </FormItem>
      <FormItem label="初始播放量" prop="initReadNum">
        <InputNumber :max="99999" :min="1" v-model="addInfo.initReadNum" placeholder="请输入初始播放量"></InputNumber>
      </FormItem>
      <FormItem label="是否启用" prop="disabled" class="ivu-form-item-required">
        <Radio-group v-model="addInfo.disabled">
          <Radio :label=0>启用</Radio>
          <Radio :label=1>禁用</Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="是否试听" prop="tryout" class="ivu-form-item-required">
        <Radio-group v-model="addInfo.tryout">
          <Radio :label=1>能试听</Radio>
          <Radio :label=0>不能试听</Radio>
        </Radio-group>
      </FormItem>
      <Form-item label="课时类型" class="-c-form-item ivu-form-item-required">
        <Radio-group v-model="addInfo.type" @on-change="changePlayType">
          <Radio :label=1>音频</Radio>
          <Radio :label=2>视频</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="上传音视频" class="-c-form-item">
        <Upload
          style="display: inline-block"
          :action="baseUrlVa"
          :show-upload-list="false"
          :max-size="20480"
          :before-upload="beforeUpload"
          :on-success="handleSuccessPlay"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">{{addInfo.type==1 ? '上传音频' : '上传视频'}}</Button>
        </Upload>

        <span v-if="addInfo.type=='1'" class="-c-tips">音频格式：mp3、wma、arm 音频大小：20M以内</span>
        <span v-else class="-c-tips">视频格式：mp4、wmv、rmvb、avi 视频大小：20M以内</span>

        <div class="-c-course-wrap" v-if="addInfo.resUrl">
          <div class="-c-course-item -item-audio" v-if="addInfo.type == '1'">
            <Icon class="-item-icon" type="md-volume-up" size="30"/>
            <audio style="margin-left: 20px;display: flex"
                   ref="media"
                   :src="playUrl"
                   controls="controls" preload="auto"></audio>
          </div>
          <div class="-item-video" v-else>
            <video style="width: 300px"
                   ref="media"
                   :src="playUrl"
                   controls="controls" preload="auto"></video>
          </div>
        </div>
      </Form-item>
      <Form-item label="课时文稿" class="-c-form-item -c-border">
        <editor v-model="addInfo.document" style="width: 580px"></editor>
      </Form-item>
    </Form>
    <div slot="footer" class="-p-s-footer">
      <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitPwd('addInfo')" class="g-primary-btn ">确 认</div>
    </div>
    <loading v-if="isFetching"></loading>
  </Modal>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Editor from "../../../components/editor";
  import Loading from "../../../components/loading";

  export default {
    name: 'classEdit',
    components: {Loading, Editor},
    props: ['isOpen', 'dataInfo'],
    data() {
      return {
        isOpenModal: false,
        isFetching: false,
        addInfo: {},
        playUrl: '',
        audioType: ['mp3', 'wma', 'arm'],
        videoType: ['mp4', 'wmv', 'rmvb', 'avi'],
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `${getBaseUrl()}/common/uploadPrivateFile`, //私有地址 （音视频）
        ruleValidate: {
          name: [
            {required: true, message: '请输入课时名称', trigger: 'blur'},
            {type: 'string', max: 40, message: '课程名称最多40字', trigger: 'blur'}
          ],
          sequence: [
            {required: true, type: 'number', message: '请输入排序值', trigger: 'blur'}
          ],
          initReadNum: [
            {required: true, type: 'number', message: '请输入初始播放量', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      this.isOpenModal = this.isOpen
      console.log(this.dataInfo)
      if (this.dataInfo.id) {
        this.getInfo()
      } else {
        this.addInfo = {
          id: '',
          name: '',
          sequence: null,
          tryout: 0,
          disabled: 0,
          type: 1,
          initReadNum: null,
        }
      }
    },
    methods: {
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        if (this.addInfo.type == '1') {
          isPass = this.audioType.some(item => {
            return item == fileType[fileType.length - 1]
          })
        } else {
          isPass = this.videoType.some(item => {
            return item == fileType[fileType.length - 1]
          })
        }

        this.isFetching = isPass
        if (!isPass) {
          this.$Message.error('上传格式错误')
        }
        return isPass
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
      handleSuccessPlay(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.addInfo.resUrl = res.resultData.url
          this.getAvUrl(this.addInfo.resUrl)
        }
      },
      getAvUrl(data) {
        if (this.isFetching) return
        this.isFetching = true
        this.$api.common.getAVUrl({
          key: data
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('上传成功')
                this.playUrl = response.data.resultData
              }
            })
          .finally(() => {
            this.isFetching = false
          });
      },
      getInfo(data) {
        this.$api.course.classHourInfo({
          id: this.dataInfo.id
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.addInfo = response.data.resultData
                this.addInfo.initReadNum = +this.addInfo.initReadNum
                this.addInfo.sequence = +this.addInfo.sequence
                this.addInfo.disabled = this.addInfo.disabled ? 1 : 0
                this.addInfo.tryout = this.addInfo.tryout ? 1 : 0
                this.playUrl = this.addInfo.playUrl
              }
            });
      },
      changePlayType() {
        this.addInfo.resUrl = ''
        this.playUrl = ''
      },
      closeModal(name) {
        this.$emit('closeEditModal')
        this.$refs[name].resetFields();
      },
      submitPwd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.resUrl) {
              return this.$Message.error('请上传音视频文件')
            }
            this.$emit('submitChildInfo', this.addInfo)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-class-edit {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
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
  }
</style>
