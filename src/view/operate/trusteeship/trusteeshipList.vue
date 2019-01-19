<template>
  <div class="p-trusteeship">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList">
          <Radio :label=1>页面托管</Radio>
          <Radio :label=2>图片托管</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center -date-search">
          <Col span="2">创建时间:</Col>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="searchInfo.startTime"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期" @on-open-change="changeDate"
                           v-model="searchInfo.endTime"></Date-picker>
            </div>
          </Col>
        </Col>
      </Row>

      <div class="g-add-btn -p-t-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="radioType == '2' ? columnsUnanswered : columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-trusteeship"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="650"
      :title="addInfo.id ? '编辑托管' : '新增托管'">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="80">
        <FormItem :label="radioType =='2' ? '图片名称' : '页面名称'" prop="name">
          <Input :rows="5" v-model="addInfo.name" placeholder="请输入名称"></Input>
        </FormItem>
        <Form-item label="上传图片" prop="content" class="ivu-form-item-required" v-if="radioType == '2'">
          <Upload
            v-if="!addInfo.content"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="200"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <div class="g-course-add-style">
              <span>+</span>
              <span>上传图片</span>
            </div>
          </Upload>
          <div class="-c-course-wrap" v-if="addInfo.content">
            <div class="-c-course-item">
              <img :src="addInfo.content">
              <div class="-i-del" @click="delImg()">删除</div>
            </div>
          </div>
          <span class="-c-tips" v-else>只能上传jpg/png文件，且不超过200kb，图片尺寸为960px*360px</span>
        </Form-item>
        <Form-item label="页面代码" prop="content" class="ivu-form-item-required" v-else>
          <editor v-model="addInfo.content" ref="editorWang"></editor>
        </Form-item>
        <FormItem label="链接" prop="link" v-if="radioType == '2'">
          <Input :rows="5" v-model="addInfo.link" placeholder="请输入链接"></Input>
        </FormItem>
        <FormItem label="主题色" prop="color" v-if="radioType == '1'">
          <ColorPicker v-model="addInfo.color" />
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import Editor from "../../../components/editor";

  export default {
    name: 'trusteeship',
    components: {Editor},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          nickname: '',
          startTime: '',
          endTime: ''
        },
        selectInfo: '1',
        dataList: [],
        total: 0,
        radioType: 1,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {
          content: '',
          name: '',
          color: ''
        },
        ruleValidate: {
          name : [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          color : [
            {required: true, message: '请选择主题色', trigger: 'change'}
          ],
        },
        columns: [
          {
            title: '页面名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '链接',
            key: 'link',
            align: 'center'
          },
          {
            title: '访问量（PV）',
            key: 'pvCount',
            align: 'center'
          },
          {
            title: '访问用户（UV）',
            key: 'uvCount',
            align: 'center'
          },
          {
            title: '操作用户/率',
            key: 'remainUserCount',
            align: 'center'
          },
          {
            title: '主题色',
            render: (h, params) => {
              return h('div', {
                style: {
                  width: '20px',
                  height: '20px',
                  backgroundColor: params.row.color,
                  margin: '0 auto'
                }
              })
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtModified).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small'
                //   },
                //   style: {
                //     color: '#5444E4'
                //   },
                //   on: {
                //     click: () => {
                //       this.openModal(params.row)
                //     }
                //   }
                // }, '预览'),
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
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
              ])
            }
          }
        ],
        columnsUnanswered: [
          {
            title: '图片名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.content
                },
                style: {
                  width: '100px',
                  height: '60px',
                  margin: '10px'
                }
              })
            },
            align: 'center'
          },
          {
            title: '链接',
            key: 'link',
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtModified).format("YYYY-MM-DD HH:mm:ss"))
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate(bool) {
        if (!bool) {
          this.getList(1)
        }
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        if(data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            content: '',
            name: '',
            color:""
          }
          setTimeout(()=>{
            this.$refs.editorWang.clearHtml()
          },0)
        }
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk: () => {
            this.$api.trusteeship.delTrusteeship({
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
      delImg () {
        this.addInfo.content = ''
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']
        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.addInfo.content = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : ''
        endTime = this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''
        if(num) {
          this.tab.currentPage = 1
        }
        this.$api.trusteeship.getList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: this.radioType,
          name: this.searchInfo.nickname,
          startDate: startTime,
          endDate: endTime
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
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.content || this.addInfo.content == '<p><br></p>') {
              return this.$Message.error(`${this.radioType == '1' ? '请输入页面代码' : '请上传图片'}`)
            }
            this.addInfo.type = this.radioType
            this.isSending = true
            this.$api.trusteeship.saveTrusteeship(this.addInfo)
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
  .p-trusteeship {

    .-p-t-add-btn{
      top: 90px;
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

    .-c-tab {
      margin: 20px 0;
    }

    .-c-tips {
      color: #39f
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
  }
</style>
