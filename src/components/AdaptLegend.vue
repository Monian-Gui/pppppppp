<template>
  <div class="legend">
    <div class="top">
      <div class="title">图例</div>
      <!-- <div>
        <span class="edit" @click="editClickHandle">{{ editState ? '保存' : '编辑' }}</span>
        <span v-if="editState" class="edit" @click="cancelClickHandle">取消</span>
      </div> -->
    </div>
    <!-- 显示状态 -->
    <div v-if="!editState">
      <p class="item" v-for="(item, index) in list" :key="index">
        <span :class="iconType" :style="'background:' + item.color" @click="clickItem(item, index)"></span>
        <span>{{ item.label }}{{ item.value }}</span>
      </p>
    </div>
    <!-- 编辑状态 -->
    <div v-else>
      <p class="item" v-for="(item, index) in list" :key="index">
        <el-color-picker v-model="item.color" size="mini" show-alpha></el-color-picker>
        <span class="item" style="padding: 0">
          <span class="label">{{ item.label }}</span>
          <el-input class="my-el-input" type="number" v-model="item.value" placeholder="请输入" size="mini"></el-input>
        </span>
      </p>
    </div>

    <p class="item unit" v-if="unit" :style="editState ? 'margin-top:10px' : ''">({{ unit }})</p>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['stops', 'unit', 'radix'],
  data() {
    return {
      editState: false,
      initList: [],
      list: [],
      iconType: 'area',
      // unit: '就业人口数/人'
      radixCopy: ''
    }
  },
  watch: {
    stops: {
      handler(val) {
        let list = []
        for (let i = 0; i <= val.length - 1; i++) {
          let one = {
            color: '',
            label: '',
            value: ''
          }
          one.label = '>='
          one.color = val[i][1]
          one.value = this.radixCopy ? val[i][0] / 100 : val[i][0]
          list.push(one)
        }
        this.list = list
        this.initList = JSON.parse(JSON.stringify(list)) //复制一份原始值
      },
      deep: true
    },
    radix: {
      handler(val) {
        if (val) {
          this.radixCopy = val
        }
      },
      immediate: true
    }
  },
  methods: {
    editClickHandle() {
      // 编辑逻辑
      if (!this.editState) {
        this.editState = true
      }
      //保存逻辑
      else {
        let list = this.list,
          state
        // 输入内容校验
        if (this.radixCopy) {
          state = this.checkoutRadixFunc(list)
        } else {
          state = this.checkoutFunc(list)
        }

        if (!state) {
          return
        }
        //封装回二维数组
        let arrStops = this.objToArrHandle(list)

        this.$emit('emitArrStops', arrStops)

        this.editState = false
      }
    },

    cancelClickHandle() {
      this.$confirm('此操作将取消图例编辑！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.list = JSON.parse(JSON.stringify(this.initList))
          this.editState = false
        })
        .catch(() => {})
    },

    checkoutFunc(list) {
      let checkStatus = true

      // 校验输入格式
      let reg = /^[1-9]\d*$|^0$/ //判断输入是否为数字且不能为小数或者0123
      let valueArr = []
      list.map(item => {
        valueArr.push(item.value)
        if (!reg.test(item.value)) {
          checkStatus = false
        }
      })

      if (!checkStatus) {
        this.$message({
          message: '格式有误，请检查您输入的内容！',
          type: 'warning'
        })

        return checkStatus
      }

      //校验区间顺序
      let initValueArr = JSON.parse(JSON.stringify(valueArr))
      valueArr.sort((a, b) => {
        return a - b
      })
      valueArr.map((item, i) => {
        if (item != initValueArr[i]) {
          checkStatus = false
        }
      })

      if (!checkStatus) {
        this.$message({
          message: '区间重叠，请检查您输入的区间！',
          type: 'warning'
        })
      }

      return checkStatus
    },
    checkoutRadixFunc(list) {
      let checkStatus = true
      // 校验输入格式
      let reg = /^(([0-9])|([1-9]([0-9]+)))(.[0-9]+)?$/ //判断输入是否为小数
      let valueArr = []
      list.map(item => {
        valueArr.push(item.value)
        if (!reg.test(item.value)) {
          checkStatus = false
        }
      })

      if (!checkStatus) {
        this.$message({
          message: '格式有误，请检查您输入的内容！',
          type: 'warning'
        })

        return checkStatus
      }

      //校验区间顺序
      let initValueArr = JSON.parse(JSON.stringify(valueArr))
      valueArr.sort((a, b) => {
        return a - b
      })
      valueArr.map((item, i) => {
        if (item != initValueArr[i]) {
          checkStatus = false
        }
      })

      if (!checkStatus) {
        this.$message({
          message: '区间重叠，请检查您输入的区间！',
          type: 'warning'
        })
      }

      return checkStatus
    },

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
  background: rgba(2, 5, 19, 0.4);
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
      font-family: 'HanYiZongYiTiJian';
      font-size: 22px;
    }
    .edit {
      color: $colorMain;
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .item {
    padding: 0px 5px;
    font-size: 20px;
    display: flex;
    align-items: center;
    .line {
      width: 24px;
      height: 3px;
    }
    .area {
      margin-right: 3px;
      width: 20px;
      height: 13px;
      border: 1px solid #fff;
    }
    .circle {
      margin-left: 6px;
      margin-right: 16px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .my-el-input {
      display: inline;
    }
  }
  .unit {
    text-align: right;
    font-size: 20px;
  }
  .title {
    font-family: 'HanYiZongYiTiJian';
    color: $fontColor;
    // font-weight: bold;
    padding: 2px 0;
  }
}
</style>

<style lang="scss">
.legend {
  .el-color-picker {
    height: 30px;
    margin-top: -13px;
  }
  .el-input--mini .el-input__inner {
    height: 20px;
    line-height: 20px;
    width: 80px;
    padding: 0 6px;
  }
}
</style>
