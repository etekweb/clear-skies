<template>
  <div class="home">
    <div class="start">
      Enter ZIP Code:
      <input @keypress.enter="getWeatherData" v-model="zip" />
      <div @click="setLocationWithZIP" class="submit">Submit</div>
      <div @click="setLocationWithGPS" class="submit">Use GPS Instead</div>
    </div>
    {{forecast ? forecast.periods : ''}}
  </div>
</template>

<script>
import Axios from 'axios';
import zipcodes from "zipcodes";

export default {
  name: "Home",
  data() {
    return {
      zip: "",
      props: {},
      forecast: {}
    };
  },
  methods: {
    setLocationWithZIP() {
      const location = zipcodes.lookup(this.zip);
      if (location) {
        this.getWeatherData(location.latitude, location.longitude);
      } else {
        alert("Please enter a valid ZIP code.");
      }
    },
    setLocationWithGPS() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.getWeatherData(pos.coords.latitude, pos.coords.longitude);
        });
      } else { 
        alert("Geolocation is not supported by this browser.");
      }
    },
    getWeatherData(lat, long) {
      Axios.get("https://api.weather.gov/points/" + lat + "," + long)
      .then((res) => {
        this.props = res.data.properties;
        Axios.get(this.props.forecast)
        .then((resTwo) => {
          this.forecast = resTwo.data.properties;
        })
        .catch((errTwo) => {
          alert(errTwo);
        })
      })
      .catch((err) => {
        alert(err);
      })
    }
  }
};
</script>

<style scoped>
.submit {
  width: 100px;
  /* height: 50px; */
  display: inline;
  border: 1px solid black;
  text-align: center;
  /* display: table-cell;
  vertical-align: middle; */
  cursor: pointer;
  margin: 0 8px;
  padding: 0 4px;
}
</style>
