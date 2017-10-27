<template>
  <v-layout row wrap justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="green" dark slot="activator">Add Job</v-btn>
      <v-card>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Company"
                    required
                    v-model="company"
                    :rules="companyRules"
                    :counter="50"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Title"
                    required
                    v-model="title"
                    :rules="titleRules"
                    :counter="50"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Url"
                    required
                    v-model="url"
                    :rules="urlRules"
                    :counter="100"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Description"
                    placeholder="Enter Job Description"
                    multi-line
                    v-model="description"
                    :rules="descriptionRules"
                    :counter="500"
                  ></v-text-field>
                </v-flex>
                <v-flex x12>
                  <v-btn color="primary" @click="clickInput()">
                    Choose your image file
                  </v-btn>
                  <input required id="job_img_upload" type="file" name="company_img" accept="image/*"
                         @change="updateFile($event.target.files)">
                </v-flex>
                <v-flex xs12>
                  <p v-if="inputFile">{{ inputFile.name }}</p>
                  <p v-if="isSaving">Uploading {{ inputFile.name }} ...</p>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click="clear">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click.native="dialog = false">Close</v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click="submit()"
              :disabled="isSaving"
            >Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import isURL from 'validator/lib/isURL'

  const STATUS_INITIAL = 0
  const STATUS_SAVING = 1
  const STATUS_SUCCESS = 2
  const STATUS_FAILED = 3

  export default {
    data: () => ({
      dialog: false,
      valid: true,
      company: '',
      companyRules: [
        (v) => !!v || 'Company name is required',
        (v) => (v && v.length <= 50) || 'Company name must be less than 50 characters'
      ],
      title: '',
      titleRules: [
        (v) => !!v || 'Job title is required',
        (v) => (v && v.length <= 50) || 'Job title must be less than 50 characters'
      ],
      url: '',
      urlRules: [
        (v) => !!v || 'Url is required',
        (v) => (v && isURL(v, {
          protocols: ['http', 'https'],
          require_tld: true,
          require_protocol: true,
          require_host: true,
          require_valid_protocol: true,
          allow_underscores: false,
          host_whitelist: false,
          host_blacklist: false,
          allow_trailing_dot: false,
          allow_protocol_relative_urls: false
        })) || 'Bad Formatting',
        (v) => (v && v.length <= 100) || 'Url must be less than 100 characters'
      ],
      description: '',
      descriptionRules: [
        (v) => (v && v.length <= 500) || 'Description must be less than 500 characters'
      ],
      inputFile: null,
      uploadError: null,
      currentStatus: null
    }),
    methods: {
      submit: function () {
        if (this.$refs.form.validate()) {
          var formData = new FormData()
          formData.append('company', this.company)
          formData.append('title', this.title)
          formData.append('url', this.url)
          formData.append('description', this.description)
          formData.append('img', this.inputFile)

          axios.post('/api/jobs/', formData)
            .then(response => {
              this.dialog = false
              this.clear()
              this.$emit('reset')
            })
        }
      },
      clear: function () {
        this.$refs.form.reset()
        this.inputFile = null
        this.currentStatus = STATUS_INITIAL
        this.uploadError = null
      },
      clickInput: function () {
        document.getElementById('job_img_upload').click()
      },
      updateFile: function (files) {
        this.inputFile = files[0]
      }
    },
    computed: {
      isInitial: function () {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving: function () {
        return this.currentStatus === STATUS_SAVING
      },
      isSuccess: function () {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed: function () {
        return this.currentStatus === STATUS_FAILED
      }
    },
    mounted: function () {
      this.clear()
    }
  }
</script>

<style scoped>
  #job_img_upload {
    opacity: 0;
  }
</style>
