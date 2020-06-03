<template>
  <div class="p-exchangeRecord">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="g-search">
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">手机号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.antistop" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="selectChange"></Input>
          </div>
        </Col>
        <Col :span="10" style="margin-left: 10px" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          <Button type="primary" ghost class="-p-modal-btn -date-search" @click="toExcel">导出记录</Button>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current="tab.page" @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import {getBaseUrl} from "@/libs/index";
  import DatePickerTemplate from "@/components/datePickerTemplate";

  export default {
    name: 'orderList',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        selectInfo : '1',
        searchInfo: {
          antistop: ''
        },
        copy_url: '',
        dataList: [],
        dateOption: {
          name: '创建时间',
          type: 'datetime',
          row: '2'
        },
        total: 0,
        isFetching: false,
        getStartTime: '',
        getEndTime: '',
        columns: [
          {
            title: '用户昵称',
            key: 'nickname',
            tooltip: true,
            align: 'center'
          },
          {
            title: '手机号码',
            key: 'phone',
            tooltip: true,
            align: 'center'
          },
          {
            title: '使用的兑换码',
            key: 'code',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"));
            },
            align: 'center'
          },
        ],
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      copyUrl(param) {
        this.copy_url = param.url
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      changeDate(data) {
        this.getStartTime = data.startTime;
        this.getEndTime = data.endTime;
        this.selectChange();
      },
      toExcel() {
        let params = {
          nickname: '',
          phone: '',
          ...this.paramsInit()
        };
        let downUrl = `${getBaseUrl()}/poem-xym/courseCode/exportCourseCodeUseRecord?gmtCreateStart=${params.gmtCreateStart}&gmtCreateEnd=${params.gmtCreateEnd}&nickname=${params.nickname}&phone=${params.phone}`;
        console.log(downUrl, '导出路径');
        window.open(downUrl, '_blank');
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      selectChange() {
        this.tab.page = 1;
        this.tab.currentPage = 1;
        this.getList();
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          gmtCreateStart: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          gmtCreateEnd: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        };

        if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickname = this.searchInfo.antistop;
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.phone = this.searchInfo.antistop;
        }

        return params;
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.gswCourseCode.getCourseCodeUseRecord(this.paramsInit())
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
  .p-exchangeRecord {
    .copy-input {
      position: absolute;
      opacity: 0;
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

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
