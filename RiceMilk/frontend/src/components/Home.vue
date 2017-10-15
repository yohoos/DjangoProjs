<template>
  <div>
    <section>
      <v-parallax src="/static/images/spring.jpg" height="600">
        <v-layout
          column
          align-center
          justify-center
          >
          <v-flex xs text-xs-center>
            <h2>{{ welcome }}</h2>
            <h4><i>{{ profession }}</i></h4>
          </v-flex>
          <v-flex md>
            <v-avatar
              :size="img_width"
              >
              <img src="https://avatars2.githubusercontent.com/u/12375128?v=4&s=400&u=44411691244718d092661e0dc4e4a9704c6b5365" alt="My Face" style="">
            </v-avatar>
          </v-flex>
        </v-layout>
      </v-parallax>
    </section>
    <!-- <section class="non-parallax">
      <v-container fluid grid-list-xl>
        <v-layout
          column
          align-center
          justify-center
          >
          <v-flex xs text-xs-center>
            <h4>Where I've Worked</h4>
          </v-flex>
        </v-layout>
        <v-layout row wrap align-center justify-center text-xs-center>
          <v-flex md6 xs12>
            <v-card>
              <v-card-media src="/static/doc-images/cards/desert.jpg" height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{ current_job.title }}</h3>
                  <div>{{ current_job.description }}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn href="http://www.google.com" flat color="orange">Website</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row wrap text-xs-center>
          <v-flex md6 xs12 v-for="job in jobs" :key="job.title">
            <v-card>
              <v-card-media src="/static/doc-images/cards/desert.jpg" height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{ job.title }}</h3>
                  <div>{{ job.description }}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="orange">Website</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section> -->
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
      profession: 'Data Engineer',
      img_width: '200px',
      current_job: null,
      jobs: []
    }
  },
  mounted: function () {
    ;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
