
let ApiKey = "발급 받은 API 키"
let date = new Date();
let year = date.getFullYear();
let month = "0" + (date.getMonth() + 1);
let month2 = month.substr(-2);
let day = "0" + date.getDate();
let day2 = day.substr(-2);
let day3 = "0" + (day2 - 1);
let day4 = day3.substr(-2);
let time = date.getHours();
let minutes = date.getMinutes();
let weathertoday = year + month2 + day2
let weathertoday2 = year + month2 + day4

let navDay = date.getDay()
let navDayarr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let navDay2 = navDayarr[navDay]

const modifyNumber = (time) => {
  if (parseInt(time) < 10) {
    return "0" + time;
  }
  else
    return `${time}`;
};

let hour = modifyNumber(date.getHours());
let min = modifyNumber(date.getMinutes());
let sec = modifyNumber(date.getSeconds());

//navbar의 시계를 위해 만든 함수
const setClock = () => {
  var date = new Date();
  var hour = modifyNumber(date.getHours());
  var min = modifyNumber(date.getMinutes());
  var sec = modifyNumber(date.getSeconds());
  $('.time-table').html(navDay2 + " " + hour + ":" + min + ":" + sec);
};


//현재 날씨 데이터를 위한 시계 함수 매 시 30분에 데이터 업로드됨
let weathernTime = time => {
  if (time > 10) {
    return (time - 1) + "30"
  } else {
    return "0" + (time - 1) + "30"
  }
};

let nTime = weathernTime(time);

// 00시의 경우 2330의 데이터가 필요해서 만든 함수
let weatherNt = time => {
  if ("0" + time === "00" && minutes < 30) return "2330"
  else return nTime
};

let Ntime = weatherNt(time);

//하루 날씨 데이터를 위한 시간 함수
let weathertTime = time => {
  if (time >= 10) return time + "00"
  else return "0" + time + "00"
}
let tTime = weathertTime(time);


//하루 날씨의 날짜를 정의하는 함수
let weatherNd = () => {
  if ('0' + `${time}` + `${minutes}` == "0030") return weathertoday
  else if (time == 00) return weathertoday2
  else return weathertoday
};

//misedata 호출을 위한 어레이
let miseCode = ['PM10', 'PM25']

//날씨 데이터 호출과 템플릿 제작을 위한 지역별 데이터
let state = [
  { region_eng: 'seoul', region: '서울', nx: 60, ny: 127 },
  { region_eng: 'busan', region: '부산', nx: 98, ny: 76 },
  { region_eng: 'daegu', region: '대구', nx: 89, ny: 90 },
  { region_eng: 'incheon', region: '인천', nx: 55, ny: 124 },
  { region_eng: 'gwangju', region: '광주', nx: 58, ny: 74 },
  { region_eng: 'daejeon', region: '대전', nx: 67, ny: 100 },
  { region_eng: 'ulsan', region: '울산', nx: 102, ny: 84 },
  { region_eng: 'sejong', region: '세종', nx: 66, ny: 103 },
  { region_eng: 'gyeonggi', region: '경기', nx: 60, ny: 120 },
  { region_eng: 'gangwon', region: '강원', nx: 73, ny: 134 },
  { region_eng: 'chungbuk', region: '충북', nx: 69, ny: 107 },
  { region_eng: 'chungnam', region: '충남', nx: 68, ny: 100 },
  { region_eng: 'jeonbuk', region: '전북', nx: 63, ny: 89 },
  { region_eng: 'jeonnam', region: '전남', nx: 51, ny: 67 },
  { region_eng: 'gyeongnam', region: '경남', nx: 91, ny: 77 },
  { region_eng: 'gyeongbuk', region: '경북', nx: 89, ny: 91 },
  { region_eng: 'jeju', region: '제주', nx: 52, ny: 38 }
]

//현재 실시간 날씨 데이터
const nWeather = async data => {
  try {
    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${ApiKey}&
          pageNo=1&numOfRows=1000&dataType=JSON&base_date=${weatherNd()}&base_time=${nTime}&nx=${data.nx}&ny=${data.ny}`
    );
    const result = await response.json();
    const datas = result.response.body.items.item;
    const ndata = datas.filter(data => data.fcstTime === tTime)
    //최근 시간 기준으로 3시간의 데이터가 불러와지기 때문에 현재시간을 기준으로 필터링
    return ndata
  } catch (error) {
    console.log(error);
    return '';
  }
};

//오늘 00시부터 11시까지의 날씨 데이터
const tWeather = async data => {
  try {
    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${ApiKey}&
        pageNo=1&numOfRows=1000&dataType=JSON&base_date=${weathertoday2}&base_time=0500&nx=${data.nx}&ny=${data.ny}`
    );
    const result = await response.json();
    const datas = result.response.body.items.item;
    const tData = datas.filter(
      item => item.fcstDate === weathertoday && item.category == "TMP");
    //chart생성을 위해 TMP 부분만 필터 함수를 이용해 추출
    const tDataArr = [];
    tData.forEach(data => {
      const newArr = parseInt(data.fcstValue);
      tDataArr.push(newArr);
    });

    return tDataArr;

  } catch (error) {
    console.log(error);
    return '';
  }
};

