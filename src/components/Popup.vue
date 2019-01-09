<template>
  <div>
    <v-dialog width="400" v-model="dialog">
      <v-btn slot="activator" class="grey">Test</v-btn>
      <v-card>
        <v-card-text class="headline grey lighten-2" primary-title>Form example</v-card-text>
        <v-card-text>
          <v-form>
            <v-text-field label="Name" v-model="form.name" prepend-icon="folder"></v-text-field>
            <v-textarea
              name="input-7-1"
              label="Description"
              value
              hint
              v-model="form.content"
              prepend-icon="edit"
            ></v-textarea>
            <v-btn class="success" @click="submit">Add Project</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      form: {
        name: null,
        content: null
      }
    }
  },
  methods: {
    submit () {
      console.log(`name = ${this.form.name}`)
      console.log(`name = ${this.form.content}`)
    }
  }
}
</script>

<style>
</style>
