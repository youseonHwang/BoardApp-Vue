<template>
<v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-system-bar color=#FF4081></v-system-bar>
            <v-toolbar flat color="#FFCDD2">
              <v-toolbar-title >통 계 차 트</v-toolbar-title>
            <v-spacer></v-spacer>
            <div>
              <v-switch
              v-model="sticky"
              label="Sticky Banner"
              hide-details
              ></v-switch>
            </div>
            </v-toolbar>
            <v-banner  single-line :sticky="sticky" >
            <template v-slot:actions>
              <v-btn text color="deep-purple accent-4" >
                리뷰 보러가기
              </v-btn>
            </template>
            </v-banner>
            <v-container fluid 
                id="scroll-target"
                style="max-height: 700px"
                class="overflow-y-auto">
            <section class="container"  v-scroll:#scroll-target="onScroll">
            <div class="columns">
              <v-card class="chart-card">
                <v-row no-gutters>
                  <v-col cols="12" mb="6" sm="12">
                    <div class="column">
                      <h3>최근 글 등록수</h3>
                      <line-chart :chart-data="weekChart"></line-chart>
                    </div>
                  </v-col>
                </v-row>
                </v-card>
              <v-card class="chart-card">
              <v-row no-gutters>
                  <v-col cols="12" mb="12" sm="12">
                  <div class="column">
                    <h3>연령대별 회원수 통계</h3>
                    <reactive :chart-data="acountAgeChart"></reactive>
                  </div>
                  </v-col>
              </v-row>
              </v-card>

              <v-card class="chart-card">
              <v-row no-gutters>
                  <v-col cols="12" mb="12" sm="12">
                  <div class="column">
                    <h3>별점대별 인원수 통계</h3>
                    <bubble-chart :chart-data="ratingChart"></bubble-chart>
                  </div>
                  </v-col>
              </v-row>
              </v-card>
            </div>
          </section>
        </v-container>

        <!-- bottom-navigation -->
        <v-bottom-navigation color="#FF4081">

          <v-btn>
            <span>Recents</span>
            <v-icon>mdi-history</v-icon>
          </v-btn>

          <v-btn>
            <span>Favorites</span>
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <v-btn>
            <span>Nearby</span>
            <v-icon>mdi-map-marker</v-icon>
          </v-btn>

          </v-bottom-navigation>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import LineChart from '@/components/LineChart'
  import BubbleChart from '@/components/BubbleChart'
  import Reactive from '@/components/ReactiveChart'
  import { getWeek, getBarChart , getRatingCount } from '@/api/index';

  export default {
    name: 'VueChartJS',
    components: {
      LineChart,
      BubbleChart,
      Reactive
    },
    data() {
      return {
        acountAgeChart: null,
        weekChart: null,
        ratingChart: null,
        sticky: false,
        value:3,
        offsetTop: 0,
      }
    },
    created() {
      this.getWeekChart()
      this.getAccountChart()
      this.getRatingChart()
    },
    methods: {
      /* 스크롤 관련 메소드 */
      onScroll (e) {
        this.offsetTop = e.target.scrollTop
      },

      /* 별점대별 인원 수 차트 */
      async getRatingChart() {
        console.log('getRatingChart!!!!!!!!!!!')
        const response = await getRatingCount()
        console.log(response)
        this.ratingChart = {
          datasets: [
            {
              label: '명',
              backgroundColor: '#f87979',
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#249EBF',
              data: [
                {x:response.data[0]*10,y:response.data[0]*10,r:response.data[0] *10},
                {x:response.data[1]*10,y:response.data[1]*10,r:response.data[1] *10},
                {x:response.data[2]*10,y:response.data[2]*10,r:response.data[2] *10},
                {x:response.data[3]*10,y:response.data[3]*10,r:response.data[3] *10},
                {x:response.data[4]*10,y:response.data[4]*10,r:response.data[4] *10},
              ]
            }
          ]
        }
      },
      /* 일주일간 등록된 차트 수 */
      async getWeekChart() {
        const response = await getWeek()
        this.weekChart = {
          labels: response.data[1],
          datasets: [
            {
              label: '개',
              backgroundColor: '#f87979',
              data: response.data[0]
            }
          ]
        }
      },
      /* 연령대별 회원수 통계 비동기 함수 */
      async getAccountChart() {
        const response = await getBarChart()
        this.acountAgeChart = {
          labels: ['0~9세', '10대', '20대', '30대', '40대', '50대', '60대', '70대', '그 외'],
          datasets: [
            {
              label: '명',
              backgroundColor: '#f87979',
              data: response.data
            }
          ]
        }
      },
    },

  }
</script>
<style>
    v-card {
        display: inline;
    }
    .columns{
        padding-left: 20px;
        padding-right: 20px;
    }
    section {
        display: inline;
    }
    .chart-card{
        margin-bottom: 50px;
    }
</style>