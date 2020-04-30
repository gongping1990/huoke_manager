<template>
  <div class="p-gswList">
    <Card>
      <Table  :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="p-gswList-top g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-gswList"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="编辑">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="类型" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入类型"></Input>
          </FormItem>
          <Form-item label="封面" class="ivu-form-item-required">
            <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="播放数量" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入播放数量"></Input>
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
  import dayjs from 'dayjs';
  import {getBaseUrl} from '@/libs/index';
  import UploadImg from "@/components/uploadImg";

  export default {
    name: 'xxb_h5_gsw',
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
          address: [
            {required: true, message: '请选择结束时间', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '类型',
            key: 'name',
            align: 'center'
          },
          {
            title: '封面',
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toJump(params.row);
                    }
                  }
                }, '内容管理')
              ]);
            }
          }
        ]
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true;
        this.addInfo = JSON.parse(JSON.stringify(data));
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
        this.$api.xxbBanner.pageBanner({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
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
      toJump(param) {
        this.$router.push({
          name: 'xxb_h5_gsw_content',
          query: {
            id: param.id
          }
        })
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
    }
  };
</script>


<style lang="less" scoped>
  .p-gswList {
    &-top {
      margin-top: 20px;
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
