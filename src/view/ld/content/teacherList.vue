<template>
  <div class="p-virtual">
    <Card>
      <Row class="g-search">
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">教师名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>
      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-virtual"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="450"
        :title="addInfo.id ? '编辑教师' : '创建教师'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="教师头像" prop="name" class="ivu-form-item-required -p-v-content">
            <div class="g-flex-j-sa -p-v-top">
              <div class="-p-upload">
                <Upload
                  :action="baseUrl"
                  :show-upload-list="false"
                  :before-upload=" beforeUpload"
                  :max-size="100"
                  :on-success="handleSuccess"
                  :on-exceeded-size="handleSize"
                  :on-error="handleErr">
                  <div class="-p-upload-img"
                       :style="{backgroundImage: 'url('+addInfo.headImage+')',backgroundRepeat:'no-repeat', backgroundSize: 'cover'}">
                    <Icon size="30" type="ios-camera"/>
                  </div>
                </Upload>
              </div>
              <div class="-p-text">
                <div class="-p-v-text" :class="{'g-success': textType=='2','g-error': textType=='3'}">
                  {{textStatus[textType]}}
                  <Icon size="18" v-if="textType=='2'" type="ios-checkmark-circle"/>
                  <Icon size="18"  v-if="textType=='3'" type="ios-close-circle"/>
                </div>
                <div class="-p-v-tip">上传仅支持jpg、png格式，大小不超过100k</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="教师名称" prop="teacherName">
            <Input type="text" v-model="addInfo.teacherName" placeholder="请输入教师名称"></Input>
          </FormItem>
          <FormItem label="教师介绍" prop="introduce">
            <Input type="textarea" v-model="addInfo.introduce" :rows="4" placeholder="请输入教师介绍"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-v-flex">
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
    name: 'virtualUser',
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        tab: {
          page: 1,
          pageSize: 10
        },
        selectInfo: '1',
        searchInfo: {},
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        textType: '0',
        textStatus: ['上传用户对象','更换头像','上传成功','上传失败'],
        ruleValidate: {
          teacherName: [
            {required: true, message: '请输入教师名称', trigger: 'blur'},
            {type: 'string', max: 50, message: '标题长度为50字', trigger: 'blur'}
          ],
          introduce: [
            {required: true, type: 'string', message: '请输入教师介绍', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '用户头像/名称',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.headImage
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.teacherName)
              ])
            }
          },
          {
            title: '创建时间',
            key: 'gmtCreate'
          },
          {
            title: '教师介绍',
            key: 'introduce'
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
      this.getList()
    },
    methods: {
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.teacher.delTeacher({
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
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.textType = '1'
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.textType = '0' +
            ''
          this.addInfo = {}
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      beforeUpload(file) {
        let imgType = ['jpeg','png']
        console.log(file)
        if(file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
         return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.textType = '2'
          this.addInfo.headImage = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.textType = '3'
        this.$Message.error('上传失败，请重新上传')
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.teacher.teacherList({
          current: this.tab.page,
          size: this.tab.pageSize,
          teacherName: this.searchInfo.manner
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
      submitInfo (name) {
        if(!this.addInfo.headImage) {
          return this.$Message.error('请上传头像')
        }

        let promiseDate = this.addInfo.id ? this.$api.teacher.updateTeacher(this.addInfo) : this.$api.teacher.addTeacher(this.addInfo)
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
    }
  };
</script>


<style lang="less" scoped>
  .p-virtual {
    .-p-v-content {

      .-p-v-top {
        padding: 20px 0;
        align-items: center;
      }

      .-p-upload {

        &-img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #ebebeb;
          border: 1px solid #d9dadb;
          color: rgba(179, 181, 184, 1);
          cursor: pointer;
        }

        &-img:hover {
          color: #5444E4;
        }
      }

      .-p-text {
        margin-left: 20px;

        .-p-v-text {
          font-size: 15px;
        }
      }
      .-p-v-tip {
        color: rgba(179, 181, 184, 1);
      }
    }

    .-p-v-flex {
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
