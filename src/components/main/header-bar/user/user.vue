<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick" placement="bottom-end">
      <Avatar :src="userAvator"/>
      <span class="user-name">欢迎您~{{userName}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list" >
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: require('@/assets/images/userImg.png')
      }
    },
    data() {
      return {
        userName: localStorage.nickname
      }
    },
    methods: {
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.$api.admin.loginOut()
              .then(
                res => {
                  if (res.data.code == '200') {
                    localStorage.clear()
                    this.$Message.error('退出成功')
                    this.$router.push('/login')
                  }
                })
            break
        }
      }
    }
  }
</script>
<style lang="less">
  .user {
    &-avator-dropdown {
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;

      .user-name {
        padding: 0 10px;
        color: #5444E4;
      }
    }
  }
</style>
