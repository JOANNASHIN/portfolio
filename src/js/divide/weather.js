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
            "Clear": 'url("/src/images/weather/sunny1.jpg")',
            "Rain": 'url("/src/images/weather/darksky.jpg")',
            "Haze": 'url("/src/images/weather/darksky.jpg")',
            "Mist": 'url(/src/images/weather/darksky.jpg)',
            "Rain": 'url("/src/images/weather/darksky.jpg")',
            "Clouds": 'url("/src/images/weather/cloudy3.jpg")',
            "Snow": 'url("/src/images/weather/snow.jpg")',
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
    
    
    const test = () => {

        /*
        IE9부터 지원 하며 최신버전의 크롬 웹 브라우저는 보안을 위해 https 통신이 아닌 경우에 지오로케이션을 못하도록 막았다.
        따라서 현재 예제를 로컬에서 돌릴 때는 문제 없지만, 실제 서버에 올려 배포할때는 문제가 될 수 있다.
        */
        var locationInfo, watcherInfo, watcher;
        locationInfo = document.getElementById("locationInfo");
        watcherInfo = document.getElementById("watcherInfo");

        var cities = [
            ["명동점", 37.560545, 126.980841],
            ["강남점", 37.504428, 127.003048],
            ["부산점", 35.170080, 129.128333],
            ["인천공항점", 37.460836, 126.440682]
        ];

        function getLocation() {
            if (navigator.geolocation) { // GPS를 지원하면

                // 현재 위치 정보를 가져온다.
                // navigator.geolocation.getCurrentPosition(성공콜백, 에러콜백, 옵션);
                navigator.geolocation.getCurrentPosition(
                    function(position) {

                        locationInfo.innerHTML += '위도 = '+ position.coords.latitude +'<br>경도 = '+ position.coords.longitude +'<br>';
                        locationInfo.innerHTML += '표고 = '+ position.coords.alitude  +'<br>';
                        locationInfo.innerHTML += '표고의 오차 (미터 단위) = '+ position.coords.alitudeAccuracy +'<br>';
                        locationInfo.innerHTML += '위 경도의 오차 = '+ position.coords.accuracy +'<br>';
                        locationInfo.innerHTML += '디바이스의 진행방향(시계방향) = '+ position.coords.heading  +'<br>';
                        locationInfo.innerHTML += '디바이스 진행속도 = '+ position.coords.speed  +'<br>';
                        locationInfo.innerHTML += '<hr>';
                    
                        var nearCity = nearestCity(position.coords.latitude, position.coords.longitude);
                    
                    },
                    function(error) {
                    
                        locationInfo.innerHTML += displayError(error) +'<br>';
                    
                    }, 
                    {
                        enableHighAccuracy: false,
                        maximumAge: 0,
                        timeout: Infinity
                    }
            );

            } else {
                locationInfo.innerHTML += "GPS를 지원하지 않습니다<br>";
            }
        }

        function displayError(error) {
            var errorTypes = {
                0: "알 수 없는 오류",
                1: "사용자가 권한 거부",
                2: "위치를 찾을 수 없음",
                3: "요청 응답 시간 초과"
            };
            var errorMessage = errorTypes[error.code];
            if (error.code == 0 || error.code == 2) {
                errorMessage = errorMessage + " " + error.message;
            }
            return errorMessage;
        }

        // 호도각(degress)각도에서 라디안(radians) 값으로 변환
        function degreesToRadians(degress) {
            radians = (degress * Math.PI)/180;
            return radians;
        }

        // 구면 코사인 법칙(Spherical Law of Cosine) 으로 두 위도/경도 지점의 거리를 구함
        function computeDistance(latitude1, longitude1, latitude2, longitude2) {

            var startLatRads = degreesToRadians(latitude1);
            var startLongRads = degreesToRadians(longitude1);
            var destLatRads = degreesToRadians(latitude2);
            var destLongRads = degreesToRadians(longitude2);

            var Radius = 6371; //지구의 반경(km)
            var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
                        Math.cos(startLatRads) * Math.cos(destLatRads) *
                        Math.cos(startLongRads - destLongRads)) * Radius;

            return distance;	// 반환 거리 단위 (km)
        }

        // 가까운 도시
        function nearestCity(latitude, longitude) {

            var mindif = 99999;
            var closest = 0;

            for (index = 0; index < cities.length; ++index) {

                // 사용자의 위치와 지점 사이의 거리를 얻습니다.
                var distance = computeDistance(latitude, longitude, cities[index][1], cities[index][2]);

                locationInfo.innerHTML += '현재 위치부터 '+  cities[index][0] +'까지 : 약 '+ Math.round(distance) +' km <br>';

                // 가장 짧은 거리값
                if (distance < mindif) {
                    closest = index;
                    mindif = distance;		// 가장 가까운 거리
                }
                }

                locationInfo.innerHTML +='<hr> 가까운 지점은 '+ cities[closest][0] +'이며 '+ Math.round(mindif) +'km 거리에 있습니다.<br>';

                return cities[closest];
        }

        getLocation();


        //   위치 정보가 변경될 때마다 위치정보를 얻기 (watchPosition)
        var start = function () {
            if (navigator.geolocation) {

                watcher = navigator.geolocation.watchPosition(
                    function (position) {
                        watcherInfo.innerHTML = '<br>위도 = '+ position.coords.latitude +'<br>경도 = '+ position.coords.longitude +'<br>';
                        watcherInfo.innerHTML += '표고 = '+ position.coords.alitude  +'<br>';
                        watcherInfo.innerHTML += '표고의 오차 (미터 단위) = '+ position.coords.alitudeAccuracy +'<br>';
                        watcherInfo.innerHTML += '위 경도의 오차 = '+ position.coords.accuracy +'<br>';
                        watcherInfo.innerHTML += '디바이스의 진행방향(시계방향) = '+ position.coords.heading  +'<br>';
                        watcherInfo.innerHTML += '디바이스 진행속도 = '+ position.coords.speed  +'<br>';
                    },
                    function(error) {
                        watcherInfo.innerHTML = '<br>'+ displayError(error);
                    },
                    { 
                    timeout: 2000, 
                    maximumAge: 3000 
                    }
                );
            }
        };

        // 위치정보 받기 중지 (clearWatch)
        var stop = function () {
            navigator.geolocation.clearWatch(watcher);
        };

        /*
        [getCurrentPosition 옵션]
                    enableHighAccuracy: 배터리를 더 소모해서 더 정확한 위치를 찾음
                기본 값이 false. 앱이 위치 정보를 최대한 정확하게 수신하고자할 때 true로 설정하면 된다. 
                하지만 이러한 경우 응답 속도가 늦어지거나 기기의 전원 소모를 가중 시킬 수도 있게 된다. 
                사용자가 이러한 경우 높은 정확도를 수집하기 위한 권한 일부를 거절하는 것이 가능하기도 하고, 
                기기 자체에서 지원이 안 될수도 있다. 이 인자의 주된 목적은 배터리로 동작하는 모바일 장비들의 
                전원 소모를 줄이기 위하여 굳이 '아주' 정확한 위치 정보가 필요하지 않다고 표기할 때 사용된다.

                    maximumAge : 한 번 찾은 위치 정보를 해당 초만큼 캐싱
                기본 값이 0. 기존에 수집했던 위치 정보를 얼마나 보관하여 캐쉬로 사용할지 결정하는 값이다. 
                값이 0으로 설정되었다면, 캐쉬를 사용하지 않고 매번 요청이 있을때마다 위치 정보의 갱신을 요청하게 되고, 
                Infinity로 설정하게 되면 한번만 위치 정보를 수집하고 이후 계속 같은 값을 재활용하게 된다. 	
                watchPosition() 함수의 경우에는 가장 처음 위치 정보를 수집한 시점을 시작으로 시간을 계산하고 시간단위는 밀리초이다. 
                위치 정보가 굳이 아주 정확할 필요가 없다면 이 값도 적당하게 조절하여 모바일 장비에 대한 전원 소모를 배려해줄 수 있다.

                    timeout: 주어진 초 안에 찾지 못하면 에러 발생
                기본 값이 0xFFFFFFFF(Infinity). getCurrentPosition() 함수나 watchPosition() 함수가 
                콜백함수를 정상적으로 호출하기 전에 최대 허용 시간을 명시한다. 
                정상적인 위치 정보를 수집할 수 없는 경우에는 에러콜백 함수가 호출되고, 
                에러 종류는 TIMEOUT으로 설정된다. 
                참고로 사용자가 위치 정보를 수집하기 위하여 권한 요청을 하는 시간은 제외 된다. 
                getCurrentPosition()의 경우에는 타임아웃으로 인한 에러콜백 호출이 단 한번만 이루어진다면, 
                watchPosition() 함수는 매번 위치 정보에 대한 갱신 요청이 있을 때마다 
                타임아웃으로 인한 에러콜백 함수 호출이 일어나게 된다. 시간 단위는 밀리초 단위이다.

        [에러]
                error.code : 1, error.message : Only secure origins are allowed (https 가 아니면 에러 발생)
                error.code : 1, error.message : User denied Geolocation
                error.code : 2, error.message : Origin does not have permission to use Geolocation service
        */
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

            alert("위치" + coords.latitude);

            mapapi();
            requestWeather();
            requestPastWeather();
        };
        
        function error(err) {
            alert(err.message)
            console.error('ERROR(' + err.code + '): ' + err.message);
        };


        alert("geolocation" in navigator);
        if ( "geolocation" in navigator ) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        } 
        else {
            alert("위치를 허용해주세요.");
        }
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
        const $weatherBg = $("#backgroundImg");

        const _current = response.current;
        
        if (_current) {
            const _backgrond = _current.weather[0].main; 
            console.log("_backgrofnd", data.weatherBackgroundImage[_backgrond])

            $(".fb__weather").css({
                "background-color": data.weatherBackground[_backgrond],
                "background-image": data.weatherBackgroundImage[_backgrond],
            })

            // $weatherBg.attr("src", data.weatherBackgroundImage[_backgrond])

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