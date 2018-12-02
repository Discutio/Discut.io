<template>

</template>

<script>

export default {
  name: 'home',
  data() {
    return {}
  },
  components: {},  
  mounted()
  {   
    this.$store.commit('setSteemSession', '');
    return this.$router.push('/');
  }
}
</script>
