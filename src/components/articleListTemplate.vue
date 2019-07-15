<template>
  <div class="p-acticle">
    <Row class="g-search">
      <Col :span="12">
        <div class="g-flex-a-j-center">
          <div class="g-flex-a-j-center -search-radio" v-if="jumpType == '1'">
            <RadioGroup v-model="radioType" @on-change="getList(1)" type="button">
              <Radio :label="item.id" v-for="(item,index) of radioList" :key="index">{{item.title}}</Radio>
            </RadioGroup>
          </div>

          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">文章名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </div>
      </Col>
    </Row>

    <div class="g-add-btn -t-add-icon" @click="openModal()" v-if="nodeData.nodeKey>0 || jumpType == '1' || level =='0'">
      <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
    </div>

    <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>

    <Modal
      class="p-acticle"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      :title="addInfo.id ? '编辑文章' : '添加文章'">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
        <FormItem label="标题" prop="title">
          <Input type="text" v-model="addInfo.title" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="栏目" prop="categoryId" placeholder="请选择栏目"
                  v-if="jumpType == '2' && level == '2' && nodeData.secondColumn=='0'">
          <Select v-model="addInfo.categoryId">
            <Option v-for="(item,index) in columnList" :label="item.title" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="栏目" v-if="jumpType == '2' && (level == '1'||nodeData.secondColumn!='0')">
          {{nodeData.title || columnName}}
        </FormItem>
        <FormItem label="排序值" prop="sort">
          <Input type="text" v-model="addInfo.sort" placeholder="请输入排序值"></Input>
        </FormItem>
        <FormItem label="链接" prop="link">
          <Input type="text" v-model="addInfo.link" placeholder="请输入链接地址"></Input>
        </FormItem>
        <Form-item label="图片" prop="img" class="ivu-form-item-required">
          <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
        </Form-item>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <Modal
      class="p-acticle"
      v-model="isOpenModalSort"
      @on-cancel="isOpenModalSort = false"
      width="350"
      title="编辑排序值">
      <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
        <FormItem label="排序值">
          <Input type="text" v-model="sortNum" placeholder="请输入排序值"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="isOpenModalSort = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitSort()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import UploadImg from "./uploadImg";

  export default {
    name: 'articleListTemplate',
    components: {UploadImg},
    props: ['columnId', 'nodeData'],
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        radioList: [],
        columnList: '',
        selectInfo: '1',
        searchInfo: {},
        total: 0,
        radioType: '',
        isFetching: false,
        isOpenModal: false,
        isOpenModalSort: false,
        isSecondColumn: false,
        isThirdColumn: false,
        isSending: false,
        addInfo: {},
        sortNum: '',
        jumpType: this.$route.query.type,
        level: this.$route.query.level,
        columnName: this.$route.query.columnName,
        ruleValidate: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {type: 'string', max: 30, message: '标题长度为30字', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入排序值', trigger: 'blur'},
          ],
          categoryId: [
            {required: true, message: '请选择栏目', trigger: 'change'},
          ],
          link: [
            {required: true, message: '请输入链接', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '标题',
            key: 'title',
            fixed: 'left',
            width: 200
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.img
                  },
                  style: {
                    width: '100px',
                    height: '60px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '排序值',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalSort(params.row)
                  }
                }
              }, params.row.sort)
            },
            align: 'center',
            width: 100
          },
          {
            title: '浏览量（PV）',
            key: 'pv',
            align: 'center',
            width: 150
          },
          {
            title: '浏览用户',
            key: 'uv',
            align: 'center',
            width: 100
          },
          {
            title: '分享',
            key: 'share',
            align: 'center',
            width: 100
          },
          {
            title: '收藏',
            key: 'collected',
            align: 'center',
            width: 100
          },
          {
            title: '地址',
            key: 'link',
            align: 'center',
            width: 500
          },
          {
            title: '操作',
            width: 190,
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
                    color: 'rgba(218, 55, 75)',
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

      if(this.jumpType == '1') {
        this.getColumnList()
      } else {
        this.getList()
      }
    },
    methods: {
      initData() {
        this.columnList = this.nodeData.children
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.getDetail(data.id)
        } else {
          let id = ''
          console.log(this.nodeData,this.level)
          if (this.level == '0') {
            id = this.$route.query.columnId
          } else {
            id = this.jumpType == '2' ? ((this.nodeData.secondColumn == '0' && this.level!='1') ? '' : this.nodeData.id) : this.radioType
          }
          this.addInfo = {
            categoryId: id,
            img: ''
          }
        }
      },
      openModalSort(data) {
        this.isOpenModalSort = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.sortNum = this.addInfo.sort
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
        this.initData()
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.wzjh.articleList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          title: this.searchInfo.nickname,
          categoryId: this.jumpType == '2' ? (this.columnId || this.$route.query.columnId) : this.radioType
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

      getColumnList() {
        this.$api.wzjh.columnList({
          materialId: this.$route.query.teachingId,
        })
          .then(
            response => {
              this.radioList = response.data.resultData;
              this.radioType = this.radioList.length && this.radioList[0].id
              this.getList()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //分页查询
      getDetail(params) {
        this.isFetching = true

        this.$api.wzjh.articleDetails({
          id: params
        })
          .then(
            response => {
              this.addInfo = JSON.parse(JSON.stringify(response.data.resultData))
              this.addInfo.sort = this.addInfo.sort.toString()
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
            this.$api.wzjh.articleDelete({
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
        if (!this.addInfo.img) {
          return this.$Message.error('请上传图片')
        } else if (this.addInfo.sort && (this.addInfo.sort < 1 || this.addInfo.sort > 99999)) {
          return this.$Message.error('排序值范围1-99999')
        } else if (!this.addInfo.categoryId) {
          return this.$Message.error('请选择栏目')
        }
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.wzjh.articleSave(this.addInfo)
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
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入排序值')
        }
        this.addInfo.sort = this.sortNum
        this.$api.category.editArticle(this.addInfo)
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('修改成功');
              this.getList()
              this.isOpenModalSort = false
            }
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-acticle {
    .-c-tips {
      color: #39f
    }

    .-search-radio {
      min-width: 200px;
    }

    .-t-add-icon {
      top: 35px;
    }
    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
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
