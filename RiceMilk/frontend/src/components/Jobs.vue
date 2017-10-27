<template>
  <v-container fluid grid-list-xl class="grey lighten-4">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <v-card>
          <v-card-text style="text-align: center;"><h4>What I'm Doing Now</h4></v-card-text>
          <v-card-media :src="current_job.img" height="200px" contain>
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3>{{ current_job.company }}</h3>
              <h4 class="headline mb-0"><i>{{ current_job.title }}</i></h4>
              <v-divider></v-divider>
              <br>
              <p>{{ current_job.description }}</p>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn :href="current_job.url" flat color="orange">Website</v-btn>
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn color="red" flat slot="activator">Change</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">Change Current Job</span>
                </v-card-title>
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-select
                        required
                        v-model="selectedJob"
                        label="Jobs"
                        autocomplete
                        :items="getJobTitleAndCompany()"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" flat @click.native="dialog = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="dialog = false; changeCurrentJob()">Change</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <add-job @reset="setOldJobs()"></add-job>
    <v-layout row wrap @reset="setOldJobs()">
      <v-flex xs12 text-xs-center><h4>Previous Experiences</h4></v-flex>
      <v-flex md6 xs12 v-for="(job, index) in jobs" :key="job.id" @reset="setOldJobs()">
        <v-card>
          <v-card-media :src="job.img" height="200px" contain></v-card-media>
          <v-card-title primary-title>
            <div>
              <h3>{{ job.company }}</h3>
              <h4 class="headline mb-0"><i>{{ job.title }}</i></h4>
              <v-divider></v-divider>
              <br>
              <p>{{ job.description }}</p>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn :href="job.url" flat color="orange">Website</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat color="red" @click="deleteJob(job)">Remove</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import AddJob from './AddJob'

  export default {
    props: [],
    components: {
      AddJob
    },
    data: function () {
      return {
        dialog: false,
        selectedJob: null,
        current_job: null,
        jobs: null
      }
    },
    methods: {
      getJobTitleAndCompany: function () {
        return this.jobs.map(job => {
          return job.company + ' : ' + job.title
        })
      },
      deleteJob: function (job) {
        axios.delete('/api/jobs/' + job.id + '/')
          .then(response => {
            this.setOldJobs()
          })
          .catch(e => {
            console.log(e)
          })
      },
      changeCurrentJob: function () {
        axios.patch('/api/jobs/' + this.current_job.id + '/', {'current': !this.current_job.current})
          .then(response => {
            console.log('Updated old job in database')
          })
          .catch(e => {
            console.log(e)
          })

        for (var i = 0; i < this.jobs.length; i++) {
          var key = this.jobs[i].company + ' : ' + this.jobs[i].title
          if (key === this.selectedJob) {
            this.current_job = this.jobs[i]
            this.current_job.current = true
            this.selectedJob = null

            break
          }
        }

        axios.patch('/api/jobs/' + this.current_job.id + '/', {'current': this.current_job.current})
          .then(response => {
            console.log('Updated current job')
            this.setOldJobs()
          })
          .catch(e => {
            console.log(e)
          })
      },
      setCurrentJob: function () {
        axios.get('/api/jobs/current')
          .then(response => {
            this.current_job = response.data
          })
          .catch(e => {
            console.log(e)
          })
      },
      setOldJobs: function () {
        axios.get('/api/jobs/old')
          .then(response => {
            this.jobs = response.data
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    mounted: function () {
      this.setCurrentJob()
      this.setOldJobs()
    }
  }
</script>
