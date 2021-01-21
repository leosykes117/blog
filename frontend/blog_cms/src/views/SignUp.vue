<template>
	<div class="signup">
		<div class="container-form">
			<div class="form-vertical-align">
				<h1>Crea una cuenta</h1>
				<Register />
			</div>
		</div>
	</div>
</template>

<script>
import Register from '@/components/Register.vue'

export default {
	name: 'SignUp',
	components: {
		Register,
	},
}
</script>

<style lang="scss" scoped>
</style>
