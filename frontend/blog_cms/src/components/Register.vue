<template>
	<div class="register">
		<p>register</p>
		<font-awesome-icon icon="user-secret" />
		<el-form ref="signUpData" :model="signUpData">
			<el-form-item>
				<el-input
					placeholder="Email"
					v-model="signUpData.email"
					autofocus
					clearable
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-input
					placeholder="Password"
					v-model="signUpData.password"
					show-password
					clearable
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">
					Sign up
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'Register',
	data() {
		return {
			signUpData: {
				email: '',
				password: '',
			},
		}
	},
	methods: {
		submitForm() {
			console.log('submit!')
			console.log(this.signUpData)
		},
	},
}
</script>

<style></style>
