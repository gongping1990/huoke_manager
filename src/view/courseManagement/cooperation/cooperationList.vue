<template>
  <div class="p-active">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo"
            :label-width="100">
        <FormItem label="内容合作方" prop="name">
          <Select v-model="addInfo.cooperationId" style="width: 300px">
            <Option v-for="(item,index) in cooperationList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="关联课程" prop="name">
          <Select v-model="addInfo.courseId" style="width: 300px">
            <Option v-for="(item,index) in courseList" :label="item.courseName" :value="item.courseId" :key="index"></Option>
          </Select>
        </FormItem>
        <Form-item label="导出格式">
          .xls
        </Form-item>
        <FormItem>
          <div class="-c-flex">
            <Button @click="execlList" ghost type="primary" class="-c-btn">导出</Button>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import CheckCourse from "../../../components/checkCourse";
  import {pattern} from '@/libs/regexp'

  export default {
    name: 'cooperationList',
    components: {CheckCourse, Loading},
    data() {
      return {
        cooperationList: [{
          id: '0',
          name: '时间知道'
        }],
        courseList: [{
          courseId: '1134349836566118401',
          courseName: '2-6年级应用题专项突破，15种考试题型全解析'
        }],
        isFetching: false,
        addInfo: {
          cooperationId: '0',
          courseId: '1134349836566118401'
        },
      }
    },
    mounted() {
      // this.getCourseList()
    },
    methods: {
      getCourseList(num) {
        this.$api.goods.aloneList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delCourse(item, index) {
        this.courseListOne.splice(index, 1)
      },
      execlList() {
        window.open(`http://huoke.prod.k12.vip/sch/statistics/getStaticsByCourse?courseId=${this.addInfo.courseId}`)
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-active {

    .-c-form {
      width: 70%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }

    .-c-flex {
      display: flex;
      justify-content: center;
    }

    .-c-btn {
      margin: 20px;
      width: 120px;
    }
  }
</style>
