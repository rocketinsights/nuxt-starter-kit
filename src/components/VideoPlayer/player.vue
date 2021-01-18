<template>
  <section class="video">
    <div @touchStart.stop="">
      <!-- <Controls /> -->
    </div>
    <video :poster="posterImg" ref="player" />
  </section>
</template>

<script>
import _ from 'lodash'

export default {
  props: [
    'height',
    'width',
    'accessToken',
    'muxDataInitTime'
  ],
  data () {
    this.debug = process.env.IS_DEV || process.env.IS_STAGING
    this.isMuxDataSetup = false
    this.muxDataInitTime = this.muxDataInitTime
    this.hls = { player: null }
    this.pointerInterval = null
    this.accessToken = this.accessToken

    this.chromecast = {
      remotePlayer: null,
      controller: null
    }

    return {
      hasPlaybackStarted: false,
      hasTrackedVideoFinished: false,
      hasTrackedQuartile25: false,
      hasTrackedQuartile50: false,
      hasTrackedQuartile75: false,
      isAirPlayAvailable: false,
      isMobileDevice: false,
      isFullscreenCapable: false,
      isFullViewport: false,
      isFullScreen: false,
      isBuffering: true,
      isPlaying: false,
      isVideoWaitingToSync: false,
      videoSyncTime: 0,
      showControls: true,
      currentTime: 0,
      duration: 0,
      video: {},
      originalHeight: this.height,
      originalWidth: this.width,
      windowHeight: this.height,
      windowWidth: this.width,
      chromecastActive: false,
      chromecastPlaybackStarted: false,
      chromecastPlaying: false,
      chromecastBuffering: false,
      chromecastCurrentTime: 0,
      chromecastSwitchoverSeekTime: 0 // what we seek to when jumping into a chromecast video
    }
  },
  computed: {
    posterImg () {
      if (this.hasPlaybackStarted || !this.video) return
      return this.video.poster
    }
  },
  methods: {
    onKeyUp (event) {
      const { keyCode } = event

      // space bar
      if (event.keyCode === 32) this.isPlaying ? this.onPauseClick(event) : this.onPlayClick(event)
    },
    onFullscreenChange () {},
    onPauseClick (event) {},
    onWindowResize () {},
  },
  head () {
    return {
      script: [
        { src: '//cdn.jsdelivr.net/npm/hls.js@latest' },
        { src: '//src.litix.io/core/3/mux.js' }
      ],
    }
  },
  mounted () {
    if (Hls.isSupported()) this.hls.player = new Hls()

    document.addEventListener('keyup', this.onKeyUp)
    document.addEventListener('fullscreenchange', this.onFullscreenChange)
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange)
    document.addEventListener('MSFullscreenChange', this.onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange)
    window.addEventListener('resize', this.onWindowResize)
  },
  unmounted () {
    const { player } = this.$refs

    document.removeEventListener('keyup', this.onKeyUp)

    player.removeEventListener('canplay', this.onCanPlay)
    player.removeEventListener('loadstart', this.onLoadStart)
    player.removeEventListener('loadedmetadata', this.onLoadedMetadata)
    player.removeEventListener('loadeddata', this.onLoadedData)
    player.removeEventListener('playing', this.onPlaying)
    player.removeEventListener('pause', this.onPause)
    player.removeEventListener('seeking', this.onSeekStart)
    player.removeEventListener('seeked', this.onSeekEnd)
    player.removeEventListener('timeupdate', this.onTimeUpdate)
    player.removeEventListener('webkitplaybacktargetavailabilitychanged', this.onAirPlayAvailabilityCheck)
  }
}
</script>
