<template>
  <section class="video" ref="container">
    <div @touchStart.stop="">
      <!-- <Controls /> -->
    </div>
    <video ref="player"
      controls
      :poster="posterImg"
      v-bind:style="videoStyles"
    />
  </section>
</template>

<script>
import _ from 'lodash'
import { getMarker, removeMarker, setMarker } from '@/utils/storage'

const PAGE_EVENTS = {
  PLAY_TRAILER_CLICKED: 'Play Trailer Clicked',
  MOVIE_DETAILS_CLICKED: 'Movie Details Clicked',
  PRODUCT_CLICKED: 'Product Clicked',
  PRODUCT_PURCHASED: 'Product Purchased',
  ADD_TO_CART_CLICKED: 'Add To Cart Clicked',
  CONTACT_SIGNUP: 'Email/SMS Sign-up',
  TWITTER_SHARE: 'Twitter Share',
  FACEBOOK_SHARE: 'Facebook Share'
}

const VIDEO_EVENTS = {
  AIRPLAY_STARTED: 'airplay started',
  CHROMECAST_BUFFERING: 'chromecast buffering',
  CHROMECAST_PLAY: 'chromecast play',
  CHROMECAST_PAUSE: 'chromecast pause',
  CHROMECAST_SEEK: 'chromecast seek',
  PLAYER_ENTER_FULLSCREEN: 'player enter fullscreen',
  PLAYER_EXIT_FULLSCREEN: 'player exit fullscreen',
  PLAYER_READY: 'player ready',
  PLAYBACK_STARTED: 'playback started',
  QUARTILE_25: 'quartile 25%',
  QUARTILE_50: 'quartile 50%',
  QUARTILE_75: 'quartile 75%',
  VIDEO_BUFFERING: 'video buffering',
  VIDEO_FINISHED: 'video finished',
  VIDEO_PLAY: 'video play',
  VIDEO_PAUSE: 'video pause',
  VIDEO_SEEK: 'video seek',
  VIDEO_WATCH_WITH_CLICKED: 'video watch with clicked'
}

const EVENTS = {
  ...PAGE_EVENTS,
  ...VIDEO_EVENTS
}

