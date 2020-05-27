<template>
  <div class="p-banner">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">banner名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
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
            <Input type="text" v-model="addInfo.sortnum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="跳转类型" prop="sortnum">
            <RadioGroup v-model="addInfo.jumpType">
              <Radio label="1">内部跳转</Radio>
              <Radio label="2">外部跳转</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="appID" v-if="addInfo.jumpType==='2'">
            <Input type="text" v-model="addInfo.appid" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="链接地址" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="有效期" class="ivu-form-item-required">
            <Row>
              <Col span="11">
                <Form-item prop="getStartTime">
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择开始日期"
                               @on-change="changeStartClick"
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
        class="p-banner"
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
  import dayjs from 'dayjs';
  import DatePickerTemplate from "@/components/datePickerTemplate";
  import UploadImg from "../../../../components/uploadImg";

  export default {
    name: 'zlkBannerList',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '有效时间',
          type: 'datetime'
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
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.url
                  },
                  style: {
                    width: '100px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ]);
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
                    this.openModalSort(params.row);
                  }
                }
              }, params.row.sortnum);
            },
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
              return h('span', `${dayjs(params.row.beginTime).format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(params.row.endTime).format('YYYY-MM-DD HH:mm:ss')}`);
            },
            width: 300,
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row);
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
                      this.delItem(params.row);
                    }
                  }
                }, '删除')
              ]);
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
        };
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      changeStartClick(date) {
        let s = new Date(date).getTime();
        let e = new Date(this.getEndTime).getTime();
        if (s > e) {
          this.getEndTime = '';
        }
      },
      changeDate(data) {
        this.searchInfo.fromDate = data.startTime;
        this.searchInfo.toDate = data.endTime;
        this.getList(1);
      },
      openModal(data) {
        this.isOpenModal = true;
        if (data) {
          let datas = JSON.parse(JSON.stringify(data));
          this.addInfo = {
            ...datas,
            jumpType: datas.inhref ? '1' : '2'
          };
          this.getStartTime = new Date(this.addInfo.beginTime);
          this.getEndTime = new Date(this.addInfo.endTime);
          this.addInfo.sortnum = this.addInfo.sortnum.toString();
        } else {
          this.getStartTime = '';
          this.getEndTime = '';
          this.addInfo = {
            url: '',
            jumpType: '1'
          };
        }
      },
      openModalSort(data) {
        this.isOpenModalSort = true;
        this.addInfo = JSON.parse(JSON.stringify(data));
        this.sortNum = this.addInfo.sortnum;
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true;
        if (num) {
          this.tab.currentPage = 1;
        }
        this.$api.zlkBanner.zlkBannerList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname || '',
          beginTime: this.searchInfo.fromDate ? new Date(this.searchInfo.fromDate).getTime() : '',
          endTime: this.searchInfo.toDate ? new Date(this.searchInfo.toDate).getTime() : ''
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除banner图片吗？',
          onOk: () => {
            this.$api.zlkBanner.zlkDelBanner({
              id: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              });
          }
        });
      },
      submitInfo(name) {
        if (!this.addInfo.url) {
          return this.$Message.error('请上传banner图片');
        } else if (this.addInfo.sortnum && (this.addInfo.sortnum < 1 || this.addInfo.sortnum > 99999)) {
          return this.$Message.error('排序值范围1-99999');
        } else if (!this.getStartTime) {
          return this.$Message.error('请输入开始时间');
        } else if (!this.getEndTime) {
          return this.$Message.error('请输入结束时间');
        } else if (this.addInfo.jumpType === '2' && !this.addInfo.appid) {
          return this.$Message.error('请输入appID');
        }

        if (this.isSending) return;
        this.addInfo.beginTime = new Date(this.getStartTime).getTime();
        this.addInfo.endTime = new Date(this.getEndTime).getTime();
        this.addInfo.inhref = this.addInfo.jumpType === '1';
        delete this.addInfo.jumpType;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true;
            let promiseDate = this.addInfo.id ? this.$api.zlkBanner.zlkUpdateBanner(this.addInfo) : this.$api.zlkBanner.zlkAddBanner(this.addInfo);
            promiseDate
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList();
                    this.closeModal(name);
                  }
                })
              .finally(() => {
                this.isSending = false;
              });
          }
        });
      },
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入排序值');
        }
        this.$api.materia.updateSortNumBanner({
          id: this.addInfo.id,
          sortnum: this.sortNum
        }).then(response => {
          if (response.data.code == '200') {
            this.$Message.success('修改成功');
            this.getList();
            this.isOpenModalSort = false;
          }
        });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-banner {
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
