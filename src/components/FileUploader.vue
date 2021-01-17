<template>
  <section id="storage">
    <input type="file" @change="onFileChosen($event.target.files)" />
    <label>{{ inMegabytes }}</label>
  </section>
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      files: []
    }
  },
  computed: {
    file () {
      return _.first(this.files)
    },
    inMegabytes () {
      if (!this.file) return
      const fileSize = (this.file.size/1000000).toFixed(1)
      return `${fileSize}MB`
    }
  },
  methods: {
    ...mapActions({
      upload: 'storage/upload'
    }),
    onFileChosen (files) {
      this.files = files
      this.upload(this.file, { name: 'My File Thx' })
    }
  }
}
</script>
