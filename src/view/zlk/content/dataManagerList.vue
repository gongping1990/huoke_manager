<template>
  <div class="p-materia">
    <Card>
      <Row class="g-search">
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">选择学期：</div>
            <Select v-model="searchInfo.semester" @on-change="getList(1)" class="-search-selectOne" filterable>
              <Option value="-1">全部</Option>
              <Option value="1">上学期</Option>
              <Option value="2">下学期</Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">教材版本：</div>
            <Select v-model="searchInfo.edition" placeholder="请选择" class="-search-selectOne"
                    @on-change="getList(1)">
              <Option v-for="(item, index) of textbookList" :key="index" :label=item.name :value=item.id></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">资源名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-materia"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑资料' : '创建资料'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="标题" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入标题"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortnum">
            <InputNumber :max="999" :min="1" v-model="addInfo.sortnum" placeholder="请输入排序值"></InputNumber>
          </FormItem>
          <FormItem label="下载币" prop="currency">
            <InputNumber :max="999" :min="1" v-model="addInfo.currency" :step="1"
                         placeholder="请输入兑换所需下载币数量"></InputNumber>
          </FormItem>
          <FormItem label="购买金额" prop="priceYuan">
            <InputNumber :max="999" :min="1" :step="1" v-model="addInfo.priceYuan" placeholder="请输入购买金额"></InputNumber>
          </FormItem>
          <FormItem label="所属学期" prop="semester">
            <Select v-model="addInfo.semester" placeholder="请选择">
              <Option value="1">上学期</Option>
              <Option value="2">下学期</Option>
            </Select>
          </FormItem>
          <FormItem label="教材版本" prop="edition">
            <Select v-model="addInfo.edition" placeholder="请选择">
              <Option v-for="(item, index) of textbookList" :key="index" :label=item.name :value=item.id :disabled="item.id == '-1'"></Option>
            </Select>
          </FormItem>
          <Form-item label="上传文件" class="-c-form-item ivu-form-item-required">
            <Upload
              style="display: inline-block"
              :action="baseUrlVa"
              :show-upload-list="false"
              :max-size="204800"
              :before-upload="beforeUploadFile"
              :on-success="handleSuccessFile"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传文件</Button>
            </Upload>

            <div class="-c-tips">文件大小且不超过200M</div>

            <div class="-c-course-wrap-file" v-if="addInfo.fileDownUrl">
              <Icon size="30" type="ios-folder-outline"/>
              <div class="g-cursor" @click="delImg(2)">删除</div>
            </div>
          </Form-item>
          <Form-item label="资料预览" class="ivu-form-item-required">
            <Upload
              :action="baseUrl"
              :multiple="true"
              :show-upload-list="false"
              :max-size="100"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <div class="g-course-add-style">
                <span>+</span>
                <span>上传图片</span>
              </div>
            </Upload>
            <div class="-c-course-wrap" v-if="imgUrl.length">
              <draggable v-model="imgUrl">
                <div class="-c-course-item" v-for="(item, index) of imgUrl" :key="index">
                  <img :src="item">
                  <div class="-i-del" @click="delImg(1,index)">删除</div>
                </div>
              </draggable>
            </div>
            <div class="-c-tips">只能上传jpg/png文件，且不超过100kb，支持多张上传</div>
          </Form-item>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
        <loading v-if="isUploading"></loading>
      </Modal>

      <Modal
        class="p-materia"
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
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import draggable from 'vuedraggable'
  import {getBaseUrl} from '@/libs/index'
  import Loading from "../../../components/loading";
  import Operation from "iview/src/components/transfer/operation";

  export default {
    name: 'dataManagerList',
    components: {Operation, Loading, draggable},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `http://hkupload.prod.k12.vip/common/uploadPrivateFile`, //私有地址 （音视频）
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        textbookList: [],
        selectInfo: '1',
        searchInfo: {
          semester: '-1',
          edition: '-1'
        },
        total: 0,
        isFetching: false,
        isUploading: false,
        isOpenModal: false,
        isOpenModalSort: false,
        isSending: false,
        imgUrl: [],
        addInfo: {
          previewImgUrl: []
        },
        sortNum: '',
        ruleValidate: {
          name: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {type: 'string', max: 20, message: '标题长度为20字', trigger: 'blur'}
          ],
          sortnum: [
            {required: true, type: 'number', message: '请输入排序值', trigger: 'blur'},
          ],
          priceYuan: [
            {required: true, type: 'number', message: '请输入购买金额', trigger: 'blur'},
          ],
          currency: [
            {required: true, type: 'number', message: '请输入下载币', trigger: 'blur'},
          ],
          semester: [
            {required: true, message: '请选择所属学期', trigger: 'change'},
          ],
          edition: [
            {required: true, type: 'number', message: '请选择教材版本', trigger: 'change'},
          ]
        },
        columns: [
          {
            title: '标题',
            width: 100,
            key: 'name'
          },
          {
            title: '排序值',
            width: 100,
            key: 'sortnum',
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
              }, params.row.sortnum)
            },
            align: 'center'
          },
          {
            title: '消耗下载币',
            width: 100,
            key: 'currency'
          },
          {
            title: '购买金额',
            width: 100,
            key: 'priceYuan'
          },
          {
            title: '访问量（PV）',
            width: 150,
            key: 'pv'
          },
          {
            title: '访问用户（UV）',
            width: 150,
            key: 'uv'
          },
          {
            title: '点赞',
            width: 100,
            key: 'zan'
          },
          {
            title: '收藏',
            width: 100,
            key: 'keep'
          },
          {
            title: '分享人/次',
            width: 100,
            key: 'shared'
          },
          {
            title: '免费兑换',
            width: 100,
            key: 'convert'
          },
          {
            title: '购买',
            width: 100,
            key: 'buyed'
          },
          {
            title: '操作',
            width: 190,
            fixed: 'right',
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
                      this.download(params.row)
                    }
                  }
                }, '下载'),
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
      this.getEditionList()
    },
    methods: {
      download(data) {
        window.open(data.authorFileDownUrl, '_blank')
      },
      delImg(num, index) {
        switch (+num) {
          case 1:
            this.imgUrl.splice(index, 1)
            break
          case 2:
            this.addInfo.fileDownUrl = ''
            break
        }

      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          let dataItem = JSON.parse(JSON.stringify(data))
          this.addInfo.catalogId = this.$route.query.columnId
          this.addInfo.id = dataItem.id
          this.addInfo.sortnum = dataItem.sortnum
          this.addInfo.currency = dataItem.currency
          this.addInfo.priceYuan = dataItem.priceYuan
          this.addInfo.fileDownUrl = dataItem.fileDownUrl
          this.addInfo.semester = dataItem.semester.toString()
          this.addInfo.edition = dataItem.edition
          this.addInfo.name = dataItem.name
          this.imgUrl = JSON.parse(dataItem.previewImgUrl)
        } else {
          this.addInfo = {
            catalogId: this.$route.query.columnId,
            sortnum: null,
            currency: null,
            priceYuan: null,
            previewImgUrl: [],
            fileDownUrl: '',
            semester: '',
            edition: ''
          }
          this.imgUrl = []
        }
      },
      openModalSort(data) {
        this.isOpenModalSort = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.sortNum = this.addInfo.sortnum
      },
      closeModal(name) {
        this.isUploading = false
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      beforeUploadFile() {
        this.isUploading = true
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']
        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        this.isUploading = true
        return true
      },
      handleSuccess(res) {
        if (res.code === 200) {
          this.isUploading = false
          this.imgUrl.push(res.resultData.url)
        }
      },
      handleSuccessFile(res) {
        if (res.code === 200) {
          this.isUploading = false
          this.addInfo.fileDownUrl = res.resultData.url
        }
      },
      handleSize() {
        this.isUploading = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isUploading = false
        this.$Message.error('上传失败，请重新上传')
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
        this.$api.materia.materialList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          catalogId: this.$route.query.columnId,
          name: this.searchInfo.nickname,
          semester: this.searchInfo.semester == '-1' ? '' : this.searchInfo.semester,
          edition: this.searchInfo.edition == '-1' ? '' : this.searchInfo.edition
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
      getEditionList(num) {
        this.$api.materia.editionList()
          .then(
            response => {
              this.textbookList = response.data.resultData;
              this.textbookList.unshift({
                name: '全部',
                id: '-1'
              })
            })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.materia.delMaterial({
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

        if (!this.imgUrl.length) {
          return this.$Message.error('请上传预览图片')
        } else if (!this.addInfo.fileDownUrl) {
          return this.$Message.error('请上传文件')
        } else if (this.addInfo.sortnum && (this.addInfo.sortnum < 1 || this.addInfo.sortnum > 99999)) {
          return this.$Message.error('排序值范围1-99999')
        }

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.addInfo.previewImgUrl = JSON.stringify(this.imgUrl)
            let promiseDate = this.addInfo.id ? this.$api.materia.updateMaterial(this.addInfo) : this.$api.materia.addMaterial(this.addInfo)
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
      },
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入排序值')
        }
        this.$api.materia.updateSortNumMaterial({
          id: this.addInfo.id,
          sortnum: this.sortNum
        }).then(response => {
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
  .p-materia {
    .-c-tips {
      color: #39f
    }

    .-c-course-wrap-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px dashed #e1e1e1;
      /*background: #f7f7f7;*/
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        height: 70px;
        overflow: hidden;
        margin: 10px 20px 10px 0;

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

    .-c-tab {
      margin: 20px 0;
    }

    .-search-select-text {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

  }
</style>
