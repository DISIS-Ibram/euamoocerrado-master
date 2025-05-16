
export default function(url, param = {}, cb = o => false, options = {}) {

    var supportsLocalStorage = 'localStorage' in window;

    // Both functions return a promise, so no matter which function 
    // gets called inside getCache, you get the same API. 

    let ajaxOptions;
    let dataType;
    let contentType = "application/json; charset=utf-8";

    if(param instanceof FormData){
         ajaxOptions = {
            enctype: 'multipart/form-data',
            data: param,
            processData: false, // impedir que o jQuery tranforma a "data" em querystring
            contentType: false, // desabilitar o cabeçalho "Content-Type"
            cache: false, // desabilitar o "cache"
            timeout: 10*60*1000, // definir um tempo limite (opcional)
         }

    }else{
        ajaxOptions = {
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
         }
    } 

    function postJSON(url) {
        var promise = $.ajax({
            url : url,
            type: "POST",
            ...ajaxOptions,
            beforeSend: function (xhr) {
                var token = window.localStorage.token;
                if(token)
                    xhr.setRequestHeader("Authorization", 'Token '+token);
            },
            ...options
           
        });

        promise.done(function(data) {
            cb(data)
        });

        return promise;
    }

    return postJSON(url);

}