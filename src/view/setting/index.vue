<template>
  <div class="user-setting">
    <div class="user-setting-header">
      <Select v-model="model3" style="width:100px">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Input v-model="value13" style="width:300px">
        <Select v-model="select3" slot="prepend" style="width: 80px">
            <Option value="day">Day</Option>
            <Option value="month">Month</Option>
        </Select>
      </Input>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.user-setting {
  &-header {
    display: flex;
    align-items: center;
  }
}
</style>
