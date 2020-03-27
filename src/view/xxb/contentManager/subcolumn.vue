<template>
  <Card>
    <div class="p-tree">

      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-tree"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="350"
        :title="addInfo.id ? '编辑栏目' : '新增栏目'">
        <Form ref="addInfo" :model="addInfo" :label-width="80">
          <FormItem label="栏目名称" prop="name" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.name" placeholder="请输入栏目名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sort" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.sort" placeholder="请输入排序值"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="g-flex-j-sa">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <loading v-if="isFetching"></loading>
    </div>
  </Card>

</template>
<script>
  import {pattern} from '@/libs/regexp'
  import Loading from "@/components/loading";

  export default {
    name: 'xxb_subcolumn',
    components: {Loading},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        dataList: [],
        isOpenModal: false,
        isFetching: false,
        isSending: false,
        addInfo: {},
        columns: [
          {
            title: '栏目名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sort',
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
                }, '删除')
              ])
            }
          }

        ]
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.isFetching = true

        this.$api.xxbSection.getSectionPage({
          current: this.tab.page,
          size: this.tab.pageSize,
          provinceCityId: this.$route.query.provinceCityId,
          category: this.$route.query.category,
          sectionId: this.$route.query.id
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
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            id: '',
            name: '',
            sort: ''
          }
        }
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.xxbSection.delete({
              id: param.id
            })
              .then(
                response => {
                  if (response.data.code == "200") {
                    this.$Message.success("操作成功");
                    this.getList();
                  }
                })
          }
        })
      },
      closeModal() {
        this.isOpenModal = false
      },
      submitInfo(name) {
        if (!this.addInfo.name) {
          return this.$Message.error('请输入栏目名称')
        } else if (!this.addInfo.sort) {
          return this.$Message.error('请输入排序值')
        } else if (!pattern.positiveInteger.exec(this.addInfo.sort)) {
          return this.$Message.error('排序值为正整数')
        }
        this.isSending = true

        this.$api.xxbSection.saveSxbSection({
          id: this.addInfo.id,
          sectionId: this.$route.query.id,
          category: this.$route.query.category,
          provinceCityId: this.$route.query.provinceCityId,
          name: this.addInfo.name,
          sort: this.addInfo.sort
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList(1)
                this.closeModal()
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  }
</script>

<style scoped lang="less">
  .p-tree {
  }

</style>
