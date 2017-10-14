<template>
  <div>
    <section>
      <v-parallax src="/static/images/spring.jpg" height="600">
        <v-layout
          column
          align-center
          justify-center
          >
          <v-flex lg></v-flex>
          <v-flex lg text-lg-center>
            <h2>{{ welcome }}</h2>
            <h4><i>{{ profession }}</i></h4>
          </v-flex>
          <v-flex lg text-lg-center>
            <p></p>
          </v-flex>
        </v-layout>
      </v-parallax>
    </section>
    <section>
      <v-parallax src="/static/images/summer.jpg" height="600">
        <v-layout
          column
          align-center
          justify-center
          >
          <v-flex lg></v-flex>
          <v-flex lg text-lg-center>
            <h2>{{ welcome }}</h2>
            <h4><i>{{ profession }}</i></h4>
          </v-flex>
          <v-flex lg text-lg-center>
            <p></p>
          </v-flex>
        </v-layout>
      </v-parallax>
    </section>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      welcome: 'Yuhua Ni',
      profession: 'Data Engineer'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
