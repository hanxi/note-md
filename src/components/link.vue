<template>
	<a
		v-bind:href="href"
		v-bind:class="{ active: isActive }"
		v-on:click="go"
		>
		<slot></slot>
	</a>
</template>

<script>
export default {
	props: {
		href: String,
		required: true
	},
	computed: {
		isActive () {
			return this.href === this.$root.currentRoute;
		}
	},
	methods: {
		go (event) {
			event.preventDefault();
            this.$root.push(this.href);
		}
	}
}
</script>

<style scoped>
.active {
	color: cornflowerblue;
}
</style>

