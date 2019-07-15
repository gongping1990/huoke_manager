<template>
  <Modal
    class="p-public"
    v-model="isOpenModal"
    :mask-closable="false"
    @on-cancel="closeModal('addInfo')"
    :title="addInfo.id ? '修改公众号' : '新增公众号'">
    <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
      <FormItem label="公众号名称" prop="name">
        <Input type="text" v-model="addInfo.name" placeholder="请输入公众号名称"></Input>
      </FormItem>
      <FormItem label="公众号ID" prop="appId">
        <Input type="text" v-model="addInfo.appId" placeholder="请输入公众号Id"></Input>
      </FormItem>
      <FormItem label="添加关键字" prop="keyword">
        <div class="g-flex-j-sa">
          <Input type="text" v-model="keywordItem" class="-p-form-input" placeholder="请输入关键字"></Input>
          <Button @click="addContent(1)" ghost type="primary" class="-p-form-btn-left"
                  :class="{'-p-form-btn-bottom': addInfo.keyword.length}">添加
          </Button>
        </div>
        <div>
          <Tag v-for="(item, index) in addInfo.keyword" :key="index" :name="item" closable
               @on-close="delContent(1,index)">{{item}}
          </Tag>
        </div>
      </FormItem>
      <FormItem label="添加标签" prop="tags">
        <div class="g-flex-j-sa">
          <Input type="text" v-model="tagItem" class="-p-form-input" placeholder="请输入标签 最多四个"></Input>
          <Button @click="addContent(2)" ghost type="primary" class="-p-form-btn-left"
                  :class="{'-p-form-btn-bottom': addInfo.tags.length}">添加
          </Button>
        </div>
        <div>
          <Tag v-for="(item, index) in addInfo.tags" :key="index" :name="item" closable @on-close="delContent(2,index)">
            {{item}}
          </Tag>
        </div>
      </FormItem>
      <FormItem label="选择学段" prop="sectionEnum">
        <Select v-model="addInfo.sectionEnum">
          <Option v-for="(item,index) in periodList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="选择学科" v-if="type == '1'" prop="subjectEnum">
        <Select v-model="addInfo.subjectEnum">
          <Option v-for="(item,index) in subjectList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="选择省" v-if="type == '2'" prop="provincesId">
        <Select v-model="addInfo.provincesId" @on-change="changeProvinces">
          <Option v-for="(item,index) in provincesList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="选择市" v-if="type == '2'" prop="citiesId">
        <Select v-model="addInfo.citiesId" @on-change="changeCity">
          <Option v-for="(item,index) in cityList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="选择区" v-if="type == '2'" prop="areasId">
        <Select v-model="addInfo.areasId">
          <Option v-for="(item,index) in areasList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="公众号等级" prop="appLevelEnum">
        <Select v-model="addInfo.appLevelEnum">
          <Option v-for="(item,index) in publicGradeList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="一句话推荐" prop="describes">
        <Input type="text" v-model="addInfo.describes" placeholder="请输入一句话推荐（最多20字 包含标点符号）"></Input>
      </FormItem>
      <FormItem label="当前粉丝数" prop="funsNum">
        <Input type="text" v-model="addInfo.funsNum" placeholder="请输入当前粉丝数"></Input>
      </FormItem>
      <Form-item label="公众号图标" prop="icon">
        <Upload
          v-if="!addInfo.icon"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="100"
          :on-success="handleSuccessIcon"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <div class="-c-course-icon">
            <span>+</span>
            <span>公众号图标</span>
          </div>
        </Upload>
        <div class="-c-course-wrap -upload" v-if="addInfo.icon">
          <div class="-c-course-item">
            <img :src="addInfo.icon">
            <div class="-i-del" @click="delPoster(3)">删除</div>
          </div>
        </div>
        <span class="-c-tips" v-else>* 图片大小100k以内</span>
      </Form-item>
      <div class="-p-form-border"></div>
      <Form-item label="回复图片" prop="qrcode">
        <Upload
          v-if="!addInfo.qrcode"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="100"
          :on-success="handleSuccess"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <div class="-c-course-icon">
            <span>+</span>
            <span>回复图片</span>
          </div>
        </Upload>
        <div class="-c-course-wrap -upload" v-if="addInfo.qrcode">
          <div class="-c-course-item">
            <img :src="addInfo.qrcode">
            <div class="-i-del" @click="delPoster(1)">删除</div>
          </div>
        </div>
        <span class="-c-tips" v-else>* 图片大小100k以内</span>
      </Form-item>
      <div class="-p-form-border"></div>
      <FormItem label="回复文案" prop="writing">
        <Input type="textarea" :rows="4" v-model="addInfo.writing" placeholder="请输入回复文案"></Input>
      </FormItem>
      <div class="-p-form-border"></div>
      <FormItem label="悬浮标题" prop="sendTitle">
        <Input type="text" v-model="addInfo.susTitle" placeholder="请输入悬浮标题"></Input>
      </FormItem>
      <!--<FormItem label="悬浮路径" prop="sendDescribe">-->
        <!--<Input type="text" v-model="addInfo.susPath" placeholder="请输入悬浮路径"></Input>-->
      <!--</FormItem>-->
      <!--<Form-item label="悬浮图片" prop="susImg">-->
        <!--<Upload-->
          <!--v-if="!addInfo.susImg"-->
          <!--:action="baseUrl"-->
          <!--:show-upload-list="false"-->
          <!--:max-size="100"-->
          <!--:on-success="handleSuccessBtn"-->
          <!--:on-exceeded-size="handleSize"-->
          <!--:on-error="handleErr">-->
          <!--<div class="-c-course-icon">-->
            <!--<span>+</span>-->
            <!--<span>上传图片</span>-->
          <!--</div>-->
        <!--</Upload>-->
        <!--<div class="-c-course-wrap -upload" v-if="addInfo.susImg">-->
          <!--<div class="-c-course-item">-->
            <!--<img :src="addInfo.susImg">-->
            <!--<div class="-i-del" @click="delPoster(2)">删除</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<span class="-c-tips" v-else>* 图片大小100k以内</span>-->
      <!--</Form-item>-->
      <!--<FormItem label="推送标题" prop="sendTitle">-->
        <!--<Input type="text" v-model="addInfo.sendTitle" placeholder="请输入推送标题"></Input>-->
      <!--</FormItem>-->
      <!--<FormItem label="推送描述" prop="sendDescribe">-->
        <!--<Input type="text" v-model="addInfo.sendDescribe" placeholder="请输入推送描述"></Input>-->
      <!--</FormItem>-->
      <!--<FormItem label="推送链接" prop="sendUrl">-->
        <!--<Input type="text" v-model="addInfo.sendUrl" placeholder="请输入推送链接"></Input>-->
      <!--</FormItem>-->
      <!--<Form-item label="推送图片" prop="sendImg">-->
        <!--<Upload-->
          <!--v-if="!addInfo.sendImg"-->
          <!--:action="baseUrl"-->
          <!--:show-upload-list="false"-->
          <!--:max-size="100"-->
          <!--:on-success="handleSuccessBtn"-->
          <!--:on-exceeded-size="handleSize"-->
          <!--:on-error="handleErr">-->
          <!--<div class="-c-course-icon">-->
            <!--<span>+</span>-->
            <!--<span>推送图片</span>-->
          <!--</div>-->
        <!--</Upload>-->
        <!--<div class="-c-course-wrap -upload" v-if="addInfo.sendImg">-->
          <!--<div class="-c-course-item">-->
            <!--<img :src="addInfo.sendImg">-->
            <!--<div class="-i-del" @click="delPoster(2)">删除</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<span class="-c-tips" v-else>* 图片大小100k以内</span>-->
      <!--</Form-item>-->
    </Form>
    <div slot="footer" class="-p-s-footer">
      <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitInfo('addInfo')" class="g-primary-btn ">确 认</div>
    </div>
  </Modal>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";

  export default {
    name: 'addPublic',
    props: ['dataProp', 'type'],
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        isOpenModal: false,
        isFetching: false,
        addInfo: {
          keyword: [],
          tags: [],
          sendImg: '',
          susImg: '',
          icon: '',
          qrcode: '',
          areasId: ''
        },
        keywordItem: '',
        tagItem: '',
        periodList: this.type == '1' ? [
          {
            id: '1',
            name: '小学'
          },
          {
            id: '2',
            name: '初中'
          },
          {
            id: '3',
            name: '高中'
          }
        ] : [

          {
            id: '4',
            name: '幼升小'
          },
          {
            id: '5',
            name: '小升初'
          },
          {
            id: '6',
            name: '中考'
          },
          {
            id: '7',
            name: '高考'
          }
        ],
        subjectList: [
          {
            id: '1',
            name: '语文'
          },
          {
            id: '2',
            name: '数学'
          },
          {
            id: '3',
            name: '英语'
          },
          {
            id: '4',
            name: '物理'
          },
          {
            id: '5',
            name: '化学'
          },
          {
            id: '6',
            name: '生物'
          },
          {
            id: '7',
            name: '历史'
          },
          {
            id: '8',
            name: '地理'
          },
          {
            id: '9',
            name: '政治'
          }
        ],
        publicGradeList: [
          {
            id: '1',
            name: '大号'
          },
          {
            id: '2',
            name: '中大号'
          },
          {
            id: '3',
            name: '中号'
          },
          {
            id: '4',
            name: '中小号'
          },
          {
            id: '5',
            name: '小号'
          }
        ],
        ruleValidate: {
          name: [
            {required: true, message: '请输入公众号名称', trigger: 'blur'}
          ],
          appId: [
            {required: true, message: '请输入公众号Id', trigger: 'blur'}
          ],
          keyword: [
            {required: true, type: 'array', min: 1, message: '请输入关键字', trigger: 'change'}
          ],
          tags: [
            {required: true, type: 'array', min: 1, message: '请输入标签', trigger: 'change'}
          ],
          sectionEnum: [
            {required: true, message: '请选择学段', trigger: 'change'}
          ],
          subjectEnum: [
            {required: true, message: '请选择学科', trigger: 'change'}
          ],
          appLevelEnum: [
            {required: true, message: '请选择公众号等级', trigger: 'change'}
          ],
          describes: [
            {required: true, message: '请输入一句话推荐', trigger: 'blur'}
          ],
          funsNum: [
            {required: true, message: '请输入当前粉丝数', trigger: 'blur'}
          ],
          icon: [
            {required: true, message: '请上传公众号图标', trigger: 'blur'}
          ],
          provincesId: [
            {required: true, message: '请选择省', trigger: 'change'}
          ],
        },
        provincesList: [],
        cityList: [],
        areasList: [],
      }
    },
    mounted() {
      if (this.dataProp.id) {
        this.addInfo = this.dataProp
        this.addInfo.funsNum = this.addInfo.funsNum.toString()
        this.addInfo.sectionEnum = this.addInfo.sectionEnum.toString()
        this.addInfo.subjectEnum = this.type == '1' ? this.addInfo.subjectEnum.toString() : ''
        this.addInfo.appLevelEnum = this.addInfo.appLevelEnum.toString()
        if (this.type == '2') {
          this.getAreasList()
          this.getCityList()
        }
      }
      this.type == '2' && this.getProvincesList()
      this.isOpenModal = true
    },
    methods: {
      changeProvinces() {

        this.addInfo.citiesId = ''
        this.addInfo.areasId = ''
        this.getCityList()
        console.log('获取市', this.addInfo.areasId)
      },
      changeCity() {
        this.addInfo.areasId = ''
        this.getAreasList()
        console.log('获取区', this.addInfo.areasId)
      },
      //获取省
      getProvincesList() {
        this.isFetching = true
        this.$api.banner.provincesList()
          .then(
            response => {
              this.provincesList = response.data.resultData;

            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //获取市
      getCityList() {
        this.isFetching = true
        this.$api.banner.cityList({
          provinceId: this.addInfo.provincesId
        })
          .then(
            response => {
              this.cityList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //获取区
      getAreasList() {
        this.isFetching = true
        this.$api.banner.areasList({
          cityId: this.addInfo.citiesId
        })
          .then(
            response => {
              this.areasList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      addContent(num) {
        switch (num) {
          case 1:
            if (!this.keywordItem) {
              return this.$Message.error('请输入关键词')
            } else if (this.keywordItem.length>8) {
              return this.$Message.error('关键字字数最多8位')
            }
            this.addInfo.keyword.push(this.keywordItem)
            this.keywordItem = ""
            break
          case 2:
            if (!this.tagItem) {
              return this.$Message.error('请输入标签')
            } else if (this.addInfo.tags.length >= 4) {
              return this.$Message.error('标签最多四个')
            } else if (this.tagItem.length>6) {
              return this.$Message.error('关键字字数最多6位')
            }
            this.addInfo.tags.push(this.tagItem)
            this.tagItem = ""
            break
        }

      },
      delContent(num, index) {
        switch (num) {
          case 1:
            this.addInfo.keyword.splice(index, 1)
            break
          case 2:
            this.addInfo.tags.splice(index, 1)
            break
        }

      },
      delPoster(num) {
        switch (num) {
          case 1:
            this.addInfo.qrcode = ''
            break
          case 2:
            this.addInfo.susImg = ''
            break
          case 3:
            this.addInfo.icon = ''
            break
        }
      },
      handleSuccessBtn(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.susImg = res.resultData.url
        }
      },
      handleSuccess(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.qrcode = res.resultData.url
        }
      },
      handleSuccessIcon(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.icon = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
      closeModal(name) {
        this.$emit('closeModal')
        this.$refs[name].resetFields();
      },
      submitInfo(name) {
        console.log(1)
        if (this.type == '2') {
          delete this.addInfo.subjectEnum
        }
        if (!this.addInfo.writing && !this.addInfo.qrcode) {
          return this.$Message.error('请输入至少一种回复')
        } else if (this.addInfo.describes.length > 20) {
          return this.$Message.error('一句话推荐不能超过20字')
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('successEmitPublic', this.addInfo)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-public {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

    .-p-form-border {
      border-bottom: 1px solid #e8eaec;
      margin-bottom: 24px;

    }

    .-p-form-input {
      width: 80%;
    }

    .-p-form-btn-left {
      margin-left: 10px;
    }

    .-p-form-btn-bottom {
      margin-bottom: 10px;
    }

    .-c-tips {
      color: #39f
    }

    .-c-course-icon {
      cursor: pointer;
      text-align: center;
      color: #e9e9e9;
      width: 140px;
      height: 70px;
      line-height: 70px;
      border: 2px dashed #e9e9e9;

      span {
        font-size: 16px;
        display: inline-block;
      }
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        width: 140px;
        overflow: hidden;
        /*margin: 10px 10px 10px 0;*/

        img {
          width: 100%;
          /*height: 70px;*/
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }
  }
</style>
