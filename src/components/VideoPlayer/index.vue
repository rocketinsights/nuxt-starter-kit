<template>
  <player :width="width" :height="height" />
</template>

<script>
import Player from './player'

export default {
  props: ['width', 'height'],
  components: { Player }
}
</script>
