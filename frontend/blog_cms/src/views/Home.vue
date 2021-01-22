<template>
	<div class="home">
		<div v-if="tokenExists === true">
			<Dashboard />
		</div>
		<div v-else>
			<router-link to="/signup">Registrarse</router-link>
			 | 
			<router-link to="/signin">Iniciar sesión</router-link>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Dashboard from '@/components/Dashbord.vue'

export default {
	name: 'Home',
	components: {
		HelloWorld,
		Dashboard,
	},
	data() {
		return {
			tokenExists: false,
		}
	},
	created() {
		console.log('CREATED HOME VIEW')
		const idToken = localStorage.getItem('idToken')
		if (idToken) {
			this.tokenExists = true
		} else {
			this.tokenExists = false
		}
	},
}
</script>
