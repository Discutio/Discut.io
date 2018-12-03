import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false  

router.afterEach((to, from) => {

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
    hookPos() 
    {
      let h = 0;
      
      $(window).scroll(function()
      {   
        h = $('.navbar-hook').height() - 100;
        
        if(isNaN(h))
        {
          return $(".navbar").addClass('navbar-active');    
        }

        if($(window).scrollTop() > h)
        {
         $(".navbar").addClass('navbar-active');
        }else{
         $(".navbar").removeClass('navbar-active');
        }
      })
    }
  },  
  created: function () {
    this.hookPos();
  },
  updated: function()
  {
   
  },
  watch:
  {

  },
  mounted()
  {
    this.hookPos();
  }
}).$mount('#app')
