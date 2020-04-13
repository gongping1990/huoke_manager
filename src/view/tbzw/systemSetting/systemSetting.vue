<template>
  <div class="p-active">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right " :total="tab.total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-active"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑版本' : '创建版本'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="80">
          <FormItem label="版本号" prop="version">
            <Input type="text" v-model="addInfo.version" placeholder="请输入版本号"></Input>
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
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import {pattern} from '@/libs/regexp';

  export default {
    name: 'systemSetting',
    components: {Loading},
    data() {
      return {
        tab: {
          page: 1,
          total: 0,
          currentPage: 1,
          pageSize: 10
        },
        isOpenModal: false,
        isSending: false,
        isFetching: false,
        dataList: [],
        typeName: {},
        addInfo: {
          type: 0
        },
        ruleValidate: {
          version: [
            {required: true, message: '请输入版本号', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '小程序版本号',
            key: 'version',
            align: 'center'
          },
          {
            title: '版本创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '马甲状态',
            render: (h, param) => {
              return h('div', param.row.passed ? '已启用' : '已停用');
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
                      this.editPassedVer(params.row);
                    }
                  }
                }, params.row.passed ? '停用' : '启用'),
              ]);
            }
          }
        ],
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      openModal() {
        this.isOpenModal = true;
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },
      getList() {
        this.isFetching = true;

        this.$api.tbzwVermanage.pageVersionControl({
          current: this.tab.page,
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
      editPassedVer(data) {

        this.$api.tbzwVermanage.editPassedVer({
          verId: data.id,
          passed: !data.passed
        })
          .then(
            response => {
              this.getList();
            });
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true;
            this.$api.tbzwVermanage.editVersionControl({
              forced: false,
              type: 1,
              version: this.addInfo.version
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.closeModal(name);
                    this.getList();
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
  .p-active {

    .-c-form {
      width: 50%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }
    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }
  }
</style>
