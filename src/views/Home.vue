<template>
  <div class="home">
    <div class="start">
      Enter ZIP Code:
      <input type="number" @keypress.enter="setLocationWithZIP" v-model="zip" />
      <div @click="setLocationWithZIP" class="submit">Submit</div>
      <div @click="setLocationWithGPS" class="submit">Use GPS Instead</div>
    </div>
    <div class="location">{{city}}{{state ? ', ' + state : ''}}</div>
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
import zipcodes from "zipcodes";

export default {
  name: "Home",
  data() {
    return {
      zip: "",
      city: "",
      state: "",
      props: {},
      forecast: [],
      hourly: []
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
    setLocationWithZIP() {
      const location = zipcodes.lookup(this.zip);
      console.log(location);
      if (location) {
        this.city = location.city;
        this.state = location.state;
        this.getWeatherData(location.latitude, location.longitude);
        document.activeElement.blur();
      } else {
        alert("Please enter a valid ZIP code.");
      }
    },
    setLocationWithGPS() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.city = "Current Location";
          this.getWeatherData(pos.coords.latitude, pos.coords.longitude);
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
    convertTime(time) {
      const d = new Date(time);
      let hour = d.getHours();
      // Set AM and PM
      let tod = hour > 11 ? 'p' : 'a';
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

<style scoped>
.start {
  line-height: 32px;
}
.submit {
  /* height: 50px; */
  display: inline;
  border: 1px solid black;
  text-align: center;
  /* display: table-cell;
  vertical-align: middle; */
  cursor: pointer;
  user-select: none;
  margin: 0 8px;
  padding: 0 4px;
  white-space: nowrap;
}
.location {
  margin: 8px 0 16px 0;
}
.time-wrap {
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
