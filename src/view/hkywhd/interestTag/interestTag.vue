<template>
  <div class="p-interestTag">
    <Card>
      <div class="g-search p-interestTag-flex">
        <div class="g-t-left">
          <Radio-group v-model="tagType" type="button" @on-change="changeTagType">
            <Radio v-for="(item, index) of tagList" :key="index" :label="item.categoryId">{{item.categoryName}}</Radio>
          </Radio-group>
        </div>
        <div>
          <Button @click="openModalGroup(dataItem)">编辑标签组</Button>
          <Button type="primary" @click="openModalGroup()">添加标签组</Button>
        </div>
      </div>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-interestTag"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑标签' : '创建标签'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="50">
          <FormItem label="名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入标签名称"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-interestTag"
        v-model="isOpenModalGroup"
        @on-cancel="closeModal('addInfoGroup')"
        width="500"
        :title="addInfoGroup.id ? '编辑标签组' : '创建标签组'">
        <Form ref="addInfoGroup" :model="addInfoGroup" :rules="ruleValidateGroup" :label-width="50">
          <FormItem label="名称" prop="name">
            <Input type="text" v-model="addInfoGroup.name" placeholder="请输入标签组名称"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfoGroup')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfoGroup('addInfoGroup')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'bannerList',
    data() {
      return {
        tagType: '1',
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        tagList: [],
        total: 0,
        dataItem: '',
        isFetching: false,
        isOpenModal: false,
        isOpenModalGroup: false,
        isSending: false,
        addInfo: {},
        addInfoGroup: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入标签名称', trigger: 'blur'},
          ]
        },
        ruleValidateGroup: {
          name: [
            {required: true, message: '请输入标签组名称', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '标签名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '业务应用',
            key: 'useCourseCount',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params)=>{
              return h('div', dayjs(+params.row.gmtCreate).format('YYYY-MM-DD HH:mm'))
            },
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '编辑'),
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small'
                //   },
                //   style: {
                //     color: 'rgba(218, 55, 75)'
                //   },
                //   on: {
                //     click: () => {
                //       this.delItem(params.row)
                //     }
                //   }
                // }, '删除')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getTagCategoryList()
    },
    methods: {
      changeTagType () {
        this.tagList.forEach(item=>{
          if(item.categoryId === this.tagType) {
            this.dataItem = item
          }
        })

        this.getList()
      },
      openModalGroup (data) {
        this.isOpenModalGroup = true
        if (data) {
          this.addInfoGroup = JSON.parse(JSON.stringify(data))
          this.addInfoGroup.name = this.addInfoGroup.categoryName
        } else {
          this.addInfoGroup = {}
        }
      },
      openModal(data) {
        this.isOpenModal = true
        this.dataItem = data
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {}
        }
      },

      closeModal(name) {
        this.isOpenModal = false
        this.isOpenModalGroup = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getTagCategoryList() {
        this.isFetching = true
        this.$api.hkywhdTagManage.getTagCategoryList()
          .then(
            response => {
              this.tagList = response.data.resultData;
              this.tagType = this.tagList.length && this.tagList[0].categoryId
              this.dataItem = this.tagList.length && this.tagList[0]
              this.getList()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getList() {
        this.isFetching = true
        this.$api.hkywhdTagManage.getTagPage({
          current: this.tab.page,
          size: this.tab.pageSize,
          categoryId: this.tagType,
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
            this.$api.hkywhdTagManage.removeById({
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
            this.isSending = true
            this.$api.hkywhdTagManage.saveTag({
              id: this.addInfo.id,
              name: this.addInfo.name,
              categoryId: this.tagType
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
      },
      submitInfoGroup(name) {
        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.hkywhdTagManage.saveTagCategory({
              id: this.addInfoGroup.categoryId,
              name: this.addInfoGroup.name
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getTagCategoryList()
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
  .p-interestTag {
    .-c-tips {
      color: #39f
    }

    &-flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      width: 100%;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .g-add-top{
      top: 78px;
    }

  }
</style>
