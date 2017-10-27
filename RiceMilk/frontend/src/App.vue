<template>
  <v-app id="inspire">
    <v-navigation-drawer clipped persistent light :mini-variant.sync="mini" v-model="drawer" enable-resize-watcher app>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img
                src="https://avatars2.githubusercontent.com/u/12375128?v=4&s=400&u=44411691244718d092661e0dc4e4a9704c6b5365"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Yuhua Ni</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items.slice(0,1)" :key="item.title" @click="goTo (item.title)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Projects</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="item in items.slice(1)" :key="item.title" @click="goTo (item.title)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color='primary' clipped-left dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Welcome</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-content>
        <router-view></router-view>
      </v-content>
    </main>
    <v-footer color='primary' app>
      <span class="white--text">&copy; 2017. Powered by VueJS and Django</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true,
      items: [
        {title: 'Home', icon: 'dashboard'},
        {title: 'Coming Soon...', icon: 'assignment'}
      ],
      mini: false,
      right: null
    }),
    props: {
      source: String
    },
    methods: {
      goTo: function (name) {
        this.$router.push({name: name, params: {}})
      }
    }
  }
</script>
<style>
  li div a {
    text-decoration: none;
  }
</style>
