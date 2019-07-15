<template>
  <div class="p-articleManager">
    <Card>
      <Row class="-t-header" style="height: 100%">
        <Col :span="24">
          <path-record-sp :data-prop="detailInfo"></path-record-sp>
        </Col>
      </Row>
      <div class="g-flex-j-sa -p-a-tree">
        <Col :span="4" class="g-t-left -p-a-left" v-if="detailInfo.type == '2'">
          <Tree :data="treeList" @on-select-change="changeTree" class="-p-a-l-t"></Tree>
        </Col>
        <Col :span="detailInfo.type == '2' ? 20 : 24">
          <article-list-template ref="childMethod" :columnId="columnId" :nodeData="nodeData"></article-list-template>
        </Col>
      </div>
    </Card>
  </div>
</template>

<script>
  import ArticleListTemplate from "@/components/articleListTemplate";
  import PathRecordSp from "../../../../components/tree/pathRecordSp";

  export default {
    name: 'articleManager',
    components: {PathRecordSp, ArticleListTemplate},
    data() {
      return {
        detailInfo: this.$route.query,
        columnId: '',
        nodeData: '',
      }
    },
    computed: {
      treeList() {
        let list = []
        list.unshift({
          title: this.detailInfo.columnName,
          id: this.detailInfo.columnId,
          expand: true,
          selected: true,
          children: JSON.parse(localStorage.getItem('columnList'))
        })
        return list
      }
    },
    mounted() {
      this.columnId = this.detailInfo.columnId
    },
    methods: {
      changeTree(data) {
        this.columnId = data[0].id
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
