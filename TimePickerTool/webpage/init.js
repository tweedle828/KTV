$(document).ready(function() {
    window.addEventListener("keydown", function(e) {
        if (e.keyCode == 32 && e.target == document.body) {
            toggleAudioPlayer(); // space bar to toggle audio player
            e.preventDefault(); // and prevent scrolling
        }
    });

    window.addEventListener("keydown", function(e) {
        if (e.keyCode == 8 && e.target == document.body) { //backspace
            $("#" + lineNum).removeClass("lead font-weight-bold")
            var time = secondsToTimestamp(Math.round10($("#audioPlayer").prop("currentTime"), -2));
            console.log(time);
            lineTimes[lineNum - 1] = time;
            $('#' + lineNum + 'timestamp').text(time);
            lineNum++;
            if (lyrics[lineNum - 1].length == 1) {
            	lineTimes[lineNum-1] = 0;
                lineNum++;
            }
            $("#" + lineNum).addClass("lead font-weight-bold")
            e.preventDefault(); // and prevent backspace default
        }
    });

    // $("#audioPlayer").on('timeupdate', function(){
    // 	if(english.test(charLyrics[index])){
    // 		charTimes[index] = 0;
    // 		index++;
    // 		console.log("deteched english , updated");
    // 	
	// 	if(staticTimes){
    // 		if((this.currentTime >= (staticTimes[playbackIndex]-0.6)) || staticTimes[playbackIndex]==0){
    // 			$("#" + (playbackIndex-1)).removeAttr( 'style' );
    // 			$("#" + playbackIndex).css("color", "blue")
    // 			// console.log(this.currentTime + ">=" + (staticTimes[playbackIndex]-0.4)+ " aka char#" + playbackIndex)
    // 			playbackIndex++;
    // 		}

    // 	}
    // });
    $.get('/song', { 'id': '1' }, function(data) {
        lyrics = data["cn.txt"];
        for (var index in lyrics) {
            var realLineNum = parseInt(index) + 1
            var line = $("<div/>", { class: "line row" })
            var lineNumber = $('<div/>', { class: "lineNumber col-3" }).text(realLineNum)
            line.append(lineNumber)

            if (lyrics[index].length > 1) {
                var lineText = $('<div/>', { id: realLineNum, class: "lineText col-7" }).text(lyrics[index]);
                line.append(lineText)
            }
            var timestamp = $('<div/>', { id: realLineNum + 'timestamp', class: "timestamp col-2" })
            line.append(timestamp)
            $("#lyrics").append(line);
        }

        $("#1").addClass("lead font-weight-bold")

    })

    $("#print").click(function(){
    	$("#timesOutput").html(nl2br(prettyPrint()).replace(/:/g,""))
    })

});
var lyrics;
var lineTimes = [];
var index = 0;
var lineNum = 1;

var english = /^[A-Za-z0-9 \n]*$/;
var newline = /\n/;

// var playbackIndex = 0;
// var staticTimes = []
var audioPlayerID = "audioPlayer"

//toggle play/pause on the audio player
function toggleAudioPlayer() {
    $("#" + audioPlayerID).prop("paused") ? $("#" + audioPlayerID).trigger("play") : $("#" + audioPlayerID).trigger("pause");
}

function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

function prettyPrint() {
    var string = "";
    for (var index in lineTimes) {
    	if(lineTimes[index].length == 1)
    		string = string + '\n'
    	else	
        	string = string + lineTimes[index] + '\n'
    }
    return string;
}

function timestampToSeconds(timestamp) {
    return Math.floor(timestamp / 100) * 60 + timestamp % 100;
}

function secondsToTimestamp(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;
    if (seconds < 10)
        seconds = "0" + seconds;
    //used for tooltip
    var time = minutes + ":" + seconds;
    return time;
}


// Closure
(function() {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // If the value is negative...
        if (value < 0) {
            return -decimalAdjust(type, -value, exp);
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }

})();