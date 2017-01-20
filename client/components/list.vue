<style scoped>
</style>
<template>
    <ul class="mdui-list">
        <div v-for="item in noteList">
            <li>
                <v-link :href="item.path"
             class="mdui-list-item mdui-ripple">
                    <i class="mdui-list-item-avatar mdui-icon material-icons mdui-color-blue mdui-text-color-white">{{'&#xe85d;'}}</i>
                    <div class="mdui-list-item-content">
                        <div class="mdui-list-item-title mdui-list-item-one-line">
                            <span class="mdui-typo-title">
                                {{item.title}}
                            </span>
                        </div>
                        <div class="mdui-list-item-text mdui-list-item-two-line">
                            <span class="mdui-text-color-theme-text">
                                {{item.firstLine}} 
                                <br>
                            </span>
                            {{item.secondLine}}
                        </div>
                    </div>
                </v-link>
            </li>
            <li v-if="!item.isLast" class="mdui-divider-inset mdui-m-y-0"></li>
        </div>
    </ul>
</template>
<script>
export default {
  props: ['noteList']
}
</script>
