<template>
  <div class="p-bookingList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">活动名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">活动状态：</div>
            <Select v-model="searchInfo.payed" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of receiveStatus" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-bookingList"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="800"
        :title="addInfo.id ? '编辑预约信息' : '创建预约信息'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="130">
          <FormItem label="注意" class="-c-tips">
            添加活动后，预约人数为0时，可以更改所有活动信息。预约人数大于0时，活动关联的付费体验课班级不可更改，活动开始时间不可更改。每个付费体验课班级只能被一个预约活动关联，请谨慎操作。
          </FormItem>
          <FormItem label="关联付费体验课班级" class="ivu-form-item-required">
            <div class="p-bookingList-formItemWrap" v-for="item of 3">
              <div class="-item-name">乐小狮作文低段体验课</div>
              <Select class="-item-select" v-model="addInfo.payed">
                <Option v-for="item of 5" :label=item.name :value=item.id :key="item.id"></Option>
              </Select>
            </div>
          </FormItem>
          <FormItem label="优惠信息" class="ivu-form-item-required">
            <div class="p-bookingList-formDataItem" v-for="(item,index) of discountInfoList" :key="index">
              <div class="item-wrap">
                <span>满足人数</span>
                <Input class="-item-input" type="text" v-model="item.num" placeholder="人数"></Input>
              </div>
              <div class="item-wrap">
                <span>优惠金额</span>
                <Input class="-item-input" type="text" v-model="item.price" placeholder="金额"></Input>
              </div>
              <div class="item-wrap">
                <span>购课地址</span>
                <Input class="-item-input" type="text" v-model="item.address" placeholder="购课地址"></Input>
              </div>
              <div class="g-error g-cursor" @click="delActiveInfo(index)">删除</div>
            </div>
            <Button v-if="discountInfoList.length<3" @click="addActiveInfo" ghost type="primary" style="width: 100px;">新增优惠等级</Button>
          </FormItem>

          <FormItem label="虚拟预约用户" prop="groupEndTime">
            <Button @click="openUserModal()" ghost type="primary" style="width: 100px;">+添加用户</Button>
            <div class="p-bookingList-formUser">
              <div class="-formUser-item" v-for="item of 20">
                <img class="-img" src="https://pub.file.k12.vip/2019/11/18/1196354701996023809.png"/>
                <div class="-name">虚拟预约用户1</div>
              </div>
            </div>
            <div class="-c-tips">为了营造真实的活动氛围，请选择在真实在群内的运营人员来充当虚拟预约用户</div>
          </FormItem>
          <FormItem label="预约活动时间" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="startTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" @on-change="changeStartClick"
                               v-model="addInfo.startTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="endTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="addInfo.endTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="抢课结束时间" prop="expiryEndDate">
            <Date-picker style="width: 100%" type="datetime" placeholder="选择抢课结束时间"
                         v-model="addInfo.expiryEndDate" :options="dateEndOption"></Date-picker>
          </FormItem>
          <FormItem label="活动规则">
            <Input type="textarea" v-model="addInfo.shareBigTitle" :rows="4" placeholder="请输入活动规则"></Input>
          </FormItem>
          <FormItem label="分享大标题">
            <Input type="text" v-model="addInfo.shareBigTitle" placeholder="请输入分享大标题"></Input>
          </FormItem>
          <FormItem label="分享小标题">
            <Input type="text" v-model="addInfo.shareSmallTitle" placeholder="请输入分享小标题"></Input>
          </FormItem>
          <Form-item label="链接配图">
            <upload-img v-model="addInfo.linkImg" :option="uploadOption"></upload-img>
          </Form-item>

        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

    </Card>

    <Modal
      class="p-bookingList"
      v-model="isOpenModalDetail"
      @on-cancel="isOpenModalDetail = false"
      footer-hide
      width="800"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Modal>

    <virtual-user-template v-model="isOpenModalUser"></virtual-user-template>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";
  import VirtualUserTemplate from "./virtualUserTemplate";

  export default {
    name: 'flashScreen',
    components: {VirtualUserTemplate, UploadImg, DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        receiveStatus: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '0',
            name: '未开始'
          },
          {
            id: '1',
            name: '进行中'
          },
          {
            id: '2',
            name: '已结束'
          },
          {
            id: '3',
            name: '已过期'
          }
        ],
        dataList: [],
        detailList: [],
        discountInfoList: [
          {
            num: '',
            price: '',
            address: ''
          }
        ],
        selectInfo: '1',
        searchInfo: {
          payed: '-1'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalDetail: false,
        isOpenModalUser: false,
        isSending: false,
        addInfo: {},
        copy_url: '',
        statusList: {
          '0': '未开始',
          '1': '进行中',
          '2': '已结束',
          '3': '已过期'
        },
        dateStartOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        dateEndOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        dateEndOptionTwo: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入团购名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '团购名称长度为20字', trigger: 'blur'}
          ],
          groupPrice: [
            {required: true, type: 'number', message: '请输入拼课价格', trigger: 'blur'},
          ],
          groupEndTime: [
            {required: true, message: '请输入拼课时限', trigger: 'blur'},
          ],
          autoGroupTime: [
            {required: true, message: '请输入自动成团时限', trigger: 'blur'},
          ],
          startTime: [
            {required: true, type: 'date', message: '请输入活动开始时间', trigger: 'blur'},
          ],
          endTime: [
            {required: true, type: 'date', message: '请输入活动结束时间', trigger: 'blur'},
          ],
          expiryEndDate: [
            {required: true, type: 'date', message: '请输入抢课结束时间', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '活动名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '关联付费体验课班级',
            key: 'groupEndTime',
            align: 'center'
          },
          {
            title: '优惠等级1',
            key: 'autoGroupTime',
            align: 'center'
          },
          {
            title: '优惠等级2',
            key: 'autoGroupTime',
            align: 'center'
          },
          {
            title: '优惠等级3',
            key: 'autoGroupTime',
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '活动时间',
            render: (h, params) => {
              return h('span', `${params.row.startTime} - ${params.row.endTime}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '操作',
            width: 220,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalDetail(params.row)
                    }
                  }
                }, '数据统计'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.copyUrl(params.row)
                    }
                  }
                }, '复制链接'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.state > 1 ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.endItem(params.row)
                    }
                  }
                }, '结束'),
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '预约页面PV',
            key: 'name',
            align: 'center'
          },
          {
            title: '预约页面UV',
            key: 'groupEndTime',
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '预约率',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '下单人数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '成功订单数',
            key: 'payUserCount',
            align: 'center'
          },
          {
            title: '预约-付费转化率',
            width: 150,
            key: 'payUserCount',
            align: 'center'
          }
        ]
      };
    },
    watch: {
      'addInfo.startTime'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeStartClick () {
        let data1 = new Date(this.addInfo.startTime).getTime()
        let data2 = new Date(this.addInfo.endTime).getTime()
        let data3 = new Date(this.addInfo.expiryEndDate).getTime()

        if (data1 > data2) {
          this.addInfo.endTime = ''
        }

        if ((data1 > data3) || (data2 > data3)) {
          this.addInfo.expiryEndDate = ''
        }
      },
      delActiveInfo (index) {
        this.discountInfoList.splice(index,1)
      },
      addActiveInfo() {
        this.discountInfoList.push({
          num: '',
          price: '',
          address: ''
        })
      },
      copyUrl(param) {
        this.copy_url = param.url
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      openUserModal() {
        this.isOpenModalUser = true
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))

        } else {
          this.discountInfoList = [
            {
              num: '',
              price: '',
              address: ''
            }
          ],
          this.addInfo = {
            id: '',
            groupPrice: null,
            linkImg: '',
            popImg: ''
          }
        }
      },
      openModalDetail(data) {
        this.isOpenModalDetail = true
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      //分页查询
      getDetailList(num) {
        this.isFetching = true
        if (num) {
          this.tabDetail.currentPage = 1
        }
        this.$api.tbzwGroupConfig.adminList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          state: this.searchInfo.payed
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
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.tbzwGroupConfig.adminList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          state: this.searchInfo.payed
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
      endItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？',
          onOk: () => {
            this.$api.tbzwGroupConfig.finish({
              id: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      submitInfo(name) {

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.tbzwGroupConfig.save({
              id: this.addInfo.id,
              startTime: dayjs(this.addInfo.startTime).format("YYYY/MM/DD HH:mm:ss"),
              endTime: dayjs(this.addInfo.endTime).format("YYYY/MM/DD HH:mm:ss"),
              name: this.addInfo.name,
              groupEndTime: this.addInfo.groupEndTime,
              autoGroupTime: this.addInfo.autoGroupTime,
              groupPrice: this.addInfo.groupPrice * 100,
              shareBigTitle: this.addInfo.shareBigTitle,
              shareSmallTitle: this.addInfo.shareSmallTitle,
              linkImg: this.addInfo.linkImg,
              popImg: this.addInfo.popImg,
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-bookingList {

    &-formItemWrap {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .-item-name {
        display: inline-block;
        margin-right: 20px;
      }

      .-item-select {
        width: 70%;
      }

    }

    &-formDataItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .item-wrap {
        width: 30%;
      }

      .-item-input {
        display: inline-block;
        margin-left: 10px;
        width: 120px;
      }
    }

    &-formUser {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;

      .-formUser-item {
        text-align: center;
        width: 80px;
        padding: 10px 10px 0 0;
        cursor: pointer;

        .-img {
          cursor: pointer;
          margin: 0 auto;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .-name {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          height: 20px;
          line-height: 20px;
        }
      }
    }

    .copy-input {
      position: absolute;
      opacity: 0;
    }

    .-search-select-text-two {
      margin-left: 20px;
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tips {
      color: #39f
    }

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }

  }
</style>
