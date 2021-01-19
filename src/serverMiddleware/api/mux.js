import _ from 'lodash'
import express from 'express'
import Mux from '@mux/mux-node'
import fetch from 'node-fetch'

const router = express.Router()

const getUser = () => {
  console.log('TODO make this work with Firebase?')
  return {
    email: 'brandon@rocketinsights.com'
  }
}

const getHeaders = () => {
  const username = process.env.MUX_TOKEN_ID
  const password = process.env.MUX_TOKEN_SECRET
  const encoded = Buffer.from(`${username}:${password}`).toString('base64')

  return {
    Authorization: `Basic ${encoded}`
  }
}

const fetchPlaybackIds = async (assetId) => {
  const res = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
    headers: getHeaders()
  })

  const { data } = await res.json()
  return data.playback_ids
}

const getStreamUrl = (playbackId, policy) => {
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`
  if (policy === 'public') return streamUrl

  // if it's not public, it's 'signed' and we have to sign the url
  const token = Mux.JWT.sign(playbackId, {
    expiration: '1d',
    keyId: process.env.MUX_SIGNING_KEY_ID,
    keySecret: process.env.MUX_SIGNING_KEY
  })

  if (_.isNil(token)) {
    console.log(`getStreamUrl Token is empty. PlaybackID: ${playbackId} , policy: ${policy}`)
  }

  return `${streamUrl}?token=${token}`
}

const getStreamUrls = (playbackIds) => {
  // Rearranges the signed policy before the public
  const rearrangedPlaybackIds = _.orderBy(playbackIds, ['policy'], ['desc'])
  return _.map(rearrangedPlaybackIds, ({ id, policy }) => getStreamUrl(id, policy))
}

router.get('/', async (req, res) => {
  const assetId = req.headers['x-asset-id']
  const accessToken = req.headers['x-access-token']
  const user = getUser(req)

  console.log('assetId', assetId)
  console.log('TODO accessToken?', accessToken)
  console.log('user', user)

  // if (!user || !user.email || !accessToken) {
  //   // someone trying to be sneaky? They get the teapot
  //   if (_.isNil(user)) {
  //     console.log('getting signed url user is empty')
  //   } else if (_.isNil(user.email)) {
  //     console.log('getting signed url user email is empty')
  //   } else {
  //     console.log('getting signed url accessToken is empty')
  //   }

  //   return res.status(418).json(JSON.stringify(null))
  // }

  try {
    const playbackIds = await fetchPlaybackIds(assetId)
    const streamUrls = getStreamUrls(playbackIds)
    return res.status(200).json(streamUrls)
  } catch (err) {
    return res.status(503).json({ error: err.message })
  }
})

export default router
