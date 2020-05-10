<template>
  <div class="location-manager">
    <div class="locations-bar">
      <div class="location-list">
        <div
          v-for="(location, index) of $store.state.locations"
          class="btn"
          :class="{selected: location.name === $store.state.currentLocation.name}"
          @click="$emit('setLocation', location)"
          :key="index"
        >
          {{location.name}}
          <div class="delete" v-if="showLocationSettings" @click.stop="removeLocation(location)">x</div>
        </div>
      </div>
      <div class="settings btn" @click="toggleLocationSettings">⚙</div>
    </div>
    <div class="add-location" v-if="showLocationSettings">
      Enter ZIP Code:
      <input type="number" @keypress.enter="addLocationWithZIP" v-model="zip" />
      <div @click="addLocationWithZIP" class="btn">Submit</div>
      <div @click="addLocationWithGPS" class="btn">Use GPS Instead</div>
      <div>
        <div class="btn" @click="reload">Check for App Updates</div>
        <div class="btn" @click="toggleDark">Toggle Dark Mode</div>
      </div>
    </div>
  </div>
</template>

<script>
import zipcodes from "zipcodes";

export default {
  data() {
    return {
      zip: "",
      showLocationSettings: true
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
        this.$emit("setLocation", location);
        this.zip = "";
        document.activeElement.blur();
        this.toggleLocationSettings();
      } else {
        alert("Please enter a valid ZIP code.");
      }
    },
    addLocationWithGPS() {
      this.zip = "";
      const location = {};
      location.name = "Current Location";
      location.useGPS = true;
      // Only add if GPS is not already added
      if (
        this.$store.state.locations.findIndex(
          obj => obj.name === location.name
        ) === -1
      ) {
        this.$store.commit("addLocation", location);
        this.$emit("setLocation", location);
        this.toggleLocationSettings();
      }
    },
    removeLocation(location) {
      this.$store.commit("removeLocation", location);
      if (location === this.$store.state.currentLocation) {
        this.$emit("setLocation", this.$store.state.locations[0]);
      }
    },
    toggleLocationSettings() {
      if (Object.keys(this.$store.state.currentLocation).length !== 0) {
        this.showLocationSettings = !this.showLocationSettings;
      }
    },
    reload() {
      location.reload();
    },
    toggleDark() {
      this.$store.commit('toggleDark');
      if (this.$store.state.dark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      this.toggleLocationSettings();
    }
  },
  mounted() {
    const location = this.$store.state.currentLocation;
    if (location && Object.keys(location).length > 0) {
      this.showLocationSettings = false;
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
  -ms-overflow-style: none;
}
.location-list::-webkit-scrollbar {
  display: none;
}
.add-location {
  line-height: 32px;
}
.btn {
  /* height: 50px; */
  display: inline;
  text-align: center;
  /* display: table-cell;
  vertical-align: middle; */
  cursor: pointer;
  user-select: none;
  margin: 0 8px;
  padding: 0 4px;
  white-space: nowrap;
  position: relative;
}
.btn.selected {
  font-weight: bold;
  background-color: black;
  color: white;
}
.settings.btn {
  font-size: 16px;
}
.delete {
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  right: -8px;
  color: white;
  width: 20px;
  height: 20px;
  font-size: 16px;
  line-height: 16px;
}
</style>
