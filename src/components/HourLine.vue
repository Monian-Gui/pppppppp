<template>
  <div id="hourline" class="box"></div>
</template>

<script>
export default {
  data() {
    return {
      hourArr: [
        '0时',
        '1时',
        '2时',
        '3时',
        '4时',
        '5时',
        '6时',
        '7时',
        '8时',
        '9时',
        '10时',
        '11时',
        '12时',
        '13时',
        '14时',
        '15时',
        '16时',
        '17时',
        '18时',
        '19时',
        '20时',
        '21时',
        '22时',
        '23时'
      ]
    }
  },
  created() {},
  mounted() {
    this.initEchart()
    this.$store.state.hour = '6时' //首次加载
  },

  methods: {
    // 绘制图表
    initEchart() {
      let that = this
      let myChart = document.getElementById('hourline')
      this.myChart = this.$echarts.init(myChart)
      this.myChart.setOption({
        timeline: {
          data: that.hourArr,
          axisType: 'category',
          orient: 'horizontal',
          //inverse: true, //倒序
          show: true,
          autoPlay: false,
          //loop: false,//循环播放
          playInterval: 4000,
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
          currentIndex: 6, //当前项
          symbol: 'circle', //'emptyCircle' ,'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          // symbolSize: 14, //圆点大小

          //轴线
          lineStyle: {
            show: true,
            color: '#2E95FA',
            width: 2
          },
          //文本标签
          label: {
            position: 'left',
            show: true,
            color: '#fff',
            fontSize: 14,
            rotate: 30
          },
          //图形
          itemStyle: {
            color: '#fff',
            borderColor: '#2E95FA',
            borderWidth: 1
          },
          //当前项图形
          checkpointStyle: {
            color: '#E0773B'
            // borderColor: "#2E95FA",
            // borderWidth: 1
          },
          //控制按钮
          controlStyle: {
            showPlayBtn: true,
            itemSize: 22,
            color: '#fff',
            borderColor: '#2E95FA',
            borderWidth: 1
          },
          //选中&hover
          emphasis: {
            itemStyle: {
              color: '#FFB946'
            },
            label: {
              color: 'rgb(255, 176, 130)',
              fontSize: 12,
              fontWeight: 800
            },
            controlStyle: {
              color: '#E0773B',
              borderColor: '#E0773B'
            }
          }
        }
      })
      window.addEventListener('resize', function() {
        that.myChart.resize()
      })
      this.myChart.on('timelinechanged', e => {
        this.$store.state.hour = this.hourArr[e.currentIndex] //时间线触发
      })
    }
  },
  beforeDestroy() {
    this.myChart.dispose()
  }
}
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
}
</style>
