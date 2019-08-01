<template>
  <div class="p-experienceClass">
    <Card class="p-experienceClass-card">
      <div class="p-experienceClass-wrap">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidateOne" :label-width="90">
          <FormItem label="选择体验课" prop="courseList">
            <Select v-model="addInfo.courseList" multiple :disabled="!isEdit">
              <Option v-for="(item,index) of courseExperienceList" :value="item.id" :label="item.name"></Option>
            </Select>
          </FormItem>
        </Form>
        <div class="-c-flex">
          <Button v-if="isEdit" @click="closeEdit('addInfo')" ghost type="primary" class="-c-btn">取 消</Button>
          <div v-if="isEdit" @click="submitInfo('addInfo')" class="g-primary-btn -c-btn">确 认</div>
          <div v-if="!isEdit" @click="isEdit= true" class="g-primary-btn -c-btn">编 辑</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import Loading from "../../../components/loading";

  export default {
    name: 'contentList',
    components: {Loading},
    props: ['open'],
    data() {
      return {
        addInfo: {
          courseList: []
        },
        courseExperienceList: [],
        isEdit: false,
        isSending: false,
        ruleValidateOne: {
          courseList: [
            { required: true, type: 'array', min: 1, message: '请选择体验课程', trigger: 'change' }
          ]
        }
      };
    },
    mounted() {
      this.getList()
      this.getCourseList()
    },
    methods: {
      closeEdit(name) {
        this.$refs[name].resetFields();
        this.getList()
        this.isEdit = false
      },
      //分页查询
      getCourseList() {
        this.isFetching = true
        this.$api.poem.getNewCourseLessonList()
          .then(
            response => {
              this.courseExperienceList = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getList() {
        this.isFetching = true
        this.$api.gswExperience.getExperienceConfigList()
          .then(
            response => {
              this.addInfo.courseList = []
              for (let item of response.data.resultData) {
                this.addInfo.courseList.push(item.lessonId)
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let array = []
            for (let item of this.addInfo.courseList) {
              for (let data of this.courseExperienceList) {
                  if (item === data.id) {
                    array.push({
                      sortnum: data.sortnum,
                      lessonId: data.id
                    })
                  }
              }
            }
            console.log(array,this.addInfo.courseList,1)
            this.$api.gswExperience.saveExperienceConfig({
              list: array
            })
              .then(response => {
                if (response.data.code == '200') {
                  this.$Message.success('修改成功');
                  this.getList()
                  this.closeEdit(name)
                }
              })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-experienceClass {
    text-align: left;

    .-c-btn {
      margin-left: 20px;
      height: 40px;
      width: 120px;
    }

    .-c-flex {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .-c-tips {
      color: #39f;
    }

    &-card {
      min-height: 90vh;
    }

    &-wrap {
      margin-top: 24px;
      width: 60%;
      min-width: 600px;
    }
  }
</style>
