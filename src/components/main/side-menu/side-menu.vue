<template>
  <div class="side-menu-wrapper">
    <Menu ref="sideMenu" :active-name="$route.name" theme="light" width="auto" :open-names="openNowName"
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
        systemList: {
          '1': '获课学堂',
          '2': '获课语文',
          '4': '资料库',
          '5': '获课朗读',
          '7': '古诗文',
          '8': '同步作文',
        },
        systemIdList: {
          '1': '1',
          '2': '2',
          '4': '4',
          '5': '5',
          '7': '7',
          '8': '8',
        },
        sideMenuList: [],
        systemName: ''
      }
    },
    computed: {},
    watch: {
      '$store.state.nowAdminType'(_n, _d) {
        this.systemName = this.systemList[_n]
        this.getList()
        this.$router.push('/')
        this.$forceUpdate()
      }
    },
    mounted() {
      this.getList()
      this.getAdminList()
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
          this.$refs.sideMenu.updateActiveName()
        }
      });
    },
    methods: {
      getAdminList() {
        let nowId = this.$store.state.nowAdminType
        this.systemName = this.systemList[nowId]
      },
      getList() {
        this.isFetching = true
        this.$api.admin.listByUserPerm({
          system: this.systemIdList[this.$store.state.nowAdminType]
        })
          .then(
            response => {
              this.sideMenuList = response.data.resultData
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
      padding: 14px 24px;
      .-title-name {
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
