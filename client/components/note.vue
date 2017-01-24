<template>
    <div v-html="note" v-highlightjs></div>
</template>
<script>
import Vue from 'vue'
import Hljs from 'highlight.js'
import 'highlight.js/styles/github-gist.css'

Vue.directive('highlightjs', function (el) {
  console.log(el)
  const blocks = el.querySelectorAll('pre code')
  Array.prototype.forEach.call(blocks, Hljs.highlightBlock)
})

export default {
  props: ['note']
}
</script>

