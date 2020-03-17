<template>
  <div class="p-banner">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.subjectType" type="button" @on-change="getList()">
          <Radio :label=0>幼升小</Radio>
          <Radio :label=1>小升初</Radio>
          <Radio :label=2>中考</Radio>
          <Radio :label=3>高考</Radio>
        </Radio-group>
      </Row>
      <Row class="g-tab g-search g-t-left">
        <Radio-group v-model="searchInfo.conductType" type="button" @on-change="getList()">
          <Radio :label=0>进行中</Radio>
          <Radio :label=1>未开始</Radio>
          <Radio :label=2>已过期</Radio>
        </Radio-group>
      </Row>

      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-banner"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑banner' : '创建banner'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <Form-item label="banner图片" prop="url" class="ivu-form-item-required">
            <upload-img v-model="addInfo.url" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortnum">
            <Select v-model="addInfo.sortnum">
              <Option v-for="(item,index) of 9" :key="index" :value="item" :label="item"></Option>
            </Select>
          </FormItem>
          <FormItem label="链接地址" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="有效期" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="showTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期" :disabled="addInfo.id!=''"
                               v-model="addInfo.showTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="hideTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="addInfo.hideTime" :options="dateEndOption"></Date-picker>
                </Form-item>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-banner"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="500"
        title="添加省市">

        <div slot="footer" class="p-banner-btn">
          <div @click="isOpenModalData = false" class="g-primary-btn"> 确 认</div>
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
    name: 'banner',
    components: {UploadImg, DatePickerTemplate},
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
        dataList: [],
        searchInfo: {
          subjectType: 0,
          conductType: 0
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
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
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '活动名称长度为20字', trigger: 'blur'}
          ],
          sortnum: [
            {required: true, type: 'number', message: '请选择排序值', trigger: 'change'}
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.url
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 100,
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'href',
            align: 'center'
          },
          {
            title: '有效期时间',
            render: (h, params) => {
              return h('span', `${params.row.showTime} - ${params.row.hideTime}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '应用省市',
            key: 'pv',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
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
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
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
                }, '应用')
              ])
            }
          }
        ]
      };
    },
    watch: {
      'addInfo.showTime'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            id: '',
            showTime: '',
            hideTime: '',
            sortnum: '',
            url: ''
          }
        }
      },
      openModalData(data) {
        this.isOpenModalData = true
        this.getDetailList(data)
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getDetailList(data) {
        this.isFetching = true
        this.$api.xxbBanner.listBannerStatistics({
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
          bannerId: data.id
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.xxbBanner.pageBanner({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
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
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.xxbBanner.removeBanner({
              bannerId: param.id
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
        if (!this.addInfo.url) {
          return this.$Message.error('请上传图片')
        } else if (!this.addInfo.showTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.addInfo.hideTime) {
          return this.$Message.error('请输入结束时间')
        }

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.xxbBanner.saveBanner({
              id: this.addInfo.id,
              hideTime: dayjs(this.addInfo.hideTime).format("YYYY/MM/DD HH:mm:ss"),
              showTime: dayjs(this.addInfo.showTime).format("YYYY/MM/DD HH:mm:ss"),
              name: this.addInfo.name,
              href: this.addInfo.href,
              url: this.addInfo.url,
              sortnum: this.addInfo.sortnum
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
  .p-banner {

    .g-add-btn {
      top: 120px;
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
  }
</style>
