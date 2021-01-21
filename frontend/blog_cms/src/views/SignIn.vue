<template>
	<div class="signin">
		<div class="container-form">
			<div class="form-vertical-align">
				<h1>Inicia Sesión</h1>
				<Login />
			</div>
		</div>
	</div>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
	name: 'SignIn',
	components: {
		Login,
	},
}
</script>

<style></style>
