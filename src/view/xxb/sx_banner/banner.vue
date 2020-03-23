<template>
  <div class="p-operationManager">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.subjectType" type="button" @on-change="getList()">
          <Radio :label=1>幼升小</Radio>
          <Radio :label=2>小升初</Radio>
          <Radio :label=3>中考</Radio>
          <Radio :label=4>高考</Radio>
        </Radio-group>
      </Row>
      <Row class="g-tab g-search g-t-left">
        <Radio-group v-model="searchInfo.conductType" type="button" @on-change="getList()">
          <Radio :label=2>进行中</Radio>
          <Radio :label=1>未开始</Radio>
          <Radio :label=3>已过期</Radio>
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
        class="p-operationManager"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑banner' : '创建banner'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <Form-item label="运营位图片" prop="img" class="ivu-form-item-required">
            <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sort">
            <Select v-model="addInfo.sort">
              <Option v-for="(item,index) of 9" :key="index" :value="item" :label="item"></Option>
            </Select>
          </FormItem>
          <FormItem label="链接地址" prop="address">
            <Input type="text" v-model="addInfo.address" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="有效期" class="ivu-form-item-required">
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
                  <Date-picker style="width: 100%" type="datetime" placeholder="选择结束日期"
                               v-model="addInfo.endTime" :options="dateEndOption"></Date-picker>
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
        class="p-operationManager"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="500"
        title="添加省市">
        <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
          <Form-item label="应用省市">
            {{dataItem.provinceCount}}省，{{dataItem.cityCount}}市
          </Form-item>
          <Form-item label="是否全选">
            <Radio-group v-model="addInfo.isAll" @on-change="changeAllCity">
              <Radio :label=1>是</Radio>
              <Radio :label=0>否</Radio>
            </Radio-group>
          </Form-item>
          <FormItem label="选择省市">
            <Select v-model="addInfo.cityIds" class="-search-selectOne" multiple filterable
                    :disabled="addInfo.isAll === 1">
              <Option v-for="(item,index) in cityList" :label=" item.cityName || item.provinceName" :value="item.id"
                      :key="index"></Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="isOpenModalData = false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitSetting()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import {getBaseUrl} from '@/libs/index';
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
        cityList: [],
        searchInfo: {
          subjectType: 1,
          conductType: 2
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        dataItem: {},
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
          sort: [
            {required: true, type: 'number', message: '请选择排序值', trigger: 'change'}
          ],
          startTime: [
            {required: true, type: 'date', message: '请选择开始时间', trigger: 'change'}
          ],
          endTime: [
            {required: true, type: 'date', message: '请选择结束时间', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请选择结束时间', trigger: 'blur'}
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
                    src: params.row.img
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ]);
            },
            width: 100,
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sort',
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '有效期时间',
            render: (h, params) => {
              return h('span', `${params.row.startTime} - ${params.row.endTime}`);
            },
            width: 300,
            align: 'center'
          },
          {
            title: '应用省市',
            render: (h, param) => {
              return h('div', `${param.row.provinceCount}省，${param.row.cityCount}市`);
            },
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
                      this.openModalData(params.row);
                    }
                  }
                }, '应用'),
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
                    color: 'rgba(218, 55, 75)'
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
        ]
      };
    },
    watch: {
      'addInfo.startTime'(_new, _old) {
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
      changeAllCity() {
        if (this.addInfo.isAll === 1) {
          this.addInfo.cityIds = []
          this.cityList.forEach(item=>{
            this.addInfo.cityIds.push(item.id)
          })
        }
        this.$forceUpdate()
      },
      openModal(data) {
        this.isOpenModal = true;
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data));
        } else {
          this.addInfo = {
            id: '',
            isAll: 0,
            startTime: '',
            endTime: '',
            sort: '',
            img: ''
          };
        }
      },
      openModalData(data) {
        this.dataItem = JSON.parse(JSON.stringify(data));
        this.isOpenModalData = true;
        this.addInfo = {
          id: '',
          cityIds: []
        };
        this.getAllProvinceCity(data);
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getDetailList(data) {
        this.isFetching = true;
        this.addInfo.cityIds = [];
        this.$api.xxbOperationPosition.getProvinceCityByOperationPositionId({
          id: data.id
        }).then(response => {
          let array = response.data.resultData;
          array.forEach(item => {
            this.addInfo.cityIds.push(item.id);
          });
          this.addInfo.isAll = this.addInfo.cityIds.length === this.cityList.length ? 1 : 0
        }).finally(() => {
          this.isFetching = false;
        });
      },
      getAllProvinceCity(data) {
        this.$api.xxbProvinceCity.getAllProvinceCity()
          .then(
            response => {
              this.cityList = response.data.resultData;
              this.getDetailList(data);
            });
      },
      //分页查询
      getList(num) {
        this.isFetching = true;
        if (num) {
          this.tab.currentPage = 1;
        }
        this.$api.xxbOperationPosition.getOperationPositionPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: 1,
          category: this.searchInfo.subjectType,
          state: this.searchInfo.conductType,
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
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.xxbOperationPosition.delete({
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

        if (this.isSending) return;

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.img) {
              return this.$Message.error('请上传图片');
            }

            this.isSending = true;
            this.$api.xxbOperationPosition.saveOperationPosition({
              id: this.addInfo.id,
              endTime: dayjs(this.addInfo.endTime).format("YYYY/MM/DD HH:mm:ss"),
              startTime: dayjs(this.addInfo.startTime).format("YYYY/MM/DD HH:mm:ss"),
              name: this.addInfo.name,
              category: this.searchInfo.subjectType,
              type: 1,
              address: this.addInfo.address,
              img: this.addInfo.img,
              sort: this.addInfo.sort
            })
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
      submitSetting() {
        let allCity = []
        if (this.isSending) return;

        if (!this.addInfo.isAll && !this.addInfo.cityIds.length) {
          return this.$Message.error('请选择需要应用的省市');
        }

        this.isSending = true;

        if (this.addInfo.isAll) {
          this.cityList.forEach(item=>{
            allCity.push(item.id)
          })
        }

        this.$api.xxbOperationPosition.changeProvinceCityByOperationPositionId({
          id: this.dataItem.id,
          provinceCityIds: this.addInfo.isAll ? allCity : this.addInfo.cityIds
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.isOpenModalData = false;
                this.getList();
              }
            })
          .finally(() => {
            this.isSending = false;
          });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-operationManager {

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
