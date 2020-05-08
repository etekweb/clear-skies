<template>
  <div class="location-manager">
    <div class="locations-bar">
      <div class="location-list">
        <div
          v-for="(location, index) of $store.state.locations"
          class="btn"
          :class="{selected: currentLocation === location}"
          @click="setLocation(location)"
          :key="index"
        >{{location.name}}</div>
      </div>
      <div class="btn" @click="showAddLocationForm = !showAddLocationForm">+</div>
    </div>
    <div class="add-location" v-if="showAddLocationForm">
      Enter ZIP Code:
      <input type="number" @keypress.enter="addLocationWithZIP" v-model="zip" />
      <div @click="addLocationWithZIP" class="btn">Submit</div>
      <div @click="addLocationWithGPS" class="btn">Use GPS Instead</div>
    </div>
  </div>
</template>

<script>
import zipcodes from "zipcodes";

export default {
  props: {
    currentLocation: Object,
  },
  data() {
    return {
      zip: "",
      showAddLocationForm: true
    };
  },
  methods: {
    addLocationWithZIP() {
      const res = zipcodes.lookup(this.zip);
      if (res) {
        const location = {};
        location.name = res.city + ", " + res.state;
        location.lat = res.latitude;
        location.long = res.longitude;
        this.$store.commit("addLocation", location);
        this.setLocation(location);
        document.activeElement.blur();
      } else {
        alert("Please enter a valid ZIP code.");
      }
    },
    addLocationWithGPS() {
      this.zip = "";
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const location = {};
          location.name = "Current Location";
          location.lat = pos.coords.latitude;
          location.long = pos.coords.longitude;
          this.$store.commit("addLocation", location);
          this.setLocation(location);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    setLocation(location) {
      this.$emit("setLocation", location);
      this.showAddLocationForm = false;
    }
  }
};
</script>

<style scoped>
.locations-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.location-list {
  display: flex;
  overflow-x: scroll;
}
.add-location {
  line-height: 32px;
}
.btn {
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
.btn.selected {
  text-decoration: underline;
}
</style>
