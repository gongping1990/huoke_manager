<template>
  <div class="p-formalOpeningTime">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import PoptipTimeTem from "./poptipTimeTem";

  export default {
    name: 'formalOpeningTime',
    components: {PoptipTimeTem},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '学年',
            key: 'typeName',
            align: 'center'
          },
          {
            title: '年级',
            key: 'typeName',
            align: 'center'
          },
          {
            title: '上学期开始时间',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(PoptipTimeTem, {
                  props: {
                    dataProp: params.row
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  }
                })
              ]);
            }
          },
          {
            title: '上学期结束时间',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(PoptipTimeTem, {
                  props: {
                    dataProp: params.row
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  }
                })
              ]);
            }
          },
          {
            title: '下学期开始时间',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(PoptipTimeTem, {
                  props: {
                    dataProp: params.row
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  }
                })
              ]);
            }
          },
          {
            title: '下学期结束时间',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(PoptipTimeTem, {
                  props: {
                    dataProp: params.row
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  }
                })
              ]);
            }
          }
        ]
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.tbzwInternalChannel.categoryList({
          current: this.tab.page,
          size: this.tab.pageSize,
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-formalOpeningTime {

    &-left {
     padding-left: 30px;
      display: flex;
      justify-content: left;
    }

    .-c-tips {
      color: #39f
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
