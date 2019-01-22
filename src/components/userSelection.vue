<template>
  <Modal top="6vh" @close="closeModal" :title="otherInfo.title" v-model="isAddOpenModal"
         :width="otherInfo.type == '3' ? '600px':'900px'">
    <Row class="p-user">
      <Col :span="otherInfo.type != 3 ? 16 : 24">
        <Card class="-card-left">
          <p v-if="otherInfo.type != 3" slot="title">
            <span>接收用户（{{otherInfo.type==1 ? '仅可选择有电话号码的用户':'仅可选择已关注公众号的用户'}}）</span>
          </p>

          <div class="-left-user">
            <div class="-user-left">
              <div>
                <div>
                  <RadioGroup v-model="radioType" @on-change="changeRadio" v-if="otherInfo.type!=3" type="button">
                    <Radio label="1">列表选择</Radio>
                    <Radio label="2">分群选择</Radio>
                  </RadioGroup>
                </div>
                <div style="margin-top: 10px" v-if="radioType==1">
                  <Select v-model="search.keyType" style="width: 100px;margin-bottom: 10px">
                    <Option label="用户昵称" value="1"></Option>
                    <Option label="用户电话" value="2" v-if="otherInfo.type!='4'"></Option>
                  </Select>
                  <div style="display: flex;margin-bottom: 10px">
                    <Input v-model="search.inputContent" placeholder="请输入内容" size="small"
                           style="margin-right: 10px"></Input>
                    <Button icon="ios-search" size="small" class="-search-icon"
                            @click="getSearch"></Button>
                    <Button icon="ios-close" size="small" class="-search-icon"
                            v-if="isShowDelIcon"
                            @click="backSearch"></Button>
                  </div>
                </div>

                <div v-if="radioType == 1">
                  <div class="-c-l-check">
                    <Checkbox v-model="checkAll" @on-change="checkAllUser">全选所有用户</Checkbox>
                  </div>
                  <div class="-c-l-wrap" v-viewmore="loadMore">
                    <Checkbox-group v-model="addStorage">
                      <Checkbox :label="item.userId" v-for="(item,index) in userList"
                                :key="index"
                                :disabled="checkAll"
                                class="-c-l-list">
                        <div class="-list">
                          <div class="-list-img">
                            <img :src="item.headImgUrl">
                          </div>
                          <div class="-list-text">
                            <div>{{item.nickname}}</div>
                            <div>{{item.phone}}</div>
                          </div>
                        </div>
                      </Checkbox>
                    </Checkbox-group>
                  </div>
                </div>
                <div v-else>
                  <div style="margin: 20px 0" v-if="otherInfo.type!=1 && otherInfo.type!=4">
                    电话号码：
                    <Select v-model="search.userPhone" placeholder="请选择"
                            style="width: 100px" @on-change="getUserNum">
                      <Option label="全部" value="3"></Option>
                      <Option label="有" value="true"></Option>
                      <Option label="无" value="false"></Option>
                    </Select>
                  </div>
                  <div style="margin: 20px 0">
                    付费情况：
                    <Select v-model="search.userType" placeholder="请选择"
                            style="width: 100px" @on-change="getUserNum">
                      <Option label="全部" value="3"></Option>
                      <Option label="已付费" value="1"></Option>
                      <Option label="未付费" value="2"></Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div class="-user-right">
              <div v-if="!checkAll" class="-u-right-text">已选用户{{addStorage.length||userNum}}人</div>
              <div v-else class="-u-right-text">已选择全部用户</div>
              <div class="-u-right-content">
                <div v-for="item of selecedUser" class="-user-r-wrap">
                  <div class="-list">
                    <div class="-list-img">
                      <img :src="item.headImgUrl">
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
          <div v-if="otherInfo.type == 1">
            <Input type="textarea" :rows="5" placeholder="请输入内容"
                   v-model="userInfo.content"></Input>
          </div>
          <div v-if="otherInfo.type == 2">
            <Form :model="userInfo" :label-width="80">
              <Form-item label="first" required>
                <div class="g-flex-a-j-center">
                  <Input v-model="userInfo.first" placeholder="请输入first" size="small"></Input>
                  <ColorPicker class="-p-u-color" size="small" v-model="userInfo.firstColor"/>
                </div>
              </Form-item>
              <Form-item :label="item.name" :key="item.id" v-for="item of keywords">
                <div class="g-flex-a-j-center">
                  <Input v-model="userInfo[item.key]" :placeholder='item.tips'
                         size="small"></Input>
                  <ColorPicker class="-p-u-color" size="small" v-model="item.color"/>
                </div>
              </Form-item>
              <Form-item label="remark" required>
                <div class="g-flex-a-j-center">
                  <Input v-model="userInfo.remark" placeholder="请输入备注" size="small"></Input>
                  <ColorPicker class="-p-u-color" size="small" v-model="userInfo.remarkColor"/>
                </div>
              </Form-item>
              <Form-item label="链接地址">
                <Input v-model="userInfo.url" placeholder="请输入链接地址" size="small"></Input>
              </Form-item>
            </Form>
          </div>
        </Card>

        <Card class="-card-right-top">
          <div slot="title">
            <span>发送时间</span>
          </div>
          <div>
            <div>
              <RadioGroup v-model="userInfo.sendType">
                <Radio :label="1">立即发送</Radio>
                <Radio :label="2">定时发送</Radio>
              </RadioGroup>
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
    <span slot="footer">
      <Button @click="closeModal">取 消</Button>
      <Button type="primary" @click="submitModal()">确 定</Button>
    </span>
    <Loading v-if="isFetching"></Loading>
  </Modal>
