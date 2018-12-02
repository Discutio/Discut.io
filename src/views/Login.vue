<template>

</template>

<script>

export default {
  name: 'home',
  data() {
    return {
      tip: ''
    }
  },
  components: {},
  mounted()
  {  

    if (this.$route.query.access_token != undefined) 
    {   
        if(!localStorage.getItem('voteWeight'))
        {
          this.$store.commit('setVoteWeight', 100);
        }

        this.$store.commit('setSteemSession', this.$route.query.access_token);
    }     

    window.location = '/';
  }     
}
</script>
