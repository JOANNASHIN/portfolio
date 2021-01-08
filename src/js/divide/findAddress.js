const findAddress = () => {
    const $document = $(document);
    const http = new XMLHttpRequest();
    const inputBox = $("#searchInput");
    const $autocomplete = $(".js__autocomplete");

    const data = {
        Key: "JZ76-FC56-BN78-UF48",
    }

    const requests = {
        autocomplete: {
            url: "https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws",
            parameter: {
                Key: data.Key,
                Text: null,
                IsMiddleware: false,
                Container: null,
                Origin: null,
                Countries: "KR",
                Limit: 10,
                Language: "EN",
            },
        },
        addressDetail: {
            url: "https://services.postcodeanywhere.co.uk/Capture/Interactive/Retrieve/v1.00/json3.ws",
            parameter: {
                Key: data.Key,
                Id: null,
                Field1Format: "",
            },
        },
    }

    const makeParameters = (parameter) => {
        let params = '';

        for(let [key, value] of Object.entries(parameter)){
            params += `&${key}=${value}`;
        }
      
        return params;
    }

    const requestAutoComplete = (secondFind) => {
        const request = requests.autocomplete;
        const url = request.url;
        
        if (secondFind !== undefined){
            request.parameter.Container = secondFind;
        } 

        const parameter = makeParameters(request.parameter);

        $autocomplete.empty();

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                const response = JSON.parse(http.responseText);
                const items = response.Items;

                if (items.length == 1 && typeof(items[0].Error) != "undefined") {
                    drawResult("error");
                    console.error("requestAutoComplete has exception");
                    return ;
                }

                if (!items.length) {
                    drawResult();
                    return ;
                }

                for (let i = 0; i < items.length; i++){
                    let eachItem = items[i];
                    $autocomplete.append(`<li class="js__address__option" data-id="${eachItem.Id}" data-type="${eachItem.Type}">${eachItem.Text} ${eachItem.Description}</li>`);
                }

                $autocomplete.addClass("show");
            }
        }

        http.send(parameter);
    }

    const requestAddressDetail = (id) => {
        const request = requests.addressDetail;
        const url = request.url;

        request.parameter.Id = id;

        const parameter = makeParameters(request.parameter);

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                const response = JSON.parse(http.responseText);
        
                if (response.Items.length == 1 && typeof(response.Items[0].Error) != "undefined") {
                    drawResult("error");
                    console.error("requestAddressDetail has exception");
                }
                else {
                    drawResult(response.Items[0]);
                    inputBox.val("");
                }
            }
        }

        http.send(parameter); 
    }

    const drawResult = (result) => {
        let _html = null;

        $autocomplete.empty();
        $autocomplete.removeClass("show");
        
        if (!result) {
            _html = "매칭하는 주소가 없습니다."
        } 
        else if (result === "error") {
            _html = "오류가 발생하였습니다. 잠시 후 다시 시도해주세요."
        }
        else {
            _html = `
                <label>
                    <span>City</span>
                    <input type="text" value="${result.City}">
                </label>
                <label>
                    <span>State</span>
                    <input type="text" value="${result.Province}">
                </label>
                <label>
                    <span>Address1</span>
                    <input type="text" value="${result.Line1} ${result.Line2} ${result.Line3} ${result.Line4} ${result.Line5}">
                </label>
                <label>
                    <span>Address2</span>
                    <input type="text" placeholder="상세주소를 입력해주세요.">
                </label>
                <label>
                    <span>Zipcode</span>
                    <input type="text" value="${result.PostalCode}">
                </label>
            `
        }

        $("#result").html(_html);
    }

    const addEvents = () => {
        $document
            .on("change", "#country", function() { //나라변경
                requests.autocomplete.parameter.Countries = $(this).val();
            })
            .on("input", "#searchInput", function() { //주소입력
                requests.autocomplete.parameter.Text = $(this).val();
                requestAutoComplete();
            })
            .on("click", "#requestFind", function() { //검색버튼
                requestAutoComplete();
            })
            .on("click", ".js__address__option", function(e) { //자동입력박스에서 주소 선택
                const $select = $(this);
                const test = e.target;
                const _selectValue = $select.html();
                const _selectData = test.dataset;

                if (_selectValue == "Select Address") {
                    return ;
                }
        
                if (_selectData.type == "Address") {
                    requestAddressDetail(_selectData.id);
                }
                else {
                    requestAutoComplete(_selectData.id);
                }
            })
    }

    const init = () => {
        addEvents();
    }

    init();
}

export default findAddress;
