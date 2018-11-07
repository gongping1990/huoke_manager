<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <common-icon :type="parentItem.icon || ''"/>
      <span>{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
          <common-icon :type="item.children[0].icon || ''"/>
          <span>{{ showTitle(item.children[0]) }}</span></menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
          <common-icon :type="item.icon || ''"/>
          <span>{{ showTitle(item) }}</span></menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
  import {showTitle} from '@/libs/util'

  export default {
    name: 'SideMenuItem',
    props: {
      parentItem: {
        type: Object,
        default: () => {
        }
      },
      theme: String,
      iconSize: Number
    },
    computed: {
      parentName() {
        return this.parentItem.name
      },
      children() {
        return this.parentItem.children
      },
      textColor() {
        return this.theme === 'dark' ? '#fff' : '#495060'
      }
    },
    methods: {
      showTitle(item) {
        return showTitle(item, this)
      },
      showChildren(item) {
        return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
      },
      getNameOrHref(item, children0) {
        return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
      }
    }
  }
</script>
