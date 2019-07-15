<template>
  <div class="p-learningResource">
    <Card>
      <tree-two></tree-two>
    </Card>
  </div>
</template>

<script>
  import TreeTwo from "./treeTwo";
  export default {
    name: 'learningResource',
    components: {TreeTwo},
    data() {
      return {

      }
    }
  };
</script>


<style lang="less" scoped>
  .p-learningResource {

  }
</style>
