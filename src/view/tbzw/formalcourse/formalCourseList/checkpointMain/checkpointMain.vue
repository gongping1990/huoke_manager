<template>
  <div class="p-checkpointMain">
    <Card class="p-checkpointMain-body">
        <div class="p-checkpointMain-nav">
          <nav-component ref="childNav" @changeChildItem="changeChild"></nav-component>
        </div>
        <div class="p-checkpointMain-content" v-show="isShow">
          <picture-book-template ref="childOne" v-show="dataInfo.type === 1"></picture-book-template>
          <video-template ref="childTwo" v-show="dataInfo.type === 2"></video-template>
          <VideoInteractionTemplate ref="childThree" v-show="dataInfo.type === 3" @updateNav="updateNav"></VideoInteractionTemplate>
        </div>
    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import NavComponent from "./navComponent";
  import VideoInteractionTemplate from "./videoInteractionTemplate";
  import PictureBookTemplate from "./pictureBookTemplate";
  import VideoTemplate from "./videoTemplate";

  export default {
    name: 'checkpointMain',
    components: {VideoTemplate, PictureBookTemplate, VideoInteractionTemplate, NavComponent},
    data() {
      return {
        dataInfo: '',
        isShow: false
      }
    },
    mounted() {
    },
    methods: {
      updateNav () {
        this.$refs.childNav.getList()
      },
      changeChild (data) {
        if (!data) {
          return this.isShow = false
        }
        this.dataInfo = data
        this.isShow = true

        switch (+this.dataInfo.type) {
          case 1:
            this.$refs.childOne.initData(data)
            break
          case 2:
            this.$refs.childTwo.getList(data)
            break
          case 3:
            this.$refs.childThree.initData(data)
            break
        }
      }
    }
  };
</script>

<style lang="less">
  .p-checkpointMain {
    .ivu-card-body {
      display: flex;
      width: 100%;
      padding: 0;
    }
  }
</style>

<style lang="less" scoped>
  .p-checkpointMain{
    width: 100%;

    &-body {
      width: 100%;
    }

    &-nav {
      /*width: 210px;*/
      border-right: 1px solid #EBEBEB
    }

    &-content {
      width: 100%;
    }

  }
</style>
