<template>
  <div>
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">

        <!-- 사용자 프로필 버튼 -->
        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on" class="mr-4" >
              <v-avatar  color="grey darken-1" size="39" >
                <span class="white--text accountId">{{ account.id }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <h3>{{ account.name }}</h3>
                <p class="caption mt-1"> 권한: {{ account.role }} </p>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logout"> 로그아웃 </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>

        <!-- Header 메뉴 -->
        <v-btn text @click="$router.push('/board')" v-if="this.$store.state.account.role=='ROLE_ADMIN'">
          게시판
        </v-btn>
        <v-btn text  @click="$router.push('/chart')" v-if="this.$store.state.account.role=='ROLE_ADMIN'">
          차트
        </v-btn>
        <v-btn text  @click="$router.push('/review')">
          리뷰
        </v-btn>
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      account: this.$store.state.account
    }
  },
  methods: {
    logout() {
      this.$store.state.account={
        id: '',
        token: '',
        role:'',
      }
      this.$router.push({ path: '/' })
    }
  }
}

</script>

<style>
h3 {
  font-size: 20px;
}
.accountId{
  font-size: 10px;
}
</style>