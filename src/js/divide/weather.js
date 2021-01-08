const weather = () => { 

    const data = {
        key: "af134da678fac6615bd7aabed303b791",
        url: "https://api.openweathermap.org/data/2.5/onecall",
    }

    const requests = {
        weather: {
            lat: null,
            lon: null,
            exclude: "hourly, daily",
            appid: data.key
        },

        past: {
            dt: null,
        }
    }

    const test = () => {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          
          function success(pos) {
            var crd = pos.coords;
            mapapi({"lat": crd.latitude, "lon": crd.longitude})
            // console.log('Your current position is:');
            // console.log('Latitude : ' + crd.latitude);
            // console.log('Longitude: ' + crd.longitude);
            // console.log('More or less ' + crd.accuracy + ' meters.');
          };
          
          function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
          };
          
          navigator.geolocation.getCurrentPosition(success, error, options);
    }

    const mapapi = (pos) => {
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        const mapOption = {
            // center: new kakao.maps.LatLng(36.532987599245075, 127.2553285580849), //지도의 중심좌표.
            center: new kakao.maps.LatLng(pos.lat, pos.lon), //지도의 중심좌표.
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
                var infoDiv = document.getElementById('centerAddr');

                for(var i = 0; i < result.length; i++) {
                    // 행정동의 region_type 값은 'H' 이므로
                    if (result[i].region_type === 'H') {
                        infoDiv.innerHTML = result[i].address_name;
                        break;
                    }
                }
            }    
        }
    }

    const requestWeather = async () => { 
        try { 
            const parameter = Object.assign(requests.weather, {
                lat: "33.441792",
                lon: "94.037689"
            });

            const response = await requestApi({
                type: "get",
                url: data.url,
                data: parameter
            }) 

            console.log("response", response);
        }

        catch {
            console.error("requestWeather has exception...")
        }
    }
    
    const init = () => {
        requestWeather();
        test();
        // mapapi();
    }

    init();
}

export default weather;