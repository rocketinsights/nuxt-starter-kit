import _ from 'lodash'

let storage

export const state = () => {
  return {
    downloadUrl: null,
    uploadProgress: null,
    uploadRef: null,
    uploadTask: null
  }
}

export const mutations = {
  setUploadRef (state, ref) {
    state.uploadRef = ref
  },
  setUploadTask (state, task) {
    state.uploadTask = task
  },
}

export const actions = {
  init () {
    storage = this.$fireModule.storage
  },
  upload ({ commit, dispatch }, file, metadata = {}) {
    const name = _.kebabCase(metadata.name) || `${Date.now()}-${_.random(Date.now())}`
    const path = `images/${name}`
    const ref = this.$fire.storage.ref().child(path)
    const task = ref.put(file, metadata)

    commit('setUploadRef', ref)
    commit('setUploadTask', task)

    task.on(this.$fireModule.storage.TaskEvent.STATE_CHANGED, {
      next: (snapshot) => dispatch('onUploadStateChange', snapshot),
      error: (err) => dispatch('onUploadError', err),
      complete: () => dispatch('onUploadComplete')
    })
  },
  onUploadStateChange ({ state }, snapshot) {
    state.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    console.log(`${state.uploadProgress}% done`)

    switch (snapshot.state) {
      case storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused')
        break
      case storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running')
        break
    }
  },
  onUploadError ({ commit }, err) {
    console.error('Upload Error', err.message)
  },
  async onUploadComplete ({ commit, state }) {
    state.downloadUrl = await state.uploadTask.snapshot.ref.getDownloadURL()
    console.log('File available at', state.downloadUrl)
  },
}

export const getters = {}
