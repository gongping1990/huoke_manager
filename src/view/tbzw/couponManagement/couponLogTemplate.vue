<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="800"
    title="优惠券领取/使用详情">

    <Row class="g-search">
      <Col :span="5" class="g-t-left">
        <div class="g-flex-a-j-center">
          <div class="-search-select-text-two">是否使用：</div>
          <Select v-model="searchInfo.used" @on-change="getList(1)" class="-search-selectOne">
            <Option v-for="item of payTypeList" :label=item.name :value=item.id :key="item.id"></Option>
          </Select>
        </div>
      </Col>

      <Col :span="6">
        <div class="-search">
          <Select v-model="searchInfo.select" class="-search-select">
            <Option value="1">用户昵称</Option>
            <Option value="2">手机号码</Option>
          </Select>
          <span class="-search-center">|</span>
          <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                 @on-click="getList(1)"></Input>
        </div>
      </Col>
    </Row>

    <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'couponLogTemplate',
    props: ['value', 'couponId'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        payTypeList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '是',
          },
          {
            id: '0',
            name: '否',
          }
        ],
        searchInfo: {
          used: '-1',
          select: '1'
        },
        total: 0,
        dataList: [],
        isOpenDetail: false,
        isFetching: false,
        radioType: '',
        columns: [
          {
            title: '用户头像/昵称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headImgUrl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            },
            align: 'center'
          },
          {
            title: '电话号码',
            key: 'phone',
            align: 'center'
          },
          {
            title: '领取时间',
            render: (h, params)=>{
              return h('div', dayjs(+params.row.getTime).format('YYYY-MM-DD HH:mm'))
            },
            key: 'getTime',
            align: 'center'
          },
          {
            title: '使用时间',
            render: (h, params)=>{
              return h('div', params.row.useTime ? dayjs(+params.row.useTime).format('YYYY-MM-DD HH:mm') : '-')
            },
            key: 'useTime',
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
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getList(num) {
        if (num) {
          this.tab.currentPage = 1
        }

        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          id: this.couponId,
          used: this.searchInfo.used != '-1' ? (this.searchInfo.used == '1') : '',
        }

        if (this.searchInfo.select === '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.searchInfo.select === '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.$api.tbzwCoupon.getCouponUserDetais(params)
          .then(response => {
            this.dataList = response.data.resultData.records
            this.total = response.data.resultData.total;
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

    .-search-select-text-two {
      min-width: 60px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

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
