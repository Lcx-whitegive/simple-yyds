import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import { 
  Button,
   Form, 
   FormItem, 
   Input, 
   Message, 
   Container, 
   Header, 
   Main, 
   Aside,
   Menu,
   Submenu,
   MenuItem,
   RadioGroup,
   Breadcrumb,
   BreadcrumbItem,
   Card,
   Row,
   Col,
   Table,
   TableColumn,
   Switch,
   Tooltip,
   Pagination,
   Dialog,
   Loading,
   MessageBox,
   Tag,
   Tree,
   Select,
   Option,
   Cascader,
   Alert,
   Tabs,
   TabPane,
   Steps,
   Step,
   Checkbox,
   CheckboxGroup,
   Upload
  } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(RadioGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Loading)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
