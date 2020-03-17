<template>
  <div class="p-cityList">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-cityList"
      v-model="isOpenModal"
      @on-cancel="isOpenModal=false"
      width="500"
      title="开通省市">
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="开通省市">
          <Radio-group v-model="addInfo.type">
            <Radio :label=1>省</Radio>
            <Radio :label=2>市</Radio>
          </Radio-group>

          <div class="p-cityList-list">
            <Select v-model="addInfo.province" v-if="addInfo.type === 1">
              <Option v-for="(item,index) of areaList" :key="index" :value="item.value" :label="item.label"></Option>
            </Select>
            <Cascader v-if="addInfo.type === 2" :data="areaList" trigger="hover" change-on-select
                      v-model="addInfo.city"></Cascader>
          </div>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="isOpenModal=false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import area from '@/libs/area.js'

  export default {
    name: 'cityList',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        addInfo: {
          city: []
        },
        areaList: area.list,
        total: 0,
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '省市名称',
            align: 'center',
            render: (h, param) => {
              return h('div', param.row.name || param.row.title)
            }
          },
          {
            title: '排序值',
            key: 'sort',
            align: 'center'
          },
          {
            title: '是否热门',
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.changeHot(params.row)
                    }
                  }
                }, '设为热门'),
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
                      this.changeOpen(params.row)
                    }
                  }
                }, '取消开通')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      // this.getList()
    },
    methods: {
      openModal() {
        this.isOpenModal = true
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      changeOpen(param) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要${param.isOpen ? '取消' : '设为'}开通吗？`,
          onOk: () => {
            this.$api.composition.removeTeacherById({
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
      changeHot(param) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要${param.isOpen ? '取消' : '设为'}热门吗？`,
          onOk: () => {
            this.$api.composition.removeTeacherById({
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
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.xxbMaterial[this.detailInfo.urlDetail]({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          categoryName: this.columnInfo.firstName,
          subject: this.detailInfo.subject,
          name: this.searchInfo.nickname,
          subCategoryName: this.columnInfo.isFirst ? '' : this.columnInfo.title
        })
          .then(
            response => {
              if (this.detailInfo.columnNum === '0') {
                this.dataList = response.data.resultData
              } else {
                this.dataList = response.data.resultData.records
                this.total = response.data.resultData.total
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (!this.addInfo.province && this.addInfo.type === 1) {
          return this.$Message.error('请选择需要开通的省')
        } else if (!this.addInfo.city.length && this.addInfo.type === 2) {
          return this.$Message.error('请选择需要开通的市')
        }

        if (this.isSending) return

        this.isSending = true
        this.$api.xxbBanner.saveBanner({
          id: this.addInfo.id,
          url: this.addInfo.url,
          sortnum: this.addInfo.sortnum
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.isOpenModal = false
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-cityList {

    &-list {
      margin-top: 10px;
    }

    .-c-tips {
      color: #39f
    }
    .-c-tab {
      margin: 20px 0;
    }

    .-p-v-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }
  }
</style>
