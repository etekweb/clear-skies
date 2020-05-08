<template>
  <div id="app">
    <LocationList @setLocation="setLocation" :currentLocation="currentLocation" />
    <div class="time-wrap">
      <div v-for="(hour, index) of hourlyToday" class="timeRow" :key="index">
        <span class="time">{{convertTime(hour.startTime)}}</span>
        <span class="temp">{{hour.temperature}}℉</span>
        <span class="forecast">{{hour.shortForecast}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import LocationList from "@/components/LocationList.vue";

export default {
  components: {
    LocationList
  },
  data() {
    return {
      currentLocation: {},
      props: {},
      forecast: [],
      hourly: [],
      locations: [
        {
          name: "Cloquet, MN",
          lat: 47.1234,
          long: -69.42
        }
      ]
    };
  },
  computed: {
    hourlyToday() {
      if (this.hourly) {
        return this.hourly.slice(0, 12);
      }
      return [];
    }
  },
  methods: {
    setLocation(location) {
      this.currentLocation = location;
      this.getWeatherData(location.lat, location.long);
    },
    getWeatherData(lat, long) {
      Axios.get("https://api.weather.gov/points/" + lat + "," + long)
        .then(res => {
          this.props = res.data.properties;
          Axios.get(this.props.forecast)
            .then(resTwo => {
              this.forecast = resTwo.data.properties.periods;
            })
            .catch(errTwo => {
              alert(errTwo);
            });
          Axios.get(this.props.forecastHourly)
            .then(resThr => {
              this.hourly = resThr.data.properties.periods;
            })
            .catch(errThr => {
              alert(errThr);
            });
        })
        .catch(err => {
          alert(err);
        });
    },
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
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.time-wrap {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.timeRow {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  margin-bottom: 6px;
  gap: 8px;
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
</style>
