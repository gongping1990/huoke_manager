<template>
  <div class="side-menu-wrapper">
    <Menu ref="sideMenu" :active-name="$route.name" theme="light" width="auto" :open-names="openNowName" accordion
          @on-select='selectMenu'>
      <div class="layout-logo-left">
        <img src="../../../assets/images/share-logo.png"/>
        <div class="-version">1.0</div>
      </div>
      <div class="-left-li -left-title">
        当前系统：
        <span class="-title-name g-cursor" @click="closeModal">
          {{systemName}} <Icon type="md-swap"/>
        </span>
      </div>
      <Submenu :name="list.path" class="-left-li" v-for="(list,index) of sideMenuList" :key="index" v-if="list.checked">
        <template slot="title">
          <Icon :type="list.ico" class="hk-menu-icon"/>
          <span>{{list.name}}</span>
        </template>

        <Menu-item v-if="item.checked" :name="item.path" v-for="(item,index1 ) of list.child" :key="index1">
          {{item.name}}
        </Menu-item>
      </Submenu>
    </Menu>
    <div v-if="isOpenModal">
      <switching-system @closePwdModal="closeModal"></switching-system>
    </div>
  </div>
</template>
<script>

  import SwitchingSystem from "../switchingSystem/switchingSystem";

  export default {
    name: 'SideMenu',
    components: {SwitchingSystem},
    props: ['openName'],
    data() {
      return {
        openNowName: this.openName,
        isOpenModal: false,
        systemList: [],
        sideMenuList: [],
        systemName: ''
      }
    },
    computed: {},
    watch: {
      '$store.state.nowAdminType'(_n, _d) {
        this.getRoleList()
        this.systemName = this.systemList[_n].name
        // this.getList()
        this.$router.push('/')
        this.$forceUpdate()
      }
    },
    mounted() {
      this.getRoleList()
    },
    methods: {
      getRoleList() {
        let nowId = this.$store.state.nowAdminType
        this.$api.admin.listBizSystem()
          .then(
            response => {
              this.systemList = response.data.resultData;
              this.systemName = this.systemList[nowId].name
              this.getList()
            })
      },
      getList() {
        this.isFetching = true
        this.$api.admin.listByUserPerm({
          system: this.systemList[this.$store.state.nowAdminType].id
        })
          .then(
            response => {
              this.sideMenuList = response.data.resultData
              this.$nextTick(() => {
                if (this.$refs.sideMenu) {
                  this.$refs.sideMenu.updateOpened();
                  this.$refs.sideMenu.updateActiveName()
                }
              });
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      closeModal() {
        this.isOpenModal = !this.isOpenModal
      },
      selectMenu(name) {
        this.$router.push({
          name: name
        })
      }
    }
  }
</script>
<style lang="less">
  .side-menu-wrapper {
    .layout-logo-left {
      padding: 30px 10px;
      img {
        width: 40%;
      }

      .-version {
        margin: 0 auto;
        width: 50px;
        background: rgba(235, 235, 235, 1);
        border-radius: 10px;
        color: #b3b5b8;
      }
    }
    .-left-title {
      display: flex;
      align-items: center;
      padding: 14px 10px 14px 24px;
      .-title-name {
        display: inline-block;
        width: 130px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #5444E4;
      }
    }
    .-left-li {
      text-align: left;
    }
    .hk-menu-icon {
      vertical-align: initial;
    }
  }

  .menu-title {
    padding-left: 6px;
  }

</style>
