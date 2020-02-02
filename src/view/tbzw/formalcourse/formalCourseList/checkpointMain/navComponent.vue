<template>
  <div class="p-navComponent">

    <div class="p-navComponent-item g-cursor"
         :class="{'-active' : dataItem.id === item.id}"
         v-for="(item, index) of dataList"
         :key="index" @click="openChild(item)">
      <img class="-item-img" :src="typeList[item.type-1].url"/>
      <div class="-item-text">
        {{item.name}}
      </div>
      <img @click.stop="openMask(item)" class="-item-icon" src="../../../../../assets/images/guanka/bj.png"/>
      <div class="-item-mask" v-if="item.id === dataIcon.id">
        <p class="g-cursor" @click.stop="addPoint(item)">编辑</p>
        <p class="g-cursor" @click.stop="delCheckpoint(item)">删除</p>
      </div>
      <!--<div class="-item-tip">{{typeList[item.type-1].name}}</div>-->
    </div>

    <Button class="p-navComponent-btn" @click="addPoint()" ghost type="primary">添加关卡</Button>

    <Button class="p-navComponent-btn" @click="openSort()" ghost type="primary">关卡排序</Button>

    <Modal
      class="p-navComponent"
      v-model="isOpenModalSort"
      @on-cancel="isOpenModalSort = false"
      title="关卡排序">
      <div class="p-navComponent-sort">
        <draggable v-model="sortList">
          <div v-for="(item,index) in sortList" :key="index" class="-sort-item">
            {{item.name}}
          </div>
        </draggable>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalSort = false" ghost type="primary" style="width: 100px;">取 消</Button>
        <div @click="submitSort()" class="g-primary-btn" style="line-height: 40px">确 认</div>
      </div>
    </Modal>

    <Modal
      class="p-navComponent"
      v-model="isOpenModalRadio"
      @on-cancel="isOpenModalRadio = false"
      :title="addInfo.id ? '编辑关卡' : '新增关卡'">
      <Form :model="addInfo" ref="addInfo" :label-width="80" :rules="ruleValidate">
        <FormItem label="关卡名称" prop="name">
          <Input type="text" v-model="addInfo.name" :maxlength="14" placeholder="请输入关卡名称(最多十四个字)"></Input>
        </FormItem>
        <FormItem label="关卡类型" prop="type">
          <Select v-model="addInfo.type">
            <Option label="绘本" value="1"></Option>
            <Option label="视频" value="2"></Option>
            <Option label="视频交互" value="3"></Option>
          </Select>
        </FormItem>
        <Form-item label="关卡图标" prop="icon">
          <Select v-model="addInfo.icon">
            <Option class="p-navComponent-option" :label="item.text" :value="item.value" v-for="(item, index) of iconList"
                    :key="index">
              <img class="p-navComponent-img" :src="item.url"/>
              <span>{{item.text}}</span>
            </Option>
          </Select>
          <p class="-c-tips">图标为系统内置，如需增加，请联系技术人员</p>
        </Form-item>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取 消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn" style="line-height: 40px">确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import draggable from 'vuedraggable'

  export default {
    name: 'navComponent',
    components: {Loading, draggable},
    data() {
      return {
        dataList: [],
        typeList: [
          {
            url: require('@/assets/images/guanka/h1.png'),
            name: '绘本'
          },
          {
            url: require('@/assets/images/guanka/s1.png'),
            name: '视频',
          },
          {
            url: require('@/assets/images/guanka/j1.png'),
            name: '视频交互',
          }
        ],
        iconList: [],
        addInfo: {},
        sortList: [],
        dataIcon: '',
        dataItem: '',
        queryInfo: this.$route.query,
        isOpenModalSort: false,
        isOpenModalRadio: false,
        ruleValidate: {
          name: [
            {required: true, message: '请输入关卡名称', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '请选择关卡类型', trigger: 'change'},
          ],
          icon: [
            {required: true, type: 'number', message: '请选择关卡图标', trigger: 'change'},
          ]
        },
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openMask(item) {
        if(this.dataIcon.id === item.id) {
          this.dataIcon = ''
        } else {
          this.dataIcon = item
        }
        this.$forceUpdate()
      },
      openChild(item) {
        this.dataItem = item || {}
        this.$emit('changeChildItem', item)
      },
      addPoint(data) {
        if (this.dataList.length >= 5 && !data) {
          return this.$Message.error('关卡数量不能超过5个')
        }
        this.isOpenModalRadio = true
        this.getPresetIcon()
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.type = this.addInfo.type.toString()
        } else {
          this.addInfo = {
            lessonId: this.queryInfo.lessonId
          }
        }
      },
      openSort() {
        this.sortList = JSON.parse(JSON.stringify(this.dataList))
        this.isOpenModalSort = true
      },
      closeModal(name) {
        this.isOpenModalRadio = false
        this.$refs[name].resetFields()
      },
      delCheckpoint(data) {
        if (this.dataList.length === 1) {
          return this.$Message.info('课时需至少保留一个关卡，无法删除')
        }
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwLesson.removeCheckPointById({
              pointId: data.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success('删除成功')
                  this.getList()
                  this.openChild()
                }
              })
          }
        })
      },
      submitSort() {
        this.dataItem = {}
        let array = []
        this.sortList.forEach(item => {
          array.push(item.id)
        })
        this.$api.tbzwLesson.sortByIds({
          lessonId: this.queryInfo.lessonId,
          ids: array,
          type: 1
        })
          .then(response => {
            if (response.data.code == '200') {
              this.isOpenModalSort = false
              this.getList()
              this.$Message.success('操作成功');
            }
          })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.tbzwLesson.listCheckPoint({
          type: this.queryInfo.type,
          lessonId: this.queryInfo.lessonId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getPresetIcon() {
        this.$api.tbzwLesson.getPresetIcon()
          .then(
            response => {
              this.iconList = response.data.resultData;
            })
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.tbzwLesson.saveCheckPoint(this.addInfo)
              .then(response => {
                if (response.data.code == '200') {
                  this.closeModal(name)
                  this.getList()
                  this.dataIcon = ''
                  this.$Message.success('操作成功');
                }
              })
          }
        })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-navComponent {
    padding: 30px;

    &-item {
      display: flex;
      align-items: center;
      position: relative;
      margin: 0 0 20px 0;
      text-align: center;
      padding: 15px 20px;
      border: 1px solid #EBEBEB;
      min-width:200px;
      background:rgba(255,255,255,1);
      box-shadow:0px 4px 30px 0px rgba(205, 206, 201, 0.35);
      border-radius:10px;

      .-item-img {
        margin-right: 27px;
        width: 27px;
        height: 25px;
      }

      .-item-text {
        height: 23px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
      }

      .-item-tip {
        position: absolute;
        right: -68px;
        width:62px;
        height:27px;
        font-size: 12px;
        line-height: 27px;
        text-align: center;
        background:rgba(0,0,0,1);
        border-radius:14px 14px 14px 0px;
        color: #ffffff;
      }


      .-item-icon {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 18px;
        height: 18px;
      }

      .-item-mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 30px;
        width: 100%;
        height: 100%;
        font-size: 18px;
        background: rgba(0, 0, 0, 0.7);
        color: #ffffff;
        border-radius:10px;
      }

      &.-active {
        border: 1px solid orange;
      }
    }

    &-btn {
      display: block;
      width: 150px;
      margin: 20px auto 0;
    }

    &-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-sort {

      .-sort-item {
        display: inline-block;
        margin-right: 10px;
        text-align: center;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 4px;
        border: 1px solid #EBEBEB;
      }
    }

    &-img {
      width: 50px;
      height: 50px;
    }

    .-c-tips {
      color: #39f;
    }

  }
</style>
