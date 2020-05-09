<template>
  <div class="hourly-forecast">
    <div v-for="(hour, index) of hourlyToday" class="timeRow" :class="{daily: isDaily}" :key="index">
      <span class="time">{{timeStr(hour.dt)}}</span>

      <span v-if="!isDaily" class="temp">{{Math.round(hour.temp)}}℉</span>
      <span v-if="isDaily" class="temp">{{Math.round(hour.temp.min)}}℉</span>
      <span v-if="isDaily" class="temp">{{Math.round(hour.temp.max)}}℉</span>

      <span class="forecast">{{forecasts[index]}}</span>

      <span class="wind">{{windStr(windDirs[index], windSpeeds[index])}}</span>

      <span class="rain">{{downfallStr(hour.temp, hour.rain)}}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    data: Array[Object],
    isDaily: Boolean,
  },
  computed: {
    hourlyToday() {
      if (this.data) {
        // TODO: change first param to 1 when current conditions finished
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
      if (this.isDaily) {
        return moment.unix(time).format("ddd M/D");
      }
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
      var val = Math.floor((direction / 22.5) + 0.5);
      var arr = ["↑", "↑", "↗︎", "→", "→", "→", "↘︎", "↓", "↓", "↓", "↙︎", "←", "←", "←", "↖︎", "↑"];
      return arr[(val % 16)];
    },
    downfallStr(temp, rain) {
      if (!rain) {
        return "";
      }
      let downfallInches = 0;
      let downfallIcon = "❄️";
      let minTemp = temp;
      if (this.isDaily) {
        downfallInches = rain / 25.4;
        minTemp = temp.min;
      } else {
        downfallInches = rain['1h'] / 25.4;
      }
      if (minTemp > 32) {
        downfallIcon = '💧';
      }
      return downfallIcon + downfallInches.toFixed(2) + "\"";
    }
  }
};
</script>

<style scoped>
.hourly-forecast {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
}
.timeRow {
  display: grid;
  grid-template-columns: 1fr 40px 1fr 100px 60px;
  grid-template-rows: 24px;
  gap: 8px;
  margin-bottom: 6px;
  width: 100%;
}
.timeRow.daily {
  grid-template-columns: 1fr 40px 40px 1fr 100px 60px;
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
