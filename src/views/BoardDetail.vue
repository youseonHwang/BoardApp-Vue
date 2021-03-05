<template>
  <div>
    <!-- title/ menu부분 -->
    <v-app-bar absolute color="#FF5722" dark >
      <v-app-bar-title>글 상세보기</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item  @click="() => {}">
            <v-list-item-title @click="toForm">
              수정
              <v-icon left>
                mdi-pencil
              </v-icon>
            </v-list-item-title>
          </v-list-item>
          <v-list-item  @click="() => {}">
            <v-list-item-title @click="dialog = true">
              삭제
              <v-icon left>
                mdi-delete
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- main content 부분 -->
    <v-sheet min-height="70vh" rounded="lg" >
      <div id="detail">
        <v-row class="mb-4">
          <v-col cols="12" sm="12" >
            <v-text-field
              v-model="board.title"
              label="글 제목"
              readonly
            ></v-text-field>
          </v-col>   
        </v-row>

        <v-row class="mb-4">
          <v-col cols="4" sm="4" >
            <v-text-field
              v-model="board.category.categoryName"
              label="카테고리"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="4" >
            <v-text-field
              v-model="board.account.name"
              label="작성자"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="4" >
            <v-text-field
              v-model="board.hit"
              label="조회수"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mb-4">
          <v-col cols="12" sm="12" >
              <v-textarea
              rows="25"
              filled
              name="input-7-4"
              label="글 내용"
              v-model="board.content"
              readonly
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="mb-4">
            <v-col cols="10" sm="10">
              <v-text-field
              v-model="board.boardFile"
              readonly>
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2">
              <v-btn
                class="openFileBtn"
                rounded
                color="#FF5722"
                dark
                @click="openImg"
              >
                파일 열기
              </v-btn>
            </v-col>
        </v-row>
      </div>
    </v-sheet>

    <!-- Confirm delete Dialog -->
    <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card dark>
        <v-card-title class="headline">
          삭제하시겠습니까?
        </v-card-title>
        <v-card-text>삭제시 복구되지 않습니다.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false" >
            삭제 취소
          </v-btn>
          <v-btn color="error" :loading="loading" text @click="clickDelete" >
            삭제 확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
</template>

<script>
import { detailBoard, deleteBoard, getImage } from '@/api/index'

export default {
  data: (boardNo) => ({
    boardNo,
    account: null, //나중에 store이용
    board: {
      account:{},
      category:{}
    },
    dialog: false,
    loading: false,
    imgUrl : null,
    msg:'',
    color:''
  }),
  methods: {

    /* 선택한 게시글의 상세 내용 요청 메소드 */
    async getBoardDetail(boardNo) {
      boardNo = this.boardNo
      const response = await detailBoard(boardNo)
      this.board = response.data
      var openFileBtn = document.querySelector('.openFileBtn')
      if(!response.data.boardFile) {
        openFileBtn.classList.remove('primary')
        openFileBtn.classList.add('disabled')
      }
    },

    /* 수정 버튼 클릭시 insert/edit 공용 폼으로 이동 */
    toForm() {
      const params = {
        "subject": "edit",
        "board": this.board
      }
      this.$router.push({ name: 'BoardForm', params})
    },

    /* 삭제 async 메소드 */
    async clickDelete(boardNo) { 
      this.loading = true
      const sleep = (milliseconds=1500) => new Promise(resolve => setTimeout(resolve, milliseconds))
      boardNo = this.boardNo
      await sleep(1500)
      const response = await deleteBoard(boardNo)
      this.loading = false
      console.log(response)
      if(response.status == 204){
        this.openSnack('삭제 성공', 'success')
        this.$router.push({ path: '/board' })
      } else {
        this.openSnack('삭제 실패', 'error')
      }
    },

    /* imageFile 반환 메소드 */
    async getImageFile(boardNo) { 
      const response = await getImage(boardNo)
      console.log(response.data)
      this.imgUrl= URL.createObjectURL(response.data)
    },

    /* 버튼 클릭시 imageURL주소로 window open  */
    /* 주소는 메모리에 올라가(Blob 객체를 바라봄) 객체를 새로 안만들고 바로 가져다 쓰기때문에 속도가 빠르다.
       주소는 실제 서버에는 존재하지 않고, 해당 브라우저에서만 사용 가능한 URL이다.(브라우저 내에서만 사용하기 위한 URL) 
    */
    openImg() {
      this.board.boardFile==null? this.openSnack('파일이 존재하지 않는 게시물입니다.', 'error') : window.open(this.imgUrl)
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
  created() {
    this.boardNo = this.$route.params.boardNo
    this.getBoardDetail()
    this.getImageFile(this.boardNo)
  },
  
};
</script>

<style>

  #detail {
    padding: 50px;
    margin-top: 80px;
  }

  v-text-area {
    white-space: pre;
  }
</style>
