const common = () => {
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

    const init = () => {
        window.requestApi = requestApi;
    }

    init();
}

export default common;