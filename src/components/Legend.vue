<template>
  <div class="legend">
    <div class="top">
      <div class="title">{{ title }}</div>
    </div>
    <div>
      <p class="item" v-for="(item, index) in list" :key="index">
        <span :class="type" :style="'background:' + item.color" @click="clickItem(item, index)"></span>
        <span>{{ item.label }}{{ item.value }}</span>
      </p>
    </div>
    <p class="item unit" v-if="unit">({{ unit }})</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '图例'
    },
    stops: {
      type: Array,
      default: () => {
        return [[], []]
      }
    },
    unit: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'area'
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initList: [],
      list: [],
      radixCopy: ''
    }
  },
  watch: {
    stops: {
      handler(val) {
        console.log('val!!!!!!!!!!!!', val)
        let list = []
        for (let i = 0; i <= val.length - 1; i++) {
          let one = {
            color: '',
            label: '',
            value: ''
          }
          one.label = ''
          one.color = val[i][1]
          one.value = this.label + val[i][0]
          list.push(one)
        }
        this.list = list
        this.initList = JSON.parse(JSON.stringify(list)) //复制一份原始值
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    objToArrHandle(list) {
      let arrStops = []
      for (let i = 0; i < list.length; i++) {
        let item = []
        item.push(Number(list[i].value))
        item.push(list[i].color)
        arrStops.push(item)
      }

      return arrStops
    },
    // 点击单个item 返回过滤器
    clickItem(item, index) {
      const nextItem = this.list[index + 1]
      let filter
      if (index == this.list.length - 1) {
        filter = ['>=', 'color', item.value]
      } else {
        filter = ['all', ['>=', 'color', item.value], ['<', 'color', nextItem.value]]
      }

      this.$emit('filter', filter)
    }
  }
}
</script>

<style scoped lang="scss">
.legend {
  background: rgba(43, 53, 57, 60%);
  border: 1px solid #ffffff80;
  padding: 4px 8px;
  color: $fontColor;
  font-size: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    .title {
      display: inline-block;
      margin-left: 4px;
      font-family: 'ShangShouRuiYuanTi-2';
      font-size: 18px;
      padding: 2px 0;
    }
  }

  .item {
    padding: 1px 5px;
    font-size: 14px;
    display: flex;
    align-items: center;
    font-family: 'ShangShouRuiYuanTi-2';
    .line {
      width: 24px;
      height: 3px;
      margin-bottom: 3px;
    }
    .area {
      margin-right: 3px;
      width: 14px;
      height: 10px;
      border: 1px solid #fff;
      margin-bottom: 3px;
    }
    .circle {
      margin-left: 0px;
      margin-right: 12px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-bottom: 3px;
    }
  }
  .unit {
    text-align: right;
    font-size: 14px;
    display: inherit;
  }
}
</style>
