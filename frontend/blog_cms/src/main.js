import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import axios from 'axios'
import vueAxios from 'vue-axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faUserSecret,
	faPlus,
	faBold,
	faItalic,
	faStrikethrough,
	faUnderline,
	faCode,
	faParagraph,
	faListUl,
	faListOl,
	faQuoteRight,
	faUndo,
	faRedo,
	faImage,
	faSave,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(vueAxios, axios)

library.add(
	faUserSecret,
	faPlus,
	faBold,
	faItalic,
	faStrikethrough,
	faUnderline,
	faCode,
	faParagraph,
	faListUl,
	faListOl,
	faQuoteRight,
	faUndo,
	faRedo,
	faImage,
	faSave
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
	router,
	render: (h) => h(App),
}).$mount('#app')
