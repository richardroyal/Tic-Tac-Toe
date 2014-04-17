$( document ).ready(function() {

  if( $.cookie('ttt-rr') == undefined ){

    var uid = Math.round(new Date().getTime() + (Math.random() * 100)) + Math.random().toString(36).substring(7);
    $.cookie('ttt-rr', uid, { expires: 365 });

  }

});