</template>

<script>
  import Loading from "./loading";
  import dayjs from 'dayjs'

  export default {
    name: 'userSelection',
    components: {Loading},
    props: ['userCheckList', 'otherInfo'], //type类别： 1为短信 2为微信  3为优惠券发送选人  4为第三方
    data() {
      return {
        search: {
          userType: "3",
          keyType: "1",
          userPhone: '3',
          phone: "",
          nickname: "",
          inputContent: ""
        },
        userInfo: {
          content: '',
          first: '',
          remark: '',
          url: '',
          sendTime: '',
          firstColor: '',
          remarkColor: ''
        },
        tabAddUser: {
          page: 1,
          pageSize: 10
        },
        checkAll: this.otherInfo.isCheckAllPeople, // 是否全选
        isFetching: false,
        isAddOpenModal: false,
        isShowLoadMoreSearch: false,
        isShowLoadMore: false,
        isShowDelIcon: false,
        radioType: '1',
        lists: {},
        userList: [],
        userLists: [],
        addStorage: [],
        keywords: [],
        keywordStorage: [],
        userNum: 0
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
      if (this.userCheckList && this.userCheckList.length && !this.checkAll) {
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
        if (this.otherInfo.type == 2 || this.otherInfo.type == 4) {
          this.getTemplateParamList(this.otherInfo.templateId)
        }
      },
      getSearch() {
        if (this.search.keyType == "1") {
          this.search.nickname = this.search.inputContent;
          this.search.phone = ''
        } else {
          this.search.phone = this.search.inputContent;
          this.search.nickname = ''
        }
        this.isShowDelIcon = true
        this.tabAddUser.page = 1;
        this.userList = [];
        this.getUserList();
      },
      backSearch() {
        this.search.nickname = "";
        this.search.inputContent = "";
        this.search.phone = "";
        this.isShowDelIcon = false
        this.init();
      },
      loadMore() {
        this.tabAddUser.page++;
        this.getUserList();
      },
      changeRadio() {
        this.checkAll = false
        this.userNum = '0'
        this.addStorage = [];
        this.search.userPhone = this.radioType == '1' ? '' : '3'
        this.search.userType = this.radioType == '1' ? '' : '3'
        this.radioType == '2' && this.getUserNum()
      },
      checkAllUser() {
        !this.checkAll && (this.userInfo.condition = "");
        this.addStorage = [];
      },
      getUserList() {
        let paramUrl = ''
        if (this.isFetching) return
        this.isFetching = true
        console.log(this.otherInfo)
        paramUrl = this.otherInfo.isOther ? this.$api.custom.userList : this.$api.user.userList
        paramUrl({
          appId: this.otherInfo.appId,
          current: this.tabAddUser.page,
          size: this.tabAddUser.pageSize,
          nickname: this.search.nickname,
          phone: this.search.phone,
          hasPhone: this.otherInfo.type == 1 ? true : '',
          hasSubscripbe: this.otherInfo.isOther ? '' : (this.otherInfo.type == 2 ? true : '')
        }).then(
          response => {
            if (this.userList.length) {
              this.userList = this.userList.concat(
                response.data.resultData.records
              );
            } else {
              this.userList = response.data.resultData.records;
            }

            this.userLists = this.userLists.concat(response.data.resultData.records)
            this.isShowLoadMore = response.data.resultData.pages > this.tabAddUser.page;
          })
          .finally(() => {
            this.isFetching = false
          })
      },
      getTemplateParamList(wxId) {
        let paramUrl = ''
        paramUrl = this.otherInfo.isOther ? this.$api.custom.getTemplateInfo : this.$api.user.getTemplateInfo
        paramUrl({
          id: wxId
        })
          .then(response => {
            this.keywordStorage = Object.entries(
              response.data.resultData.keywords
            );

            for (let item of this.keywordStorage) {
              this.keywords.push({
                name: item[0],
                key: item[1],
                tips: `请输入${item[0]}`,
                color: ''
              });
              this.userInfo[item[1]] = "";
            }
          })
      },
      getUserNum() {
        let param = {
          hasPhone: (this.otherInfo.type == 2 && this.search.userPhone != 3) ? this.search.userPhone : '',
          payUser: this.search.userType
        }
        if(this.otherInfo.type == '2' || this.otherInfo.type == '4') {
          param.addId = this.otherInfo.appId
        }
        this.$api.user.getUserCount(param)
          .then(response => {
            this.userNum = response.data.resultData
          })
      },
      submitModal() {

        this.userInfo.userIds = [];

        if (this.checkAll || this.radioType == '2') {
          this.userInfo.condition = 1;
        } else {
          this.userInfo.userIds = this.addStorage;
        }


        if (this.otherInfo.type != '1') {
          let obj = {};
          for (let item of this.keywordStorage) {
            for (let list of Object.entries(this.userInfo)) {
              if (item[1] == list[0]) {
                obj[list[0]] = list[1];
              }
            }
          }

          // 二次匹配颜色和循环出来键值对拼装配对
          let objTwo = {}
          for (let item2 of Object.entries(obj)) {
            for (let list2 of this.keywords) {
              if (list2.key == item2[0]) {
                if (item2[1] != '') {
                  objTwo[item2[0]] = `${item2[1]},${list2.color}`
                }
              }
            }
          }

          this.userInfo.first = this.userInfo.first ? `${this.userInfo.first}${this.userInfo.firstColor ? `,${this.userInfo.firstColor}` : ''}` : ''
          this.userInfo.remark = this.userInfo.remark ? `${this.userInfo.remark}${this.userInfo.remarkColor ? `,${this.userInfo.remarkColor}` : ''}` : ''
          this.userInfo.keywords = JSON.stringify(objTwo);
        }

        if (this.userInfo.sendTime == "" || this.userInfo.sendTime == null) {
          this.userInfo.sendTime = ''
        } else {
          this.userInfo.sendTime = dayjs(this.userInfo.sendTime).format('YYYY/MM/DD HH:mm:ss');
        }

        this.userInfo.userGroupQO = {
          hasPhone: (this.otherInfo.type == 2 && this.search.userPhone != 3) ? this.search.userPhone : '',
          payUser: this.search.userType
        }

        this.$store.commit('userStorageList', this.lists)
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

    .-p-u-color {
      overflow: hidden;
      display: flex;
      margin-left: 2px;
    }
  }
</style>
