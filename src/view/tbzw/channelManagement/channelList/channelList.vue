<template>
  <div class="p-channelList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">


    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">一级分类：</div>
            <Select v-model="searchInfo.typeId" @on-change="changeFirst()" class="-search-selectOne">
              <Option v-for="item of typeList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">二级分类：</div>
            <Select v-model="searchInfo.typeIdTwo" @on-change="changeTwo()" class="-search-selectOne">
              <Option v-for="item of secondList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
      </Row>
      <div class="g-add-btn g-add-top" @click="openAddModal()">
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
        <FormItem label="一级分类" prop="categoryIdOne" v-show="addInfo.id == ''">
          <Select v-model="addInfo.categoryIdOne" placeholder="请选择" @on-change="getTypeListModal()">
            <Option v-for="(item, index) of typeListModal" :label="item.name" :value="item.id"
                    :key="item.id"></Option>
          </Select>
        </FormItem>
        <FormItem label="二级分类" prop="categoryId"  v-show="addInfo.id == ''">
          <Select v-model="addInfo.categoryId" placeholder="请选择">
            <Option v-for="(item, index) of secondListModal" :label="item.name" :value="item.id"
                    :key="item.id"></Option>
          </Select>
        </FormItem>
        <FormItem label="一级分类" v-if="addInfo.id!=''">
          {{addInfo.firstCategoryName}}
        </FormItem>
        <FormItem label="二级分类" v-if="addInfo.id!=''">
          {{addInfo.secondCategoryName}}
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
  import dayjs from 'dayjs';
  import {getBaseUrl} from "@/libs/index";
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
        typeListModal: [],
        secondList: [],
        secondListModal: [],
        searchInfo: {
          typeId: '-1',
          typeIdTwo: '-1'
        },
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
          categoryIdOne: [
            {required: true, message: '请选择一级分类', trigger: 'change'},
          ],
          categoryId: [
            {required: true, message: '请选择二级分类', trigger: 'change'},
          ]
        },
        columns: [
          {
            title: '渠道名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'link',
            align: 'center',
            tooltip: true
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
            title: '累计PV',
            key: 'pv',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '累计UV',
            key: 'uv',
            align: 'center',
            // sortable: 'custom'
          },
          {
            title: '累计转化率',
            render: (h, params) => {
              return h('span', `${(params.row.conversionRate * 100).toFixed(2)}%`);
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
                      this.openAddModal(params.row);
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
                      this.openModal(params.row);
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
                      this.copyUrlFn(params.row);
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
                      this.download(params.row);
                    }
                  }
                }, '下载二维码')
              ]);
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
            // sortable: 'custom'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center',
            // sortable: 'custom'
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
              return h('span', `${(params.row.conversionRate * 100).toFixed(2)}%`);
            },
            align: 'center',
            // sortable: 'custom'
          }
        ],
      };
    },
    mounted() {
      this.getList();
      this.getTypeList();
    },
    methods: {
      changeFirst() {
        this.searchInfo.typeIdTwo = '-1';
        this.getList(1);
        this.getTypeList();
      },
      changeTwo() {
        this.getList(1);
      },
      download(data) {
        window.open(data.qrcode, '_blank');
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
        this.selectTime = data;
        this.getDetailList(1);
      },
      changeDateTwo(data) {
        this.getStartTime = data.startTime;
        this.getEndTime = data.endTime;
        this.getList(1);
      },
      changeSort(data) {
        this.sortInfo = data;
        this.getDetailList(1);
      },
      closeModal() {
        this.isOpenModal = false;
      },
      closeAddModal(name) {
        this.isOpenAddModal = false;
        this.$refs[name].resetFields();
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
        this.searchInfo.goodsId = data.id;
        this.isOpenModal = true;
        this.getDetailList();
      },
      openAddModal(data) {
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data));
          this.addInfo.categoryIdOne = '1111'
        } else {
          this.addInfo = {
            id: ''
          };
        }
        this.isOpenAddModal = true;
        this.getTypeListModal();
      },
      //分页查询
      getList(num) {
        this.isFetching = true;
        if (num) {
          this.tab.currentPage = 1;
        }
        let cId = this.searchInfo.typeIdTwo === '-1' ? this.searchInfo.typeId === '-1' ? '' : this.searchInfo.typeId : this.searchInfo.typeIdTwo;
        console.log(cId,11)
        this.$api.tbzwInternalChannel.listChannel({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          internalChannelCategoryId: cId
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      getTypeList() {
        this.$api.tbzwInternalChannel.getAllChannelCategory({
          internalChannelCategoryId: this.searchInfo.typeId === '-1' ? '' : this.searchInfo.typeId
        })
          .then(
            response => {
              if (this.typeList.length) {
                this.secondList = response.data.resultData;
                this.secondList.unshift({
                  id: '-1',
                  name: '全部'
                });
              } else {
                this.typeList = response.data.resultData;
                this.typeList.unshift({
                  id: '-1',
                  name: '全部'
                });
              }
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      getTypeListModal() {
        this.$api.tbzwInternalChannel.getAllChannelCategory({
          internalChannelCategoryId: this.addInfo.categoryIdOne
        })
          .then(
            response => {
              if (this.typeListModal.length) {
                this.secondListModal = response.data.resultData;
              } else {
                this.typeListModal = response.data.resultData;
              }
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      getDetailList(num) {
        this.isFetching = true;
        if (num) {
          this.tab.currentPage = 1;
        }
        let params = {
          current: num ? num : this.tabDetail.page,
          size: this.tabDetail.pageSize,
          sort: this.sortInfo.key
        };
        if (this.modalDetailType === '1') {
          params.internalChannelId = this.searchInfo.goodsId;
        } else {
          params.date = dayjs(this.selectTime).format('YYYYMMDD');
        }

        let promiseDate = this.modalDetailType === '1' ? this.$api.tbzwInternalChannel.getInternalChannelData(params) : this.$api.tbzwInternalChannel.getInternalChannelDataByDate(params);

        promiseDate.then(response => {
          this.dataDetailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        })
          .finally(() => {
            this.isFetching = false;
          });
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.tbzwInternalChannel.saveChannel({
              id: this.addInfo.id,
              name: this.addInfo.name,
              categoryId: this.addInfo.categoryId
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList();
                    this.closeAddModal(name);
                  }
                });
          }
        });
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

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 200px;
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
