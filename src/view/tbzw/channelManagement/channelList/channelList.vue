<template>
  <div class="p-channelList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <div class="g-add-btn" @click="openAddModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"
             @on-sort-change="changeSort"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal title="渠道详情"
           class="p-channelList"
           v-model="isOpenModal"
           width="900px"
           @on-cancel="closeModal()">
      <Row>
        <RadioGroup v-model="modalDetailType" type="button" @on-change="getDetailList(1)">
          <Radio label="1">渠道</Radio>
          <Radio label="2">日期</Radio>
        </RadioGroup>
      </Row>

      <Row v-if="modalDetailType === '1'" class="-c-tab">
        <Col :span="9">
          <div class="g-flex-a-j-center">
            <div style="width: 100px">当前选中：</div>
            <Select v-model="searchInfo.goodsId" placeholder="请选择"
                    @on-change="getDetailList(1)">
              <Option v-for="item of dataList" :label="item.name" :value="item.id"
                      :key="item.id"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Row class="g-search -c-tab" v-if="modalDetailType === '2'">
        <Col :span="6" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Date-picker class="date-time"
                         placeholder="选择开始日期"
                         :options="dateOptionOne"
                         @on-change="changeDateOne"
                         v-model="selectTime"></Date-picker>
          </div>
        </Col>
        <!--<Col :span="17" class="g-flex-a-j-center">-->
         <!---->
          <!--<date-picker-template v-if="selectType===2" :dataInfo="dateOption"-->
                                <!--@changeDate="changeDateTwo"></date-picker-template>-->
        <!--</Col>-->
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="dataDetailList"
             @on-sort-change="changeSort"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator
            :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="currentChangeRecord"></Page>
    </Modal>


    <Modal
      class="p-channelList"
      v-model="isOpenAddModal"
      @on-cancel="closeAddModal('addInfo')"
      width="500"
      :title="addInfo.id ? '编辑渠道' : '创建渠道'">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
        <FormItem label="渠道名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入渠道名称"></Input>
        </FormItem>
        <FormItem label="渠道分类" prop="categoryId">
          <Select v-model="addInfo.categoryId" placeholder="请选择">
            <Option v-for="item of typeList" :label="item.name" :value="item.id"
                    :key="item.id"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeAddModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"
  import DatePickerTemplate from "@/components/datePickerTemplate";

  export default {
    name: 'gsw_channelList',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        dataDetailList: [],
        typeList: [],
        searchInfo: {},
        addInfo: {},
        selectType: 1,
        modalDetailType: '1',
        dateOptionOne: {
          disabledDate(date) {
            return date && date.valueOf() > (new Date().getTime() - 24 * 60 * 60 * 1000);
          }
        },
        dateOption: {
          name: '',
          type: 'datetime'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenAddModal: false,
        sortInfo: '',
        copy_url: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTime: '',
        getEndTime: '',
        ruleValidate: {
          name: [
            {required: true, message: '请输入渠道名称', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '请输入渠道分类', trigger: 'change'},
          ]
        },
        columns: [
          {
            title: '渠道名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '二维码',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.qrcode
                  },
                  style: {
                    width: '40px',
                    height: '40px',
                    margin: '10px auto'
                  }
                })
              ])
            },
            align: 'center'
          },
          {
            title: '累计下单数',
            key: 'orderCount',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '累计成交数',
            key: 'successOrderCount',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '累计访问量',
            key: 'pv',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '日均访问量',
            key: 'avgPv',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '累计转化率',
            render: (h, params) => {
              return h('span', `${params.row.conversionRate * 100}%`)
            },
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openAddModal(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.copyUrlFn(params.row)
                    }
                  }
                }, '复制链接'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.download(params.row)
                    }
                  }
                }, '下载二维码')
              ])
            }
          }
        ],
        columnsRecord: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '渠道名称',
            key: 'channelName',
            align: 'center'
          },
          {
            title: '下单数',
            key: 'orderCount',
            align: 'center'
          },
          {
            title: '成交数',
            key: 'successOrderCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '访问用户数',
            key: 'uv',
            align: 'center'
          },
          {
            title: '转化率',
            key: 'conversionRate',
            render: (h, params) => {
              return h('span', `${params.row.conversionRate * 100}%`)
            },
            align: 'center',
            sortable: 'custom'
          }
        ],
      };
    },
    mounted() {
      this.getList()
      this.getTypeList()
    },
    methods: {
      download(data) {
        window.open(data.qrcode, '_blank')
      },
      copyUrlFn(row) {
        this.copy_url = row.link;
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      changeDateOne(data) {
        this.selectTime = data
        this.getList(1)
      },
      changeDateTwo(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      changeSort(data) {
        this.sortInfo = data
        this.getDetailList(1)
      },
      closeModal() {
        this.isOpenModal = false
      },
      closeAddModal(name) {
        this.isOpenAddModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      currentChangeRecord(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      openModal(data) {
        this.searchInfo.goodsId = data.id
        this.isOpenModal = true
        this.getDetailList()

      },
      openAddModal(data) {
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {}
        }
        this.isOpenAddModal = true
      },
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.tbzwInternalChannel.listChannel({
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getTypeList() {
        this.$api.tbzwInternalChannel.categoryList({
          current: 1,
          size: 1000,
        })
          .then(
            response => {
              this.typeList = response.data.resultData.records;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getDetailList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tabDetail.page,
          size: this.tabDetail.pageSize,
          sort: this.sortInfo.key
        }
        if (this.modalDetailType === '1') {
          params.internalChannelId = this.searchInfo.goodsId
        } else {
          params.date = dayjs(this.selectTime).format('YYYYMMDD')
        }

        let promiseDate = this.modalDetailType === '1' ? this.$api.tbzwInternalChannel.getInternalChannelData(params) : this.$api.tbzwInternalChannel.getInternalChannelDataByDate(params)

        promiseDate.then(response => {
          this.dataDetailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.tbzwInternalChannel.saveChannel(this.addInfo)
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeAddModal(name)
                  }
                })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-channelList {
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
    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 20%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
