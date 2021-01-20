<template>
	<div class="register">
		<p>register</p>
		<el-form :model="signUpForm" ref="signUpForm" status-icon :rules="rules" class="demo-ruleForm">
			<el-form-item prop="email">
				<el-input
					placeholder="Email"
					v-model="signUpForm.email"
					autofocus
					clearable
					autocomplete="off"
				></el-input>
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

			<el-form-item>
				<el-button type="primary" @click="submitForm('signUpForm')">
					Sign up
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
const cipherSuite = require('../lib/cipher-suite')

export default {
	name: 'Register',
	data() {
		var validateEmail = (rule, value, callback) => {
			const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (typeof value !== 'string' || value.length < 1) {
				callback(new Error('Por favor ingresa un email'))
			} else if (!re.test(value)) {
				callback(new Error('El email no es válido'))
			} else {
				callback()
			}
		}

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
				email: [{ validator: validateEmail, trigger: 'blur' }],
				password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
				name: [
					{ required: true, message: 'Por favor ingresa el nombre', trigger: 'blur' },
					{ min: 3, max: 50, message: 'El nombre deber tener entre 3 y 50 letras', trigger: 'blur' },
				],
				lastname: [
					{ required: true, message: 'Por favor ingresa el apellido', trigger: 'blur' },
					{ min: 3, max: 80, message: 'El apellidos deber tener entre 3 y 80 letras', trigger: 'blur' }
				],
			},
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
			this.$refs[formName].resetFields()
		},
		signUp(formName) {
			console.log('submit!')
			const security = this.cipherPass(this.signUpForm.password)
			console.log({ security })
			this.signUpData.passwordHash = security.passwordB64
			this.signUpData.email = this.signUpForm.email
			this.signUpData.name = this.signUpForm.name
			this.signUpData.lastname = this.signUpForm.lastname
			this.signUpData.gender = this.signUpForm.gender
			console.log(this.signUpData)

			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})

			this.axios
				.post(`${this.baseUrl}/api/auth/signup`, this.signUpData)
				.then((response) => {
					loading.close()
					this.$message({
						message: response.data.message,
						type: 'success',
					})
					console.log(response)
				})
				.catch((error) => {
					console.log('ERROR ->', error)
					loading.close()
					this.$message({
						message: error.data.message,
						type: 'error',
					})
					this.resetForm(formName)
				})
		},
		cipherPass(password) {
			console.log("password -->", password)
			const seed = this.signUpForm.email.split('@')[0]
			console.log('seed ->', seed)
			const passwordHash = cipherSuite.hash(password)
			let key = cipherSuite.createAESKeyFromString(seed)
			let passwordEncrypted = cipherSuite.aesEncrypt(passwordHash, key.key, key.IV)
			let passwordB64 = cipherSuite.stringToBase64(passwordEncrypted.data.encryptedText)
			console.log('passwordHashEncrypt', passwordEncrypted)
			console.log('passwordB64', passwordB64)
			return {
				passwordHash,
				passwordEncrypted,
				passwordB64,
			}
		},
	},
}
</script>

<style></style>
