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
      props: {},
      forecast: [],
      hourly: []
    };
  },
  methods: {
    setLocation(location) {
      this.$store.commit("setCurrentLocation", location);
      this.props = {};
      this.forecast = [];
      this.hourly = [];
      if (location.useGPS) {
        this.setLocationWithGPS(location);
      } else {
        this.getWeatherData(location.lat, location.long);
      }
    },
    setLocationWithGPS(location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          location.lat = pos.coords.latitude;
          location.long = pos.coords.longitude;
          this.getWeatherData(location.lat, location.long);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
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
    reset() {
      this.$store.commit("setCurrentLocation", {});
      this.props = {};
      this.forecast = [];
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
