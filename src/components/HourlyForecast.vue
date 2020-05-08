<template>
  <div class="hourly-forecast">
    <div v-for="(hour, index) of hourlyToday" class="timeRow" :key="index">
      <span class="time">{{timeStr(hour.dt)}}</span>
      <span class="temp">{{Math.round(hour.temp)}}℉</span>
      <span class="forecast">{{forecasts[index]}}</span>
      <span class="wind">{{windStr(windDirs[index], windSpeeds[index])}}</span>
      <span class="rain">{{hour.rain ? downfallIcon(hour.temp) + hour.rain['1h'] + '"' : ''}}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    data: Array[Object]
  },
  computed: {
    hourlyToday() {
      if (this.data) {
        return this.data.slice(0, 12);
      }
      return [];
    },
    forecasts() {
      const arr = [];
      let current = "";
      for (let i = 0; i < this.hourlyToday.length; i++) {
        if (this.hourlyToday[i].weather[0].main !== current) {
          current = this.hourlyToday[i].weather[0].main;
          arr.push(current);
        } else {
          arr.push("");
        }
      }
      return arr;
    },
    windSpeeds() {
      const arr = [];
      let current = "";
      for (let i = 0; i < this.hourlyToday.length; i++) {
        const windSpeed = Math.floor(this.hourlyToday[i].wind_speed);
        if (windSpeed !== current) {
          current = windSpeed;
          arr.push(current);
        } else {
          arr.push("");
        }
      }
      return arr;
    },
    windDirs() {
      const arr = [];
      for (let i = 0; i < this.hourlyToday.length; i++) {
        if (this.windSpeeds[i] !== "") {
          arr.push(this.hourlyToday[i].wind_deg);
        } else {
          arr.push("");
        }
      }
      return arr;
    }
  },
  methods: {
    timeStr(time) {
      return moment.unix(time).format("M/D ha").slice(0, -1);
    },
    windStr(windDir, windSpeed) {
      if (windDir || windSpeed) {
        return this.directionArrow(windDir) + " " + windSpeed + " mph";
      }
      return "";
    },
    directionArrow(direction) {
      if (direction === "") {
        return "";
      }
      const head = Math.round(direction / 45);
      switch (head) {
        case 2:
          return "→";
        case 6:
          return "←";
        case 0:
          return "↑";
        case 4:
          return "↓";
        case 3:
          return "↘︎";
        case 7:
          return "↖︎";
        case 1:
          return "↗︎";
        case 5:
          return "↙︎";
        default:
          return "—";
      }
    },
    downfallIcon(temp) {
      if (temp > 32) {
        return '💧';
      }
      return '❄️';
    }
  }
};
</script>

<style scoped>
.hourly-forecast {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.timeRow {
  display: grid;
  grid-template-columns: 1fr 40px 1fr 100px 100px;
  grid-template-rows: 24px;
  gap: 8px;
  margin-bottom: 6px;
  width: 100%;
}
.timeRow .time {
  text-align: right;
}
.timeRow .temp {
  border: 1px solid black;
  border-radius: 4px;
}
.timeRow .forecast {
  text-align: left;
}
.timeRow .wind {
  text-align: right;
  margin-right: 20px;
}
</style>
