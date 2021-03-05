<template>
<v-app>
 <v-container>
    <v-card
      class="overflow-hidden elevation-12" 
      justify="center"
      id="login-card"
    >
    <v-carousel class="banner">
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
      reverse-transition="fade-transition"
      transition="fade-transition"
    ></v-carousel-item>
  </v-carousel>

      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12"  md="6" >
            <v-text-field
              prepend-inner-icon="mdi-account"
              v-model="user.id"
              :rules="[rules.required, rules.min]"
              name="input-10-1"
              label="ID를 입력하세요"
              hint="At least 2 characters"
              counter
            ></v-text-field>
            
            </v-col>
            <v-col cols="12"  md="6" >
            <v-text-field
              prepend-inner-icon="mdi-form-textbox-password"
              v-model="user.password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="비밀번호를 입력하세요"
              hint="At least 2 characters"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
            </v-col>
          </v-row>
        </v-container>

      <!-- login Button -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn  color="blue-grey darken-3" @click.prevent="submit" >
          <v-icon left>
            mdi-login
          </v-icon>
          Login
        </v-btn>
      </v-card-actions>
      </v-form>
    </v-card>
 </v-container>

 <!-- 입력 오류 다이얼로그 -->
  <v-dialog  v-model="dialog" width="500" >
    <v-card>
      <v-card-title class="headline grey lighten-2">
        ID / Password 오류
      </v-card-title>
      <v-card-text>
        잘못 입력하셨습니다. <br/>
        ID 또는 Password를 확인해주세요.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false" >
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-app>
</template>

<script>
import { login } from '@/api/index'

  export default {
    data () {
      return {
        items: [
          {
            src: require('@/assets/images/banner2.png'),
          },
          {
            src:  require('@/assets/images/banner3.png'),
          },
          {
            src:  require('@/assets/images/banner4.png'),
          },
          {
            src:  require('@/assets/images/banner5.png'),
          },
        ],
        show1: false,
        show2: true,
        show3: false,
        show4: false,
        password: '',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 2 || 'Min 2 characters'
        },
        user:{id:'',password:'',role:''},
        account:null,
        errorMessage:'',
        dialog: false,
      }
    },

    methods: {
      submit() {
        this.requestLogin()
      },
      async requestLogin() {
      try{
        var response = await login(JSON.stringify(this.user))
         /* 로그인 성공시 */
          if(response.status==200){
            this.account = response.data
            this.setAccoutInfo(this.user.id, this.account.jwt, this.account.role[0].authority) // store에 값 넣어주기
            sessionStorage.setItem('jwt',this.$store.getters.currentToken) //sessionStorage에 저장
            this.$store.state.account.role == 'ROLE_ADMIN'
            ? this.$router.push({ name: 'BoardList'}) // 게시판으로 이동
            : this.$router.push({ name: 'Review' }) // 리뷰페이지로 이동
          } 
      } catch(error) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
          if(error.response.status ==401) {
            this.dialog=true
          }
          this.errorMessage=error.response.data.message;
        }
      },
      /* 로그인 응답 */
      setAccoutInfo(id,token,role) {
        this.$store.commit('SET_ACCOUNT', {
          id: id,
          token: token,
          role: role
        })
      }
  }
}
</script>
<style>
#login-card {
  margin-top: 100px;
  margin-bottom: 400px;
  margin-right: 70px;
  margin-left: 70px;
}
.banner {
  height:600px
}
body{
  background-color:aliceblue;
}

</style>