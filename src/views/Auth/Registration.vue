<template>

    <v-container
            class="fill-height"
            fluid
    >
        <v-row
                align="center"
                justify="center"
        >
            <v-col
                    cols="12"
                    sm="8"
                    md="4"
            >
                <v-card class="elevation-12">
                    <v-toolbar
                            color="primary"
                            dark
                            flat
                            short
                    >
                        <v-spacer/>
                        <v-toolbar-title>Registration</v-toolbar-title>
                        <v-spacer/>
                    </v-toolbar>
                    <v-card-text>
                        <v-form
                                ref="form"
                                v-model="valid"
                                validation
                        >
                            <v-text-field
                                    label="Email"
                                    name="Email"
                                    prepend-icon="person"
                                    type="email"
                                    v-model="email"
                                    :rules="emailRules"
                            />

                            <v-text-field
                                    id="password"
                                    label="Password"
                                    counter
                                    maxlength="25"
                                    v-model="password"
                                    name="password"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="passwordRules"
                                    prepend-icon="lock"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"
                            ></v-text-field>
                            <v-text-field
                                    id="confirmPassword"
                                    label="Confirm password"
                                    counter
                                    maxlength="25"
                                    v-model="confirmPassword"
                                    name="confirmPassword"
                                    :rules="confirmPasswordRules"
                                    prepend-icon="compare_arrows"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"

                            ></v-text-field>

                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn
                                color="primary"
                                @click="onSubmit"
                                :loading="loading"
                                :disabled="!valid || loading"
                        >Create accaunt
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
 export default {
  name: "Registration",
  data() {
   return {
    showPassword: false,
    email: '',
    password: '',
    confirmPassword: '',
    valid: false,
    emailRules: [
     v => !!v || 'E-mail is required',
     v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
     v => !!v || 'Password is required',
     v => (v && v.length >= 6) || 'Password must be equal than 6 characters',
    ],
    confirmPasswordRules: [
     v => !!v || 'Password is required',
     v => v == this.password || 'Password should match'
    ]
   }
  },
  computed: {
   loading() {
    return this.$store.getters.loading
   }
  },
  methods: {
   onSubmit() {
    if (this.$refs.form.validate()) {
     const user = {email: this.email, password: this.password}
     this.$store.dispatch('registerUser', user)
      .then(() => {
       this.$router.push('/')
      })
      .catch(error => console.log(error))
    }

   }
  }
 }
</script>

<style scoped>

</style>