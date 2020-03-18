<template>
  <div class="p-articleManager">
    <Card>

      <div class="g-flex-j-sa -p-a-tree">
        <Col :span="4" class="g-t-left -p-a-left">
          <Tree :data="treeList" @on-select-change="changeTree" class="-p-a-l-t"></Tree>
        </Col>
        <Col :span="20">
          <xxb-article-list ref="childMethod" :columnId="detailInfo.columnId" :nodeData="nodeData"></xxb-article-list>
        </Col>
      </div>
    </Card>
  </div>
</template>

<script>
  import XxbArticleList from "./articleList";

  export default {
    name: 'articleManager',
    components: {XxbArticleList},
    data() {
      return {
        detailInfo: this.$route.query,
        nodeData: '',
        treeList: [],
      }
    },
    mounted() {
      this.getSectionPage()
    },
    methods: {
      getSectionPage() {
        this.$api.xxbSection.getSectionPage({
          current: 1,
          size: 100000,
          provinceCityId: this.detailInfo.provinceCityId,
          category: this.detailInfo.category,
          sectionId: this.detailInfo.columnId
        })
          .then(
            response => {
              let list = response.data.resultData.records;
              list.forEach(item=>{
                item.title = item.name
              })

              this.treeList.unshift({
                title: this.detailInfo.columnName,
                id: this.detailInfo.columnId,
                expand: true,
                selected: true,
                children: list
              })
            })
      },
      changeTree(data) {
        this.detailInfo.columnId = data[0].id
        this.nodeData = data[0]

        setTimeout(() => {
          this.$refs.childMethod.getList()
        }, 0)
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-articleManager {

    .-active{
      color: rgb(84, 68, 228);
    }

    .-p-a-tree {
      font-weight: bold;

      &-item1 {
        width: 80%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-weight: normal;
        margin: 10px 10px 0 30px;
      }

      .-p-a-left{
        margin-right: 10px;
        border: 1px solid #dcdee2;
        border-radius: 4px;

        .-p-a-l-t{
          padding: 0 10px;
          overflow: auto;
          height: 100%;
        }
      }
    }
    .-t-header {
      margin-bottom: 20px;
      text-align: left;
    }

  }
</style>
