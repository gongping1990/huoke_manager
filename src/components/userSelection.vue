<template>
  <Modal top="6vh" @close="closeModal" :title="otherInfo.title" v-model="isAddOpenModal" width="40%">
    <Row class="p-user">
      <Col :span="otherInfo.type != 3 ? 16 : 24">
        <Card class="-card-left">
          <p v-if="otherInfo.type != 3" slot="title">接收用户</p>

          <div class="-left-user">
            <div class="-user-left">
              <div>
                <div>
                  <Select v-model="search.userType" placeholder="用户类别" size="small"
                          @on-change="init"
                          style="width: 100px">
                    <Option label="全部用户" value="3"></Option>
                    <Option label="付费用户" value="1"></Option>
                    <Option label="未付费用户" value="0"></Option>
                  </Select>
                  <Button icon="el-icon-search" type="primary" size="small" class="-float-right"
                          @click="searchSms">搜索
                  </Button>
                </div>
                <div v-if="isShowSearch" style="margin-top: 10px">
                  <Select v-model="search.keyType" size="small"
                          style="width: 100px;margin-bottom: 10px">
                    <Option label="用户昵称" value="1"></Option>
                    <Option label="用户ID" value="2"></Option>
                  </Select>
                  <div style="display: flex;margin-bottom: 10px">
                    <Input v-model="search.inputContent" placeholder="请输入内容" size="small"
                           style="margin-right: 10px"></Input>
                    <Button icon="ios-search" size="small" class="-search-icon"
                            @click="getSearch"></Button>
                    <Button icon="ios-close" size="small" class="-search-icon"
                            @click="backSearch"></Button>
                  </div>
                </div>

                <div class="-c-l-check" v-if="!isShowSearch">
                  <Checkbox v-model="checkAll" @on-change="checkAllUser">全选所有用户</Checkbox>
                </div>
                <div class="-c-l-wrap">
                  <Checkbox-group v-model="addStorage">
                    <Checkbox :label="item.userId" v-for="(item,index) in userList"
                              :key="index"
                              :disabled="checkAll"
                              class="-c-l-list">
                      <div class="-list">
                        <div class="-list-img">
                          <img :src="item.headImgurl">
                        </div>
                        <div class="-list-text">
                          <div>{{item.nickname}}</div>
                          <div>{{item.phone}}</div>
                        </div>
                      </div>
                    </Checkbox>
                  </Checkbox-group>
                  <div class="-c-btn">
                    <Button type="text" @click="loadMore()"
                            v-if="isShowLoadMore && !isShowSearch">点击加载更多
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div class="-user-right">
              <div v-if="!checkAll" class="-u-right-text">已选用户{{addStorage.length}}人</div>
              <div v-else class="-u-right-text">已选择全部用户</div>
              <div class="-u-right-content">
                <div v-for="item of selecedUser" class="-user-r-wrap">
                  <div class="-list">
                    <div class="-list-img">
                      <img :src="item.headImgurl">
                    </div>
                    <div class="-list-text">
                      <div>{{item.nickname}}</div>
                      <div>{{item.phone}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col :span="8" v-if="otherInfo.type != 3">
        <Card class="-card-right-top">
          <div slot="title">
            <span>消息内容</span>
          </div>
          <div v-if="type == 1">
            <Input type="textarea" :rows="5" placeholder="请输入内容"
                   v-model="userInfo.content"></Input>
          </div>
          <div v-if="type == 2">
            <Form :model="userInfo" label-width="100px">
              <Form-item label="first" required>
                <Input v-model="userInfo.first" placeholder="请输入first" size="small"></Input>
              </Form-item>
              <Form-item :label="item.name" :key="item.id" v-for="item of keywords">
                <Input v-model="userInfo[item.key]" :placeholder='item.tips'
                       size="small"></Input>
              </Form-item>
              <Form-item label="remark" required>
                <Input v-model="userInfo.remark" placeholder="请输入备注" size="small"></Input>


              </Form-item>
              <Form-item label="链接地址">
                <Input v-model="userInfo.url" placeholder="请输入链接地址" size="small"></Input>
              </Form-item>
            </Form>
          </div>
        </Card>
        <Card>
          <div slot="header" class="clearfix">
            <span>发送时间</span>
          </div>
          <div>
            <div>
              <Radio-group v-model="userInfo.sendType">
                <Radio :label="1">立即发送</Radio>
                <Radio :label="2">定时发送</Radio>
              </Radio-group>
            </div>

            <div v-if="userInfo.sendType==2" class="-card-time">
              <Date-picker v-model="userInfo.sendTime" type="datetime" placeholder="选择日期"
                           size="small" style="width: 100%">
              </Date-picker>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <span slot="footer" class="dialog-footer">
      <Button @click="closeModal">取 消</Button>
      <Button type="primary" @click="submitModal()">确 定</Button>
    </span>
    <Loading v-if="isFetching"></Loading>
  </Modal>
</template>

<script>
  import Loading from "./loading";

  export default {
    name: 'userSelection',
    components: {Loading},
    props: ['title', 'type', 'templateId', 'userCheckList','otherInfo'],
    data() {
      return {
        search: {
          userType: "3",
          keyType: "1",
          userId: "",
          nickname: "",
          inputContent: ""
        },
        userInfo: {
          sendTime: ''
        },
        tabAddUser: {
          page: 1,
          pageSize: 10
        },
        checkAll: this.otherInfo.isCheckAllPeople, // 是否全选
        isFetching: false, // 是否全选
        isAddOpenModal: false,
        isShowSearch: false,
        isShowLoadMoreSearch: false,
        isShowLoadMore: false,
        lists: {},
        userList: [],
        userLists: [],
        addStorage: [],
        keywords: [],
        keywordStorage: [],
      }
    },
    watch: {
      userLists(n, o) {
        n.forEach(e => {
          this.lists[e.userId] = e
        })
      }
    },
    computed: {
      selecedUser() {
        let arr = []
        this.addStorage.forEach(e => {
          arr.push(this.lists[e])
        })
        return arr
      }
    },
    mounted() {
      if (this.userCheckList.length && !this.checkAll) {
        this.lists = this.$store.state.userStorageList
        this.addStorage = this.userCheckList
      }
    },
    methods: {
      closeModal() {
        this.$emit('close')
        this.addStorage = [];
        this.init()
      },
      init() {
        this.isAddOpenModal = true
        this.userList = [];
        this.userLists = [];
        this.keywords = [];
        this.tabAddUser.page = 1;
        this.getUserList();
        (this.type == 2) && this.getTemplateParamList(this.templateId)
      },
      getSearch() {
        if (this.search.keyType == "1") {
          this.search.nickname = this.search.inputContent;
        } else {
          this.search.userId = this.search.inputContent;
        }
        this.tabAddUser.page = 1;
        this.userList = [];
        this.getUserList();
      },
      backSearch() {
        this.search.nickname = "";
        this.search.userId = "";
        this.isShowSearch = false;
        this.init();
      },
      loadMore() {
        this.tabAddUser.page++;
        this.getUserList();
      },
      searchSms() {
        this.userList = [];
        this.isShowSearch = true;
      },
      checkAllUser() {
        !this.checkAll && (this.userInfo.condition = "");
        this.addStorage = [];
      },
      getUserList() {
        if (this.isFetching) return
        this.isFetching = true
        this.$api.user.userList({
          current: this.tabAddUser.page,
          size: this.tabAddUser.pageSize,
          condition: this.search.userType,
          nickname: this.search.nickname,
          userId: this.search.userId
        }).then(
          response => {
            if (!this.isShowSearch) {
              if (this.userList.length) {
                this.userList = this.userList.concat(
                  response.data.resultData.records
                );
              } else {
                this.userList = response.data.resultData.records;
              }
            } else {
              if (this.userList.length) {
                this.userList = this.userList.concat(
                  response.data.resultData.records
                );
              } else {
                this.userList = response.data.resultData.records;
              }
            }

            this.userLists = this.userLists.concat(response.data.resultData.records)
            this.isShowLoadMore =
              response.data.resultData.pages > this.tabAddUser.page;
          })
          .finally(() => {
            this.isFetching = false
          })
      },
      getTemplateParamList(wxId) {
        this.$http
          .get(this.$store.state.baseUrl + "/user/getTemplateInfo", {
            params: {
              id: wxId
            }
          })
          .then(response => {
            this.keywordStorage = Object.entries(
              response.data.resultData.keywords
            );

            for (let item of this.keywordStorage) {
              this.keywords.push({
                name: item[0],
                key: item[1],
                tips: `请输入${item[0]}`
              });
              this.userInfo[item[1]] = "";
            }
          })
          .catch(error => {
            console.log(error, "错误");
          });
      },
      submitModal() {

        this.userInfo.userIds = [];

        if (this.checkAll) {
          this.userInfo.condition = 1;
        } else {
          this.userInfo.userIds = this.addStorage;
        }

        if (this.type == 2) {
          let obj = {};

          for (let item of this.keywordStorage) {
            for (let list of Object.entries(this.userInfo)) {
              if (item[1] == list[0]) {
                obj[list[0]] = list[1];
              }
            }
          }

          this.userInfo.keywords = JSON.stringify(obj);
        }

        if (this.userInfo.sendTime == "" || this.userInfo.sendTime == null) {
          this.userInfo.sendTime = ''
        } else {
          this.userInfo.sendTime = this.userInfo.sendTime
        }
        this.$store.commit('userStorageList',this.lists)
        this.$emit('submitModal', this.userInfo)
      }
    }
  }
</script>

<style lang="less" scoped>
  .p-user {
    .-card-left {
      margin-right: 10px;

      .-left-user {
        display: flex;

        .-user-left {
          flex: 1;
          border: 1px solid #ebeef5;
          border-radius: 3px;
          padding: 10px;
          margin: 10px;

          .-c-l-wrap {
            height: 372px;
            overflow-y: scroll;
          }
        }

        .-user-right {
          flex: 1;
          border: 1px solid #ebeef5;
          border-radius: 3px;
          padding: 10px;
          margin: 10px;
          min-width: 184px;

          .-u-right-content {
            height: 372px;
            overflow-y: scroll;
          }

          .-user-r-wrap {
            padding: 12px;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            margin-bottom: 10px;
            margin-right: 10px;
          }

          .-u-right-text {
            height: 40px;
            line-height: 40px;
            text-align: center;
            margin-bottom: 20px;
          }
        }
      }

      .-c-l-check {
        margin: 10px 0;
      }

      .-c-l-list {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-left: 0 !important;
        padding: 9px 10px 9px 10px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        /*width: 70%;*/
      }

      .-list {
        display: flex;
        margin-left: 20px
      }

      .-list-img {
        width: 26px;
        height: 26px;
        position: relative;
        margin-right: 10px;
        top: 7px;

        img {
          width: 100%;
        }
      }

      .-list-text {
        font-size: 12px;
        width: 100px;
      }
    }
    .-c-btn {
      text-align: center;
    }
    .-card-right-top {
      margin-bottom: 10px;
      /*height: 200px;*/
    }
    .-card-time {
      margin-top: 10px;
    }
    .-search-icon {
      padding: 1px 5px;
      margin-left: 4px;
    }
    .-search-content {
      margin-top: 10px;
      height: 372px;
      overflow-y: scroll;
    }
  }
</style>
