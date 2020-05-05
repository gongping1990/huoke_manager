<template>
  <div class="p-homePageSet">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.categoryId" type="button" @on-change="getList()">
          <Radio :label=0>APP</Radio>
          <Radio :label=1>乐小狮作文</Radio>
          <Radio :label=2>乐小狮读写</Radio>
          <Radio :label=3>乐小狮写字</Radio>
        </Radio-group>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-homePageSet"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="编辑首页信息配置">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="课程名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="courseDescribe">
            <Input type="text" v-model="addInfo.courseDescribe" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="竖版封面" class="ivu-form-item-required">
            <upload-img v-model="addInfo.verticalCover" :option="uploadOption"></upload-img>
          </FormItem>
          <FormItem label="横版封面" class="ivu-form-item-required">
            <upload-img v-model="addInfo.coverphoto" :option="uploadOption"></upload-img>
          </FormItem>
          <FormItem label="小程序链接" prop="wechatAppletUrl">
            <Input type="text" v-model="addInfo.wechatAppletUrl" placeholder="请输入小程序链接"></Input>
          </FormItem>
          <FormItem label="卡片标题" prop="cardtitle">
            <Input type="text" v-model="addInfo.cardtitle" placeholder="请输入卡片标题"></Input>
          </FormItem>
          <FormItem label="卡片图片" class="ivu-form-item-required">
            <upload-img v-model="addInfo.cardimgurl" :option="uploadOption"></upload-img>
          </FormItem>
          <FormItem label="回复链接" prop="href">
            <Input type="text" v-model="addInfo.href" placeholder="请输入回复链接"></Input>
          </FormItem>
          <FormItem label="链接大标题" prop="bigtitle">
            <Input type="text" v-model="addInfo.bigtitle" placeholder="请输入链接大标题"></Input>
          </FormItem>
          <FormItem label="链接小标题" prop="smalltitle">
            <Input type="text" v-model="addInfo.smalltitle" placeholder="请输入链接小标题"></Input>
          </FormItem>
          <FormItem label="链接配图" class="ivu-form-item-required">
            <upload-img v-model="addInfo.imgurl" :option="uploadOption"></upload-img>
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
  import UploadImg from "@/components/uploadImg";

  export default {
    name: 'tbzw_homePageSet',
    components: {UploadImg},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        searchInfo: {
          categoryId: 1
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          courseDescribe: [
            {required: true, message: '请输入课程描述', trigger: 'blur'}
          ],
          bigtitle: [
            {required: true, message: '请输入链接大标题', trigger: 'blur'},
          ],
          smalltitle: [
            {required: true, message: '请输入链接小标题', trigger: 'blur'},
          ],
          cardtitle: [
            {required: true, message: '请输入卡片标题', trigger: 'blur'},
          ],
          href: [
            {required: true, message: '请输入回复链接', trigger: 'blur'},
          ],
          wechatAppletUrl: [
            {required: true, message: '请输入小程序链接', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '课程名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '课程描述',
            key: 'courseDescribe',
            align: 'center'
          },
          {
            title: '回复链接',
            key: 'href',
            align: 'center',
            tooltip: true
          },
          {
            title: '小程序链接',
            key: 'wechatAppletUrl',
            align: 'center',
            tooltip: true
          },
          {
            title: '竖版封面',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.verticalCover
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '横版封面',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.coverphoto
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '10px auto'
                  }
                })
              ])
            }
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
                      this.openModal(params.row)
                    }
                  }
                }, '编辑')
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
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            cardimgurl: '',
            coverphoto: '',
            imgurl: '',
            verticalCover: ''
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
        this.$api.tbzwHomepage.pageHomePageCourse({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          category: this.searchInfo.categoryId
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
            if (!this.addInfo.verticalCover) {
              return this.$Message.error('请上传竖版图片')
            } else if (!this.addInfo.coverphoto) {
              return this.$Message.error('请上传横版图片')
            } else if (!this.addInfo.cardimgurl) {
              return this.$Message.error('请上传卡片图片')
            } else if (!this.addInfo.imgurl) {
              return this.$Message.error('请上传链接配图')
            }
            this.isSending = true
            this.$api.tbzwHomepage.editHomePageCourse({
              id: this.addInfo.id,
              name: this.addInfo.name,
              coverphoto: this.addInfo.coverphoto,
              courseDescribe: this.addInfo.courseDescribe,
              verticalCover: this.addInfo.verticalCover,
              smalltitle: this.addInfo.smalltitle,
              imgurl: this.addInfo.imgurl,
              href: this.addInfo.href,
              wechatAppletUrl: this.addInfo.wechatAppletUrl,
              cardtitle: this.addInfo.cardtitle,
              cardimgurl: this.addInfo.cardimgurl,
              bigtitle: this.addInfo.bigtitle,
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
  .p-homePageSet {
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
  }
</style>
