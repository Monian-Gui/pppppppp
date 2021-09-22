<template>
  <div class="title-contianer">
    <div v-if="level == 'level1'">
      <div class="text">
        <slot></slot>
      </div>
      <div class="decorate">
        <div class="left">
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <i class="iconfont icon-u50"></i>
        </div>
      </div>
    </div>

    <div v-if="level == 'level2'">
      <div class="text text-level2" :style="`color:${color2}`">
        <slot></slot>
      </div>
      <div class="decorate">
        <div class="left">
          <div class="item item-level2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * level:标题等级
     * @param {level1} arr  默认，一级标题
     * @param {level2} arr  二级标题
     * @param {level3} arr  三级标题
     */
    level: {
      type: String,
      default: 'level1'
    },
    color2: {
      default: '#fff;'
    }
  }
}
</script>

<style lang="scss" scoped>
.title-contianer {
  padding: 10px 0px;
  position: relative;
  text-align: left;
  margin-top: -10px;
  margin-bottom: -10px;
  .text {
    margin-left: 38px;
    padding-left: 10px;
    padding-bottom: 2px;
    font-size: 20px;
    color: #06d1db;
    border-bottom: 2px solid #06cfd9;
    border-image: -webkit-linear-gradient(to right, #06cfd9, #06cfd900) 20 20;
    border-image: -moz-linear-gradient(to right, #06cfd9, #06cfd900) 20 20;
    border-image: -o-linear-gradient(to right, #06cfd9, #06cfd900) 20 20;
    border-image: linear-gradient(to right, #06cfd9, #06cfd900) 20 20;
    font-family: 'ShangShouRuiYuanTi-2';
  }
  .text-level2 {
    border-bottom: none;
    font-size: 14px;
    line-height: 10px;
    margin: 10px 0 0 10px;
  }
  .decorate {
    position: absolute;
    bottom: 10px;
    .left {
      display: flex;
      align-items: flex-end;
      .item {
        // width: 4px;
        // height: 18px;
        width: 2px;
        height: 10px;
        background: #009900;
        transform: skew(30deg);
        margin-left: 3px;
        &:nth-child(1) {
          border: 2px solid #ff9900;
        }
        &:nth-child(2) {
          border: 2px solid #ffcc00;
        }
        &:nth-child(3) {
          border: 2px solid #ffff00;
        }
      }
      .item-level2 {
        width: 2px;
        height: 8px;
      }
      i {
        margin-left: 1px;
        color: #06cfd9;
        font-size: 14px;
      }
    }
  }
}
</style>
