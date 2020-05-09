<template>
  <div id="app">
    <LocationList @setLocation="setLocation" @unsetLocation="reset" />
    <div class="update-data" :class="{old: oldData}">
      <div class="update-app" v-if="$store.state.updateOnRestart">
        App update available! -
        <span @click="refresh" class="refresh-link">Click to update</span>
      </div>
      Updated {{ lastUpdated }} -
      <span @click="refresh" class="refresh-link">Reload</span>
    </div>
    <ExtendedForecast :data="hourly" />
    <ExtendedForecast isDaily :data="daily" />
  </div>
</template>

<script>
import Axios from "axios";
import moment from "moment";

import LocationList from "@/components/LocationList.vue";
import ExtendedForecast from "@/components/ExtendedForecast.vue";

export default {
  components: {
    LocationList,
    ExtendedForecast
  },
  data() {
    return {
      time: moment(),
      current: {},
      daily: [],
      hourly: [],
      lastUpdated: ""
    };
  },
  computed: {
    oldData() {
      if (parseInt(this.lastUpdated[0]) >= 5) {
        return true;
      }
      return false;
    }
  },
  methods: {
    setLocation(location) {
      this.$store.commit("setCurrentLocation", location);
      this.current = {};
      this.daily = [];
      this.hourly = [];
      if (location.useGPS) {
        this.setLocationWithGPS();
      } else {
        this.getWeatherData(location.lat, location.long);
      }
    },
    setLocationWithGPS() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.getWeatherData(pos.coords.latitude, pos.coords.longitude);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    getWeatherData(lat, long) {
      console.log("Getting weather data...");
      Axios.get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          long +
          "&units=imperial&appid=" +
          process.env.VUE_APP_APIKEY
      )
        .then(res => {
          this.current = res.data.current;
          this.daily = res.data.daily;
          this.hourly = res.data.hourly;
          this.time = moment();
          this.lastUpdated = this.time.fromNow();
        })
        .catch(err => {
          console.dir(err);
        });
    },
    reset() {
      this.$store.commit("setCurrentLocation", {});
      this.current = {};
      this.daily = [];
      this.hourly = [];
    },
    refresh() {
      location.reload();
    }
  },
  mounted() {
    const location = this.$store.state.currentLocation;
    if (location && Object.keys(location).length > 0) {
      this.setLocation(location);
    }
    this.lastUpdated = this.time.fromNow();
    setInterval(() => {
      this.lastUpdated = this.time.fromNow();
    }, 10 * 1000);
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
.update-data {
  margin: 16px 0;
}
.update-data.old {
  color: red;
}
.update-app {
  color: green;
}
.refresh-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
