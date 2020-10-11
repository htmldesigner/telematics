<template>

<div class="col-md-2 offset-5 mt-5">
 <form @submit.prevent="logIn">
  <div class="form-group">
   <label for="exampleInputLogin1">Пользователь</label>
   <input type="text" v-model="login" required class="form-control" id="exampleInputLogin1">
  </div>
  <div class="form-group">
   <label for="exampleInputPassword1">Пароль</label>
   <input required v-model="password" type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <button type="submit" class="btn-custom float-right">Войти</button>
 </form>
</div>

</template>

<script>
 export default {
  name: "Login",
  data() {
   return {
    login: "",
    password: ""
   }
  },
  methods: {
   logIn: function () {
    let login = this.login
    let password = this.password
    this.$store.dispatch('login', { login, password })
     .then(() => this.$router.push('/map'))
     .catch(err => console.log(err))
   }
  }
 }
</script>

<style scoped>

</style>