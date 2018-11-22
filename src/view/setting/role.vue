<template>
  <div class="p-setting">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'use-role',
    data() {
      return {
        dataList: [],
        isFetching: false,
        columns: [
          {
            title: '角色ID',
            key: 'id'
          },
          {
            title: '角色名',
            key: 'name'
          },
          {
            title: '授权人数',
            key: 'countnum'
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.isFetching = true
        this.$api.admin.roleListCount()
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    },
  }
</script>

<style lang="less" scoped>
  .p-setting {
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