//미세 데이터 호출 함수
const mise = async data2 => {
  try {
    const response = await fetch(
      `https://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst?serviceKey=${ApiKey}&
        returnType=xml&numOfRows=100&pageNo=1&itemCode=${data2}&dataGubun=HOUR&searchCondition=daily`
    );
    const result = await response.text();
    const data = xmlToJson.parse(result); // xml데이터로만 받을수 있어 외부라이브러리를 통해 JSON으로 변환
    const mData = data.response.body.items.item[0]
    return mData;
  } catch (error) {
    console.log(error);
    return '';
  }
};

//불러 온 전체 데이터를 처리하는 함수
const getWeatherAndMise = async () => {

  const nWeather2 = state.map(data => nWeather(data));
  const tWeather2 = state.map(data => tWeather(data));
  const mise2 = miseCode.map(data2 => mise(data2));

  const nDatas = await Promise.all(nWeather2);
  const tDatas = await Promise.all(tWeather2);
  const miseDatas = await Promise.all(mise2);

  const pm10 = miseDatas[0]
  const pm25 = miseDatas[1]

  //원하는 순서대로 설정을 위해 미세 데이터 배열 생성

  const pm10Arr = [pm10.seoul, pm10.busan, pm10.daegu, pm10.incheon, pm10.gwangju, pm10.daejeon, pm10.ulsan, pm10.sejong, pm10.gyeonggi,
  pm10.gangwon, pm10.chungbuk, pm10.chungnam, pm10.jeonbuk, pm10.jeonnam, pm10.gyeongnam, pm10.gyeongbuk, pm10.jeju];

  const pm25Arr = [pm25.seoul, pm25.busan, pm25.daegu, pm25.incheon, pm25.gwangju, pm25.daejeon, pm25.ulsan, pm25.sejong, pm25.gyeonggi,
  pm25.gangwon, pm25.chungbuk, pm25.chungnam, pm25.jeonbuk, pm25.jeonnam, pm25.gyeongnam, pm25.gyeongbuk, pm25.jeju];

  //좀 더 빠른 사이트 랜더링을 위해 localstorage 활용

  //GPT에게 물어볼 질문을 다른 데이터들과 같이 localstorage에 넣기 위해 해당 함수에서 실행
  
  gptQuestion(tDatas, nDatas, pm10Arr, pm25Arr);

  const nDatas2 = JSON.stringify(nDatas);
  const tDatas2 = JSON.stringify(tDatas);
  const pm10Arr2 = JSON.stringify(pm10Arr);
  const pm25Arr2 = JSON.stringify(pm25Arr);

  window.localStorage.setItem('nDatas', nDatas2);
  window.localStorage.setItem('tDatas', tDatas2);
  window.localStorage.setItem('pm10Arr', pm10Arr2);
  window.localStorage.setItem('pm25Arr', pm25Arr2);

};

//chatgpt에게 물어볼 질문을 생성하는 함수
const gptQuestion = (tDatas, nDatas, pm10Arr, pm25Arr) => {

  const questionArr = [];

  for (i = 0; i < state.length; i++) {

    const T1H = nDatas[i][4].fcstValue
    const pm10 = pm10Arr[i]
    const pm25 = pm25Arr[i]
    const REH = nDatas[i][5].fcstValue
    const WSD = nDatas[i][9].fcstValue

    const question = ` The weather from 00:00 to 23:00 today is ${tDatas[i]}, and now ${T1H}℃ humidity is ${REH}%, wind speed is ${WSD}m/s,fine dust is ${pm10}㎍/㎥ and ultrafine dust is ${pm25}㎍/㎥.
          Please recommend my clothes suitable for today's weather and Should I wear a mask?.`

    questionArr.push(question);

  };

  const questionArr2 = JSON.stringify(questionArr);

  window.localStorage.setItem('questionArr', questionArr2);

};

//날씨 데이터를 이미지로 나타내기 위한 함수

