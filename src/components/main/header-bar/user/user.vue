<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
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
        default: 'http://pub.file.k12.vip/avatar/parenting.png'
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
    }
  }
</style>
