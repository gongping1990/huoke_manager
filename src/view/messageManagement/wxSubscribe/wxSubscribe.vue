<template>
  <div class="p-wxSubscribe">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">当前平台：</div>
            <Select v-model="searchInfo.status" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in appList" :label="item.name" :value="item.appid" :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-wxSubscribe"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑' : '创建'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="110">
          <FormItem label="触发平台" prop="appid">
            <Select v-model="addInfo.appid" class="-search-select">
              <Option v-for="item of appList" :key="item.id" :value="item.appid" :label="item.name"></Option>
            </Select>
          </FormItem>
          <FormItem label="触发名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入触发名称"></Input>
          </FormItem>
          <FormItem label="触发类型" prop="touchType">
            <Radio-group v-model="addInfo.touchType">
              <Radio :label=0>延时触发</Radio>
              <Radio :label=1>当日触发</Radio>
              <Radio :label=2>次日触发</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="触发时间" prop="time">
            <Input type="text" v-model="addInfo.time" placeholder="请输入触发时间"></Input>
          </FormItem>
          <FormItem label="内容类型" prop="contentType">
            <Radio-group v-model="addInfo.contentType">
              <Radio :label=0>文本</Radio>
              <Radio :label=1>图片</Radio>
              <Radio :label=2>文本+图片</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="文字内容" prop="content" v-if="addInfo.contentType==0 || addInfo.contentType==2">
            <Input type="textarea" :rows="5" v-model="addInfo.content" placeholder="请输入文字内容"></Input>
          </FormItem>
          <FormItem label="上传图片" prop="img" v-if="addInfo.contentType == 1 || addInfo.contentType==2">
            <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
          </FormItem>
          <FormItem label="页面key" prop="pageKey">
            <Input type="text" v-model="addInfo.pageKey" placeholder="请输入页面key"></Input>
          </FormItem>
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
  import {getBaseUrl} from '@/libs/index'
  import dayjs from 'dayjs'
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'hkxt_wxSubscribe',
    components: {UploadImg},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        searchInfo: {},
        dataList: [],
        total: 0,
        radioType: 1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        appList: [
          {
            name: '获课学堂',
            appid: 'wx983da8778930f639'
          },
          {
            name: '每日一首古诗词',
            appid: 'wxec108f208078c8a7'
          },
          {
            name: '小语轻作文',
            appid: 'wx31846130527d54cc'
          },
          {
            name: '获好物',
            appid: 'wx2b4ea0bae3a7d83a'
          },
          {
            name: '小学作文精品课',
            appid: 'wxb6218459e8c63dbf'
          },
          {
            name: '小学作文课',
            appid: 'wx86dd75af41172544'
          },
          {
            name: '小学作文网',
            appid: 'wx5239f8052b47a50d'
          },
          {
            name: '小学作文大师',
            appid: 'wxfff8c33608ce647b'
          }
        ],
        ruleValidate: {
          appid: [
            {required: true, message: '请选择触发平台', trigger: 'change'},
          ],
          name: [
            {required: true, message: '请输入触发名称', trigger: 'blur'}
          ],
          touchType: [
            {required: true, type:'number', message: '请选择触发类型', trigger: 'change'},
          ],
          contentType: [
            {required: true, type:'number', message: '请选择内容类型', trigger: 'change'},
          ],
          time: [
            {required: true, message: '请输入触发时间（延时触发为整数，定是触发格式（mm:ss））', trigger: 'blur'}
          ],
          pageKey: [
            {required: true, message: '请输入页面key', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '触发平台',
            key: 'appName',
            tooltip: true
          },
          {
            title: '触发名称',
            key: 'name',
            tooltip: true
          },
          {
            title: '触发类型',
            render: (h, params)=>{
              return h('div',params.row.touchType == 0 ? '延时触发' : params.row.touchType == 1 ? '当日触发' : '次日触发')
            },
            align: 'center'
          },
          {
            title: '触发时间',
            key: 'time',
            align: 'center',
            tooltip: true
          },
          {
            title: '内容类型',
            render: (h, params)=>{
              return h('div',params.row.contentType == 0 ? '文本' : params.row.contentType == 1 ? '图片' : '文本+图片')
            },
            align: 'center'
          },
          {
            title: '文字内容',
            width: 400,
            key: 'content',
            align: 'center',
            tooltip: true
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.img
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '页面key',
            key: 'pageKey',
            align: 'center',
            tooltip: true
          },
          {
            title: '操作',
            width: 190,
            align: 'center',
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
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
      this.searchInfo.status = this.appList[0].appid
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
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
        this.$api.wxSubscribeKfMsg.getList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          appid: this.searchInfo.status,
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              for (let list of  this.appList){
                for (let item of this.dataList) {
                  if (list.appid == item.appid) {
                    item.appName = list.name
                  }
                }
              }
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.wxSubscribeKfMsg.delete({
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
            if ((this.addInfo.contentType == 1 || this.addInfo.contentType==2) && !this.addInfo.img) {
              return this.$Message.error('请上传图片')
            }
            this.isSending = true
            this.$api.wxSubscribeKfMsg.saveOrUpdate({
              id: this.addInfo.id,
              name: this.addInfo.name,
              appid: this.addInfo.appid,
              touchType: this.addInfo.touchType,
              time: this.addInfo.time,
              contentType: this.addInfo.contentType,
              content: this.addInfo.content,
              img: this.addInfo.img,
              pageKey: this.addInfo.pageKey
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
  .p-wxSubscribe {
    .-c-tips {
      color: #39f
    }

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 200px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
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
