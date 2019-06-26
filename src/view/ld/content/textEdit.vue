<template>
  <Modal
    class="p-teaching-edit"
    v-model="isOpenModal"
    @on-cancel="closeModal()"
    width="500"
    title="编辑课程">
    <Form ref="addInfo" :model="addInfo"  :label-width="90">
      <FormItem label="课文类别">
        <Radio-group v-model="addInfo.contentType">
          <Radio :label=1>课文</Radio>
          <Radio :label=2>音频</Radio>
          <Radio :label=3>成就</Radio>
          <Radio :label=4>课文摘要</Radio>
        </Radio-group>
      </FormItem>
      <Form-item label="课文内容" class="-c-form-item" prop="name" v-if="addInfo.contentType==1">
        <Input class="-s-width" type="textarea" :rows="6" v-model="addInfo.introduction"
               placeholder="请输入课文内容"/>
      </Form-item>
      <Form-item label="范读音频" class="-c-form-item" v-if="addInfo.contentType==2">
        <Upload
          style="display: inline-block"
          :action="baseUrlVa"
          :show-upload-list="false"
          :max-size="153600"
          :before-upload="beforeUpload"
          :on-success="handleSuccessAudio"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传音频</Button>
        </Upload>
        <div class="-c-tips">音频格式：mp3、wma、arm 音频大小：150M以内</div>
        <div class="-c-course-wrap" v-if="addInfo.vrAudio">
          <div class="-c-course-item -item-audio">
            <Icon class="-item-icon" type="md-volume-up" size="30"/>
            <audio style="margin-left: 20px;display: flex"
                   ref="media"
                   :src="playUrl"
                   controls="controls" preload="auto"></audio>
          </div>
        </div>
      </Form-item>
      <Form-item label="背景音频" class="-c-form-item" v-if="addInfo.contentType==2">
        <Upload
          style="display: inline-block"
          :action="baseUrlVa"
          :show-upload-list="false"
          :max-size="153600"
          :before-upload="beforeUpload"
          :on-success="handleSuccessAudioBg"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传音频</Button>
        </Upload>
        <div class="-c-tips">音频格式：mp3、wma、arm 音频大小：150M以内</div>
        <div class="-c-course-wrap" v-if="addInfo.bgMusic">
          <div class="-c-course-item -item-audio">
            <Icon class="-item-icon" type="md-volume-up" size="30"/>
            <audio style="margin-left: 20px;display: flex"
                   ref="media"
                   :src="playUrlBg"
                   controls="controls" preload="auto"></audio>
          </div>
        </div>
      </Form-item>
      <Form-item label="彩色图" class="-c-form-item ivu-form-item-required" v-if="addInfo.contentType==3">
        <Upload
          style="display: inline-block"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="500"
          :on-success="handleSuccessColour"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传图片</Button>
        </Upload>
        <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
        <div class="-c-course-wrap" v-if="addInfo.impAchievement">
          <div class="-c-course-item">
            <img :src="addInfo.impAchievement">
            <div class="-i-del" @click="addInfo.impAchievement= ''">删除</div>
          </div>
        </div>
      </Form-item>
      <Form-item label="黑白图" class="-c-form-item ivu-form-item-required" v-if="addInfo.contentType==3">
        <Upload
          style="display: inline-block"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="500"
          :on-success="handleSuccessBlock"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传图片</Button>
        </Upload>
        <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
        <div class="-c-course-wrap" v-if="addInfo.comAchievement">
          <div class="-c-course-item">
            <img :src="addInfo.comAchievement">
            <div class="-i-del" @click="addInfo.comAchievement= ''">删除</div>
          </div>
        </div>
      </Form-item>
      <Form-item label="课文摘要" class="-c-form-item" prop="remark" v-if="addInfo.contentType==4">
        <Input class="-s-width" type="textarea" :rows="6" v-model="addInfo.remark"
               placeholder="请输入课文摘要"/>
      </Form-item>
    </Form>
    <div slot="footer" class="-p-s-footer">
      <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitPwd()" class="g-primary-btn ">确 认</div>
    </div>
    <loading v-if="isFetching"></loading>
  </Modal>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "../../../components/loading";

  export default {
    name: 'textEdit',
    components: {Loading},
    props: ['isOpen', 'info'],
    data() {
      return {
        isOpenModal: false,
        isFetching: false,
        addInfo: {},
        coverImgUrl: '',
        playUrl: '',
        playUrlBg: '',
        audioType: ['mp3', 'wma', 'arm'],
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `http://hkupload.prod.k12.vip/sch/common/uploadPrivateFile`, //私有地址 （音视频）
      }
    },
    computed: {
      dataInfo() {
        return this.info
      }
    },
    mounted() {
      this.isOpenModal = this.isOpen
      this.playUrl = this.dataInfo.authorVrAudio
      this.playUrlBg = this.dataInfo.authorBgMusic
      this.addInfo = {
        contentType: 1,
        impAchievement: this.dataInfo.impAchievement,
        comAchievement: this.dataInfo.comAchievement,
        vrAudio: this.dataInfo.vrAudio,
        bgMusic: this.dataInfo.bgMusic,
        introduction: this.dataInfo.introduction,
        id: this.dataInfo.id,
        remark: this.dataInfo.remark,
      }
    },
    methods: {
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        isPass = this.audioType.some(item => {
          return item == fileType[fileType.length - 1]
        })

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
      handleSuccessColour(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.impAchievement = res.resultData.url
        }
      },
      handleSuccessBlock(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.comAchievement = res.resultData.url
        }
      },
      handleSuccessAudio(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.addInfo.vrAudio = res.resultData.url
          this.addInfo.duration = res.resultData.duration
          this.getAvUrl(this.addInfo.vrAudio)
        }
      },
      handleSuccessAudioBg(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.addInfo.bgMusic = res.resultData.url
          this.addInfo.duration = res.resultData.duration
          this.getBgUrl(this.addInfo.bgMusic)
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
      getBgUrl(data) {
        if (this.isFetching) return
        this.isFetching = true
        this.$api.common.getAVUrl({
          key: data
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('上传成功')
                this.playUrlBg = response.data.resultData
              }
            })
          .finally(() => {
            this.isFetching = false
          });
      },
      closeModal(name) {
        this.$emit('closeEditModal')
      },
      submitPwd(name) {
        this.$api.ldCourse.ldUpdateContentCourse({
          id: this.addInfo.id,
          introduction: this.addInfo.introduction,
          vrAudio: this.addInfo.vrAudio,
          bgMusic: this.addInfo.bgMusic,
          comAchievement: this.addInfo.comAchievement,
          impAchievement: this.addInfo.impAchievement,
          remark: this.addInfo.remark
        }).then(res=>{
          if(res.data.code == '200') {
            this.$Message.success('课程更新成功')
            this.$emit('closeEditModal')
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-teaching-edit {
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
