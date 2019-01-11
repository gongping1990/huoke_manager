<template>
  <div class="p-popManage">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">弹窗名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList"></Input>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center -date-search">
          <Col span="2">有效期:</Col>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="searchInfo.fromDate"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期"
                           v-model="searchInfo.toDate"></Date-picker>
            </div>
            <div class="-date-search">
              <Button type="primary" class="-p-modal-btn" @click="getList">搜索</Button>
            </div>
          </Col>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-popManage"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑弹窗' : '创建弹窗'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <Form-item label="弹窗图片" prop="url" class="ivu-form-item-required">
            <Upload
              v-if="!addInfo.url"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="200"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <div class="g-course-add-style">
                <span>+</span>
                <span>上传图片</span>
              </div>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.url">
              <div class="-c-course-item">
                <img :src="addInfo.url">
                <div class="-i-del" @click="delImg()">删除</div>
              </div>
            </div>
            <span class="-c-tips" v-else>只能上传jpg/png文件，且不超过200kb，图片尺寸为960px*360px</span>
          </Form-item>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortnum">
            <Input type="text" v-model="addInfo.sortnum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="链接地址" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="有效期" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期"
                               v-model="getStartTime" :options="dateStartOption"></Date-picker>
                </Form-item>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Form-item prop="getEndTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="getEndTime" :options="dateEndOption"></Date-picker>
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
        class="p-popManage"
        v-model="isOpenModalSort"
        @on-cancel="isOpenModalSort = false"
        width="350"
        title="编辑排序值">
        <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
          <FormItem label="排序值">
            <Input type="text" v-model="sortNum" placeholder="请输入排序值"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="isOpenModalSort = false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitSort()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'pushWindow',
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalSort: false,
        isSending: false,
        addInfo: {},
        sortNum: '',
        getStartTime: '',
        getEndTime: '',
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
            {required: true, message: '请输入排序值', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.url
                  },
                  style: {
                    width: '100px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortnum',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalSort(params.row)
                  }
                }
              }, params.row.sortnum)
            },
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'href'
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
    watch: {
      'getStartTime'(_new, _old) {
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
      delImg() {
        this.addInfo.url = ''
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.getStartTime = new Date(this.addInfo.showTime)
          this.getEndTime = new Date(this.addInfo.hideTime)
          this.addInfo.sortnum = this.addInfo.sortnum.toString()
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.addInfo = {
            url: ''
          }
        }
      },
      openModalSort(data) {
        this.isOpenModalSort = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.sortNum = this.addInfo.sortnum
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']
        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.addInfo.url = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.popManage.popManageList({
          current: this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          fromDate: this.searchInfo.fromDate ? dayjs(this.searchInfo.fromDate).format("YYYY/MM/DD HH:mm:ss") : '',
          toDate:  this.searchInfo.toDate  ? dayjs(this.searchInfo.toDate).format("YYYY/MM/DD HH:mm:ss") : ''
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
          content: '确认要删除弹窗图片吗？',
          onOk: () => {
            this.$api.popManage.delPopManage({
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
        if (!this.addInfo.url) {
          return this.$Message.error('请上传弹窗图片')
        } else if (this.addInfo.sortnum && (this.addInfo.sortnum < 1 || this.addInfo.sortnum > 99999)) {
          return this.$Message.error('排序值范围1-99999')
        } else if (!this.getStartTime) {
          return this.$Message.error('请输入开始时间')
        } else if (!this.getEndTime) {
          return this.$Message.error('请输入结束时间')
        }

        if (this.isSending) return
        this.addInfo.showTime = dayjs(this.getStartTime).format("YYYY/MM/DD HH:mm:ss")
        this.addInfo.hideTime = dayjs(this.getEndTime).format("YYYY/MM/DD HH:mm:ss")
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.popManage.updatePopManage(this.addInfo) : this.$api.popManage.addPopManage(this.addInfo)
            promiseDate
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
      },
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入排序值')
        }
        this.$api.popManage.updateSortNum({
          id: this.addInfo.id,
          sortnum: this.sortNum
        }).then(response => {
          if (response.data.code == '200') {
            this.$Message.success('修改成功');
            this.getList()
            this.isOpenModalSort = false
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-popManage {
    .-c-tips {
      color: #39f
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
