<template>
  <div class="p-choice">
    <div v-for="(list,listIndex) of choiceList" :key="listIndex" class="p-choice-wrap">
      <div class="-name">
        <span class="-span">题目{{listIndex+1}}：</span>
        <Input class="-input-name -s-width" v-model="list.name" type="text" :maxlength="40"
               placeholder="请输入题目（最多四十个字）"/>
        <span class="-s-color g-cursor" @click="delChoice(list,listIndex)">删除</span>
      </div>
      <div class="-name" v-if="type === 1">
        <span class="-span">答题时间：</span>
        <Input class="-input-name -s-b-width" v-model="list.answerMinute" type="text" placeholder="请输入答题时间（分）"/>分
        <Input class="-input-name -s-b-width" v-model="list.answerSecond" type="text" placeholder="请输入答题时间（分）"/>秒
      </div>
      <!--//answerPoint-->
      <div class="-name" v-if="type === 1">
        <span class="-span">答题时长：</span>
        <Input class="-input-name -s-width" v-model="list.answerTime" type="text" placeholder="请输入答题时长"/>
      </div>
      <div class="-name" v-if="type === 1">
        <span class="-span">答案公布时间：</span>
        <Input class="-input-name -s-b-width" v-model="list.publishMinute" type="text" placeholder="请输入答题时间（分）"/>分
        <Input class="-input-name -s-b-width" v-model="list.publishSecond" type="text" placeholder="请输入答题时间（秒）"/>秒
      </div>
      <!--publishPoint-->
      <div v-for="(item,index) of list.optionJson" :key="index" class="-p-item-select-wrap">
        <span class="-s-width -span">选项{{optionLetter[index]}}：</span>
        <Input class="-s-width" v-model="item.value" type="textarea" placeholder="请输入选择题干"
               :maxlength="40" style="width: 300px"/>
        <Checkbox v-model="item.checked" @on-change="changeCheck(list,index)">设为答案</Checkbox>
        <span class="-s-width -s-color g-cursor" @click="delOption(list,index)">删除</span>
      </div>
      <div class="-audio" v-if="type !== 1">
        <span class="-span">正确音频：</span>
        <upload-audio ref="childChoiceAudio" v-model="list.rightAudio" :option="uploadAudioOption"></upload-audio>
      </div>
      <div class="-audio" v-if="type !== 1">
        <span class="-span">错误音频：</span>
        <upload-audio ref="childChoiceAudio" v-model="list.errorAudio" :option="uploadAudioOption"></upload-audio>
      </div>
      <div class="-form-btn g-cursor" v-if="list.optionJson.length < 4" @click="addOption(list)">+ 新增选项</div>
    </div>
    <div class="-form-btn g-cursor" v-if="isShowAddChoice" @click="addChoice">+ 新增题目</div>
  </div>
</template>

<script>
  import admin from "../../../request/api/hkxt/admin";
  import UploadAudio from "../../../components/uploadAudio";

  export default {
    name: "choiceQuestion",
    components: {UploadAudio},
    props: ['type', 'childList', 'adminType'],
    data() {
      return {
        choiceList: [],
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm', 'mpeg']
        },
        optionLetter: ['A', 'B', 'C', 'D'],
        isShowAddChoice: true
      }
    },
    methods: {
      init() {
        this.isShowAddChoice = true
        this.choiceList = this.childList || []
        if (this.choiceList.length > 2) {
          this.isShowAddChoice = false
        }
      },
      addChoice() {
        this.choiceList.push({
          name: '',
          optionJson: [],
          sortnum: this.choiceList.length + 1,
          rightAudio: '',
          errorAudio: '',
        })
        if (this.choiceList.length > 2) {
          this.isShowAddChoice = false
        }
        this.$emit('submitChoice', this.choiceList)
      },
      changeCheck(list, idx) {
        list.optionJson.forEach((item, index) => {
          if (idx !== index) {
            item.checked = false
          }
        })
      },
      addOption(list) {
        list.optionJson.push({
          value: '',
          checked: false,
          index: this.optionLetter[list.optionJson.length]
        })
      },
      delOption(list, index) {
        list.optionJson.splice(index, 1)
      },
      delChoice(list, listIndex) {
        if (list.id) {
          this.$Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            onOk: () => {
              if (this.adminType == 7) {
                this.$api.poem.deleteQuestion({
                  lessonId: list.id
                }).then(
                  response => {
                    if (response.data.code == "200") {
                      this.$Message.success('删除成功')
                      this.choiceList.splice(listIndex, 1)
                    }
                  })
              } else {
                this.$api.composition.removeLessonQuestion({
                  questionId: list.id
                }).then(
                  response => {
                    if (response.data.code == "200") {
                      this.$Message.success('删除成功')
                      this.choiceList.splice(listIndex, 1)
                    }
                  })
              }
            }
          })
        } else {
          this.choiceList.splice(listIndex, 1)
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .p-choice {

    .-span {
      text-align: right;
      display: inline-block;
      width: 90px;
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

    }

    .-s-width {
      padding-right: 10px;
    }

    .-s-b-width {
      margin-right: 10px;
      width: 27%
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

  }
</style>
