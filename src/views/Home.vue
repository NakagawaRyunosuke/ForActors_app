<template>
  <div>
    <h1>HOME</h1>
  </div>
</template>

<script>
export default {
  mounted(){
    const user =sessionStorage.getItem('user');
    if(!user){
      this.$router.push("/login");
    }
  }
}
</script>


