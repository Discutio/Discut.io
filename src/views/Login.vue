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
      this.$store.dispatch('setTopicMode', {mode: false, name: ""});

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
