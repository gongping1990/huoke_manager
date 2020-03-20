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
            <Radio :label=0>省</Radio>
            <Radio :label=1>市</Radio>
          </Radio-group>

          <div class="p-cityList-list">
            <Select v-model="addInfo.provinceId" v-if="addInfo.type === 0" @on-change="changeProvince">
              <Option v-for="(item,index) of areaList" :key="index" :value="item.value" :label="item.label"></Option>
            </Select>
            <Cascader v-if="addInfo.type === 1" :data="areaList" change-on-select @on-change="changeCascader"
                      v-model="addInfo.city"></Cascader>
          </div>
        </FormItem>
        <FormItem label="排序值" prop="sort">
          <InputNumber v-model="addInfo.sort" placeholder="请输入排序值"></InputNumber>
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
              return h('div', `${param.row.provinceName} ${param.row.cityName || ''}` )
            }
          },
          {
            title: '排序值',
            key: 'sort',
            align: 'center'
          },
          {
            title: '是否热门',
            render: (h, param) => {
              return h('div', param.row.hot ? '是' : '否' )
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.changeHot(params.row)
                    }
                  }
                }, params.row.hot ? '取消热门' : '设为热门'),
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
                }, params.row.display ? '取消开通' : '设为开通')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.areaList.forEach(list=>{
        list.children.forEach(item=>{
          item.children.forEach(data=>{
            data.disabled = true
          })
        })
      })
      this.getList()
      console.log(this.areaList)
    },
    methods: {
      changeCascader (data,selectedData) {
        if (selectedData.length === 2){
          this.addInfo.cityId = selectedData[1].value
          this.addInfo.cityName = selectedData[1].label
          this.addInfo.provinceId = selectedData[0].value
          this.addInfo.provinceName = selectedData[0].label
        }
      },
      changeProvince (data) {
        this.areaList.forEach(item=>{
          if(data === item.value) {
            this.addInfo.provinceName = item.label
          }
        })
      },
      openModal() {
        this.isOpenModal = true
        this.addInfo = {
          city: [],
          type:'',
          sort: null
        }
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      changeOpen(param) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要${param.display ? '取消' : '设为'}开通吗？`,
          onOk: () => {
            this.$api.xxbProvinceCity.setOrCancelDisplay({
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
            this.$api.xxbProvinceCity.setOrCancelHot({
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
        this.$api.xxbProvinceCity.getProvinceCityPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records
              this.total = response.data.resultData.total
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {

        if (!this.addInfo.provinceId && this.addInfo.type === 0) {
          return this.$Message.error('请选择需要开通的省')
        } else if (this.addInfo.city.length < 2 && this.addInfo.type === 1) {
          return this.$Message.error('请选择需要开通的市或州')
        } else if (this.addInfo.type === '') {
          return this.$Message.error('请选择开通的省或市')
        } else if (!this.addInfo.sort) {
          return this.$Message.error('请输入排序值')
        }

        if (this.isSending) return

        this.isSending = true

        this.$api.xxbProvinceCity.saveProvinceCity({
          provinceId: this.addInfo.provinceId,
          cityId: this.addInfo.cityId,
          provinceName: this.addInfo.provinceName,
          cityName: this.addInfo.cityName,
          sort: this.addInfo.sort,
          provinceCity: this.addInfo.type
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
