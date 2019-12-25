<template>
  <div class="p-articleManager">
    <Card>
      <div class="g-flex-j-sa -p-a-tree">
        <Col :span="4" class="g-t-left -p-a-left">
          <Tree :data="treeList" @on-select-change="changeTree" class="-p-a-l-t"></Tree>
        </Col>
        <Col :span="20">
          <managerArticleList ref="childMethod" :columnInfo="columnId"></managerArticleList>
        </Col>
      </div>
    </Card>
  </div>
</template>

<script>
  import managerArticleList from "./articleLis";

  export default {
    name: 'articleManager',
    components: {managerArticleList},
    data() {
      return {
        detailInfo: this.$route.query,
        treeList: [],
        columnId: '',
      }
    },
    mounted() {
      this.initTree()
    },
    methods: {
      initTree () {
        this.getTreeList()
      },
      getTreeList() {
        this.isFetching = true
        this.$api.hkywhdMaterial[this.detailInfo.urlList]({
          subject: this.detailInfo.subject,
        })
          .then(
            response => {
              let array = []
              let arrayChild = []
              for (let list of response.data.resultData) {

                arrayChild = []

                if (list.subCategoryName) {
                  for (let item of list.subCategoryName) {
                    arrayChild.push({
                      firstName: list.categoryName,
                      title: item,
                      isFirst: false,
                    })
                  }
                }

                array.push({
                  firstName: list.categoryName,
                  title: list.categoryName,
                  isFirst: true,
                  children: arrayChild
                })
              }
              this.treeList.unshift({
                title: this.detailInfo.columnName,
                id: this.detailInfo.columnId,
                expand: true,
                selected: true,
                children: array
              })
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      changeTree(data) {
        this.columnId = data.length && data[0]

        setTimeout(() => {
          data.length && this.$refs.childMethod.getList(1)
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
