<template>
  <div class="p-putIn">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-flex-a-j-center">
          <div class="-search-select-text">投放位置</div>
          <Select class="-search-selectOne" v-model="selectInfo" @on-change="getList(1)">
            <Option v-for="(item,index) in managerList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="selectInfo !== 3 ? columns : columnsTwo"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-putIn"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="700"
        :title="addInfo.id ? '编辑投放' : '创建投放'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="120">
          <FormItem label="投放名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入投放名称"></Input>
          </FormItem>
          <Form-item label="胶囊位图片">
            <upload-img v-model="addInfo.capsuleUrl" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="胶囊位链接">
            <Input type="text" v-model="addInfo.dropLink" placeholder="请输入链接"></Input>
          </FormItem>
          <Form-item label="弹窗图片">
            <upload-img v-model="addInfo.popUrl" :option="uploadOption"></upload-img>
          </Form-item>
          <Form-item label="按钮图片">
            <upload-img v-model="addInfo.buttonUrl" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="弹框链接">
            <Input type="text" v-model="addInfo.popLink" placeholder="请输入链接"></Input>
          </FormItem>
          <FormItem label="悬浮框链接">
            <Input type="text" v-model="addInfo.suspendedFrameLink" placeholder="请输入链接"></Input>
          </FormItem>
          <FormItem label="通知文案">
            <Input type="text" v-model="addInfo.noticeDoc" placeholder="请输入通知文案"></Input>
          </FormItem>
          <FormItem label="通知链接">
            <Input type="text" v-model="addInfo.noticeLink" placeholder="请输入链接"></Input>
          </FormItem>

          <div class="p-putIn-itemlist" v-for="(item,index) of addInfo.xxtdList" :key="index" v-if="selectInfo !== 3">
            <FormItem :label="`中部广告位图片${index+1}`">
              <upload-img ref="childImg" v-model="item.imgUrl" :option="uploadOption"></upload-img>
              <span class="-item-del g-cursor g-error" @click="delAd(1,index)">删除</span>
            </FormItem>
            <FormItem label="广告位链接">
              <Input type="text" v-model="item.link" placeholder="请输入链接"></Input>
            </FormItem>
          </div>
          <div class="g-flex-a-j-center">
            <Button class="g-margin-center" @click="addAd(1)" v-if="selectInfo !== 3" ghost type="primary">+ 新增学习天地广告位
            </Button>
          </div>

          <div class="p-putIn-itemlist" v-for="(item1,index1) of addInfo.homepageList" :key="index1"
               v-if="selectInfo === 3">
            <FormItem :label="`首页广告位图片${index1+1}`">
              <upload-img ref="childImg"  v-model="item1.imgUrl" :option="uploadOption"></upload-img>
              <span class="-item-del g-cursor g-error" @click="delAd(2,index1)">删除</span>
            </FormItem>
            <FormItem label="广告位链接">
              <Input type="text" v-model="item1.link" placeholder="请输入链接"></Input>
            </FormItem>
          </div>
          <div class="g-flex-a-j-center">
            <Button class="g-margin-center" @click="addAd(2)" v-if="selectInfo === 3" ghost type="primary">+ 新增首页广告位
            </Button>
          </div>

          <div class="p-putIn-itemlist" v-for="(item2,index2) of addInfo.bottomList" :key="`${index2}-${index2}`"
               v-if="selectInfo === 3">
            <FormItem :label="`底部广告位图片${index2+1}`">
              <upload-img ref="childImg"  v-model="item2.imgUrl" :option="uploadOption"></upload-img>
              <span class="-item-del g-cursor g-error" @click="delAd(3,index2)">删除</span>
            </FormItem>
            <FormItem label="广告位链接">
              <Input type="text" v-model="item2.link" placeholder="请输入链接"></Input>
            </FormItem>
          </div>
          <div class="g-flex-a-j-center p-putIn-top">
            <Button class="g-margin-center" @click="addAd(3)" v-if="selectInfo === 3" ghost type="primary">+ 新增底部广告位
            </Button>
          </div>

        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-putIn"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="800"
        title="数据详情">
        <Table class="-c-tab" :loading="isFetching" :columns="selectInfo !== 3 ? columnsModal : columnsModalTwo"
               :data="detailList"></Table>

        <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
        <div slot="footer" class="p-putIn-btn">
          <div @click="isOpenModalData = false" class="g-primary-btn">确 认</div>
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
  import Editor from "../../../components/editor";

  export default {
    name: 'banner',
    components: {Editor, UploadImg, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
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
        dataList: [],
        detailList: [],
        managerList: [],
        selectInfo: '1',
        dataItem: '',
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入投放名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '投放名称长度为20字', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '投放名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '胶囊位点击次数',
            key: 'bclick',
            align: 'center'
          },
          {
            title: '弹窗点击次数',
            key: 'wclick',
            align: 'center'
          },
          {
            title: '悬浮框点击次数',
            key: 'suspendedClick',
            align: 'center'
          },
          {
            title: '中部广告位点击次数',
            key: 'xxtdClick',
            align: 'center'
          },
          {
            title: '通知点击次数',
            key: 'noticeClick',
            align: 'center'
          },
          {
            title: '扫码页UV',
            key: 'uv',
            align: 'center'
          },
          {
            title: '二维码识别次数',
            key: 'qcNums',
            align: 'center'
          },
          {
            title: '是否关闭',
            render: (h, params) => {
              return h('div', params.row.finished ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.finished ? 'none' : 'inline-block',
                    color: '#5444E4'
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalData(params.row)
                    }
                  }
                }, '数据详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.finished ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '关闭')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '投放名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '胶囊位点击次数',
            key: 'bclick',
            align: 'center'
          },
          {
            title: '弹窗点击次数',
            key: 'wclick',
            align: 'center'
          },
          {
            title: '悬浮框点击次数',
            key: 'suspendedClick',
            align: 'center'
          },
          {
            title: '首页广告位点击次数',
            key: 'homepageClick',
            align: 'center'
          },
          {
            title: '底部广告位点击次数',
            key: 'bottomClick',
            align: 'center'
          },
          {
            title: '通知点击次数',
            key: 'noticeClick',
            align: 'center'
          },
          {
            title: '扫码页UV',
            key: 'uv',
            align: 'center'
          },
          {
            title: '二维码识别次数',
            key: 'qcNums',
            align: 'center'
          },
          {
            title: '是否关闭',
            render: (h, params) => {
              return h('div', params.row.finished ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.finished ? 'none' : 'inline-block',
                    color: '#5444E4'
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalData(params.row)
                    }
                  }
                }, '数据详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.finished ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '关闭')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '日期',
            render: (h, params) => {
              return h('div', dayjs(+params.row.date).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '胶囊位点击次数',
            key: 'bclick',
            align: 'center'
          },
          {
            title: '弹窗点击次数',
            key: 'wclick',
            align: 'center'
          },
          {
            title: '悬浮框点击次数',
            key: 'suspendedClick',
            align: 'center'
          },
          {
            title: '中部广告位点击次数',
            key: 'xxtdClick',
            align: 'center'
          },
          {
            title: '通知点击次数',
            key: 'noticeClick',
            align: 'center'
          },
          {
            title: '扫码页UV',
            key: 'uv',
            align: 'center'
          },
          {
            title: '二维码识别次数',
            key: 'scanNum',
            align: 'center'
          }
        ],
        columnsModalTwo: [
          {
            title: '日期',
            render: (h, params) => {
              return h('div', dayjs(+params.row.date).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '胶囊位点击次数',
            key: 'bclick',
            align: 'center'
          },
          {
            title: '弹窗点击次数',
            key: 'wclick',
            align: 'center'
          },
          {
            title: '悬浮框点击次数',
            key: 'suspendedClick',
            align: 'center'
          },
          {
            title: '中部广告位点击次数',
            key: 'homepageClick',
            align: 'center'
          },
          {
            title: '底部广告位点击次数',
            key: 'bottomClick',
            align: 'center'
          },
          {
            title: '通知点击次数',
            key: 'noticeClick',
            align: 'center'
          },
          {
            title: '扫码页UV',
            key: 'uv',
            align: 'center'
          },
          {
            title: '二维码识别次数',
            key: 'scanNum',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.listBizSystem()
    },
    methods: {
      addAd(num) {
        switch (num) {
          case 1:
            this.addInfo.xxtdList.push({
              imgUrl: '',
              link: ''
            })
            break
          case 2:
            this.addInfo.homepageList.push({
              imgUrl: '',
              link: ''
            })
            break
          case 3:
            this.addInfo.bottomList.push({
              imgUrl: '',
              link: ''
            })
            break
        }
      },
      delAd(num, index) {
        switch (num) {
          case 1:
            this.addInfo.xxtdList.splice(index, 1)
            break
          case 2:
            this.addInfo.homepageList.splice(index, 1)
            break
          case 3:
            this.addInfo.bottomList.splice(index, 1)
            break
        }
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.getInvestManageById(data)
        } else {
          this.addInfo = {
            id: '',
            popUrl: '',
            capsuleUrl: '',
            xxtdList: [],
            homepageList: [],
            bottomList: []
          }
        }
        this.$forceUpdate()
      },
      openModalData(data) {
        this.isOpenModalData = true
        this.dataItem = data
        this.getDetailList()
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getDetailList() {
        this.isFetching = true
        this.$api.hkywhdInvestmanage.pageWxSubscribeKfMsgData({
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
          investId: this.dataItem.id
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      getInvestManageById(data) {
        this.$api.hkywhdInvestmanage.getInvestManageById({
          investId: data.id
        }).then(response => {
          this.addInfo = response.data.resultData;
          setTimeout(()=>{
            this.$refs.childImg.forEach(item=>{
              item.init()
            })
          })
        })
      },
      listBizSystem() {
        this.$api.hkywhdInvestmanage.listBizSystem()
          .then(response => {
            this.managerList = response.data.resultData
            this.selectInfo = this.managerList[0].id
            this.getList()
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.hkywhdInvestmanage.pageInvestManage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          system: this.selectInfo
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要关闭吗？',
          onOk: () => {
            this.$api.hkywhdInvestmanage.finishInvest({
              investId: param.id
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
            let paramsData = {
              name: this.addInfo.name,
              system: this.selectInfo,
              dropLink: this.addInfo.dropLink,
              capsuleUrl: this.addInfo.capsuleUrl,
              buttonUrl: this.addInfo.buttonUrl,
              popUrl: this.addInfo.popUrl,
              popLink: this.addInfo.popLink,
              suspendedFrameLink: this.addInfo.suspendedFrameLink,
              noticeDoc: this.addInfo.noticeDoc,
              noticeLink: this.addInfo.noticeLink,
              xxtdList: this.addInfo.xxtdList,
              homepageList: this.addInfo.homepageList,
              bottomList: this.addInfo.bottomList,
            }
            let paramsUrl = this.addInfo.id ? this.$api.hkywhdInvestmanage.updateInvestManage({
              id: this.addInfo.id,
              ...paramsData
            }) : this.$api.hkywhdInvestmanage.addInvestManage(paramsData)
            paramsUrl
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
  .p-putIn {
    .-c-tips {
      color: #39f
    }
    .-search-select-text {
      min-width: 80px;
      text-align: left;
    }
    .-search-selectOne {
      border: 1px solid #dcdee2;
      border-radius: 4px;
      text-align: left;
    }

    &-itemlist {
      margin: 20px 0;
      border-bottom: 1px dashed #e9e9e9;

      .-item-del {
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    &-top {
      margin-top: 10px;
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
