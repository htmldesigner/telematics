<template>
 <div class="container">
  <div class="row d-flex justify-content-center mt-5">
   <div class="col-5">
    <form @submit.prevent="onSubmit">
     <div class="form-group">
      <label for="InputAdmin">Лопин</label>
      <input
       @blur="$v.login.$touch()"
       v-model.trim="login"
       :class="{'is-invalid': $v.login.$error}"
       type="text"
       class="form-control"
       id="InputAdmin"
       aria-describedby="emailHelp"
      >
      <div class="invalid-feedback" v-if="!$v.login.required.$error">
       Введите логин
      </div>
     </div>
     <div class="form-group">
      <label for="InputPassword">Пароль</label>
      <input
       @blur="$v.password.$touch()"
       v-model.trim="password"
       :class="{'is-invalid': $v.password.$error}"
       type="password"
       class="form-control"
       id="InputPassword"
      >
      <div class="invalid-feedback" v-if="!$v.password.required.$error">
       Введите пароль
      </div>
     </div>
     <button
      type="submit"
      class="btn btn-primary"
      :disabled="$v.$invalid"
     >Воити
     </button>
    </form>
   </div>
  </div>
 </div>
</template>

<script>
 import {required, minLength, between} from 'vuelidate/lib/validators'
 import store from "../../store";

 export default {
  name: "Login",
  data() {
   return {
    login: '',
    password: ''
   }
  },
  validations: {
   login: {
    required,
    minLength: minLength(3)
   },
   password: {
    required,
    minLength: minLength(3)
   }
  },
  methods: {
   onSubmit() {
    if (!this.$v.$invalid) {
     const user = {login: this.login, password: this.password}
     this.$store.dispatch('loginUser', user)
      .then(() => {
       this.$router.push('/')
      })
      .catch(() => {
      })
    }
   }
  },
 }
</script>

<style scoped>

</style>