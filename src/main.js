import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false  

router.afterEach((to, from) => {
    document.title = to.meta.title = "Discut.io - Your opinions are the most expensive. Discover debates and hard subjects without censorship!";
})

new Vue({
  router,
  store,
  render: h => h(App),  
  beforeCreate() 
  {
    this.$store.commit('initSteemSession');
  },
  watch: {
    '$route' : function(v, v2) {
        console.log(v, v2);
    }
  },
  methods: 
  {

  },  
  created: function () {

  },
  updated: function()
  {
   
  },
  mounted()
  {

  }
}).$mount('#app')
