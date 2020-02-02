<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="800"
    :title="type == '1' ? '预约数据详情' : '预约后续报数据详情'">
    <Table class="-c-tab" :loading="isFetching" :columns="type == '1' ? columns : columnsTwo" :data="dataList"></Table>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'zhsj_detail',
    props: ['value', 'propPeriodId', 'type'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        total: 0,
        dataList: [],
        isOpenDetail: false,
        isFetching: false,
        radioType: '',
        columns: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'reserveCount',
            align: 'center'
          },
          {
            title: '已预约已购买人数',
            key: 'reserveBuyCount',
            align: 'center'
          },
          {
            title: '预约-购买转化率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.reserveBuyPercent*100}%`)
            },
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '报名人数',
            key: 'signCount',
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'reserveCount',
            align: 'center'
          },
          {
            title: '报名-预约率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.reservePercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '预约购买-总购买占比',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.reserveBuyAllPercent*100}%`)
            },
            align: 'center'
          }
        ],
      }
    },
    mounted() {

    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        _n && this.getList()
      },
    },
    methods: {
      getList() {
        this.dataList = []
        this.$api.tbzwStudyRecordData.getReserveBuyDataDetails({
          activeConfigId: this.propPeriodId,
        }).then(response => {
          let info = response.data.resultData
          if (this.type == '1') {
            info.forEach(item => {
              this.dataList.push({
                date: item.date,
                reserveCount: item.reserveCount,
                reserveBuyCount: item.reserveBuyCount,
                reserveBuyPercent: item.reserveBuyPercent,
              })
            })
          } else {
            info.forEach(item => {
              this.dataList.push({
                date: item.date,
                reserveCount: item.reserveCount,
                signCount: item.signCount,
                reservePercent: item.reservePercent,
                reserveBuyAllPercent: item.reserveBuyAllPercent,
              })
            })
          }
        })
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-detailModal {

    &-radio {
      text-align: center;
      width: 100%;
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

  }
</style>
