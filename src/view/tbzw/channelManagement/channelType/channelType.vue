<template>
  <div class="p-channelType">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Row class="-t-wrap g-tab">
        <Col :span="24" class="-t-top">
          <Col :span="4" class="g-t-center">渠道分类</Col>
          <Col :span="8" class="g-t-center">链接</Col>
          <Col :span="4" class="g-t-center">创建时间</Col>
          <Col :span="8" class="g-t-center">操作</Col>
        </Col>
        <Col :span="24" v-for="(item1,index) of dataList" :key="index" class="-t-item -t-border">
          <Col :span="4" class="g-flex-a-j-c-center g-t-center">
            <div @click="openArrow(item1)" v-if="item1.list.length" class="g-cursor">
              <Icon v-if="!item1.isShowChild" type="md-arrow-dropright" size="20"/>
              <Icon v-else type="md-arrow-dropdown" size="20"/>
            </div>
            <div >{{item1.name}}</div>
          </Col>
          <Col :span="8" class="-t-item-text g-t-center">
            {{item1.baseLink || '-'}}
          </Col>
          <Col :span="4" class="-t-item-text g-t-center">
            {{item1.gmtCreate}}
          </Col>
          <Col :span="8" class="-t-item-text g-t-center">
            <Button type="text" class="-t-theme-color" @click="openChildModal(item1, '')">添加子分类</Button>
            <Button type="text" class="-t-theme-color" @click="openModal(item1)">编辑</Button>
            <Button type="text" class="-t-red-color" @click="delItem(item1)">删除</Button>
            <Button type="text" class="-t-theme-color" @click="jumpItem(item1)">查看数据</Button>
          </Col>

          <Col :span="24" v-show="item1.isShowChild && item1.list" v-for="(item2,index2) of item1.list"
               :key="index2" class="-t-item -t-border">
            <Col :span="4" class="-t-child-padding-two g-flex-a-j-c-center">
              <div class="-t-child-m-l">{{item2.name}}</div>
            </Col>
            <Col :span="8" class="-t-item-text g-t-center">
              {{'-'}}
            </Col>
            <Col :span="4" class="-t-item-text g-t-center">
              {{item2.gmtCreate}}
            </Col>
            <Col :span="8" class="-t-item-text g-t-center">
              <Button type="text" class="-t-theme-color">&emsp;&emsp;&emsp;&emsp;&emsp;</Button>
              <Button type="text" class="-t-theme-color" @click="openChildModal(item2,item1)">编辑</Button>
              <Button type="text" class="-t-red-color" @click="delItem(item2,item1,index2)">删除</Button>
              <Button type="text" class="-t-theme-color" @click="jumpItem(item2)">查看数据</Button>
            </Col>
          </Col>
        </Col>
        <Col :span="24" v-if="!dataList.length" class="g-t-center -t-item">暂无数据</Col>
      </Row>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-channelType"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑分类' : '创建分类'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="80">
          <FormItem v-if="isChild" label='上级名称'>
            {{dataItem.name}}
          </FormItem>
          <FormItem label='名称' prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入分类名称"></Input>
          </FormItem>
          <FormItem v-show="!isChild" label="链接" prop="baseLink">
            <Input type="text" v-model="addInfo.baseLink" placeholder="请输入链接"></Input>
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
  import dayjs from 'dayjs';

  export default {
    name: 'gsw_channelType',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        dataItem: '',
        dataItemChild: '',
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isChild: false,
        isEditChild: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ]
        },
        storageInfo: []
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      openArrow(item) {
        this.$forceUpdate();
        item.isShowChild = !item.isShowChild;
        this.storageInfo = this.dataList;
      },
      openChildModal(data, person) {
        this.dataItemChild = data
        this.dataItem = person ? person : data
        this.addInfo = person ? JSON.parse(JSON.stringify(data)) : {};
        this.isChild = true;
        this.isOpenModal = true;
        this.isEditChild = (person !== '')
        console.log(this.isEditChild)
      },
      openModal(data) {
        this.isChild = false;
        this.isOpenModal = true;
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data));
        } else {
          this.addInfo = {};
        }
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.tbzwInternalChannel.categoryList({
          current: this.tab.page,
          size: this.tab.pageSize,
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.dataList.map(item => {
                item.list.map(data=>{
                  return data.gmtCreate = dayjs(+data.gmtCreate).format('YYYY-MM-DD HH:mm');
                })
                return item.gmtCreate = dayjs(+item.gmtCreate).format('YYYY-MM-DD HH:mm');
              });
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      delItem(param, person, index) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwInternalChannel.deleteCategory({
              id: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.dataList.forEach(list=>{
                    if (list.id === person.id) {
                      list.list.forEach(item=>{
                        if (item.id === param.id) {
                          list.list.splice(index,1)
                        }
                      })
                    }
                  })
                }
              });
          }
        });
      },
      jumpItem(data) {
        this.$router.push({
          name: 'tbzw_channelData',
          query: {
            name: data.name,
            id: data.id
          }
        });
      },

      submitInfo(name) {
        if (this.isSending) return;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true;
            this.$api.tbzwInternalChannel.saveCategory({
              id: this.addInfo.id,
              parentInternalChannelCategoryId: this.isChild ? this.dataItem.id : '',
              name: this.addInfo.name,
              baseLink: this.addInfo.baseLink
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    if (!this.isChild || !this.isEditChild) {
                      this.getList();
                    } else {
                      this.dataList.forEach(list=>{
                        if (list.id === this.dataItem.id) {
                          list.list.forEach(item=>{
                            if (item.id === this.dataItemChild.id) {
                              item.name = this.addInfo.name
                            }
                          })
                        }
                      })
                    }
                    this.closeModal(name);
                  }
                })
              .finally(() => {
                this.isSending = false;
              });
          }
        });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-channelType {
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

    .-c-tab {
      margin: 20px 0;
    }

    .-t-wrap {
      width: 100%;
      margin-top: 20px;
      border: 1px solid #dcdee2;

      .-t-border {
        border-top: 1px solid #dcdee2;
      }

      .-t-child-m-l {
        margin-left: 20px;
      }

      .-t-top {
        line-height: 40px;
        background-color: #f8f8f9;
        font-weight: bold;
      }

      .-t-notip {
        line-height: 48px;
      }

      .-t-flex {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

    .-t-child-padding {
      padding-left: 30px !important;
    }

    .-t-child-padding-two {
      padding-left: 50px !important;
    }

    .-t-item {
      line-height: 50px;
    }

    .-t-item-text {
      overflow: hidden;
    }

    .-t-theme-color {
      padding: 0 10px;
      color: #5444E4;
    }

    .-t-red-color {
      padding: 0 10px;
      color: rgb(218, 55, 75);
    }
  }
</style>
