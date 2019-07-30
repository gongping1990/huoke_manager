<template>
  <div class="p-prizeList">
    <Card>
      <div class="g-add-btn " @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-prizeList"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="800"
      :title="addInfo.id ? '编辑奖品' : '新增奖品'">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="100">
        <FormItem label="奖品名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入推荐位名称"></Input>
        </FormItem>
        <FormItem label="奖品价格" prop="price">
          <InputNumber :max="999999" :min="1" v-model="addInfo.price" placeholder="请输入兑换学分" class="g-width"></InputNumber>
        </FormItem>
        <FormItem label="兑换学分" prop="credit">
          <InputNumber :max="999999" :min="1" v-model="addInfo.credit" placeholder="请输入兑换学分" class="g-width"></InputNumber>
        </FormItem>
        <FormItem label="奖品库存" prop="total">
          <InputNumber :max="999999" :min="1" v-model="addInfo.total" placeholder="请输入奖品库存" class="g-width"></InputNumber>
        </FormItem>
        <FormItem label="奖品性质" prop="prizeType">
          <Radio-group v-model="addInfo.prizeType">
            <Radio label='0'>实物</Radio>
            <Radio label='1'>虚拟</Radio>
          </Radio-group>
        </FormItem>
        <Form-item label="奖品封面" class="-c-form-item ivu-form-item-required">
          <upload-img v-model="addInfo.coverImg" :option="uploadOption"></upload-img>
        </Form-item>
        <Form-item label="详情图册" class="-c-form-item ivu-form-item-required">
          <upload-img-multiple v-model="addInfo.showImgs" :option="uploadOption"></upload-img-multiple>
        </Form-item>
        <Form-item label="奖品说明" class="ivu-form-item-required">
          <editor ref="editor" v-model="addInfo.directions" style="width: 600px"></editor>
        </Form-item>
        <Form-item label="奖品详情" class="ivu-form-item-required">
          <editor ref="editorTwo" v-model="addInfo.details" :uploadImgServer="baseUrl" style="width: 600px"></editor>
        </Form-item>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import dayjs from 'dayjs'
  import Editor from "@/components/editor";
  import UploadImg from "../../../components/uploadImg";
  import UploadImgMultiple from "../../../components/uploadImgMultiple";

  export default {
    name: 'friendHelp',
    components: {UploadImgMultiple, UploadImg, Editor},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {
          name: '',
          prizeType: '0',
          credit: null,
          price: null,
          details: '',
          directions: '',
          coverImg: '',
          showImgs: []
        },
        columns: [
          {
            title: '奖品名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '奖品原价',
            key: 'price',
            align: 'center'
          },
          {
            title: '库存',
            key: 'total',
            align: 'center'
          },
          {
            title: '奖品性质',
            render: (h, params) => {
              return h('div', params.row.prizeType ? '虚拟' : '实物')
            },
            align: 'center'
          },
          {
            title: '封面图',
            render:
              (h, params) => {
                return h('img', {
                  attrs: {
                    src: params.row.coverImg
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px'
                  }
                })
              },
            align: 'center'
          }
          ,
          {
            title: '创建时间',
            render: (h,params)=>{
              return h('div',dayjs(+params.row.gmtCreate).format('YYYY-MM-DD HH:mm:ss'))
            },
            width: 150,
            align: 'center'
          }
          ,
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
        ruleValidate: {
          name: [
            {required: true, message: '请输入奖品名称', trigger: 'blur'}
          ],
          price: [
            {required: true, type: 'number', message: '请输入奖品价格', trigger: 'blur'}
          ],
          credit: [
            {required: true, type: 'number', message: '请输入兑换学分', trigger: 'blur'}
          ],
          total: [
            {required: true, type: 'number', message: '请输入奖品库存', trigger: 'blur'}
          ]
        }
      }
        ;
    },
    computed: {},
    mounted() {
      this.getList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true

        if (data) {

          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.price = +this.addInfo.price
          this.addInfo.credit = +this.addInfo.credit
          this.addInfo.total = +this.addInfo.total
          this.addInfo.prizeType = this.addInfo.prizeType.toString()
          this.addInfo.showImgs = JSON.parse(this.addInfo.showImgs)
        } else {
          this.addInfo = {
            name: '',
            prizeType: '0',
            credit: null,
            price: null,
            details: '',
            directions: '',
            coverImg: '',
            total: null,
            showImgs: []
          }
        }

        this.$refs.editor && this.$refs.editor.setHtml(this.addInfo.details)
        this.$refs.editorTwo && this.$refs.editorTwo.setHtml(this.addInfo.directions)
        this.$forceUpdate()
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.gswPrzie.prizeAdminList({
          current: this.tab.page,
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
          content: '确认删除模板吗？',
          onOk: () => {
            this.$api.gswPrzie.prizeDelete({
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

        this.$refs[name].validate((valid) => {
          if (valid) {
            let paramUrl = ''

            if (!this.addInfo.coverImg) {
              return this.$Message.error('请上传奖品封面')
            } else if (!this.addInfo.showImgs.length) {
              return this.$Message.error('请上传奖品轮播图')
            } else if (!this.addInfo.details || this.addInfo.details == '<p><br></p>') {
              return this.$Message.error('请输入奖品详情')
            } else if (!this.addInfo.directions || this.addInfo.directions == '<p><br></p>') {
              return this.$Message.error('请输入奖品说明')
            }
            this.isSending = true

            if (this.addInfo.id) {
              delete this.addInfo.courseGoodsList
              delete this.addInfo.courseNum
              delete this.addInfo._index
              delete this.addInfo._rowKey
            }

            this.$api.gswPrzie.saveOrderUpdate({
              ...this.addInfo,
              showImgs: JSON.stringify(this.addInfo.showImgs)
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
  .p-prizeList {
    .-search-select-text {
      min-width: 70px;
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

    .-p-h-margin {
      margin-bottom: 10px;
    }

    .-p-h-img {
      img {
        width: 50%;
      }
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {

      .-c-course-item {
        display: inline-block;
        position: relative;
        background-color: #EBEBEB;
        width: 200px;
        height: 90px;
        margin: 10px 10px 10px 0;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 4px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
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
</style>
