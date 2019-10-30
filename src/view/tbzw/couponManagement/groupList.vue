<template>
  <div class="p-groupList">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <!--<Radio :label=0>小语轻作文</Radio>-->
          <Radio :label=1>乐小狮作文</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">团购名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">团购状态：</div>
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
        class="p-groupList"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="600"
        :title="addInfo.id ? '编辑优惠券' : '创建优惠券'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="注意" class="-c-tips">
            添加团购后，只能更改分享大标题、分享小标题、链接配图、弹窗图片，如其他参数填写错误，请结束后重新添加
          </FormItem>
          <FormItem label="适用课程">
            <div class="p-groupList-formItemWrap">
              <div class="-item-name" v-for="(item,index) of applicableCourseList" :key="index">{{item}}</div>
            </div>
          </FormItem>
          <FormItem label="团购名称" prop="name">
            <Input type="text" v-model="addInfo.name" :disabled="addInfo.id!=''" placeholder="请输入优惠券名称"></Input>
          </FormItem>
          <FormItem label="拼课价格" prop="groupPrice">
            <Input-number class="g-width" :min="0" :step="1" v-model="addInfo.groupPrice" :disabled="addInfo.id!=''"
                          placeholder="请输入优惠券面额（元）"></Input-number>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课时限" prop="groupEndTime">
            <Input type="text" v-model="addInfo.groupEndTime" :disabled="addInfo.id!=''" placeholder="请输入拼课时限"></Input>
          </FormItem>
          <FormItem label="自动成团" prop="autoGroupTime">
            <Input type="text" v-model="addInfo.autoGroupTime" :disabled="addInfo.id!=''" placeholder="请输入自动成团时限"></Input>
          </FormItem>
          <FormItem label="活动时间" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="startTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.startTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="endTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.endTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
          <Form-item label="弹窗图片">
            <upload-img v-model="addInfo.popImg" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="分享大标题">
            <Input type="text" v-model="addInfo.shareBigTitle" placeholder="请输入分享大标题"></Input>
          </FormItem>
          <FormItem label="分享小标题">
            <Input type="text" v-model="addInfo.shareSmallTile" placeholder="请输入分享小标题"></Input>
          </FormItem>
          <Form-item label="链接图片">
            <upload-img v-model="addInfo.linkImg" :option="uploadOption"></upload-img>
          </Form-item>

        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'flashScreen',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
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
        radioType: 1,
        dataList: [],
        selectInfo: '1',
        searchInfo: {
          payed: '-1'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
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
          ]
        },
        columns: [
          {
            title: '团购名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '拼课时限',
            key: 'groupEndTime',
            align: 'center'
          },
          {
            title: '自动成团时间',
            key: 'autoGroupTime',
            align: 'center'
          },
          {
            title: '拼课价格',
            render: (h, params) => {
              return h('span', (+params.row.groupPrice / 100).toFixed(2))
            },
            align: 'center'
          },
          {
            title: '付款人数',
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
            title: '团购状态',
            render: (h, params) => {
              return h('div', this.statusList[params.row.state])
            }
          },
          {
            title: '操作',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.state < 2 ? 'inline-block' : 'none',
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.state > 1 ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.endItem(params.row)
                    }
                  }
                }, '结束'),
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
                      this.copyUrl(params.row)
                    }
                  }
                }, '复制链接')
              ])
            }
          }
        ]
      };
    },
    computed: {
      applicableCourseList() {
        let list = []
        if (this.radioType === 0) {
          list = ['小语轻作文']
        } else {
          list = ['乐小狮作文高段', '乐小狮作文中段', '乐小狮作文低段']
        }
        return list
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      copyUrl(param) {
        this.copy_url = param.couponUrl
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.groupPrice = +this.addInfo.groupPrice / 100
        } else {
          this.addInfo = {
            id: '',
            groupPrice: null,
            linkImg: '',
            popImg: ''
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
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
              couponId: param.id
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
              shareSmallTile: this.addInfo.shareSmallTile,
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
  .p-groupList {

    &-formItemWrap {
      display: flex;

      .-item-name {
        display: inline-block;
        padding: 4px 8px;
        line-height: 18px;
        color: #ffffff;
        border-radius: 20px;
        background: #00c9ff;
        margin-left: 10px;
      }
    }
    .g-add-top {
      top: 110px;
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
