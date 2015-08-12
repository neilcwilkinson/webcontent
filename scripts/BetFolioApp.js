// var ws = new WebSocket("ws://104.197.95.193:8080/rates");
var mobile_device = false;
var window_focus = true;
var connection_count = 0;

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function BetFolioApp() {
    if(isMobile.any()) {
        mobile_device = true;
        //alert("This is a Mobile Device");
    } else {
        mobile_device = false;
        //alert("This is NOT a Mobile Device");
    }

    if ("WebSocket" in window) {
       //alert("WebSocket is supported by your Browser!");
    }

    $('#user-agent').text(navigator.userAgent);
    
    $(window).focus(function() {
        window_focus = true;
        $("#rate-count").text('Got Focus');
    })
    .blur(function() {
        window_focus = false;
        $("#rate-count").text('Lost Focus');
    });

     $("#slip").click(function(){
        $('#popupBettingSlip').popup({ positionTo: 'origin' }).popup('open');
    });

   $('a[href="#firstpage"]').click(function(){
        $.get("page1.html", function( content ) {
            $('#selectedTarget').html(content).enhanceWithin();
        });
    }); 
    $('a[href="#secondpage"]').click(function(){
        $.get("page2.html", function( content ) {
            $('#selectedTarget').html(content).enhanceWithin();
        });
    }); 
    $('a[href="#thirdpage"]').click(function(){
        $.get("page3.html", function( content ) {
            $('#selectedTarget').html(content).enhanceWithin();
        });
    });
    $("#slip").addClass("rounded-corners"); 
    BetFolioApp.prototype.connect();
}

BetFolioApp.prototype.connect = function () {

    var ws = new WebSocket("ws://localhost:8080/rates");
    ws.onopen = function(e) {
        connection_count += 1;
        $("#connection-status").text("Connected");
        $("#connection-count").text(connection_count);
    };
    ws.onclose = function(){
        $("#connection-status").text("Disconnected");
        //try to reconnect in 5 seconds
        setTimeout(function(){
            if ((mobile_device == false) || (window_focus == true && mobile_device == true)) {            
                BetFolioApp.prototype.connect();
            } 
        }, 5000);
    };
    ws.onmessage = function(e) {
        rateCount += 1;
        //"#latest-rate").text(event.data);
        if ((mobile_device == false) || (window_focus == true && mobile_device == true)) {            
            $("#rate-count").text(rateCount);
        } 
    };

    // var ws = new WebSocket("ws://104.197.95.193:8080/rates");
    // ws.onopen = function(e) {
    //     $("#latest-rate").text("Connected");
    // };
    // ws.onclose = function(e) {
    //     $("#latest-rate").text("Disconnected");
    // };
    // ws.onmessage = function(e) {
    //     rateCount += 1;
    //     //"#latest-rate").text(event.data);
    //     if ((mobile_device == false) || (window_focus == true && mobile_device == true)) {            
    //         $("#rate-count").text(rateCount);
    //     } 
    // };

    // var $ul = $('#msg-list');
    // $('#sendBtn').click(function(){
    //   var data = $('#name').val();
    //   ws.send(data);
    //   console.log("送信メッセージ:" + data);
    //   $('<li>').text(data).appendTo($ul);
    // });
}

BetFolioApp.prototype.loadSport = function(sport) {
    //alert(pagename)
    if (sport == 'Baseball') {
        $.get("page3.html", function( content ) {
                $('#selectedTarget').html(content).enhanceWithin();
        });
    } 
    else 
    {
        $.get("tbd.html", function( content ) {
                $('#selectedTarget').html(content).enhanceWithin();
        });
    }
    $('#outside').panel("close");
}

BetFolioApp.prototype.loadContent = function(content) {
    var pagename = content + ".html"
    $.get(pagename, function( content ) {
            $('#selectedTarget').html(content).enhanceWithin();
    });
    $('#inside-a').panel("close");
}