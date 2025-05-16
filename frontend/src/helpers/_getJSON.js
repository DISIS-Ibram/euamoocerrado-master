
export default function(url, param = {}, cb = o => false, options = {}) {

    var supportsLocalStorage = 'localStorage' in window;

    // Both functions return a promise, so no matter which function 
    // gets called inside getCache, you get the same API. 

    var hash = url + JSON.stringify(param)

    function getJSON(url) {
       

        var promise =  $.ajax({
            url : url,
            type: "GET",
            data: JSON.stringify(param),
            dataType:  "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
               
                var token = window.localStorage.token;
                if(token)
                    xhr.setRequestHeader("Authorization", 'Token '+token);
            },
            ...options
            // success: (data)=>{
            //     console.log(data);
            // }
        });

        promise.done(function(data) {
            cb(data)
        });

        return promise;
    }

    return getJSON(url);

}