<template>
  <div class="p-choice">
    <div v-for="(list,listIndex) of choiceList" :key="listIndex" class="p-choice-wrap">
      <div class="-name">
        <span class="-span">题目：</span>
        <Input class="-input-name -s-width" v-model="list.subject" type="text" :maxlength="30"
               placeholder="请输入题目（最多三十个字）"/>
      </div>
      <div class="-name">
        <span class="-span">题干音频：</span>
        <upload-audio class="-input-name" ref="childChoiceAudio" v-model="list.vfUrl"
                      :option="uploadAudioOption"></upload-audio>
      </div>
      <div class="-name">
        <span class="-span">答题时间：</span>
        <Input class="-input-name -s-b-width" v-model="list.answerMinute" type="text" placeholder="请输入答题时间（分）"/>分
        <Input class="-input-name -s-b-width -s-b-margin" v-model="list.answerSecond" type="text"
               placeholder="请输入答题时间（分）"/>秒
      </div>
      <div class="-name">
        <span class="-span">答题时长：</span>
        <Input class="-input-name -s-width" v-model="list.answerTime" type="text" placeholder="请输入答题时长"/>
      </div>
      <div class="-name" v-show="type=='1'">
        <span class="-span">录音提示：</span>
        <upload-img class="-input-name" v-model="list.imgUrl" :option="uploadOption"></upload-img>
      </div>
      <!--publishPoint-->
      <div class="-option-wrap" v-show="list.optionJson.length">
        <div>
          <p class="-name" v-if="type == 3">
            <span class="-span">左侧选项：</span>
          </p>
          <div v-for="(item,index) of list.optionJson" :key="index" class="-p-item-select-wrap">
            <span class="-s-width -span">{{type == 3 ? '左' : '选项'}}{{optionLetter[index]}}：</span>
            <upload-img ref="childImg" v-if="type!='1'" v-model="item.value"
                        :option="uploadOption"></upload-img>
            <Checkbox v-if="type=='2'" v-model="item.checked" class="-s-b-margin"
                      @on-change="changeCheck(list,index)">设为答案
            </Checkbox>
            <div v-if="type=='3'" class="g-flex-a-j-center -s-b-margin">
              <span style="width: 50px">关联：</span>
              <Select v-model="item.links" style="width: 70px">
                <Option v-for="(item,index) in list.optionJsonTwo" :label="item.name" :value="item.index" :key="index"></Option>

              </Select>
            </div>

            <span class="-s-width -s-color g-cursor" @click="delOption(list,index)">删除</span>
          </div>
        </div>
        <div>
          <p class="-name" v-if="type == 3">
            <span class="-span">右侧选项：</span>
          </p>
          <div v-for="(item,index) of list.optionJsonTwo" :key="`${index}R`" class="-p-item-select-wrap" v-if="type == 3">
            <span class="-s-width -span">右{{optionLetter[index]}}：</span>
            <upload-img ref="childImg" v-if="type!='1'" v-model="item.value"
                        :option="uploadOption"></upload-img>
          </div>

        </div>
      </div>


      <div class="-form-btn g-cursor" v-if="list.optionJson.length < 4 && (type == 2)"
           @click="addOption(list)">+ 新增选项
      </div>

      <div class="-form-btn g-cursor" v-if="list.optionJson.length < 3 && (type == 3)"
           @click="addOption(list)">+ 新增选项
      </div>
    </div>

    <div class="p-choice-footer g-flex-j-sa">
      <Button @click="backCancel()" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitInfo()" class="g-primary-btn" style="line-height: 40px">确 认</div>
    </div>
  </div>
</template>

<script>
  import UploadAudio from "@/components/uploadAudio";
  import UploadImg from "@/components/uploadImg";

  export default {
    name: "choiceQuestionThree",
    components: {UploadImg, UploadAudio},
    props: ['type', 'childList'],
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        choiceList: [
          {
            subject: '',
            optionJson: [],
            imgUrl: '',
            vfUrl: ''
          }
        ],
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        optionLetter: ['A', 'B', 'C', 'D', 'E', 'F'],
        numList: [],
      }
    },
    methods: {
      init() {

        this.numList = []
        this.choiceList = this.childList.length ? JSON.parse(JSON.stringify(this.childList)) : [
          {
            subject: '',
            optionJson: [],
            optionJsonTwo: [],
            imgUrl: '',
            vfUrl: ''
          }
        ]

        if (this.choiceList.length && this.type != 1) {
          setTimeout(() => {
            this.$refs.childImg && this.$refs.childImg.length && this.$refs.childImg.forEach(item => {
              item.init()
            })
          })
        }

        if (this.choiceList.length && this.type === 3) {
          this.choiceList.forEach(item=>{
            item.optionJson = item.leftJson || []
            item.optionJsonTwo = item.rigthJson || []

            item.optionJsonTwo.forEach((data,index)=> {
              data.name = `右${this.optionLetter[index]}`
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

        list.optionJson.push({
          value: '',
          check: false,
          link: '',
          index: `L${this.optionLetter[list.optionJson.length]}`
        })

        if(this.type == 3) {
          list.optionJsonTwo.push({
            value: '',
            name: `右${this.optionLetter[list.optionJson.length-1]}`,
            index: `R${this.optionLetter[list.optionJson.length-1]}`
          })
        }

        list.optionJson.forEach((item, index) => {
          this.numList.push({
            id: index + 1,
            name: index + 1
          })
        })
      },
      delOption(list, index) {
        list.optionJson.splice(index, 1)
        list.optionJsonTwo.splice(index, 1)
      },
      submitInfo() {
        this.$emit('submitChoice', this.choiceList)
      },
      backCancel() {
        this.$emit('cancelChoice')
      }
    }
  }
</script>

<style scoped lang="less">
  .p-choice {
    width: 80%;
    margin: 40px 0;

    .-name {
      display: flex;
      align-items: center;
    }

    .-span {
      margin-right: 10px;
      text-align: right;
      display: inline-block;
      width: 80px;
    }

    .-option-wrap {
      display: flex;
    }

    &-wrap {
      padding-bottom: 10px;
      margin-bottom: 16px;
      /*border-bottom: 1px solid #dcdee2;*/
    }

    &-wrap:last-child {
      border-bottom: none;
    }

    &-footer {
      width: 90%;
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
      width: 80%;
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
