import _ from 'lodash'

const _guid = () => { // thanks StackOverflow (https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript)
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

const _setItem = (key, data) => {
  if (window.navigator.doNotTrack) { return console.warn('Do Not Track is on: localStorage skipped') }
  const payload = JSON.stringify(data)
  localStorage.setItem(key, payload)
}

// const _getItem = (key) => {
//   return JSON.parse(localStorage.getItem(key))
// }

// only creates user if it doesn't exist, returns userId
const _getUser = () => {
  const userId = localStorage.getItem('userId')
  const defaultId = _guid()
  if (!_.isEmpty(userId)) { return userId }
  _setItem('userId', defaultId)
  return defaultId
}

const _setBookmark = (slug, time) => {
  const markers = _getMarkers()
  markers[slug] = time
  _setItem('videoBookmarks', markers)
}

const _trackMarker = (name, time) => {
  _getUser()
  _setBookmark(_.kebabCase(name), time)
}

const _getMarkers = () => JSON.parse(localStorage.getItem('videoBookmarks')) || {}

const setMarker = _.throttle(_trackMarker, 3000)

const getMarker = (name) => {
  const markers = _getMarkers()
  const slug = _.kebabCase(name)
  return _.get(markers, slug, 0)
}

const removeMarker = (name) => {
  const markers = _getMarkers()
  const slug = _.kebabCase(name)
  delete markers[slug]
  _setItem('videoBookmarks', markers)
}

export {
  getMarker,
  removeMarker,
  setMarker
}
