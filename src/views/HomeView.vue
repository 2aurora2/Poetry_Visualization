<template>
  <div class="layout">
    <div class="overview-section">
      <div class="card">
        <h2 class="card-title">诗词数量</h2>
        <b class="card-content">
          唐诗：57,347首，宋词：19,484首，元曲：8771首
        </b>
      </div>
      <div class="card">
        <h2 class="card-title">诗人数量</h2>
        <b class="card-content">
          唐代：3662人，宋代：1489人，元代：230人
        </b>
      </div>
    </div>
    <div class="content-section">
      <ChinaMapComp class="map-comp" />
      <DynastyComparisonChart class="chart-comp" />
    </div>
  </div>
</template>

<script setup>
import ChinaMapComp from '../components/ChinaMapComp.vue'
import DynastyComparisonChart from '../components/DynastyComparisonChart.vue'
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.overview-section {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 10px;
}

.card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 40%;
}

.card-title {
  font-family: 'STXingkai', 'KaiTi', serif; /* 华文行楷 */
  font-size: 26px;
  color: rgba(188, 19, 62, 0.98);
}

.card-content {
  font-family: 'KaiTi', serif;
  font-size: 18px;
  color: #333;
}

.content-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.map-comp {
  flex: 0 0 70%;
}

.chart-comp {
  flex: 0 0 30%;
}
</style>