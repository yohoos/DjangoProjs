<template>
  <v-layout
    justify-center
    align-center
  >
    <v-flex lg10 text-lg-center>
      <p>{{ msg }}</p>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'wifimap',
  data () {
    return {
      msg: 'Welcome to the Map'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
