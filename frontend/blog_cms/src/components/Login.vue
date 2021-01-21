<template>
	<div class="login">
		<el-form :model="signInForm" ref="signInForm" status-icon :rules="rules" class="demo-ruleForm">
			<el-form-item prop="email">
				<el-input placeholder="Email" v-model="signInForm.email" autofocus clearable autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item prop="password">
				<el-input
					placeholder="Password"
					v-model="signInForm.password"
					show-password
					clearable
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" round @click="submitForm('signInForm')">
					Iniciar Sesión
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import auth from '../lib/auth'

export default {
	name: 'Login',
	data() {
		var validateEmail = auth.validateEmail
		return {
			signInForm: {
				email: '',
				password: '',
			},
			rules: {
				email: [{ validator: validateEmail, trigger: 'blur' }],
				password: [{ required: true, message: 'Por favor ingresa el password', trigger: 'blur' }],
			},
			sigInData: {
				email: '',
				passwordHash: '',
			},
			baseUrl: 'http://localhost:3000',
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.signIn(formName)
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		signIn() {
			console.log('submit!')
			const security = auth.cipherPassword(this.signInForm.email, this.signInForm.password)
			console.log({ security })
			this.sigInData.email = this.signInForm.email
			this.sigInData.passwordHash = security.passwordB64
			console.log(this.sigInData)

			const loading = this.$loading({
				lock: true,
				text: 'Creando cuenta...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})

			this.axios
				.post(`${this.baseUrl}/api/auth/signin`, this.sigInData)
				.then((response) => {
					console.log(response)
					localStorage.setItem('idToken', response.data.data.token)
					loading.close()
					this.$router.replace('/')
				})
				.catch((error) => {
					this.sendingData = false
					console.error('ERROR ->', error.response)
					loading.close()
					this.$message({
						message: error.response.data.message,
						type: 'error',
					})
					this.signInForm.password = ''
				})
		},
	},
}
</script>

<style></style>
