<template>
  <div class="p-navComponent">

    <div class="p-navComponent-item g-cursor"
         :class="{'-active' : dataItem.id === item.id}"
         v-for="(item, index) of dataList"
         :key="index" @click="openChild(item)">
      <div class="-item-type" :class="typeList[item.type-1].class">{{typeList[item.type-1].name}}</div>
      {{item.name}}
      <Icon @click.stop="openMask(item)" class="-item-icon" type="ios-create-outline"/>
      <div class="-item-mask" v-if="item.id === dataIcon.id">
        <p class="g-cursor" @click="addPoint(item)">编辑</p>
        <p class="g-cursor" @click="delCheckpoint(item)">删除</p>
      </div>
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
      :closable="false"
      :mask-closable="false"
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
            <Option class="p-navComponent-option" :label="item.name" :value="item.src" v-for="(item, index) of iconList" :key="index">
              <img class="p-navComponent-img" :src="item.src"/>
              <span>{{item.name}}</span>
            </Option>
          </Select>
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
            class: '-typeOne',
            name: '绘本'
          },
          {
            class: '-typeTwo',
            name: '视频',
          },
          {
            class: '-typeThree',
            name: '视频交互',
          }
        ],
        iconList: [
          {
            src: 'https://pub.file.k12.vip/2019/09/30/1178583754778177537.png',
            name: '图标1'
          },
          {
            src: 'https://pub.file.k12.vip/2019/09/19/1174632403613650946.png',
            name: '图标2',
          }
        ],
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
            {required: true, message: '请选择关卡图标', trigger: 'change'},
          ]
        },
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openMask (item) {
        this.dataIcon = item
        this.$forceUpdate()
      },
      openChild(item) {
        this.dataItem = item
        this.$emit('changeChildItem', item)
      },
      addPoint(data) {
        if (this.dataList.length >= 5) {
          return this.$Message.error('关卡数量不能超过5个')
        }
        this.isOpenModalRadio = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
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
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.tbzwLesson.saveCheckPoint(this.addInfo)
              .then(response => {
                if (response.data.code == '200') {
                  this.closeModal(name)
                  this.getList()
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
      position: relative;
      margin: 0 auto 20px;
      text-align: center;
      width: 150px;
      padding: 10px 15px;
      border-radius: 4px;
      border: 1px solid #EBEBEB;

      .-item-type {
        position: absolute;
        top: 0;
        left: 0;
        padding: 1px 4px;
        font-size: 12px;
        border-radius: 2px;
        color: #ffffff;

        &.-typeOne {
          background-color: #39ba5c;
        }

        &.-typeTwo {
          background: #2baee9;
        }

        &.-typeThree {
          background: #f48336;
        }
      }

      .-item-icon {
        background-color: #2baee9;
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 18px;
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
        background: rgba(0, 0, 0, 0.3);
        color: #ffffff;
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
        width: 100px;
        padding: 10px 15px;
        border-radius: 4px;
        border: 1px solid #EBEBEB;
      }
    }

    &-img {
      width: 50px;
      height: 50px;
    }

  }
</style>
