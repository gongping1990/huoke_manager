<template>
  <Modal title="产品详情"
         class="p-goods"
         v-model="isOpenModal"
         width="900px"
         @on-cancel="closeModal()">
    <Row>
      <Col :span="9">
        <div class="g-flex-a-j-center">
          <div style="width: 100px">当前选中：</div>
          <Select v-model="form.state" placeholder="请选择"
                  @on-change="getList(1)">
            <Option v-for="item of goodsList" :label="item.name" :value="item.id"
                    :key="item.id"></Option>
          </Select>
        </div>
      </Col>
    </Row>

    <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="dataList"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChangeRecord"></Page>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'productDetail',
    props: ['id', 'list'],
    data() {
      return {
        form: {
          state: this.id
        },
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        dataList: [],
        goodsList: this.list,
        total: 0,
        isOpenModal: false,
        isFetching: false,
        columnsRecord: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '打开人数',
            render: (h, params) => {
              return h('div',[
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`生字  ${params.row.openNum[0] || 0}`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`朗读  ${params.row.openNum[1] || 0}`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`精读  ${params.row.openNum[2] || 0}`),
              ])
            },
            align: 'center'
          },
          {
            title: '通关人数',
            render: (h, params) => {
              return h('div',[
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`生字  ${params.row.finishNum[0] || 0}`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`朗读  ${params.row.finishNum[1] || 0}`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`精读  ${params.row.finishNum[2] || 0}`),
              ])
            },
            align: 'center',
          },
          {
            title: '平均通关时长',
            render: (h, params) => {
              return h('div',[
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`生字  ${params.row.avgTime[0] || 0}s`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`朗读  ${params.row.avgTime[1] || 0}s`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`精读  ${params.row.avgTime[2] || 0}s`),
              ])
            },
            align: 'center',
          },
          {
            title: '通关率',
            render: (h, params) => {
              return h('div',[
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`生字  ${params.row.finishRate[0] || 0}%`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`朗读  ${params.row.finishRate[1] || 0}%`),
                h('div', {
                  style: {
                    'line-height': '20px'
                  }
                },`精读  ${params.row.finishRate[2] || 0}%`),
              ])
            },
            align: 'center',
          }
        ],
      }
    },
    mounted() {
      this.isOpenModal = true
      this.getList()
    },
    methods: {
      currentChangeRecord(val) {
        this.tab.page = val;
        this.getList();
      },

      getList(num) {
        this.dataList = []
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.hkywDataCenter.getPrepProductDetail({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          lessonId: this.form.state
        }).then(response => {
          this.total = response.data.resultData.total;
          response.data.resultData.records.forEach(item => {
            this.dataList.push({
              name: item.name,
              date: item.date,
              avgTime: JSON.parse(item.avgTime),
              openNum: JSON.parse(item.openNum),
              finishNum: JSON.parse(item.finishNum),
              finishRate: JSON.parse(item.finishRate)
            })
          })
        })
          .finally(() => {
            this.isFetching = false
          })
      },
      closeModal() {
        this.$emit('closeModal')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-goods {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 100%;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }
  }
</style>
