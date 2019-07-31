<template>
  <div class="p-upgrade">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-upgrade"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="更新版本">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="选择版本" prop="id">
            <Select v-model="addInfo.id" >
              <Option v-for="(item,index) in versionList" :label="item.version" :value="item.id" :key="index"></Option>
            </Select>
            <div class="-c-tips">更新仅对装机低于发布版本的设备有效</div>
          </FormItem>
          <FormItem label="是否强制" prop="force">
            <Radio-group v-model="addInfo.force">
              <Radio :label=1 >是</Radio>
              <Radio :label=0 >否</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="更新说明" prop="updateNotes">
            <Input type="textarea" :rows="4" v-model="addInfo.updateNotes" placeholder="请输入更新说明"></Input>
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
  import UploadImg from "../../../components/uploadImg";
  import dayjs from 'dayjs'

  export default {
    name: 'qrcodeList',
    components: {UploadImg},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        versionList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          id: [
            {required: true, message: '请选择版本号', trigger: 'change'}
          ],
          updateNotes: [
            {required: true, message: '请输入更新说明', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '版本号',
            key: 'version'
          },
          {
            title: '是否强制',
            render: (h, params)=>{
              return h('span',params.row.force ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '更新说明',
            key: 'updateNotes',
            align: 'center'
          },
          {
            title: '状态',
            render: (h, params)=>{
              return h('div', params.row.finished ? `已结束（${params.row.finishTime}）` : '生效中')
            },
            align: 'center'
          },
          {
            title: '创建时间',
            key:'gmtCreate',
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
                    display: params.row.finished ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '结束')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal(data) {
        this.getVersionList()
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.endTime = new Date(+this.addInfo.endTime)
        } else {
          this.addInfo = {
            force: 0
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
      getVersionList() {
        this.$api.gswProduct.listPackageByProduct({
          current: this.tab.page,
          size: 1000
        })
          .then(
            response => {
              this.versionList = response.data.resultData.records
            })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.gswProduct.listReleaseByProduct({
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要结束吗？',
          onOk: () => {
            this.$api.gswProduct.versionFinished({
              productId: param.id
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
            this.$api.gswProduct.addRelease({
              id: this.addInfo.id,
              force: this.addInfo.force,
              updateNotes : this.addInfo.updateNotes
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
  .p-upgrade {
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
