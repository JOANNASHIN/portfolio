const weather = () => { 

    const data = {
        key: "af134da678fac6615bd7aabed303b791",
        position: {},
        weatherBackground: {
            "sunny": "skyblue",
            "rainy": "#5b6986",
            "Clouds": "#355cac",
            "snow": "#c8dee1"
        },

        weatherBackgroundImage: {
            "sunny": 'url("/src/images/weather/sunny1.jpg")',
            "rainy": 'url("/src/images/weather/darksky.jpg")',
            "Clouds": 'url("/src/images/weather/cloudy3.jpg")',
            "snow": 'url("/src/images/weather/snow.jpg")',
        },
    }

    const requests = {
        weather: {
            lat: null,
            lon: null,
            exclude: "hourly, daily",
            appid: data.key,
            units: "metric",
            lang: "kr",
        },

        past: {
            lat: null,
            lon: null,
            dt: null,
            appid: data.key,
            units: "metric",
            lang: "kr",
        }
    }

    const requestCurrentPosition = () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        
        function success(position) {
            const coords = position.coords;
          
            data.position = {
                lat: coords.latitude,
                lon: coords.longitude,
            }

            mapapi();
            requestWeather();
            requestPastWeather();
        };
        
        function error(err) {
            console.error('ERROR(' + err.code + '): ' + err.message);
        };
        
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    const mapapi = () => {
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        const mapOption = {
            // center: new kakao.maps.LatLng(36.532987599245075, 127.2553285580849), //지도의 중심좌표.
            center: new kakao.maps.LatLng(data.position.lat, data.position.lon), //지도의 중심좌표.
            level: 13 //지도의 레벨(확대, 축소 정도)
        };  

        // 지도를 생성합니다    
        const map = new kakao.maps.Map(mapContainer, mapOption); 

        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        function searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
        }
        console.log("sss", map.getCenter())
        searchAddrFromCoords(mapOption.center, displayCenterInfo);

        // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
        function displayCenterInfo(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                let location = result[1].address_name;
                $("#location").html(location);
            }     
        }
    }

    const requestWeather = async () => { 
        try { 
            const parameter = Object.assign(requests.weather, {
                lat: data.position.lat,
                lon: data.position.lon
            });

            console.log("requestWeather", parameter)

            const response = await requestApi({
                type: "get",
                url: "https://api.openweathermap.org/data/2.5/onecall",
                data: parameter
            })

            if (response) {
                drawResult(response);
            }            
        }

        catch {
            console.error("requestWeather has exception...")
        }
    }

    const requestPastWeather = async () => { 
        try { 
            const parameter = Object.assign(requests.past, {
                lat: data.position.lat,
                lon: data.position.lon,
                dt: moment().subtract(1, 'days').format("X"),
                // dt: new Date().getTime()
            });

            console.log("requestPastWeather", parameter)

            const response = await requestApi({
                type: "get",
                url: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
                data: parameter
            })

            console.log("response", response);

            if (response) {
                // drawResult(response, true);
                $("#pastTemp").html(response.current.temp)
                $("#pastTempFeelsLike").html(response.current.feels_like)
            }
        }

        catch {
            console.error("requestPastWeather has exception...")
        }
    }

    const drawResult = (response) => {
        $(".fb__loading").hide();
        $(".fb__loading__after").show();       
        
        const $description = $("#description");
        const $currentTemp = $("#currentTemp");
        const $weatherIcon = $("#js__weather__icon");

        const _current = response.current;
        
        if (_current) {
            const _backgrond = _current.weather[0].main; 
            console.log(data.weatherBackground[_backgrond])
            $(".fb__weather").css({
                "background-color": data.weatherBackground[_backgrond],
                // "background-image": data.weatherBackgroundImage[_backgrond],
            })
            $description.html(_current.weather[0].description);
            $currentTemp.html(_current.temp);
            $weatherIcon.attr("src", `http://openweathermap.org/img/wn/${_current.weather[0].icon}@2x.png`);
        }
    }
    
    const init = () => {
        requestCurrentPosition();
    }

    init();
}

export default weather;