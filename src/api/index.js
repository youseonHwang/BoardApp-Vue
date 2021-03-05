import axios from 'axios';
import { store } from '@/store/index';

const config = {
  baseUrl: 'http://200.100.1.115:8088/',
  headers: {
    token:{'Authorization': 'Bearer '+ store.getters.currentToken}, //변경 감지가 안됨.. 이상함.. . . . .
    access: { 'Access-Control-Allow-Origin': '*' },
    form: { 'Content-Type': 'multipart/form-data' },
    json: { 'Content-Type': 'application/json'}
  }
}

// header 병합하기
function getHeaderToken() {
  config.headers.token = { 'Authorization': 'Bearer ' + store.getters.currentToken }
  return Object.assign({}, config.headers.token, config.headers.json)
}

// 게시물 목록에 필요한 data 반환
function getBoardList(page, categoryNo, search) {
  try {
    const header = getHeaderToken()
    return axios({
      method: 'get',
      url: `${config.baseUrl}api/board`,
      headers: header ,
      params: { page, categoryNo, search }
    })
  } catch (error) {
    console.log(error)
  }
}

// 리뷰 목록
function getReviewList() {
  try {
    const header = getHeaderToken()
    return axios({
      method: 'GET',
      url: `${config.baseUrl}api/review`,
      headers: header
    })
  } catch (error) {
    console.log(error)
  }
}
// 게시물 상세보기
function detailBoard(boardNo) {
  console.log(store.getters.currentToken)
  try {
    const header = getHeaderToken()
    return axios({
      method: 'get',
      url: `${config.baseUrl}api/board/${boardNo}`,
      headers:header
    })
  } catch(error) {
    console.log(error)
  }
}

// 새 게시물 작성
function insertBoard(formData) {
  try {
    const header = getHeaderToken()
    return axios({
      method:'POST',
      url:`${config.baseUrl}api/board`,
      data:formData,
      headers:header
    })
  } catch (error) {
    console.log(error)
  }
}

// 새 리뷰 등록
function insertReview(formData) {
  try {
    const header = getHeaderToken()
    return axios({
      method:'POST',
      url:`${config.baseUrl}api/review`,
      data:formData,
      headers:header
    })
  } catch (error) {
    console.log(error)
  }
}

// 기존 게시물 수정
function updateBoard(boardNo,formData) {
  try {
    const header = getHeaderToken()
    return axios({
      method: 'put',
      url: `${config.baseUrl}api/board/${boardNo}`,
      data: formData,
      headers:header
    })
  } catch (error) {
    console.log(error)
  }
}

// 게시물 삭제
function deleteBoard(boardNo) {
  try {
    const header = getHeaderToken()
    return axios({
      method:'delete',
      url: `${config.baseUrl}api/board/${boardNo}`,
      headers: header
    })
  } catch (error) {
    console.log(error)
  }
}

// 이미지 가져오기
function getImage(boardNo) {
  const header = getHeaderToken()
  try {
    return axios({
      url: `${config.baseUrl}api/image/${boardNo}`,
      method: 'get',
      responseType: 'blob',
      headers: header
    })
  } catch (error) {
    console.log(error)
  }
}

// 바차트 가져오기
function getBarChart() {
  const header = getHeaderToken()
  try {
    return axios({
      url: `${config.baseUrl}api/count/account`,
      method: 'get',
      headers: header
    })
  } catch (error) {
    console.log(error)
  }
}
// 일주일 라인 차트 가져오기
function getWeek() {
  const header = getHeaderToken()
  try {
    return axios({
      url: `${config.baseUrl}api/count/week`,
      method: 'get',
      headers: header
    })
  } catch (error) {
    console.log(error)
  }
}

// 일주일 라인 차트 가져오기
function getRatingCount() {
  const header = getHeaderToken()
  try {
    return axios({
      url: `${config.baseUrl}api/count/rating`,
      method: 'get',
      headers: header
    })
  } catch (error) {
    console.log(error)
  }
}

// 로그인 요청
function login(user) {
  return axios.post(`${config.baseUrl}api/login`, user, { headers: { "Content-Type": "application/json" } })
    
}  
// 로그인 에러 메세지 출력
function loginError() {
  try { return axios.get(`${config.baseUrl}/error`) } catch (error) { console.log(error) }
}

//로그인
export { login , loginError }
//게시판
export { detailBoard, getBoardList, insertBoard, updateBoard, deleteBoard, getImage}
// 리뷰
export { insertReview, getReviewList }
// 차트
export { getBarChart, getWeek, getRatingCount }
