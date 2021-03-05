<template>
<div>
  <!-- 바디 타이틀바 -->
  <v-toolbar color="#1B5E20" dark >
    <!-- 바디 타이틀바_왼쪽 메뉴 -->
    <v-app-bar-nav-icon >
      <v-menu  bottom left >
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on" >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item >
            <v-list-item-title @click="openReviewModal()">리뷰작성</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar-nav-icon>
    <v-toolbar-title>REVIEWS</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- 바디 타이틀바_오른쪽 메뉴 -->
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-toolbar>

    <v-container fluid>
      <!-- 리뷰 -->
        <v-row no-gutters class="review-row">
          <!-- 리뷰 카드 시작 -->
          <v-card
            v-for="review in reviews"
            :key="review.reviewNo"
            elevation="15"
            class="review-card"
            color="#81C784"
            dark
            cols="12"
            mb="4"
            sm="4"
            max-width="350">
            <v-card-title>
              <v-icon large left > mdi-message-processing </v-icon>
              <span class="title font-weight-light">Review</span>
            </v-card-title>
              
            <!-- 리뷰 메세지 -->
            <v-card-text class="headline font-weight-bold">
              "{{ review.reviewMemo }}"
            </v-card-text>
              
            <!-- 별점 -->
            <v-card-actions class="pa-4">
              {{ review.account.id }}님의 리뷰
            <v-spacer></v-spacer>
            <span class="grey--text text--lighten-2 caption mr-2">
                ({{ review.rating }})
            </span>
            <v-rating
                v-model="review.rating"
                background-color="white"
                color="yellow accent-4"
                dense
                hover
                size="18"
                readonly
            ></v-rating>
            </v-card-actions>

            <!-- 이름 및 정보 -->
            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                      class="elevation-6"
                      alt=""
                      src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ review.account.id }}</v-list-item-title>
                </v-list-item-content>
                <v-row  align="center" justify="end" slot-scope="">
                  <v-icon class="mr-1"> mdi-heart </v-icon>
                  <span class="subheading mr-2">0</span>
                  <span class="mr-1">·</span>
                  <v-icon class="mr-1"> mdi-share-variant </v-icon>
                  <span class="subheading">0</span>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-row>

 

    </v-container>
           <!-- 리뷰 다이얼로그 -->
        <v-row justify="center">
          <v-dialog v-model="dialog" width="600px" >
          <v-card class="elevation-16 mx-auto" width="600" >

            <!-- 리뷰 타이틀 -->
            <v-card-title class="headline">
              저희 서비스를 평가해주세요
            </v-card-title>
            <v-card-text>
              사용경험을 남겨주세요! 감사합니다!
              <div class="text-center mt-12">
                <v-rating
                v-model="rating"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="$ratingFull"
                hover
                large
                ></v-rating>
              </div>
            </v-card-text>

            <!-- 리뷰 메모란 -->
            <v-divider></v-divider>
            <v-textarea
                class="textarea-memo"
                v-model="reviewMemo"
                placeholder="리뷰를 적어주세요"
                counter
                maxlength="120"
                full-width
                single-line
            ></v-textarea>
            
            <!-- 리뷰 버튼란 -->
            <v-divider></v-divider>
            <v-card-actions class="justify-space-between">
              <v-btn text @click="openReviewModal">
                  No Thanks
              </v-btn>
              <v-btn color="primary" text @click="clickPostReview">
                  Rate Now
              </v-btn>
            </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
  </div>
</template>

<script>

import { insertReview, getReviewList } from '@/api/index'

export default {
    data: () => ({
      rating: 5,
      dialog: false,
      reviewMemo:'',
      reviews:{},
      
    }),

    /* 메소드들 */
    methods:{
       /* 모달창 오픈 메소드 */
      openReviewModal(){
        this.dialog= !this.dialog
      },
      clickPostReview() {
        this.postReview()
      },
      /* 새 글 등록 요청시 async 메소드 */
      async postReview() { 
        console.log('postReview!!!!!!!!!!!')
        var formData = new FormData();
        formData.append("rating", this.rating)
        formData.append("account", this.$store.getters.currentUser)
        this.reviewMemo != null ? formData.append("reviewMemo", this.reviewMemo) : ""
        const response = await insertReview(formData)
        if(response.status == 200){
          this.openSnack('리뷰 등록 성공', 'success')
          this.dialog=false
          this.getReviews()
          this.reviewMemo=''
        } else {
          this.openSnack('리뷰 등록 실패', 'error')
        }
      },
       /* 리뷰 목록 반환 비동기함수 */
      async getReviews() {
        console.log('getReviews!!!!!!!!!!!')
        const response = await getReviewList()
        this.reviews = response.data
      },
      /* 요청 완료시 snackbar 오픈 메소드 */
      openSnack(text,c) {
        this.$store.commit('SET_SNACKBAR', {
          show: true,
          msg: text,
          color: c,
        })
      },
    },
     /* 화면이 켜지자마자 동작 */
    created() {
        this.getReviews()
    },
}
</script>

<style>
  v-card {
      display: inline;
  }
  .review-card {
      margin: 1.2%;
  }
  .textarea-memo {
      padding: 20px
  }
  .review-row{
    margin-bottom: 60px ;
  }

</style>