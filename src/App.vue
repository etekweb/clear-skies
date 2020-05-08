<template>
  <div id="app">
    <LocationList @setLocation="setLocation" @unsetLocation="reset" />
    <HourlyForecast :data="hourly" />
  </div>
</template>

<script>
import Axios from "axios";
import LocationList from "@/components/LocationList.vue";
import HourlyForecast from "@/components/HourlyForecast.vue";

export default {
  components: {
    LocationList,
    HourlyForecast
  },
  data() {
    return {
      current: {},
      daily: [],
      hourly: []
    };
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
      .then((res) => {
        this.current = res.data.current;
        this.daily = res.data.daily;
        this.hourly = res.data.hourly;
      })
      .catch((err) => {
        console.dir(err);
      })
    },
    reset() {
      this.$store.commit("setCurrentLocation", {});
      this.current = {};
      this.daily = [];
      this.hourly = [];
    }
  },
  mounted() {
    const location = this.$store.state.currentLocation;
    if (location && Object.keys(location).length > 0) {
      this.setLocation(location);
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
</style>
