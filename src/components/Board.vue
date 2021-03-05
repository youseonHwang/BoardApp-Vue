<template>
  <v-app id="inspire">
    <div id="header">
      <Header/>
    </div>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col>
            <v-card class="overflow-hidden">
             <router-view></router-view>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    <snack-bar></snack-bar>
    </v-main>
  </v-app>
</template>

<script>
import Header from './Header.vue'
import SnackBar from './SnackBar'

export default {
  name: 'Board',
  data(){
    return{
      boardNo: this.$route.params.boardNo,
      message: '',
      visible: false
    }
  },
  components: {
    Header,
    SnackBar,
  },
}
</script>

<style>
.overflow-hidden {
  margin-top: 15px;
}
</style>
