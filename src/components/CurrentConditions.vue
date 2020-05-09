<template>
  <div class="current-conditions">
    <!-- {{data}} -->
    <div class="temp">{{Math.round(data.temp)}}℉</div>
    <span>{{data.weather ? data.weather[0].main : ''}}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>

<style scoped>
.current-conditions {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.temp {
  font-size: 20px;
  width: 50px;
  height: 30px;
  border: 1px solid black;
  border-radius: 4px;
  display:flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
</style>