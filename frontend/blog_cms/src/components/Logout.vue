<template>
	<div class="logout">
		<h1>logout</h1>
	</div>
</template>

<script>
export default {
	name: 'Logout',
	data() {
		return {}
	},
	mounted() {
		localStorage.removeItem('idToken')
		this.$router.replace('/')
	},
}
</script>

<style></style>
