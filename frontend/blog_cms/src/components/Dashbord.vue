<template>
	<div class="dashboard">
		<el-container>
			<el-header style="text-align: right; font-size: 12px">
				<el-menu
					:default-active="activeIndex2"
					class="el-menu-demo"
					mode="horizontal"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
				>
					<el-menu-item index="1">Processing Center</el-menu-item>
					<el-submenu index="2">
						<template slot="title">Workspace</template>
						<el-menu-item index="2-1">item one</el-menu-item>
						<el-menu-item index="2-2">item two</el-menu-item>
						<el-menu-item index="2-3">item three</el-menu-item>
						<el-submenu index="2-4">
							<template slot="title">item four</template>
							<el-menu-item index="2-4-1">item one</el-menu-item>
							<el-menu-item index="2-4-2">item two</el-menu-item>
							<el-menu-item index="2-4-3">item three</el-menu-item>
						</el-submenu>
					</el-submenu>
					<el-menu-item index="3" disabled>Info</el-menu-item>
					<el-menu-item index="4">
						<router-link to="/logout">Logout</router-link>
					</el-menu-item>
				</el-menu>
			</el-header>
			<el-container>
				<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
					<el-menu>
						<el-menu-item index="1">
							<el-button type="primary" round @click="goEditArticle">
								<div class="btn-new-article">
									<font-awesome-icon icon="plus" />
									Nuevo Artículo
								</div>
							</el-button>
							<hr />
						</el-menu-item>
						<el-menu-item index="2">Option 1</el-menu-item>
						<el-menu-item index="3">Option 2</el-menu-item>
					</el-menu>
				</el-aside>
				<el-container>
					<el-main v-loading="gettingArticles">
						<el-row>
							<el-col :span="8" v-for="(article, index) in userArticles" :key="o">
								<el-card :body-style="{ padding: '0px' }" shadow="hover">
									<img
										src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
										class="image"
									/>
									<div style="padding: 14px;">
										<span>{{ article.title }}</span>
										<div class="bottom clearfix">
											<time class="time">{{ formatDate(article.createdAt) }}</time>
											<el-button type="text" class="button">Operating</el-button>
										</div>
									</div>
								</el-card>
							</el-col>
						</el-row>
					</el-main>
				</el-container>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import moment from 'moment-timezone'

export default {
	name: 'Dashboard',
	data() {
		return {
			gettingArticles: false,
			userArticles: [],
			baseUrl: 'http://localhost:3000',
		}
	},
	methods: {
		goEditArticle() {
			this.$router.replace('/editArticle')
		},
		formatDate(date) {
			return moment(date).tz('America/Mexico_City').format('DD/MM/YYYY HH:mm:ss')
		}
	},
	created() {
		console.log('DASHBOARD CREATED')
		if (localStorage.getItem('idToken') === null) {
			this.$router.replace('/login')
		}
	},
	mounted() {
		console.log('TRAYENDO LOS ARTICULOS DE LOS USUARIOS')
		const token = localStorage.getItem('idToken')
		this.gettingArticles = true
		this.axios
			.post(
				`${this.baseUrl}/api/user/articles`,
				{},
				{
					headers: {
						'x-access-token': token,
					},
				}
			)
			.then((response) => {
				console.log('response ->', response)
				this.userArticles = response.data.data
				this.gettingArticles = false
			})
			.catch((err) => {
				console.error('error ->', err.response)
			})
	},
}
</script>

<style lang="scss" scoped>
.navbar {
	background-color: #3e4444;
}

.btn-new-article {
	display: table-cell;
	vertical-align: middle;
}
</style>
