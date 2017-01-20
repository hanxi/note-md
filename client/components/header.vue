<style>
</style>
<template>
    <div class="mdui-container">
        <div class="mdui-row-xs-5">
            <slot></slot>
            <div v-for="item in paths" class="mdui-chip">
                <v-link :href="item.path" class="mdui-chip-title">{{item.name}}</v-link>
            </div>
            <span>{{current}}</span>
        </div>
    </div>
</template>
<script>
export default {
  computed: {
    paths () {
      const path = this.getPath()
      const paths = []
      let fromIndex = 0
      while (true) {
        const index = path.indexOf('/', fromIndex)
        if (index === -1) {
          break
        }
        paths.push({
          path: path.substring(0, index + 1),
          name: path.substring(fromIndex, index === 0 ? index + 1 : index)
        })
        fromIndex = index + 1
      }
      return paths
    },
    current () {
      const path = this.getPath()
      const index = path.lastIndexOf('/')
      const current = path.substring(index + 1)
      return current
    }
  },
  methods: {
    getPath () {
      let path = this.$root.currentRoute
      if (!path) {
        path = '/'
      }
      console.log(this.$root)
      if (path.substr(-1, 1) === '/') {
        path = path.substr(0, path.length - 1)
      }
      return path
    }
  }
}
</script>

