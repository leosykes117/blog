<template>
	<div class="edit-article">
		<el-form :model="createArticleForm" ref="createArticleForm" status-icon class="demo-ruleForm">
			<el-form-item prop="title">
				<el-input
					placeholder="Título"
					v-model="createArticleForm.title"
					autofocus
					clearable
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item prop="slug">
				<el-input placeholder="Enlace" v-model="createArticleForm.slug" clearable autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item prop="isPublished">
				<el-switch v-model="createArticleForm.isPublished" active-text="Público" inactive-text="Borrador"> </el-switch>
			</el-form-item>

			<el-form-item>
				<editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
					<div class="menubar">
						<button class="menubar__button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
							<font-awesome-icon icon="bold" />
						</button>

						<button class="menubar__button" :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
							<font-awesome-icon icon="italic" />
						</button>

						<button class="menubar__button" :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
							<font-awesome-icon icon="strikethrough" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.underline() }"
							@click="commands.underline"
						>
							<font-awesome-icon icon="underline" />
						</button>

						<button class="menubar__button" :class="{ 'is-active': isActive.code() }" @click="commands.code">
							<font-awesome-icon icon="code" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.paragraph() }"
							@click="commands.paragraph"
						>
							<font-awesome-icon icon="paragraph" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.heading({ level: 1 }) }"
							@click="commands.heading({ level: 1 })"
						>
							H1
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.heading({ level: 2 }) }"
							@click="commands.heading({ level: 2 })"
						>
							H2
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.heading({ level: 3 }) }"
							@click="commands.heading({ level: 3 })"
						>
							H3
						</button>

						<button class="menubar__button" @click="showImagePrompt(commands.image)">
							<font-awesome-icon icon="image" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.bullet_list() }"
							@click="commands.bullet_list"
						>
							<font-awesome-icon icon="list-ul" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.ordered_list() }"
							@click="commands.ordered_list"
						>
							<font-awesome-icon icon="list-ol" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.blockquote() }"
							@click="commands.blockquote"
						>
							<font-awesome-icon icon="quote-right" />
						</button>

						<button
							class="menubar__button"
							:class="{ 'is-active': isActive.code_block() }"
							@click="commands.code_block"
						>
							<font-awesome-icon icon="code" />
						</button>

						<button class="menubar__button" @click="commands.horizontal_rule">
							_
						</button>

						<button class="menubar__button" @click="commands.undo">
							<font-awesome-icon icon="undo" />
						</button>

						<button class="menubar__button" @click="commands.redo">
							<font-awesome-icon icon="redo" />
						</button>
					</div>
				</editor-menu-bar>
				<editor-content class="editor__content" :editor="editor" />
			</el-form-item>

			<el-form-item>
				<el-button type="success" circle>
					<font-awesome-icon icon="save" @click="saveArticle()" />
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'

import {
	Blockquote,
	CodeBlock,
	HardBreak,
	Heading,
	HorizontalRule,
	OrderedList,
	BulletList,
	ListItem,
	TodoItem,
	TodoList,
	Bold,
	Code,
	Italic,
	Link,
	Strike,
	Underline,
	History,
	Image,
} from 'tiptap-extensions'

export default {
	name: 'EditArticle',
	components: {
		EditorMenuBar,
		EditorContent,
	},
	props: {
		flag: {
			type: String,
		},
	},
	data() {
		return {
			editor: new Editor({
				extensions: [
					new Blockquote(),
					new CodeBlock(),
					new HardBreak(),
					new Heading({ levels: [1, 2, 3] }),
					new BulletList(),
					new OrderedList(),
					new ListItem(),
					new TodoItem(),
					new TodoList(),
					new Bold(),
					new Code(),
					new Italic(),
					new Link(),
					new Strike(),
					new Underline(),
					new History(),
					new Image(),
					new HorizontalRule(),
				],
				content: ``,
			}),
			baseUrl: 'http://localhost:3000',
			createArticleForm: {
				title: '',
				slug: '',
				isPublished: false,
			},
		}
	},
	methods: {
		showImagePrompt(command) {},
		saveArticle() {
			console.log('saveArticle')
			const content = this.editor.getHTML()
			const token = localStorage.getItem('idToken')
			const payload = JSON.parse(JSON.stringify(this.createArticleForm))
			payload.content = content

			const loading = this.$loading({
				lock: true,
				text: 'Guardando cambios...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})

			this.axios
				.put(`${this.baseUrl}/api/user/edit`, payload, {
					headers: {
						'x-access-token': token,
					},
				})
				.then((response) => {
					console.log(response)
					loading.close()
					this.$message({
						message: 'Cambios guardados con éxito!',
						type: 'success',
						duration: 1500,
						onClose: () => {
							this.$router.replace('/')
						},
					})
				})
				.catch((err) => {
					console.error(err.response)
					loading.close()
					this.$message({
						message: 'Ocurrio un error al guardar los cambios del artículo',
						type: 'error',
						duration: 1500,
						showClose: true,
					})
				})
		},
	},
	created() {
		if (localStorage.getItem('idToken') === null) {
			this.$router.replace('/login')
		}
	},
	mounted() {
		this.editor.focus()
	},
	beforeDestroy() {
		this.editor.destroy()
	},
}
</script>

<style lang="scss" scoped></style>
