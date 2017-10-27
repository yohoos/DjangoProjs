<template>
  <div>
    <section>
      <v-parallax src="/static/images/spring.jpg">
        <v-layout
          row
          wrap
          align-center
          justify-center
        >
          <v-flex md6 xs12 text-xs-center>
            <h2>{{ welcome }}</h2>
            <h4><i>{{ profession }}</i></h4>
          </v-flex>
          <v-flex md6 xs12 text-xs-center>
            <v-avatar
              size="200px"
            >
              <img
                src="https://avatars2.githubusercontent.com/u/12375128?v=4&s=400&u=44411691244718d092661e0dc4e4a9704c6b5365"
                alt="My Face">
            </v-avatar>
          </v-flex>
        </v-layout>
      </v-parallax>
    </section>
    <section class="non-parallax">
      <jobs></jobs>
    </section>
    <section>
      <v-parallax src="/static/images/summer.jpg">
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout
            fill-height
            row
            wrap
            align-center
            justify-center
            text-xs-center
          >
            <v-flex md6 xs12>
              <h4>Check me out on LinkedIn</h4>
              <v-btn color="primary" large href="https://www.linkedin.com/in/yuhuani50/" dark>To LinkedIn and Awaaaay!
              </v-btn>
            </v-flex>
            <v-flex md6 xs12 text-xs-center>
              <v-avatar
                tile
                size="200px"
              >
                <img
                  src="/static/icons/linkedin.png"
                  alt="My Face">
              </v-avatar>
            </v-flex>
          </v-layout>
        </v-container>
      </v-parallax>
    </section>
    <section>
      <tools></tools>
    </section>
    <section>
      <v-parallax src="/static/images/autumn.jpg" :height="height">
        <v-container
          fluid
          grid-list-xl
        >
          <v-layout
            row
            wrap
            align-center
            justify-center
            fill-height
          >
            <v-flex xs12 sm6>
              <v-card dark class="elevation-0 transparent">
                <v-card-text class="text-xs-center">
                  <v-icon x-large class="blue--text text--lighten-2">info</v-icon>
                </v-card-text>
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline text-xs-center">Feel Free To Look Around</div>
                </v-card-title>
                <v-card-text class="subheading">
                  I will occasionally try out different technologies/frameworks/languages and showcase tutorials or small projects
                  on this website. You can access those side projects via the side navigation panel. Thank you for visiting!
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6 class="white--text">
              <v-card dark class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline text-xs-center">Find Me</div>
                </v-card-title>
                <v-list dark class="transparent">
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">email</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>yuhuani50@gmail.com</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile @click="redirect()">
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">code</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>https://github.com/yohoos</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-parallax>
    </section>
  </div>
</template>

<script>
  import Jobs from './Jobs'
  import Tools from './Tools'

  export default {
    name: 'home',
    components: {
      Jobs,
      Tools
    },
    data: function () {
      return {
        welcome: 'Yuhua Ni',
        profession: 'Data Engineer',
        height: '400'
      }
    },
    methods: {
      redirect: function () {
        window.location.href = 'https://github.com/yohoos'
      },
      setHeight: function (event) {
        if (event.currentTarget.innerWidth <= 400) {
          this.height = '700'
        } else if (event.currentTarget.innnerWidth <= 600) {
          this.height = '600'
        } else {
          this.height = '500'
        }
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.setHeight)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
