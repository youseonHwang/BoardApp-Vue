<template>
  <div>
    <!-- title과 tab부분 -->
    <v-app-bar absolute color="#FF5722" dark >
      <v-app-bar-title class="col-3 app-bar-title" >게시판</v-app-bar-title>
      <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab @click="changeCategory(1000)">공지사항</v-tab>
            <v-tab @click="changeCategory(2000)">분실물센터</v-tab>
          </v-tabs>
      </template>
      <v-text-field
          append-icon="mdi-magnify"
          class="mx-2"
          flat
          hide-details
          label="Search"
          solo-inverted
          v-model="search"
          @keyup.enter="searchBoard(search)"
        ></v-text-field>
    </v-app-bar>

    <!-- 글 추가 버튼 -->
    <v-btn class="mx-2 insertBtn" fab dark x-large color="#FDD835 " @click="toForm" absolute right>
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>

    <!-- 테이블 -->
    <v-container id="regular-tables" fluid>
      <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" width="8%">
              순서
            </th>
            <th class="text-center" width="15%">
              카테고리
            </th>
            <th class="text-center" width="35%">
              제목
            </th>
            <th class="text-center" width="15%">
              작성자
            </th>
            <th class="text-center" width="15%">
              작성일
            </th>
            <th class="text-center" width="8%">
              조회수
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center"
            v-for="( board,i) in boardList"
            :key="board.boardno" >
            <td>{{ page>1?index=page*10 +i : i+1 }}</td> 
            <td>{{ board.category.categoryName }}</td>
            <td><router-link :to="{name: 'BoardDetail', params:{boardNo: board.boardNo }}">{{ board.title }}</router-link></td>
            <td>{{ board.account.username }}</td>
            <td>{{ board.regdate}}</td>
            <td>{{ board.hit }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- 테이블 끝 -->
    <!-- <v-data-table
      :headers="headers"
      :items="boardList"
      :search="search"
    ></v-data-table> -->
    </v-container>

    <!-- 페이징 -->
    <div class="text-center pagination">
      <v-pagination
        color="#FF5722"
        v-model="page"
        :total-visible="5"
        :length="totalPage"
        @input="changePage"
      ></v-pagination>
    </div>
  
  </div>
</template>

<script>
import { getBoardList } from '@/api/index'

export default {
  data () {
    return {
      index: 1,
      regdate: null,
      boardList: [],
      totalPage: 0,
      page: 1,
      categoryNo: null,
      search: null,
      token: this.$store.getters.currentToken,
       headers: [
          {
            text: '제목',
            align: 'start',
            sortable: false,
            value: "title",
          },
          { text: '카테고리', value: 'category.categoryName' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
        ],
    }
  },
  methods: {
    
    async getBoard() {
      console.log('getBoard들어옴!!!!!!!!!!!')
      const response = await getBoardList(this.page, this.categoryNo, this.search)
      this.totalPage = response.data.totalPages
      this.boardList = response.data.content
    },
    changePage(value) { //page 버튼이 눌렸을때 동작
      this.page = value
    },
    changeCategory(value) { //카테고리 버튼을 눌렀을때 동작
      this.getBoard(this.page = 1, this.categoryNo = value, this.search=null)
    },
    toForm() { //새 글 버튼을 눌렀을때 동작
      const params ={"subject": "add"}
      this.$router.push({ name: 'BoardForm', params})
    },
    searchBoard(search) { //검색시 동작
      this.getBoard(this.page = 1, this.categoryNo, this.search = search)
    } 
  },
  created() { 
    this.getBoard()
  },
  watch: {
    page: {
      handler(page){
        console.log("handlerpage:::::::"+page)
        this.getBoard(page)
      }
    },
    categoryNo: {
      handler(categoryNo) {
        this.getBoard(1,categoryNo)
      }
    }
  },
  computed:{
  }
}
</script>

<style>
#regular-tables {
  margin-top: 130px;
}
.v-btn--absolute{
  top: 75px
}
.app-bar-title{
  margin-left: 30px;
  font-size: 25px;
}
.pagination {
  margin-bottom: 20px;
}
</style>
