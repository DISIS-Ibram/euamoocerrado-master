export default function(url) {
    if(!url) return ''
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    var videoid = (match&&match[7].length==11)? match[7] : false;
    // if(videoid)
    return "https://www.youtube.com/embed/"+videoid

}
