<template>
	<div class="register">
		<el-form :model="signUpForm" ref="signUpForm" status-icon :rules="rules" class="demo-ruleForm">
			<el-form-item prop="name">
				<el-input placeholder="Nombre" v-model="signUpForm.name" clearable autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item prop="lastname">
				<el-input placeholder="Apellido" v-model="signUpForm.lastname" clearable autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item prop="gender">
				<el-radio-group v-model="signUpForm.gender">
					<el-radio :label="'F'">Mujer</el-radio>
					<el-radio :label="'M'">Hombre</el-radio>
					<el-radio :label="undefined">Prefiero no decirlo</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item prop="email">
				<el-input placeholder="Email" v-model="signUpForm.email" autofocus clearable autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item prop="password">
				<el-input
					placeholder="Password"
					v-model="signUpForm.password"
					show-password
					clearable
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" round @click="submitForm('signUpForm')">
					Crear cuenta
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import auth from '../lib/auth'

export default {
	name: 'Register',
	data() {
		var validateEmail = auth.validateEmail
		return {
			signUpData: {
				email: '',
				passwordHash: '',
				name: '',
				lastname: '',
				gender: '',
			},
			signUpForm: {
				email: '',
				password: '',
				name: '',
				lastname: '',
				gender: '',
			},
			rules: {
				name: [
					{ required: true, message: 'Por favor ingresa el nombre', trigger: 'blur' },
					{ min: 3, max: 50, message: 'El nombre deber tener entre 3 y 50 letras', trigger: 'blur' },
				],
				lastname: [
					{ required: true, message: 'Por favor ingresa el apellido', trigger: 'blur' },
					{ min: 3, max: 80, message: 'El apellidos deber tener entre 3 y 80 letras', trigger: 'blur' },
				],
				email: [{ validator: validateEmail, trigger: 'blur' }],
				password: [{ required: true, message: 'Por favor ingresa el password', trigger: 'blur' }],
			},
			sendingData: false,
			baseUrl: 'http://localhost:3000',
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.signUp(formName)
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		resetForm(formName) {
			this.sendingData = true
			this.$refs[formName].resetFields()
		},
		signUp(formName) {
			console.log('submit!')
			const security = auth.cipherPassword(this.signUpForm.email, this.signUpForm.password)
			console.log({ security })
			this.signUpData.passwordHash = security.passwordB64
			this.signUpData.email = this.signUpForm.email
			this.signUpData.name = this.signUpForm.name
			this.signUpData.lastname = this.signUpForm.lastname
			this.signUpData.gender = this.signUpForm.gender
			console.log(this.signUpData)

			const loading = this.$loading({
				lock: true,
				text: 'Creando cuenta...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})

			this.axios
				.post(`${this.baseUrl}/api/auth/signup`, this.signUpData)
				.then((response) => {
					console.log(response)
					localStorage.setItem('idToken', response.data.data.token)
					this.sendingData = false
					loading.close()
					this.$router.replace('/')
				})
				.catch((error) => {
					this.sendingData = false
					console.error('ERROR ->', error)
					loading.close()
					this.$message({
						message: error.response.data.message,
						type: 'error',
					})
					this.resetForm(formName)
				})
		},
	},
}
</script>

<style></style>
