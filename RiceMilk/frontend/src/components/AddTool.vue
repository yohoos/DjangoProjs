<template>
  <v-layout row wrap justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="green" dark slot="activator">Add Tool</v-btn>
      <v-card>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-card-title>
            <span class="headline">New Tool</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Name"
                    required
                    v-model="name"
                    :rules="nameRules"
                    :counter="100"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-checkbox label="Favorite" v-model="favorite"></v-checkbox>
                </v-flex>
                <v-flex xs12>
                  <v-checkbox label="Work Related" v-model="work_related"></v-checkbox>
                </v-flex>
                <v-flex x12>
                  <v-btn color="primary" @click="clickInput()">
                    Choose your image file
                  </v-btn>
                  <input required id="tool_img_upload" type="file" name="tool_img" accept="image/*"
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

  const STATUS_INITIAL = 0
  const STATUS_SAVING = 1
  const STATUS_SUCCESS = 2
  const STATUS_FAILED = 3

  export default {
    data: function () {
      return {
        dialog: false,
        valid: false,
        name: null,
        img: null,
        favorite: false,
        work_related: false,
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => (v && v.length <= 100) || 'Name must be less than 100 characters'
        ],
        inputFile: null,
        uploadError: null,
        currentStatus: null
      }
    },
    methods: {
      submit: function () {
        if (this.$refs.form.validate()) {
          var formData = new FormData()
          formData.append('name', this.name)
          formData.append('img', this.inputFile)
          formData.append('favorite', this.favorite)
          formData.append('work_related', this.work_related)

          axios.post('/api/tools/', formData)
            .then(response => {
              this.dialog = false
              this.clear()
              this.$emit('reset_tools')
            })
        }
      },
      clear: function () {
        this.$refs.form.reset()
        this.inputFile = null
        this.currentStatus = STATUS_INITIAL
        this.uploadError = null
        this.favorite = false
        this.work_related = false
      },
      clickInput: function () {
        document.getElementById('tool_img_upload').click()
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

<style>
  #tool_img_upload {
    opacity: 0;
  }
</style>
