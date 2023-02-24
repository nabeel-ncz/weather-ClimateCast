
let date = document.getElementById("today-date-and-time")
let current_city=document.getElementById("current-city")
let today_condition_status=document.getElementById("today-condition-status")
let today_temp=document.getElementById("today-temp-value")
let weatherCards=document.getElementById("weather-card-row")

let air_quality_value=document.querySelector('.air-quality-value')
let sunrise_value=document.querySelector('.sunrise-value')
let visibility_vallue=document.querySelector('.visibility-value')
let wind_value=document.querySelector(".wind-value")
let humidity_value=document.querySelector(".humidity-value")
let uvindex_value=document.querySelector('.uvindex-value')

let air_quality_status=document.querySelector('.air-quality-status')
let sunrise_status=document.querySelector('.sunrise-status')
let visibility_status=document.querySelector('.visibility-status')
let wind_status=document.querySelector('.wind-status')
let humidity_status=document.querySelector('.humidity-status')
let uvindex_status=document.querySelector('.uvindex-status')

function getDatetime() {
    let current = new Date()
    let c_hour = current.getHours()
    let c_minute = current.getMinutes()
    let days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ]
    //12hour format  =={
    c_hour = c_hour % 12;
    if (c_hour < 10) {
        c_hour = "0" + c_hour
    }
    if (c_minute < 10) {
        c_minute = "0" + c_minute
    }
    //====}
    let c_day = days[current.getDay()]
    let ret_str = c_day + ',' + c_hour + ':' + c_minute
    return ret_str;
}
date.innerText=getDatetime()
//update time every second
setInterval(()=>{
    date.innerText=getDatetime()
},1000)

function setHumidityStatus(value){
    if(value<=30){
        humidity_status.innerText='Low'
    }else if(value<=60){
        humidity_status.innerText='Moderate'
    }else{
        humidity_status.innerText='High'
    }
}
function setVisibilityStatus(value){
    if(value <= 0.03){
        visibility_status.innerText= 'dense fog'
    }else if(value <= 0.16){
        visibility_status.innerText='moderate fog'
    }else if(value <= 0.35){
        visibility_status.innerText='light fog'
    }else if(value <= 1.13){
        visibility_status.innerText='very light fog'
    }else if(value <= 2.16){
        visibility_status.innerText='light mist'
    }else if(value <= 5.4){
        visibility_status.innerText='very light mist'
    }else if(value <= 10.8){
        visibility_status.innerText='clear air'
    }else{
        visibility_status.innerText='very clear air'
    }
}
function setUvindexStatus(value){
    if(value <= 2){
        uvindex_status.innerText = 'Low'
    }else if(value <= 5){
        uvindex_status.innerText= 'Moderate'
    }else if(value <= 7){
        uvindex_status.innerText='High'
    }else if(value <=10){
        uvindex_status.innerText='very high'
    }else{
        uvindex_status.innerText='Extreme'
    }
}
function setairqualityStatus(value){
    if(value <= 50){
        air_quality_status.innerText='Good'
    }else if(value <= 100){
        air_quality_status.innerText='Moderate'
    }else if(value <= 150){
        air_quality_status.innerText='unhealthy for s.group'
    }else if(value <= 200){
        air_quality_status.innerText=='unhealthy'
    }else if(value <= 250){
        air_quality_status.innerText='very unhealthy'
    }else{
        air_quality_status.innerText='hazardous'
    }
}

//function to get public ip with fetch--
function getCurrentLocation(){
    const loc_api='https://geolocation-db.com/json/'
    fetch(loc_api,{
        "method":"GET",
        "headers":{
        }
    }).then((res)=>res.json()).then((data)=>{
        getweatherdata(data.city,"c","daily")
    })
}
getCurrentLocation();//one time call current location weather details
//function to get wether information --
function getweatherdata(city, unit, hourlyOrWeek) {
    const w_api_key = "UFECJKW58UVLKMMTQHPDFUCWB"
    const w_api = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?unitGroup=metric&key=" + w_api_key + "&contentType=json"
    fetch(w_api, {
        "method": "GET",
        "headers": {
        }
    }).then((res) => res.json()).then((data) => {
        let leng=data.days.length;
        let today=data.currentConditions

        current_city.innerText = data.address;

        if(unit=='c'){
            today_temp.innerText = data.days[0].temp
        }else{
            today_temp.innerText = celciustToFaranheit(data.days[0].temp)
        }
        today_condition_status.innerText = data.days[0].conditions

        uvindex_value.innerText= today.uvindex
        humidity_value.innerText= today.humidity
        wind_value.innerText= today.windspeed
        visibility_vallue.innerText= today.visibility
        sunrise_value.innerText= today.sunrise
        air_quality_value.innerText= today.winddir

        setUvindexStatus(today.uvindex)
        setHumidityStatus(today.humidity)
        //setWindStatus(today.windspeed)
        setVisibilityStatus(today.visibility)
        setairqualityStatus(today.winddir)

        if(hourlyOrWeek=="daily"){
            updateForecast(data.days[0].hours,unit,"day")
        }else{
            updateForecast(data.days,unit,"week")
        }
        console.log(data);
    })
}

//celcius to faranheit --
function celciustToFaranheit(temp){
    let t=(temp*9/5)+32
    return t;
}
function getDayName(date){
    let day= new Date(date)
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    return days[day.getDay()]
}
function getHour(time){
    let hour=time.split(":")[0];
    let min=time.split(":")[1];
    if(hour<12){
        let newTime=hour+":"+min+"pm";
        return newTime;
    }else{
        newTime=hour+":"+min+"am";
        return newTime;
    }
}
//forecast update with hourly and weekly
function updateForecast(data,unit,type){
    weatherCards.innerHTML=''
    let day=0;
    let numOfCards=0;
    if(type=='day'){
        numOfCards=24
    }else{
        numOfCards=7
    }
    for(let i=0;i<numOfCards;i++){
        let w_card=document.createElement("div")
        w_card.classList.add("col-lg-2")

        let dayName=getHour(data[day].datetime)
        if(type=='week'){
            dayName=getDayName(data[day].datetime)
        }

        let dayTemp=data[day].temp
        if(unit=='f'){
            dayTemp=celciustToFaranheit(data[day].temp)
        }
        w_card.innerHTML='<div class="weather-item"><div class="icon"></div><h4 class="weather-item-heading">'+dayName+'</h4><p>'+dayTemp+'<br>and one more</p></div>'
        weatherCards.appendChild(w_card);
        day++;
    }
}

//search locaton 
const search_form = document.getElementById("weather-search-form")
search_form.addEventListener('submit',(event)=>{
    event.preventDefault()
    
    let city_name=document.getElementById("city-form")
    let D_or_w=document.getElementById("select-form")
    let temp_unit=document.getElementById("temp-form")

    if(city_name.value==''){
        alert("please enter city nme")
    }else{
        getweatherdata(city_name.value,temp_unit.value,D_or_w.value)
    }

    //console.log(city_name.value+':'+D_or_w.value+':'+temp_unit.value);
})





