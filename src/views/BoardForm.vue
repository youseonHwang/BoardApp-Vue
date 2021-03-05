<template>

<div>
  <!-- title과 tab부분 -->
  <v-app-bar absolute color="#FF5722" dark >
    <v-app-bar-title >{{subjectTitle}}</v-app-bar-title>
    <v-spacer></v-spacer>
      
  </v-app-bar>

  <!-- form 부분 -->
  <v-sheet min-height="70vh" rounded="lg">
    
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
      <form @submit.prevent="submit" id="insertForm">

        <validation-provider
          v-slot="{ errors }"
          name="글 제목"
          v-model="title"
          rules="required|max:200"
        >
          <v-text-field
            v-model="title"
            :counter="200"
            :error-messages="errors"
            label="글 제목"
            required
          ></v-text-field>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="카테고리"
          v-model="category"
          rules="required"
        >
          <v-select
            v-model="category"
            :items="items"
            item-text="categoryName"
            item-value="categoryNo"
            :error-messages="errors"
            label="카테고리"
            data-vv-name="select"
            required
          ></v-select>
        </validation-provider>

        <v-textarea
            name="글 내용"
            v-model="content"
            autocomplete=""
            label="글 내용"
        ></v-textarea>

        <v-file-input
          label="파일을 첨부해주세요 (PDF/Image)"
          accept="image/*, application/pdf"
          v-model="uploadFile"
          show-size
          name="uploadFile"
          outlined
          dense
          class="inputFile"
        ></v-file-input>
        <v-row>
          <v-col sm="4" >
            <v-btn
              class="mr-4 "
              type="submit"
              :disabled="invalid"
              @click="clickSubmit"
            >
              submit
            </v-btn>
            <v-btn @click="clear">
              clear
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </validation-observer>
  </v-sheet>
</div>
</template>

<script>
import { required, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { insertBoard, updateBoard } from '@/api/index'

setInteractionMode('eager')

  extend('required', {
    ...required,
    message: '{_field_} 은/는 필수사항입니다.'
  })
  extend('max', {
    ...max,
    message: '{_field_} 은/는 {length}자를 넘길 수 없습니다.',
  })

export default {
  props: {
    subject: {
      required: false,
      type: String
    },
    board: {
      required: false
    }
  },
  
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  created(){
    this.user = this.$store.state.account
    
  },

  mounted() {
    this.subjectTitle = this.subject == "add" ? "글 추가" : "글 수정"
    if(this.subject=="edit") {
      this.title = this.board.title
      this.content = this.board.content
      this.category = this.board.category.categoryNo
      this.board.boardFile !=null?
      document.getElementsByClassName('v-label')[3].innerHTML=this.board.boardFile:
      ""
    }
  },

  data: () => ({
    user: '',
    name: '',
    select: null,
    title: null,
    category: null,
    content: null,
    uploadFile: null,
    items: [
      { categoryName : '공지사항', categoryNo: 1000 },
      { categoryName : '분실물센터', categoryNo: 2000 },
    ],
    subjectTitle: "",
    filePlaceholder:"",
    msg:'',
    color:""
  }),

  methods: {

    /* 폼 유효성 (validate) 확인 */
    submit () {
      this.$refs.observer.validate()
    },

    /* clear 버튼 클릭시 메소드 */
    clear () {
      this.title = '',
      this.category = null
      this.select = null
      this.content = ''
      this.$refs.observer.reset()
    },
    
    
    /* 새 글 등록 요청시 async 메소드 */
    async postBoard() { 
      var formData = new FormData();
      formData.append("title", this.title)
      formData.append("category", this.category)
      formData.append("content ", this.content)
      formData.append("account", this.user.id) // 로그인 기능 완성시 변경 예정
      this.uploadFile != null ? formData.append("uploadFile", this.uploadFile) : ""
      const response = await insertBoard(formData)
      console.log(response)
      if(response.status == 200){
        this.openSnack('글 등록 성공', 'success')
        this.$router.push({ path: '/board' })
      } else {
        this.openSnack('글 등록 실패', 'error')
        this.$router.push({ path: '/board' })
      }
    },

    /* 글 수정 요청시 async 메소드 */
    async putBoard() {
      var formData = new FormData();
      formData.append("title", this.title)
      formData.append("category", this.category)
      formData.append("content ", this.content)
      formData.append("account", "vue40") // 로그인 기능 완성시 변경 예정
      this.uploadFile != null ? formData.append("uploadFile", this.uploadFile) : ""
      const response = await updateBoard(this.board.boardNo, formData)
       console.log(response)
      if(response.status == 200){
        this.openSnack('글 수정 성공', 'success')
        this.$router.push({ path: '/board' })
      } else {
        this.openSnack('글 수정 실패', 'error')
      }
    },

    /* 등록 or 수정 요청 확인 후 메소드 실행 */
    clickSubmit() {
      this.subject == "add" ? this.postBoard() : this.putBoard()
    },

    /* 요청 완료시 snackbar 오픈 메소드 */
    openSnack(text,c) {
      this.$store.commit('SET_SNACKBAR', {
        show: true,
        msg: text,
        color: c,
      })
    }
  },
}
</script>

<style >
#insertForm {
  padding: 50px;
  margin-top: 80px;
}
</style>