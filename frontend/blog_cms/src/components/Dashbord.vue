<template>
	<div class="dashboard">
		<el-header style="text-align: right; font-size: 12px">
			<el-menu
				:default-active="activeIndex2"
				class="el-menu-demo"
				mode="horizontal"
				@select="handleSelect"
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
		<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
			<el-menu>
				<el-menu-item index="1">
					<el-button type="primary" round>
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
	</div>
</template>

<script>
export default {
	name: 'Dashboard',
	created() {
		if (localStorage.getItem('idToken') === null) {
			this.$router.replace('/login')
		}
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