const makeImg = (PTY, SKY) => {

  const bad = "/public/svg/bad.svg";
  const badrain = "/public/svg/badrain.svg";
  const badrainsnow = "/public/svg/badrainsnow.svg";
  const badsnow = "/public/svg/badsnow.svg";
  const cloud = "/public/svg/cloud.svg"
  const cloudrain = "/public/svg/cloudrain.svg"
  const cloudrainsnow = "/public/svg/cloudrainsnow.svg"
  const cloudsnow = "/public/svg/cloudsnow.svg"
  const moon = "/public/svg/moon.svg"
  const mooncloud = "/public/svg/mooncloud.svg"
  const moonrain = "/public/svg/moonrain.svg"
  const moonrainsnow = "/public/svg/moonrainsnow.svg"
  const moonsnow = "/public/svg/moonsnow.svg"
  const moonbad = "/public/svg/moonbad.svg"
  const moonbadrain = "/public/svg/moonbadrain.svg"
  const moonbadrainsnow = "/public/svg/moonbadrainsnow.svg"
  const moonbadsnow = "/public/svg/moonbadsnow.svg"
  const rain = "/public/svg/rain.svg"
  const rainsnow = "/public/svg/rainsnow.svg"
  const snow = "/public/svg/snow.svg"
  const sun = "/public/svg/sun.svg"

  //낮과 저녁 시간을 구분 하여 이미지를 설정하기 위한 함수와 includes식별자
  const moonarr = ['18', '19', '20', '21', '22', '23', '00', '01', '02', '03', '04', '05']
  const moontime = moonarr.includes(modifyNumber(time));

  let svg = "";

  // - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
  // - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)  

  if (moontime === true) {
    if ((PTY === 1 || PTY === 5) && (SKY === 1 || SKY === 3)) { svg = moonrain; }
    if ((PTY === 1 || PTY === 5) && SKY === 4) { svg = moonbadrain; }

    if ((PTY === 2 || PTY === 6) && (SKY === 1 || SKY === 3)) { svg = moonrainsnow; }
    if ((PTY === 2 || PTY === 6) && SKY === 4) { svg = moonbadrainsnow; }
    if ((PTY === 3 || PTY === 7) && (SKY === 1 || SKY === 3)) { svg = moonsnow; }
    if ((PTY === 3 || PTY === 7) && SKY === 4) { svg = moonbadsnow; }

    if (PTY === 0 && SKY === 1) { svg = moon; }
    if (PTY === 0 && SKY === 3) { svg = mooncloud; }
    if (PTY === 0 && SKY === 4) { svg = moonbad; }
  } else {
    if ((PTY === 1 || PTY === 5) && SKY === 1) { svg = rain; }
    if ((PTY === 1 || PTY === 5) && SKY === 3) { svg = cloudrain; }
    if ((PTY === 1 || PTY === 5) && SKY === 4) { svg = badrain; }

    if ((PTY === 2 || PTY === 6) && SKY === 1) { svg = rainsnow; }
    if ((PTY === 2 || PTY === 6) && SKY === 3) { svg = cloudrainsnow; }
    if ((PTY === 2 || PTY === 6) && SKY === 4) { svg = badrainsnow; }

    if ((PTY === 3 || PTY === 7) && SKY === 1) { svg = snow; }
    if ((PTY === 3 || PTY === 7) && SKY === 3) { svg = cloudsnow; }
    if ((PTY === 3 || PTY === 7) && SKY === 4) { svg = badsnow; }

    if (PTY === 0 && SKY === 1) { svg = sun; }
    if (PTY === 0 && SKY === 3) { svg = cloud; }
    if (PTY === 0 && SKY === 4) { svg = bad; }
  };

  return `<iframe src='${svg}'></iframe>`

};

//한 시간동안 강수 데이터에서 강수없음으로 데이터가 출력되면 0값을 return하기 위한 함수
const RN1value = (RN1) => {

  if (RN1 === "강수없음")
    return 0;
  else return parseInt(RN1);

};

