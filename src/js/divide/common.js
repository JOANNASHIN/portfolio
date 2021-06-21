const common = () => {
    const $document = $(document);
    const $body = $("body");

    //공통 비동기 통신
    const requestApi = (object) => {
        if (!object.url) return ;
        
        return new Promise((resolve, reject) => {
            try {
                $.ajax({
                    type: object.type ? object.type : "POST",
                    url: object.url,
                    data: object.data ? object.data : "",
                    success (result) {
                        resolve(result);
                    },
        
                    error(error) {
                        reject(error)
                    }
                });
            }
        
            catch(error) {
                reject(error)
            }
        })
    }

    /**
    * 레이어 js__layer
    * 열기버튼 js__layer__open
    * 닫기버튼 js__layer__close
    */
    const fn_layer = () => {
        /**
        * 레이어 열기
        *   1. 동작이 일어나는 버튼에 js__layer__open 클래스 추가
        *   2. 동작이 일어나는 버튼에 data-layer="레이어 아이디값" 속성 추가
        */
        $document.on("click", ".js__layer__open", function () {
            const _layer = $(this).data("layer");
            const $layer = $("#" + _layer);

            console.log($layer);

            layer_show($layer, true);
        });

        /**
        * 레이어 닫기
        *   1. 닫기버튼에 js__layer__close 클래스 추가
        *   2. 해당 레이어 최상위에 js__layer 클래스 추가
        */
        $document.on("click", ".js__layer__close", function () {
            const _this = $(this);
            const $layer = _this.closest(".js__layer");
            layer_show($layer, false);
        });
    };

   /**
    * 레이어 열고 닫기
    * @param {element} $layer - 레이어 선택자(필수)
    * @param {boolean} Boolean - open(true) / close(false)
    */
   const layer_show = ($layer, Boolean, callback) => {
       if (!$layer) return ;

       if (Boolean) {
           $layer.addClass("show");
           $body.addClass("scroll--lock");
       }
       else{
           $layer.removeClass("show");
           $body.removeClass("scroll--lock");
       }

       if (callback) callback();
   };

    //input 버튼 관련 함수
    const inputCommonEvents = () => {

    const getTargetElement = ($this) => {
        return {
            $input: $this.closest(".js__input__wrapper").find(".js__input"),
            $clear: $this.closest(".js__input__wrapper").find(".js__input__clear"),
            _valueLength: $this.val().length
        }
    }

    const keyupEvent = () => {
        $document.on("keyup", ".js__input", function() {
            const {$clear, _valueLength} = getTargetElement($(this));

            if (!$clear.length) return ;
            
            if (_valueLength) $clear.addClass("show");
            else $clear.removeClass("show");

            return false;
        })
    }

    const focusBlurEvent = function () {
        $document
            .on("focus", ".js__input", function() {
                const {$clear, _valueLength} = getTargetElement($(this));
                
                if (!$clear.length) return ;
                
                if (_valueLength) $clear.addClass("show");
                else $clear.removeClass("show");

                return false;
            })

            .on("blur", ".js__input", function() {
                const {$clear} = getTargetElement($(this));

                $clear.removeClass("show");
                return false;
            });
    }

    const clearEvent = () => {
        $document.on("click", ".js__input__clear", function (e) {
            e.stopPropagation();

            const {$input, $clear} = getTargetElement($(this));

            if (!$input.length || !$clear.length) return ;

            $input.val("");
            $clear.removeClass("show");

            return false;
        })
    }

    const bindEvents = function () {
        keyupEvent();
        focusBlurEvent();
        clearEvent();
    }

    bindEvents();
}

    const init = () => {
        window.requestApi = requestApi;
        window.layer_show = layer_show;
        fn_layer();
        inputCommonEvents();
    }

    init();
}

export default common;