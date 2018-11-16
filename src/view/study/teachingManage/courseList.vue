<template>
  <div class="p-course">
    <Row class="-c-wrap">
      <Col :span="3" v-for="(item, index) of dataList" class="-c-item g-t-center" :key="index" >
        <div @click="toDetail" class="-c-item-cursor">
          <img src="../../../assets/images/grade-logo.png">
          <h5>{{item.name}}</h5>
        </div>
      </Col>
      <Col :span="24" v-if="isNextChild">
        <div class="-c-margin g-primary-btn" @click="toBack">
          <Icon type="md-return-left" />
          返回单元章节
        </div>
      </Col>
    </Row>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>

  import Loading from "@/components/loading";

  export default {
    name: 'courseList',
    components: {Loading},
    data() {
      return {
        dataList: [
          {
            name: '一单元',
          },
          {
            name: '二单元',
          },
          {
            name: '三单元',
          },
          {
            name: '四单元',
          }
        ],
        isFetching: false,
        isNextChild: false,
      };
    },
    mounted() {
      // this.getList()
    },
    methods: {
      toDetail() {
        if (this.isNextChild) {
          this.$router.push({
            name: 'courseInfo'
          })
        } else {
          this.isNextChild = true
          this.dataList = [
            {
              name: '小蝌蚪找妈妈',
            },
            {
              name: '钢铁是怎样炼成的',
            },
            {
              name: '狼来了的故事',
            },
            {
              name: '名声讲座',
            }
          ]
        }
      },
      toBack () {
        console.log(22)
        this.isNextChild = false
        this.dataList = [
          {
            name: '一单元',
          },
          {
            name: '二单元',
          },
          {
            name: '三单元',
          },
          {
            name: '四单元',
          }
        ]
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.course.gradeList()
          .then(
            response => {
              this.dataList = response.data.resultData.records;
            }).finally(() => {
          this.isFetching = false
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-course {
    .-c-wrap {
      text-align: left;
    }

    .-c-margin {
      width: 150px;
      margin: 20px auto;
    }

    .-c-item {
      display: inline-block;
      margin: 20px;

      img {
        width: 60px;
      }

      &-cursor{
        cursor: pointer;
      }
    }

  }
</style>