export default {
  props: [
    'height',
    'width',
    'accessToken',
    'muxDataInitTime'
  ],
  data () {
    return {
      debug: process.env.IS_DEV || process.env.IS_STAGING,
      isMuxDataSetup: false,
      hls: { player: null },
      pointerInterval: null,
      chromecast: {
        remotePlayer: null,
        controller: null
      },
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
      video: {
        assetId: 'aPQqIC7xI1aGyyUYjInwGkAB99z11cQ02',
        title: 'Big Buck Bunny',
        poster: ''
      },
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
    },
    videoStyles () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },
  methods: {
    initializeMuxData () {
      if (this.isMuxDataSetup) return
      const { player } = this.$refs

      if (this.debug) console.log('setting up Mux data events')

      mux.monitor(player, {
        // debug: this.debug,
        hlsjs: this.hls.player,
        Hls,
        data: {
          env_key: process.env.MUX_DATA_ENV_KEY,
          player_name: 'Custom Nuxt Starter Kit HTML5 Player',
          player_init_time: this.muxDataInitTime,
          video_title: this.video.title,
          video_duration: this.$refs.player.duration
        }
      })

      this.isMuxDataSetup = true
    },
    loadScript (srcUrl) {
      const script = document.createElement('script')
      script.async = false
      script.src = srcUrl
      document.querySelector('head').appendChild(script)
    },
    async fetchStreamUrl (assetId) {
      try {
        const options = {
          method: 'GET',
          headers: {
            'x-asset-id': assetId,
            'x-access-token': this.accessToken
          }
        }
        const res = await fetch('/api/mux', options)
        const streamUrls = await res.json()
        return _.first(streamUrls)
      } catch (err) {
        console.log('fetchStreamUrl failed', err.message)
        return null
      }
    },
    async loadVideoSrc (assetId) {
      try {
        const { player } = this.$refs
        const srcUrl = await this.fetchStreamUrl(assetId)

        // only happens when a watchwith video is switched in
        if (this.chromecastActive) {
          this.loadChromecastSrc(srcUrl)
          return
        }

        if (Hls.isSupported()) {
          this.hls.player.loadSource(srcUrl)
          this.hls.player.attachMedia(player)
          if (this.debug) console.log('HLS supported the polyfill way')
        } // Note: it would be more normal to wait on the 'canplay' event below however
        // on Safari (where you are most likely to find built-in HLS support) the
        // video.src URL must be on the user-driven white-list before a 'canplay'
        // event will be emitted the last video event that can be reliably
        // listened-for when the URL is not on the white-list is 'loadedmetadata'.
        else if (player.canPlayType('application/vnd.apple.mpegurl')) {
          if (this.debug) console.log('HLS supported the "native" way')
          player.src = srcUrl
        } else {
          window.alert('This browser does not support HLS playback')
        }

        this.initializeMuxData()
        this.activeAssetId = assetId
        this.trackEvent(EVENTS.PLAYER_READY)
      } catch (err) {
        console.error('Failed to loadVideoSrc()', err.message)
      }
    },
    trackEvent (eventName, payload) {
      console.log('TODO trackEvent', { eventName, payload })
    },
    trackQuartile (marker) {
      switch (marker) {
        case 25:
          this.trackEvent(EVENTS.QUARTILE_25, {
            videoName: this.video.title
          })
          break
        case 50:
          this.trackEvent(EVENTS.QUARTILE_50, {
            videoName: this.video.title
          })
          break
        case 75:
          this.trackEvent(EVENTS.QUARTILE_75, {
            videoName: this.video.title
          })
          break
        default:
      }
    },
    unloadVideoSrc () {
      const { player } = this.$refs
      this.hls.player.attachMedia(player)
    },
    onAirPlayAvailabilityCheck (event) {
      if (event.availability === 'available') this.isAirPlayAvailable = true
    },
    onChromecastAvailable (isAvailable) {
      if (!isAvailable) return

      const applicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      const sessionRequest = new chrome.cast.SessionRequest(applicationId)
      // const apiConfig = new chrome.cast.ApiConfig(sessionRequest, this.onChromecastSession, this.onChromecastReceiver)
      const apiConfig = new chrome.cast.ApiConfig(sessionRequest, _.noop, _.noop)
      chrome.cast.initialize(apiConfig, _.noop, (errMessage) => {
        console.log('Error initializing Chromecast API', errMessage)
      })

      cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: applicationId,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      })

      const remotePlayer = new cast.framework.RemotePlayer()
      const controller = new cast.framework.RemotePlayerController(remotePlayer)

      this.chromecast.remotePlayer = remotePlayer
      this.chromecast.controller = controller

      const {
        IS_CONNECTED_CHANGED,
        CURRENT_TIME_CHANGED,
        IS_MEDIA_LOADED_CHANGED,
        PLAYER_STATE_CHANGED
      } = cast.framework.RemotePlayerEventType

      controller.addEventListener(IS_CONNECTED_CHANGED, this.onChromecastReceiverConnectChange)
      controller.addEventListener(CURRENT_TIME_CHANGED, this.onChromecastTimeUpdate)
      controller.addEventListener(IS_MEDIA_LOADED_CHANGED, () => this.onChromecastMediaLoaded)
      controller.addEventListener(PLAYER_STATE_CHANGED, ({ value }) => {
        switch (value) {
          case 'PLAYING':
            this.onChromecastPlaying()
            break
          case 'PAUSED':
            this.onChromecastPaused()
            break
          case 'BUFFERING':
            this.onChromecastBuffering()
            break
          default:
            if (this.debug) console.log('PLAYER_STATE_CHANGED unhandled', value)
        }
      })
    },
    onChromecastMediaLoaded () {
      if (this.debug) console.log('onChromecastMediaLoaded')
      if (this.chromecastSwitchoverSeekTime) {
        if (this.debug) console.log('seeking to', this.chromecastSwitchoverSeekTime)
        this.isVideoWaitingToSync = false
      }
    },
    async loadChromecastSrc (videoSrc) {
      try {
        const mediaInfo = new chrome.cast.media.MediaInfo(videoSrc)
        mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata()
        mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC
        mediaInfo.metadata.title = this.video.title

        const request = new chrome.cast.media.LoadRequest(mediaInfo)
        const castSession = cast.framework.CastContext.getInstance().getCurrentSession()
        await castSession.loadMedia(request)
      } catch (errorCode) {
        console.log('Failed to load chromecast media. Error code:', errorCode)
      }
    },
    seekChromecastPlayer (time) {
      this.chromecast.remotePlayer.currentTime = time
      this.chromecast.controller.seek()
      if (this.debug) console.log('seeking chromecst to', time)
      this.chromecastSwitchoverSeekTime = 0
    },
    onPointerMove () {
      this.showControls = true

      clearInterval(this.pointerInterval)
      const callback = _.bind(() => {
        if (!this.isPlaying) return
        this.showControls = false
      }, this)

      this.pointerInterval = setInterval(callback, 2000)
    },
    onPointerLeave () {
      this.showControls = false
    },
    onContainerTouch () {
      this.showControls = !this.showControls
    },
    // ----------------------------------------------- Player Handlers
    onChromecastReceiverConnectChange ({ value }) {
      if (this.debug) console.log('onChromecastReceiverConnectChange')
      if (value && cast && cast.framework) { // connected
        this.chromecastActive = true
        this.chromecastPlaying = false
        this.chromecastSwitchoverSeekTime = this.currentTime
        this.isPlaying = false

        this.loadVideoSrc(this.video.assetId)
        this.unloadVideoSrc()
      }
    },
    onChromecastSession (event) {
      if (this.debug) console.log('onChromecastSession', event)
    },
    onChromecastReceiver (event) {
      if (this.debug) console.log('onChromecastReceiver', event)
    },
    onChromecastPlaying () {
      const { chromecastPlaybackStarted, chromecastSwitchoverSeekTime } = this
      if (this.debug) console.log('onChromecastPlaying', { chromecastPlaybackStarted, chromecastSwitchoverSeekTime })

      if (!chromecastPlaybackStarted && chromecastSwitchoverSeekTime) {
        if (this.debug) console.log('seeking to time for chromecast', chromecastSwitchoverSeekTime)
        this.seekChromecastPlayer(chromecastSwitchoverSeekTime)
      }

      this.chromecastPlaying = true
      this.chromecastPlaybackStarted = true
      this.chromecastSwitchoverSeekTime = 0
      this.chromecastBuffering = false

      this.trackEvent(EVENTS.CHROMECAST_PLAY, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })
    },
    onChromecastPaused () {
      if (this.debug) console.log('onChromecastPaused')
      this.chromecastPlaying = false
      this.chromecastBuffering = false

      this.trackEvent(EVENTS.CHROMECAST_PAUSE, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })
    },
    onChromecastBuffering () {
      if (this.debug) console.log('onChromecastBuffering')
      this.chromecastBuffering = true
      this.trackEvent(EVENTS.CHROMECAST_BUFFERING, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })
    },
    onChromecastTimeUpdate ({ value }) {
      const { chromecastPlaying, video } = this
      if (!chromecastPlaying) return

      setMarker(video.assetId, value)

      if (this.hasPlaybackStarted) this.chromecastSwitchoverSeekTime = value
      
      this.chromecastCurrentTime = value
      this.currentTime = value
      this.chromecastBuffering = false
    },
    onCanPlay () {
      this.duration = this.$refs.player.duration
    },
    onLoadStart () {
      this.isBuffering = true
    },
    onLoadedData () {
      if (this.debug) console.log('onLoadedData')

      // first event to fire when a video is loaded in
      this.isBuffering = false

      const {
        chromecastActive,
        isVideoWaitingToSync,
        videoSyncTime
      } = this

      if (chromecastActive) return

      if (isVideoWaitingToSync) {
        // a watch with video just got switched in
        this.seekTo(videoSyncTime)
        this.isVideoWaitingToSync = false
      }

      // playback has to be user initiated
      this.$refs.player.play()
    },
    onLoadedMetadata () {
      // a video has just loaded in, let's play it
      this.isBuffering = false
      if (!this.hasPlaybackStarted && !this.isIOS) this.$refs.player.play()
    },
    onPlaying () {
      if (!this.hasPlaybackStarted) {
        this.trackEvent(EVENTS.PLAYBACK_STARTED, {
          videoName: this.video.title
        })
      } else {
        this.trackEvent(EVENTS.VIDEO_PLAY, {
          currentTime: Math.round(this.currentTime),
          videoName: this.video.title
        })
      }

      this.isPlaying = true
      this.hasPlaybackStarted = true
    },
    onPause () {
      if (this.hasTrackedVideoFinished) return

      this.isPlaying = false
      this.trackEvent(EVENTS.VIDEO_PAUSE, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })
    },
    onSeekStart () {
      if (!this.hasPlaybackStarted) return
      this.isBuffering = true
    },
    onSeekEnd () {
      if (!this.hasPlaybackStarted) return
      this.isBuffering = false
      this.trackEvent(EVENTS.VIDEO_SEEK, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })
    },
    onTimeUpdate () {
      const { player } = this.$refs

      this.chromecastCurrentTime = player.currentTime
      this.currentTime = player.currentTime

      const percentComplete = Math.round(player.currentTime / player.duration * 100)
      if (percentComplete === 25 && !this.hasTrackedQuartile25) {
        this.trackQuartile(25)
        this.hasTrackedQuartile25 = true
      }

      if (percentComplete === 50 && !this.hasTrackedQuartile50) {
        this.trackQuartile(50)
        this.hasTrackedQuartile50 = true
      }

      if (percentComplete === 75 && !this.hasTrackedQuartile75) {
        this.trackQuartile(75)
        this.hasTrackedQuartile75 = true
      }

      // we track video complete when we get within 30 seconds of the end of the video it's rare that
      const videoComplete = player.currentTime > player.duration - 30
      const shouldBookmark = player.currentTime > 30 && !videoComplete
      this.isPlaying && shouldBookmark ? setMarker(this.video.assetId, player.currentTime) : removeMarker(this.video.assetId)

      if (videoComplete && !this.hasTrackedVideoFinished) {
        this.trackEvent(EVENTS.VIDEO_FINISHED, {
          videoName: this.video.title
        })
        this.hasTrackedVideoFinished = true
      }
    },
    onFullscreenChange () {
      if (!document.fullscreenElement && !document.webkitCurrentFullScreenElement && !document.msRequestFullscreen && this.isFullScreen) {
        this.isFullScreen = false
      }
    },
    // ----------------------------------------------- */

    // ----------------------------------------------- Click Handlers
    onFullscreenClick (event) {
      event.stopPropagation()

      this.isFullScreen = !this.isFullScreen

      if (document.fullscreenElement) { // in fullscreen
        this.trackEvent(EVENTS.PLAYER_EXIT_FULLSCREEN, {
          currentTime: Math.round(this.currentTime),
          videoName: this.video.title
        })

        return document.exitFullscreen()
      }

      if (document.webkitCurrentFullScreenElement) {
        this.trackEvent(EVENTS.PLAYER_EXIT_FULLSCREEN, {
          currentTime: Math.round(this.currentTime),
          videoName: this.video.title
        })

        return document.webkitExitFullscreen()
      }

      if (document.msRequestFullscreen) {
        this.trackEvent(EVENTS.PLAYER_EXIT_FULLSCREEN, {
          currentTime: Math.round(this.currentTime),
          videoName: this.video.title
        })

        return document.msExitFullscreen()
      }

      // go fullscreen!
      const el = this.$refs.container

      if (el.requestFullscreen) el.requestFullscreen()
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
      else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen()
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
      else if (el.msRequestFullscreen) el.msRequestFullscreen()

      this.trackEvent(EVENTS.PLAYER_ENTER_FULLSCREEN, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })
    },
    onPauseClick (event) {
      if (this.chromecastActive) {
        this.chromecast.controller.playOrPause()
      } else {
        this.$refs.player.pause()
      }

      event.stopPropagation()
    },
    onPlayClick (event) {
      const { chromecastActive, videos } = this

      if (isEmpty(this.$refs.player.currentSrc)) {
        this.loadVideoSrc(video.assetId)
      }

      if (chromecastActive) {
        this.chromecast.controller.playOrPause()
      } else {
        this.$refs.player.play()
      }

      event.stopPropagation()
    },
    onCloseClick() {
      this.onPointerLeave()
    },
    onAirPlayClick (event) {
      if (!this.isAirPlayAvailable) return
      this.$refs.player.webkitShowPlaybackTargetPicker()
      this.trackEvent(EVENTS.AIRPLAY_STARTED, {
        currentTime: Math.round(this.currentTime),
        videoName: this.video.title
      })

      event.stopPropagation()
    },
    seekTo (time) {
      this.currentTime = time
      this.$refs.player.currentTime = time
    },
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
    const { player } = this.$refs
    if (Hls.isSupported()) this.hls.player = new Hls()

    document.addEventListener('keyup', this.onKeyUp)
    document.addEventListener('fullscreenchange', this.onFullscreenChange)
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange)
    document.addEventListener('MSFullscreenChange', this.onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange)

    player.addEventListener('canplay', this.onCanPlay)
    player.addEventListener('loadstart', this.onLoadStart)
    player.addEventListener('loadedmetadata', this.onLoadedMetadata)
    player.addEventListener('loadeddata', this.onLoadedData)
    player.addEventListener('playing', this.onPlaying)
    player.addEventListener('pause', this.onPause)
    player.addEventListener('seeking', this.onSeekStart)
    player.addEventListener('seeked', this.onSeekEnd)
    player.addEventListener('timeupdate', this.onTimeUpdate)

    // airplay and chromecast events
    player.addEventListener('webkitplaybacktargetavailabilitychanged', this.onAirPlayAvailabilityCheck)
    window.__onGCastApiAvailable = this.onChromecastAvailable
    this.loadScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1')

    const { userAgent, platform, maxTouchPoints } = window.navigator
    // Microsoft injected the word iPhone in IE11's userAgent in order to try and fool Gmail somehow
    const notIE = !window.MSStream

    this.isMobileDevice = /Mobi|Android/i.test(userAgent)
    this.isIOS = (/iPad|iPhone|iPod/.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)) && notIE
    this.isFullscreenCapable = !!document.fullscreenEnabled

    const bookmark = getMarker(this.video.assetId)
    if (bookmark) { // there's a bookmark, so let's load and seek to it
      this.isVideoWaitingToSync = true
      this.videoSyncTime = bookmark
    }

    this.loadVideoSrc(this.video.assetId)
    this.trackEvent(EVENTS.PLAYER_READY)
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
