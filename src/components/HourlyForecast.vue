<template>
  <div class="hourly-forecast">
    <div v-for="(hour, index) of hourlyToday" class="timeRow" :key="index">
      <span class="time">{{convertTime(hour.startTime)}}</span>
      <span class="temp">{{hour.temperature}}℉</span>
      <span class="forecast">{{forecasts[index]}}</span>
      <span class="wind">{{directionArrow(windDirs[index])}} {{windSpeeds[index]}}</span>
    </div>
  </div>
</template>

<script>
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
        if (this.hourlyToday[i].shortForecast !== current) {
          current = this.hourlyToday[i].shortForecast;
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
        if (this.hourlyToday[i].windSpeed !== current) {
          current = this.hourlyToday[i].windSpeed;
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
          arr.push(this.hourlyToday[i].windDirection);
        } else {
          arr.push("");
        }
      }
      return arr;
    }
  },
  methods: {
    convertTime(time) {
      const d = new Date(time);
      let hour = d.getHours();
      // Set AM and PM
      let tod = hour > 11 ? "p" : "a";
      // Remove 13-23 from range (for 12 hour time)
      hour = hour % 12;
      // If hour is 0, it is midnight or noon, so set to 12
      if (hour === 0) {
        hour = 12;
      }
      // Return proper date/time string
      return d.getMonth() + "/" + d.getDate() + " " + hour + tod;
    },
    directionArrow(direction) {
      switch (direction) {
        case "E":
          return "→";
        case "W":
          return "←";
        case "N":
          return "↑";
        case "S":
          return "↓";
        case "SE":
          return "↘︎";
        case "NW":
          return "↖︎";
        case "NE":
          return "↗︎";
        case "SW":
          return "↙︎";
        case "":
          return "";
        default:
          return "–";
      }
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
  grid-template-columns: 1fr 40px 1fr 100px;
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
