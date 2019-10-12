<template>
  <div class="-item"
       :class="{'show': value == type}">
    <div class="-item-content"
         @click="clickItem">
      <i class="-item-icon"
         :class="icon"></i>
      {{text}}
      <i class="-item-arror"></i>
    </div>
    <div class="-item-slot"
         :style="{height: heightActive}">
      <div ref="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'line'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      height: 'auto',
      heightActive: 0
    }
  },
  watch: {
    value (val) {
      val == this.type ? (this.heightActive = this.height) : (this.heightActive = 0)
      this.$emit('click', this.type, (val == this.type))
    }
  },
  mounted () {
    setTimeout(() => {
      console.log(this.$refs.content)
      this.height = this.$refs.content.offsetHeight + 'px'
    }, 1000);
    this.show && this.clickItem()
  },
  methods: {
    clickItem () {
      this.$emit('input', this.type)
    }
  }
}
</script>

<style lang="less" scoped>
.-item {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid #dddfe9;
  &-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70px;
    font-size: 20px;
    line-height: 25px;
    color: #333;
    font-weight: 500;
  }
  &-slot {
    height: 0;
    overflow: hidden;
    transition: all 0.3s;
  }
  &-icon {
    display: block;
    margin-right: 22px;
    width: 25px;
    height: 25px;
    background-size: 100%;
    background-repeat: no-repeat;
    &.hx {
      background-image: url('../../../assets/images/correct/hx.png');
    }
    &.text {
      background-image: url('../../../assets/images/correct/text.png');
    }
    &.tp {
      background-image: url('../../../assets/images/correct/tp.png');
    }
    &.mb {
      background-image: url('../../../assets/images/correct/mb.png');
    }
    &.tx {
      background-image: url('../../../assets/images/correct/tx.png');
    }
  }
  &-arror {
    display: block;
    margin-left: 12px;
    width: 13px;
    height: 7px;
    background: url('../../../assets/images/correct/arror.png') no-repeat;
    background-size: 100%;
    transform: rotate(0);
    transition: all 0.3s;
  }
  &.show {
    .-item-arror {
      transform: rotate(180deg);
    }
    .-item-slot {
      visibility: visible;
      height: auto;
    }
    .-item-content {
      border-bottom: 1px solid #dddfe9;
    }
  }
}
</style>

