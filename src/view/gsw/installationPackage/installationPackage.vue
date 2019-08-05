<template>
  <div class="p-installationPackage">
    <Card>
      <div class="g-add-btn" @click="openModal('', 0)">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-installationPackage"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="isUpload ? '上传安装包' : '添加版本'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="版本号" prop="version" v-if="!isUpload">
            <Input type="text" v-model="addInfo.version" placeholder="请输入版本号"></Input>
          </FormItem>
          <FormItem label="安装包" prop="version" v-if="isUpload">
           <upload-file v-model="uploadInfo" :option="uploadOption" :action="baseUrl"></upload-file>
            <div class="-c-tips">* 仅支持安卓apk文件上传</div>
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
  import UploadFile from "../../../components/uploadFile";

  export default {
    name: 'installationPackage',
    components: {UploadFile},
    data() {
      return {
        baseUrl: '',
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          format: ['apk']
        },
        dataList: [],
        total: 0,
        radioType:1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isUpload: false,
        uploadInfo: {},
        addInfo: {},
        ruleValidate: {
          version: [
            {required: true, message: '请输入版本号', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '版本号',
            key: 'version'
          },
          {
            title: '创建时间',
            key: 'gmtCreate'
          },
          {
            title: '最近更新时间',
            key: 'gmtModified'
          },
          {
            title: '安卓安装包',
            key: 'filename',
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
                      window.open(params.row.androidPackage)
                    }
                  }
                }, '下载'),
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
                      this.openModal(params.row, 1)
                    }
                  }
                }, '上传')
              ])
            }
          }
        ],
      };
    },
    watch: {
      'uploadInfo' (_n,_o) {
        if(_n.isSucess) {
          this.isOpenModal = false
          this.$Message.success('上传成功')
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal(data, num) {
        if (num === 1) {
          this.isUpload = true
          this.baseUrl = `${getBaseUrl()}/poem/product/uploadPackage?id=${data.id}`
        } else {
          this.isUpload = false
        }
        this.isOpenModal = true
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
        this.$api.gswProduct.listPackageByProduct({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize
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
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.gswProduct.addVersion({
              version: this.addInfo.version
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
  .p-installationPackage {
    .-c-tips {
      color: #39f
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
