<template>

  <v-snackbar v-model="sb.show" :color="sb.color" :timeout="3000" right multi-line>
    {{ sb.msg }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="sb.show = false">
        <v-icon dark dense>mdi-close-circle-outline</v-icon>
      </v-btn>
    </template>
  </v-snackbar>

</template>
 
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['sb']),
  },
}
// v-model="sb.show" 는 store에 저장된 show 값을 바탕으로 스낵바 표시 유무를 설정한다.
// timeout 은 스낵바가 표시되는 시간을 설정한다. (단위는 밀리세컨드)
// @click="sb.show = false" 는 닫기 버튼 클릭 시 show 값을 변경하여 스낵바를 보이지 않도록 한다.
</script>

<style>

</style>