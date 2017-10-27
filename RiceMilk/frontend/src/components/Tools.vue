<template>
  <v-layout
    column
    wrap
    align-center
  >
    <add-tool @reset_tools="setTools"></add-tool>
    <v-flex xs12 sm4>
      <div class="text-xs-center">
        <h2 class="headline">Tools I Use At Work</h2>
        <!--<span class="subheading"><i>Big Data Tools</i></span>-->
      </div>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-xl>
        <v-layout row wrap align-center>
          <v-flex xs6 sm3 md2 v-for="tool in getWorkRelated()" :key="tool.name" @reset_tools="setTools()">
            <v-card class="elevation-0 transparent">
              <v-card-media :src="tool.img" height="200px" contain></v-card-media>
              <v-card-title primary-title class="layout justify-center">
                <div class="headline text-xs-center">{{ tool.name }}</div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="red" @click="deleteTool(tool)">Remove</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex xs12 sm4>
      <div class="text-xs-center">
        <h2 class="headline">Favorites Outside Work</h2>
        <!--<span class="subheading"><i>Big Data Tools</i></span>-->
      </div>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-xl>
        <v-layout row wrap align-center>
          <v-flex xs6 sm3 md2 v-for="tool in getFavoritesOnly()" :key="tool.name" @reset_tools="setTools()">
            <v-card class="elevation-0 transparent">
              <v-card-media :src="tool.img" height="200px" contain></v-card-media>
              <v-card-title primary-title class="layout justify-center">
                <div class="headline text-xs-center">{{ tool.name }}</div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="red" @click="deleteTool(tool)">Remove</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import AddTool from './AddTool'

  export default {
    components: {
      AddTool
    },
    data: function () {
      return {
        tools: []
      }
    },
    methods: {
      setTools: function () {
        axios.get('/api/tools/')
          .then(response => {
            this.tools = response.data
          })
          .catch(e => {
            console.log(e)
          })
      },
      deleteTool: function (tool) {
        axios.delete('/api/tools/' + tool.id)
          .then(response => {
            this.setTools()
          })
          .catch(e => {
            console.log(e)
          })
      },
      getWorkRelated: function () {
        return this.tools.filter(tool => tool.work_related === true)
      },
      getFavoritesOnly: function () {
        return this.tools.filter(tool => tool.work_related === false && tool.favorite === true)
      }
    },
    mounted: function () {
      this.setTools()
    }
  }
</script>
