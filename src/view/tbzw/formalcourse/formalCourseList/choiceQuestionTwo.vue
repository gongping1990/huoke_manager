<template>
  <div class="p-choice">
    <div v-for="(list,listIndex) of choiceList" :key="listIndex" class="p-choice-wrap">
      <div class="-name">
        <span class="-span">题目：</span>
        <Input class="-input-name -s-width" v-model="list.name" type="text" :maxlength="40"
               placeholder="请输入题目（最多四十个字）"/>
      </div>
      <!--<div class="-name">-->
      <!--<span class="-span">题干音频：</span>-->
      <!--<upload-audio class="-input-name" ref="childChoiceAudio" v-model="list.topicAudio"-->
      <!--:option="uploadAudioOption"></upload-audio>-->
      <!--</div>-->
      <div class="-name" v-if="type=='1' || type=='3'">
        <span class="-span">题干图片：</span>
        <upload-img class="-input-name" v-model="list.topicImage" :option="uploadOption"></upload-img>
      </div>
      <div class="-name">
        <span class="-span">答题时间：</span>
        <Input class="-input-name -s-b-width" v-model="list.answerMinute" type="text" placeholder="请输入答题时间（分）"/>分
        <Input class="-input-name -s-b-width -s-b-margin" v-model="list.answerSecond" type="text"
               placeholder="请输入答题时间（分）"/>秒
      </div>
      <div class="g-tips -s-b-marginLeft">答题时间与上一题答案公布时间间隔不得小于8秒</div>
      <!--//answerPoint-->
      <div class="-name">
        <span class="-span">答题时长：</span>
        <Input class="-input-name -s-width" v-model="list.answerTime" type="text" placeholder="请输入答题时长"/>
      </div>
      <div class="-name">
        <span class="-span">答案公布时间：</span>
        <Input class="-input-name -s-b-width" v-model="list.publishMinute" type="text" placeholder="请输入答题时间（分）"/>分
        <Input class="-input-name -s-b-width -s-b-margin" v-model="list.publishSecond" type="text"
               placeholder="请输入答题时间（秒）"/>秒
      </div>
      <!--publishPoint-->
      <div v-for="(item,index) of list.optionJson" :key="index" class="-p-item-select-wrap">
        <span class="-s-width -span">选项{{optionLetter[index]}}：</span>
        <Input v-if="type=='1' || type=='3'" class="-s-width" v-model="item.value" type="textarea" placeholder="请输入选择题干"
               :maxlength="type == '3' ? 20 : 28" style="width: 300px"/>
        <upload-img ref="childImg" v-if="type=='2' || type=='4'" v-model="item.value" :option="uploadOption"></upload-img>
        <Checkbox v-if="!isEdit && (type=='1' || type=='2')" v-model="item.checked" class="-s-b-margin"
                  @on-change="changeCheck(list,index)">设为答案
        </Checkbox>
        <div v-if="type=='3' || type=='4'" class="g-flex-a-j-center -s-b-margin">
          <span style="width: 50px">顺序：</span>
          <Select v-model="item.sortNum" style="width: 70px">
            <Option v-for="(item,index) in numList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </div>

        <span v-if="!isEdit" class="-s-width -s-color g-cursor" @click="delOption(list,index)">删除</span>
      </div>
      <div class="g-tips -s-b-marginLeft" v-if="type == '3'">选项所有字数相加不得超过40字</div>
      <div class="-form-btn g-cursor" v-if="list.optionJson.length < 3 && !isEdit && (type > 2)"
           @click="addOption(list)">+ 新增选项
      </div>
      <div class="-form-btn g-cursor" v-if="list.optionJson.length < 2 && !isEdit && (type < 3)"
           @click="addOption(list)">+ 新增选项
      </div>
    </div>

    <div class="g-flex-j-sa">
      <Button @click="backCancel()" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitInfo()" class="g-primary-btn" style="line-height: 40px">确 认</div>
    </div>
  </div>
</template>

<script>
  import admin from "@/request/api/hkxt/admin";
  import UploadAudio from "@/components/uploadAudio";
  import UploadImg from "../../../../components/uploadImg";

  export default {
    name: "choiceQuestionTwo",
    components: {UploadImg, UploadAudio},
    props: ['type', 'childList', 'isChildEdit', 'length'],
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        choiceList: [
          {
            name: '',
            qetype: this.type,
            optionJson: [],
            topicImage: '',
            topicAudio: ''
          }
        ],
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm', 'mpeg']
        },
        optionLetter: ['A', 'B', 'C', 'D'],
        numList: [],
        isEdit: this.isChildEdit || false
      }
    },
    watch: {
      isChildEdit(_n) {
        this.isEdit = _n
        console.log(_n)
      }
    },
    methods: {
      init() {
        this.numList = []
        this.choiceList = this.childList.length ? JSON.parse(JSON.stringify(this.childList)) : [
          {
            name: '',
            sortnum: this.length + 1,
            qetype: this.type,
            optionJson: [],
            topicImage: '',
            topicAudio: ''
          }
        ]

        if (this.choiceList.length) {
          setTimeout(()=>{
            this.$refs.childImg.length && this.$refs.childImg.forEach(item=>{
              item.init()
            })
          })

          this.choiceList[0].optionJson.forEach((item, index) => {
            this.numList.push({
              id: index + 1,
              name: index + 1
            })
          })
        }
      },
      changeCheck(list, idx) {
        list.optionJson.forEach((item, index) => {
          if (idx !== index) {
            item.checked = false
          }
        })
      },
      addOption(list) {
        this.numList = []
        list.optionJson.push({
          value: '',
          sortNum: '',
          checked: false,
          index: this.optionLetter[list.optionJson.length]
        })

        list.optionJson.forEach((item, index) => {
          this.numList.push({
            id: index + 1,
            name: index + 1
          })
        })
      },
      delOption(list, index) {
        list.optionJson.splice(index, 1)
      },
      submitInfo () {
        this.$emit('submitChoice', this.choiceList)
      },
      backCancel () {
        this.$emit('cancelChoice')
      }
    }
  }
</script>

<style scoped lang="less">
  .p-choice {
    margin: 40px 0;

    .-name {
      display: flex;
      align-items: center;
    }

    .-span {
      margin-right: 10px;
      text-align: right;
      display: inline-block;
      width: 110px;
    }

    &-wrap {
      padding-bottom: 10px;
      margin-bottom: 16px;
      border-bottom: 1px solid #dcdee2;
    }

    &-wrap:last-child {
      border-bottom: none;
    }

    .-input-name {
      padding: 10px 0;
      width: 60%;
    }

    .-audio {
      display: flex;
      margin-top: 10px;
    }

    .-p-item-select-wrap {
      padding: 10px 0;
      display: flex;
      align-items: center;
    }

    .-s-width {
      padding-right: 10px;
    }

    .-s-b-width {
      margin-right: 10px;
      width: 27%
    }

    .-s-b-margin {
      margin: 0 10px;
    }

    .-s-color {
      color: rgb(218, 55, 75);
    }

    .-form-btn {
      margin: 10px 0 0 0;
      /*width: 333px;*/
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      border: 1px dashed #5444E4;
      color: #5444E4;
    }

    .-s-b-marginLeft {
      margin-left: 120px;
    }

  }
</style>
