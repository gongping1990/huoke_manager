<template>
  <div class="p-choice">
    <div v-for="(list,listIndex) of choiceList" :key="listIndex" class="p-choice-wrap">
      <div class="-name">
        <span>题目：</span>
        <Input class="-input-name -s-width" v-model="list.name" type="text" placeholder="请输入题目"/>
        <span class="-s-color g-cursor" v-if="type==2" @click="delChoice(list,listIndex)">删除</span>
      </div>
      <div v-for="(item,index) of list.optionList" :key="index" class="-p-item-select-wrap">
        <span class="-s-width">选项{{optionLetter[index]}}</span>
        <Input class="-s-width" v-model="item.value" type="textarea" placeholder="请输入选择题干"
               :maxlength="40" style="width: 300px"/>
        <Checkbox v-model="item.isChecked" @on-change="changeCheck(list,index)">设为答案</Checkbox>
        <span class="-s-width -s-color g-cursor" @click="delOption(list,index)">删除</span>
      </div>
      <div class="-form-btn g-cursor" v-if="list.optionList.length < 4" @click="addOption(list)">+ 新增选项</div>
    </div>
    <div class="-form-btn g-cursor" v-if="isShowAddChoice" @click="addChoice">+ 新增题目</div>
  </div>
</template>

<script>
  export default {
    name: "choiceQuestion",
    props: ['type', 'childList'],
    data() {
      return {
        choiceList: [],
        optionLetter: ['A', 'B', 'C', 'D'],
        isShowAddChoice: true
      }
    },
    methods: {
      init () {
        this.isShowAddChoice = true
        this.choiceList = this.childList || []
        if (this.type == 1 && this.choiceList.length) {
          this.isShowAddChoice = false
        } else if (this.type == 2 && this.choiceList.length > 2) {
          console.log(2)
          this.isShowAddChoice = false
        }
      },
      addChoice() {
        this.choiceList.push({
          name: '',
          optionList: []
        })
        if (this.type == 1) {
          this.isShowAddChoice = false
        } else if (this.type == 2 && this.choiceList.length > 2) {
          this.isShowAddChoice = false
        }
        this.$emit('submitChoice', this.choiceList)
      },
      changeCheck(list, idx) {
        list.optionList.forEach((item, index) => {
          if (idx !== index) {
            item.isChecked = false
          }
        })
      },
      addOption(list) {
        list.optionList.push({
          value: '',
          isChecked: false,
          index: this.optionLetter[list.optionList.length]
        })
      },
      delOption(list, index) {
        list.optionList.splice(index, 1)
      },
      delChoice(list, listIndex) {
        this.choiceList.splice(listIndex, 1)
      },
    }
  }
</script>

<style scoped lang="less">
  .p-choice {

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
      width: 80%;
    }

    .-p-item-select-wrap {
      padding: 10px 0;

    }

    .-s-width {
      padding-right: 10px;
    }

    .-s-color {
      color: rgb(218, 55, 75);
    }

    .-form-btn {
      margin: 10px 0 0 0;
      width: 333px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      border: 1px dashed #5444E4;
      color: #5444E4;
    }

  }
</style>
