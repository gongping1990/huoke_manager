<template>
  <div class="p-tree">

    <Row class="-t-wrap g-tab">
      <Col :span="24" class="-t-top">
        <Col :span="6" class="g-t-center">课时名称</Col>
        <Col :span="6" class="g-t-center">排序值</Col>
        <Col :span="6" class="g-t-center">浏览量（pv）</Col>
        <Col :span="6" class="g-t-center">浏览用户（uv）</Col>
      </Col>
      <Col :span="24" v-for="(item1,index) of firstChild" :key="index" class="-t-item -t-border">
        <Col :span="6" class="-t-child-padding g-flex-a-j-center">
          <div @click="openArrow(item1)" v-if="item1.list.length" class="g-cursor">
            <Icon v-if="!item1.isShowChild" type="md-arrow-dropright" size="20"/>
            <Icon v-else type="md-arrow-dropdown" size="20"/>
          </div>
          <div :class="{'-t-child-m-l': !item1.list.length}">{{item1.name || '-'}}</div>
        </Col>
        <Col :span="6" class="-t-item-text  g-t-center">
          {{index+1}}
        </Col>
        <Col :span="6" class="-t-item-text  g-t-center">
          {{item1.pv}}
        </Col>
        <Col :span="6" class="-t-item-text  g-t-center">
          {{item1.uv}}
        </Col>

        <Col :span="24" v-show="item1.isShowChild && item1.list" v-for="(item2,index2) of item1.list"
             :key="index2" class="-t-item -t-border">
          <Col :span="18" class="-t-child-padding-two g-flex-a-j-center">
            <div class="-t-child-m-l">{{item2.name}}</div>
          </Col>
          <Col :span="6">
            <div class="-t-child-padding-two -t-o-color g-t-center">{{item2.sort}}</div>
          </Col>
        </Col>
      </Col>
      <Col :span="24" v-if="!firstChild.length" class="g-t-center -t-item">暂无数据</Col>
    </Row>

    <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>
    <loading v-if="isFetching"></loading>
  </div>
</template>
<script>
  import {pattern} from '@/libs/regexp';
  import Loading from "@/components/loading";

  export default {
    name: 'treeTemplate',
    components: {Loading},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        firstChild: [],
        isFetching: false,
        isSending: false,
        storageInfo: [],
        dataItem: ''
      };
    },
    mounted() {

    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getList(data) {
        data && (this.dataItem = data);
        this.isFetching = true;

        this.$api.xxbPoemAdmin.getClassContent({
          current: this.tab.page,
          size: this.tab.pageSize,
          categoryName: this.dataItem.name,
          grade: this.dataItem.grade,
          poemType: this.$route.query.id,
          semester: this.dataItem.semester,
        })
          .then(
            response => {
              this.firstChild = response.data.resultData.records;
              this.firstChild = this.firstChild.map(item => {
                return {
                  ...item,
                  list: item.list ? item.list : []
                };
              });
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      openArrow(item) {
        this.$forceUpdate();
        item.isShowChild = !item.isShowChild;
        this.storageInfo = this.firstChild;
        this.$store.commit('changeArticeList', {
          data: this.firstChild
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .p-tree {

    .-t-add-icon {
      top: 36px;
    }
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-t-wrap {
      width: 100%;
      margin-top: 20px;
      border: 1px solid #dcdee2;

      .-t-border {
        border-top: 1px solid #dcdee2;
      }

      .-t-child-m-l {
        margin-left: 20px;
      }

      .-t-top {
        line-height: 40px;
        background-color: #f8f8f9;
        font-weight: bold;
        border-bottom: 1px solid #dcdee2;
      }

      .-t-notip {
        line-height: 48px;
      }

      .-t-flex {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
    .-t-child-padding {
      padding-left: 30px !important;
    }
    .-t-child-padding-two {
      padding-left: 50px !important;
    }
    .-t-child-padding-three {
      padding-left: 70px !important;
    }
    .-t-child-padding-four {
      padding-left: 90px !important;
    }

    .-t-item {
      line-height: 50px;
    }
    .-t-img {
      width: 24px;
      height: 18px
    }

    .-t-item-text {
      font-weight: bold;
    }

    .-t-theme-color {
      color: #5444E4;
    }
    .-t-red-color {
      color: rgb(218, 55, 75);
    }
    .-t-o-color {
      color: #ff9966;
    }
    .-t-g-color {
      color: #66d0a5
    }
  }

</style>
