/**
 * Sets and manages user cookie. This associates submission 
 * with a distinct user so that stats can be talleyed per player.
 *
 * Uses pseudo random string for user identification.
 */
$( document ).ready(function() {

  if( $.cookie('ttt-rr') == undefined ){

    var uid = Math.round(new Date().getTime() + (Math.random() * 100)) + Math.random().toString(36).substring(7);
    $.cookie('ttt-rr', uid, { expires: 365 });

  }

});
