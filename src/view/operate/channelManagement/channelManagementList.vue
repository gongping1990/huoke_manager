<template>
  <div class="p-channel">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">渠道名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center -date-search">
          <Col span="2">创建日期:</Col>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="searchInfo.fromDate"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期" @on-open-change="changeDate"
                           v-model="searchInfo.toDate"></Date-picker>
            </div>
          </Col>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-channel"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="350"
        :title="addInfo.id ? '编辑渠道' : '新增渠道'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="渠道名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入渠道名称"></Input>
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
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'channelManagement',
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入渠道名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '渠道名称长度为20字', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '累计销量',
            key: 'saleNum',
            align: 'center'
          },
          {
            title: '累计销售额',
            key: 'saleAmount',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('span', `${params.row.gmtCreate}`)
            },
            width: 300,
            align: 'center'
          },
          {
            title: '操作',
            width: 250,
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toDetail(params.row)
                    }
                  }
                }, '详情')
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
      changeDate (bool) {
        if(!bool) {
          this.getList(1)
        }
      },
      toDetail(data) {
        this.$router.push({
          name: 'channelDetail',
          query: {
            id: data.id
          }
        })
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            name: ''
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
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.channel.getList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          name: this.searchInfo.nickname,
          begin: this.searchInfo.fromDate ? dayjs(this.searchInfo.fromDate).format("YYYY/MM/DD HH:mm:ss") : '',
          end: this.searchInfo.toDate ? dayjs(this.searchInfo.toDate).format("YYYY/MM/DD HH:mm:ss") : ''
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
            let promiseDate = this.addInfo.id ? this.$api.channel.upadteChannel(this.addInfo) : this.$api.channel.addChannel(this.addInfo)
            promiseDate
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
  .p-channel {
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
