<template>
  <div class="p-teach">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">学段：</div>
            <Select v-model="searchInfo.sectionEnum" @on-change="getList" class="-search-selectOne">
              <Option v-for="(item,index) in periodList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">地区：</div>
            <Select v-model="searchInfo.provincesId" @on-change="getList" class="-search-selectOne">
              <Option v-for="(item,index) in provincesList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">等级：</div>
            <Select v-model="searchInfo.appLevelEnum" @on-change="getList" class="-search-selectOne">
              <Option v-for="(item,index) in publicGradeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">公众号名称</Option>
              <Option value="2">关键词</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.key" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList"></Input>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon" @click="openModal">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <div v-if="isOpenModal">
      <add-public @closeModal="closeModal" @successEmitPublic="submitInfo" :dataProp="addInfo" :type="2"></add-public>
    </div>
  </div>
</template>

<script>
  import AddPublic from "../../../components/publicAddressList/addPublic";

  export default {
    name: 'publicAddressList',
    components: {AddPublic},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          sectionEnum: '-1',
          provincesId: '-1',
          appLevelEnum: '-1',
        },
        selectInfo: '1',
        dataList: [],
        provincesList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        periodList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '小学'
          },
          {
            id: '2',
            name: '初中'
          },
          {
            id: '3',
            name: '高中'
          },
          {
            id: '4',
            name: '幼升小'
          },
          {
            id: '5',
            name: '小升初'
          },
          {
            id: '6',
            name: '中考'
          },
          {
            id: '7',
            name: '高考'
          }
        ],
        subjectList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '语文'
          },
          {
            id: '2',
            name: '数学'
          },
          {
            id: '3',
            name: '英语'
          },
          {
            id: '4',
            name: '物理'
          },
          {
            id: '5',
            name: '化学'
          },
          {
            id: '6',
            name: '生物'
          },
          {
            id: '7',
            name: '历史'
          },
          {
            id: '8',
            name: '地理'
          },
          {
            id: '9',
            name: '政治'
          }
        ],
        publicGradeList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '大号'
          },
          {
            id: '2',
            name: '中大号'
          },
          {
            id: '3',
            name: '中号'
          },
          {
            id: '4',
            name: '中小号'
          },
          {
            id: '5',
            name: '小号'
          }
        ],
        addInfo: '',
        columns: [
          {
            title: '公众号名称',
            key: 'name',
            align: 'center',
            fixed: 'left',
            width: 120
          },
          {
            title: '公众号ID',
            key: 'appId',
            align: 'center',
            width: 120
          },
          {
            title: '关键词',
            align: 'center',
            render: (h,params)=>{
              return h('div',params.row.keyword.map(function (item) {
                return h('Tag',item)
              }))
            },
            width: 180
          },
          {
            title: '学段',
            key: 'sectionEnum',
            render: (h,params)=>{
              return h('div',this.periodList[params.row.sectionEnum].name)
            },
            align: 'center',
            width: 60
          },
          {
            title: '地区',
            render: (h,params)=>{
              return h('div',`${params.row.provinceName} ${params.row.cityName ? params.row.cityName : ''} ${params.row.areaName ? params.row.areaName : ''}`)
            },
            align: 'center',
            width: 100
          },
          {
            title: '公众号等级',
            render: (h,params)=>{
              return h('div',this.publicGradeList[params.row.appLevelEnum].name)
            },
            align: 'center',
            width: 120
          },
          {
            title: '标签',
            render: (h,params)=>{
              return h('div',params.row.tags.map(function (item) {
                return h('Tag',item)
              }))
            },
            align: 'center',
            width: 200
          },
          {
            title: '一句话推荐',
            key: 'describes',
            align: 'center',
            width: 350
          },
          {
            title: '图标',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.icon
                },
                style: {
                  width: '60px',
                  height: '60px',
                  margin: '5px 0'
                }
              })
            },
            align: 'center',
            width: 100
          },
          {
            title: '粉丝数',
            key: 'funsNum',
            align: 'center',
            width: 80
          },
          {
            title: '回复图片',
            render: (h, params) => {
              if(params.row.qrcode) {
                return h('img', {
                  attrs: {
                    src: params.row.qrcode
                  },
                  style: {
                    width: '60px',
                    height: '60px'
                  }
                })
              }
            },
            align: 'center',
            width: 90
          },
          {
            title: '回复文案',
            key: 'writing',
            align: 'center',
            width: 350
          },
          // {
          //   title: '推送标题',
          //   key: 'sendTitle',
          //   align: 'center',
          //   width: 120
          // },
          // {
          //   title: '推送描述',
          //   key: 'sendDescribe',
          //   align: 'center',
          //   width: 120
          // },
          // {
          //   title: '推送链接',
          //   key: 'sendUrl',
          //   align: 'center',
          //   width: 120
          // },
          // {
          //   title: '推送图片',
          //   render: (h, params) => {
          //     if(params.row.sendImg) {
          //       return h('img', {
          //         attrs: {
          //           src: params.row.sendImg
          //         },
          //         style: {
          //           width: '60px',
          //           height: '60px',
          //           margin: '10px'
          //         }
          //       })
          //     }
          //   },
          //   align: 'center',
          //   width: 90
          // },
          {
            title: '操作',
            width: 200,
            align: 'center',
            fixed: 'right',
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
                    color: 'rgb(218, 55, 75)',
                    marginRight: '5px'
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
        ],
      };
    },
    mounted() {
      this.getList()
      this.getProvincesList()
    },
    methods: {
      getProvincesList() {
        this.isFetching = true
        this.$api.ylxcx_banner.provincesList()
          .then(
            response => {
              this.provincesList = response.data.resultData;
              this.provincesList.unshift({
                id: '-1',
                name: '全部'
              })
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
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      closeModal(name) {
        this.isOpenModal = false
      },
      //分页查询
      getList() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          provincesId: this.searchInfo.provincesId,
          sectionEnum: this.searchInfo.sectionEnum,
          appLevelEnum: this.searchInfo.appLevelEnum,
          type: '2'
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.name = this.searchInfo.key
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.keyword = this.searchInfo.key
        }

        this.isFetching = true
        this.$api.ylxcx_appInfo.schoolList(params)
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
          content: '确认要删除？',
          onOk: () => {
            this.$api.ylxcx_appInfo.delSchool({
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
      submitInfo(params) {
        if(this.isSending) return
        this.isSending = true
        this.addInfo = params
        console.log(this.addInfo)
        let promiseDate = this.addInfo.id ? this.$api.ylxcx_appInfo.updateSchool(this.addInfo) : this.$api.ylxcx_appInfo.addSchool(this.addInfo)
        promiseDate
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal()
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
  .p-teach {
    .-search-select-text {
      min-width: 45px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }


    .-p-text-right {
      text-align: right;
    }

    .-t-add-icon {
      top: 36px;
    }

    .-g-m-tip {
      color: #b3b5b8;
      display: flex;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
