<template>
  <div class="p-date g-flex-a-j-center" :class="{'p-date-left': dataInfo.row != '2'}">
    <Col span="2" class="-search-select-text" v-if="dataInfo.name && !dataInfo.isMore">{{dataInfo.name}}</Col>
    <Col span="2" class="-search-select-text -width" v-if="dataInfo.isMore">
      <Select v-model="dateTime.index" class="-search-selectOne" @on-change="changeSelect">
        <Option v-for="(item,index) in dataInfo.name" :label="item.name" :value="item.id" :key="index"></Option>
      </Select>
    </Col>
    <Col span="14" class="g-flex-a-j-center">
      <div>
        <Date-picker class="date-time"
                     placeholder="选择开始日期"
                     :type="dataInfo.type"
                     :clearable="false"
                     @on-change="changeStartClick"
                     v-model="dateTime.startTime"></Date-picker>
      </div>
      <div>&nbsp;-&nbsp;</div>
      <div>
        <Date-picker class="date-time"
                     placeholder="选择结束日期"
                     :type="dataInfo.type"
                     v-model="dateTime.endTime"
                     :options="dateOption"
                     @on-open-change="changeDateFn"
                     @on-change="changeEndClick">

        </Date-picker>
      </div>
      <Button style="margin-left: 10px" @click="resetDate">重置</Button>
    </Col>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'datePickerTemplate',
    props: ['dataInfo'],
    data() {
      return {
        dateTime: {
          startTime: '',
          endTime: '',
          index: this.dataInfo.isMore ? this.dataInfo.name[0].id : ''
        },
        dateOption: {
          // disabledDate(date) {
          //   return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          // }
        },
      }
    },
    watch: {
      'dateTime.startTime'(_new, _old) {
        this.dateOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      }
    },
    methods: {
      changeSelect () {
        if(this.dateTime.startTime && this.dateTime.endTime) {
          this.changeDateFn(false)
        }
      },
      resetDate() {
        this.dateTime.startTime = ''
        this.dateTime.endTime = ''
        this.dateTime.index = '0'
        this.$emit('changeDate', this.dateTime)
      },
      changeStartClick(date) {
        let s = new Date(date).getTime()
        let e = new Date(this.dateTime.endTime).getTime()
        if (s > e) {
          this.dateTime.endTime = ''
        }
        if (this.dateTime.endTime) {
          this.changeDateFn(false)
        }
      },
      changeEndClick(date) {
        let initialDate = new Date(`${dayjs(date).format('YYYY-MM-DD')} 00:00:00`).getTime()
        let changeDate = new Date(date).getTime()
        if (initialDate == changeDate) {
          this.dateTime.endTime = new Date(changeDate + (24 * 60 * 60 * 1000 - 1))
        }
      },
      changeDateFn(bool) {
        if (!bool && this.dateTime.endTime && this.dateTime.startTime) {
          this.$emit('changeDate', this.dateTime)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-date {

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-search-select-text {
      min-width: 70px;
    }

    .-search-selectOne {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-width {
      min-width: 120px;
      margin-right: 20px;
    }

  }

  .p-date-left {
    margin-left: 20px;
  }

</style>