//날씨 데이터를 활용하여 탬플릿을 만드는 함수
const makeDetail = (nDatas, pm10Arr, pm25Arr) => {

  for (let i = 0; i < nDatas.length; i++) {

    const container = $(`.container${i}`);

    const region = state[i].region_eng
    const T1H = nDatas[i][4].fcstValue
    const pm10 = pm10Arr[i]
    const pm25 = pm25Arr[i]
    const REH = nDatas[i][5].fcstValue
    const WSD = nDatas[i][9].fcstValue
    const PTY = parseInt(nDatas[i][1].fcstValue);
    const SKY = parseInt(nDatas[i][3].fcstValue);
    const RN1 = nDatas[i][2].fcstValue

    const template =
      `
  <div class="main">
    <div class="weather-container">
      <div id="weather" class="weather">${makeImg(PTY, SKY)}</div>
      <div id="T1H" class="nDegree T1H">${T1H}℃
      </div>
    </div>
   <div class="detail">
      <div class="detail-img"><img src="/public/icon-region.png"></div>
      <div class="detail-region region">${region}</div>
    </div>
  </div>
  <div class="chart-box">
    <canvas class="myChart${i}" style="width: 1100px; height: 100%; padding: 10px;"></canvas>
  </div>
  <div class="weather-box">
    <div class="pm10">
      <h1>Pm10</h1>
        <p id="pm10" class="pm10">${pm10}㎍/㎥</p>
    </div>
    <div class="pm25">
      <h1>Pm2.5</h1>
        <p id="pm25" class="pm25">${pm25}㎍/㎥</p>
   </div>
   <div class="Precipitation">
      <h1>Precipitation</h1>
        <p id="RN1" class="RN1">${RN1value(RN1)}mm</p>
    </div>
    <div class="Humidity">
      <h1>Humidity</h1>
        <p id="REH" class="REH">${REH}%</p></p>
    </div>
    <div class="wind">
      <h1>Wind</h1>
        <p id="WSD" class="WSD">${WSD}m/s</p>
    </div>
  </div>
`
    container.append(template);
  };
};

//차트를 만들기 위한 함수
const makeChart = (tDatas, state) => {

  for (let i = 0; i < tDatas.length; i++) {

    const chartData = tDatas[i];
    const region = state[i].region_eng
    const ctxArea = document.getElementsByClassName(`myChart${i}`);

    class Custom extends Chart.LineController {
      draw() {
        super.draw(arguments);
        const ctx = this.chart.ctx;
        const _stroke = ctx.stroke;
        ctx.stroke = function () {
          ctx.save();
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 5;
          _stroke.apply(this, arguments);
          ctx.restore();
        }
      }
    };
    Custom.id = 'shadowLine';
    Custom.defaults = Chart.LineController.defaults
    Chart.register(Custom);
    const ctx = ctxArea;
    const myChart = new Chart(ctx, {
      type: 'shadowLine',
      data: {
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        datasets: [{
          label: region,
          data: chartData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 4,
          tension: 0.4,
          scaleStartValue: 0,
          borderCapStyle: 'round',

        }]
      },
      options: {
        responsive: false,
        animation: {
          x: {
            duration: 2000,
            from: 1
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            }
          },
          y: {
            display: false,
            beginAtZero: true,
            grid: {
              display: false
            }
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };
};

//템플릿과 차트를 만드는 함수
const makeAll = () => {

  const nDatas = JSON.parse(window.localStorage.getItem('nDatas'));
  const tDatas = JSON.parse(window.localStorage.getItem('tDatas'));
  const pm10Arr = JSON.parse(window.localStorage.getItem('pm10Arr'));
  const pm25Arr = JSON.parse(window.localStorage.getItem('pm25Arr'));

  makeDetail(nDatas, pm10Arr, pm25Arr);

  makeChart(tDatas, state);

};

// 전체 페이지를 만드는 함수
const final = () => {

  const mainLoad = $('#main-page').length > 0
  const timeLoad = minutes == 00 || minutes == 30

  $(document).ready(() => {
    if (mainLoad || timeLoad) {
      window.localStorage.clear();
      getWeatherAndMise();
    } else {
      makeAll();
    }
  });
};

// final();

// OpenAI API 호출을 위해 사용할 데이터
const seoulData = JSON.parse(window.localStorage.getItem('questionArr'))[0];
const busanData = JSON.parse(window.localStorage.getItem('questionArr'))[1];
const daeguData = JSON.parse(window.localStorage.getItem('questionArr'))[2];
const incheonData = JSON.parse(window.localStorage.getItem('questionArr'))[3];
const gwangjuData = JSON.parse(window.localStorage.getItem('questionArr'))[4];
const daejeonData = JSON.parse(window.localStorage.getItem('questionArr'))[5];
const ulsanData = JSON.parse(window.localStorage.getItem('questionArr'))[6];
const sejongData = JSON.parse(window.localStorage.getItem('questionArr'))[7];
const gyeonggiData = JSON.parse(window.localStorage.getItem('questionArr'))[8];
const gangwonData = JSON.parse(window.localStorage.getItem('questionArr'))[9];
const chungbukData = JSON.parse(window.localStorage.getItem('questionArr'))[10];
const chungnamData = JSON.parse(window.localStorage.getItem('questionArr'))[11];
const jeonbukData = JSON.parse(window.localStorage.getItem('questionArr'))[12];
const jeonnamData = JSON.parse(window.localStorage.getItem('questionArr'))[13];
const gyeongnamData = JSON.parse(window.localStorage.getItem('questionArr'))[14];
const gyeongbukData = JSON.parse(window.localStorage.getItem('questionArr'))[15];
const jejuData = JSON.parse(window.localStorage.getItem('questionArr'))[16];








