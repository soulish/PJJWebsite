var idtag = 0;
var randomized = true;
var playNextURL = null;

Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] === needle) return true;
   }
   return false;
};

if (!String.prototype.includes) {
    String.prototype.includes = function() {'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

Array.prototype.equals = function (array) {
    // if the other array is a false value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

var Track = Backbone.Model.extend({});
var TrackList = Backbone.Collection.extend({
    model: Track,
    status: {},
    modelID: function(attrs){
        return attrs.id;
    },
    checkWithFilter: function (array) {
        var _thisCollection = this;
        this.status = {done: false};
        idtag = 0;
        mainTrackList.models.map(function(track) {
            var thisDuration;
            var trackDuration = parseInt(track.attributes.duration.split(":")[0]);
            if (trackDuration < 5){thisDuration = "0-5 mins";}
            else if ((trackDuration >= 5) && (trackDuration < 10)){thisDuration = "5-10 mins"; }
            else if ((trackDuration >= 10) && (trackDuration < 15)){thisDuration = "10-15 mins"; }
            else if ((trackDuration >= 15) && (trackDuration < 20)){thisDuration = "15-20 mins"; }
            else if (trackDuration >= 20){thisDuration = "20+ mins"; }
            if (array[2].length == 53) {
                if ((array[0].contains(track.attributes.year)) && (array[1].contains(track.attributes.tour)) &&
                    (array[3].contains(thisDuration) &&
                    (array[4].contains(track.attributes.city) || array[4].contains("All " + track.attributes.state + " Cities") ||
                    array[4].contains("All " + track.attributes.country + " Cities")))) {
                    var temp = track;
                    temp.attributes.id = idtag;
                    _thisCollection.add(temp);
                    idtag += 1;
                }
            }
            else{
                if ((array[0].contains(track.attributes.year)) && (array[1].contains(track.attributes.tour)) &&
                    (array[2].contains(track.attributes.title)) && (array[3].contains(thisDuration))  &&
                    (array[4].contains(track.attributes.city) || array[4].contains("All " + track.attributes.state + " Cities") ||
                    array[4].contains("All " + track.attributes.country + " Cities"))) {
                    var temp = track;
                    temp.attributes.id = idtag;
                    _thisCollection.add(temp);
                    idtag += 1;
                }
            }
        });
        this.status = {done: true, numTracks: idtag};
    },
    check: function () {
        var _thisCollection = this;
        this.status = $.getJSON("files/sorted_tracks_min.json", function (data) {
            $.each(data, function(key) {
                var ex = typeof data[key].extras === 'undefined' ? "" : data[key].extras;
                var cc = typeof data[key].country === 'undefined' ? "USA" : data[key].country;
                var track = new Track ( {
                    "title": data[key].title,
                    "date": data[key].date,
                    "weekday": data[key].weekday,
                    "country": cc,
                    "state": data[key].state,
                    "city": data[key].city,
                    "venue": data[key].venue,
                    "url": data[key].url,
                    "band": data[key].band,
                    "year": data[key].year,
                    "tour": data[key].tour,
                    "extras": ex,
                    "duration": data[key].duration,
                    "id": idtag
                } );
                if (!_thisCollection.get(data[key].id)) {
                    _thisCollection.add(track);
                    idtag += 1;
                }
            });
        });
    },
    initialize: function(){
        //this.check();
    }
});

var mainTrackList = new TrackList();
mainTrackList.check();
currentTrackList = new TrackList();

var AboutArea = React.createClass({displayName: "AboutArea",
    dismiss: function(){
        ga('send', 'event', 'About Section', 'Dismiss');
        React.unmountComponentAtNode(document.getElementById('mainAreaAbout'));
        localStorage.dismissed = 1;
        window.scrollTo(0, 74 * Math.floor(Math.random() * idtag) - 286);
    },
    render: function(){
        var orig_ref = "http://www.phishjustjams.com/";
        var string = "@phishjustjams";
        var final_string = "https://twitter.com/intent/tweet?original_referer="+encodeURI(orig_ref)+"&hashtags=phishjustjams&text="+encodeURI(string)+"&tw_p=tweetbutton";
        var follow_string = "https://twitter.com/intent/follow?original_referer="+encodeURI(orig_ref)+"&region=follow_link&screen_name=phishjustjams&tw_p=followbutton";
        return(
            React.createElement("div", {className: "AboutArea", id: "AboutArea"}, 
                React.createElement("h1", {className: "aboutAreaH1"}, "About:"), 
                React.createElement("p", {className: "aboutAreaP", id: "aboutAreaP1"}, 
                    "The PhishJustJams website presents the music of Phish with the lyrics and" + ' ' +
                    "composed sections removed, so you can get just to the jams.  I find it distracting" + ' ' +
                    "to hear lyrics when I am working or reading, so I would often listen to a compilation" + ' ' +
                    "that someone (\"dug\") put together back in 1998 of Phish jams from the Fall of '97.  After years" + ' ' +
                    "of listening to this compilation I decided to do the same thing for Phish in 3.0.  After" + ' ' +
                    "I finished that project I went back and attacked the years from 1993-2003.  While I was working" + ' ' +
                    "on those older tracks my brother took over cutting up the tracks from their current" + ' ' +
                    "tours."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "Each track attempts to preserve as much of the jam as possible without including lyrics" + ' ' +
                    "where reasonable.  Some tracks are easy, like Diseases or Tweezers or Rebas, while others" + ' ' +
                    "have some singing over part of the jam, like Stash.  Then there are some tracks like the '99 Holmdel" + ' ' +
                    "Split that starts as a jam, goes into Kung, and then explodes into a huge jam; it is best" + ' ' +
                    "to preserve that all as one track, so the Kung is included.  There are a few tracks such" + ' ' +
                    "as this, but in general the idea is to focus solely on the jams.  We tried to get as many" + ' ' +
                    "great jams as we could out of the shows, however early on in the process we tended to" + ' ' +
                    "skip certain tracks with perfunctory jams, like a random 10-minute Bathtub Gin from" + ' ' +
                    "2012, unless they were especially interesting.  If you think there are any great jams" + ' ' +
                    "that we're missing, please let us know and we'll try to add it in."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "If you like the site and would like to be kept up to date about what is" + ' ' +
                    "going on with the website, whether we add in new Phish tracks, or" + ' ' +
                    "add tracks from one of their side projects or even another band altogether," + ' ' +
                    "please ", React.createElement("a", {href: follow_string}, "follow us"), " on Twitter."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "If you are interested in listening to the full tracks or full shows, I encourage you" + ' ' +
                    "to check out ", React.createElement("a", {target: "_blank", href: "http://www.phish.in/"}, "Phish.in"), " which hosts all of the shows" + ' ' +
                    "in their complete form.  This website is solely focused on the jams."
                ), 
                React.createElement("button", {style: {display: "block"}, className: "btn-phish", onClick: this.dismiss}, "Dismiss"), 
                React.createElement("h1", {className: "aboutAreaH1"}, "How to Use the Site:"), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "This website works pretty easily.  You can either scroll up to see the tracks, or" + ' ' +
                    "at hit the Dismiss button at the bottom of this section." + ' ' +
                    "Then just click on a track to get started.  Or get started with a random track" + ' ' +
                    "by hitting the play or next track buttons. By" + ' ' +
                    "default all of the 2044 tracks are in the initial playlist, and shuffle mode is turned on." + ' ' +
                    "Because of that, you will always start the page on a random track, and each" + ' ' +
                    "trip to the page should be like a new adventure."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "To refine the tracks that you want to listen to click on the \"Years\", \"Tours\", \"Songs\"," + ' ' +
                    "\"Durations\", or \"Locations\" buttons, which allow you to pare down your search.  Each has a button to" + ' ' +
                    "select all of the options in that category.  In" + ' ' +
                    "the Years filter there are 1.0, 2.0, and 3.0 headings which can be clicked to" + ' ' +
                    "select all years in those eras.  The list will be updated as soon as you close each menu" + ' ' +
                    "and you will also be taken to a random track that fits that criteria.  However, whatever" + ' ' +
                    "track you are currently listening to stay playing, so you can modify your preferences" + ' ' +
                    "without waiting until the track you're listening to has ended."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "You can use any combination of the filters that you wish, but there is a chance you" + ' ' +
                    "won't get any tracks that meet your criteria; for instance if you look only in 1997 and" + ' ' +
                    "select \"Light\" as the song, you won't get any available tracks, since they hadn't written it yet." + ' ' +
                    "If you wish to reset all of the options and go back to the full list, you can click on" + ' ' +
                    "the Reset All button.  Lastly, if you wish to listen in chronological order instead of" + ' ' +
                    "randomly, just click on the far right button on the top to alternate between listening" + ' ' +
                    "options."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "You may click on the \"Setlist\" button located on each track to be taken" + ' ' +
                    "to the phish.net setlist for the show the track belongs to.  And you can also" + ' ' +
                    "click \"Play Next\" to set that song up as the next song to be played.  You" + ' ' +
                    "can only choose the very next song, not multiple songs at this time."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "If you like the track you're listening to and would like to tweet out what" + ' ' +
                    "you are listening to, you can click on the Twitter bird in the Now Playing" + ' ' +
                    "area, which fills in the song you're listening to for you (it takes about 5 seconds to" + ' ' +
                    "update after the track changes).  You will have a chance" + ' ' +
                    "to review the tweet before actually sending it out."
                ), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "You may dismiss this section at any time by hitting the \"Dismiss\" button at" + ' ' +
                    "the bottom, and you'll be taken to a random spot in the playlist." + ' ' +
                    "You can always call it back by clicking on the \"About\" link at the top of the page."
                ), 
                React.createElement("button", {style: {display: "block"}, className: "btn-phish", onClick: this.dismiss}, "Dismiss"), 
                React.createElement("h1", {className: "aboutAreaH1"}, "Download:"), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "You can download individual tracks by right-clicking on them and choosing \"Save Link As\"," + ' ' +
                    "but if you are interested in downloading entire years or the entire collection, please" + ' ' +
                    "visit ", React.createElement("a", {target: "_blank", href: "http://verno329.postach.io/post/phish-just-jams/"}, "this site"), " where" + ' ' +
                    "you can easily download entire years at once."
                ), 
                React.createElement("h1", {className: "aboutAreaH1"}, "Contact:"), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "If you want to contact me about issues with the site, ideas for improvements, tracks that" + ' ' +
                    "you think I'm missing and should include, or any other reason, you can send me a tweet" + ' ' +
                    "by ", React.createElement("a", {href: final_string}, "clicking here"), ".  Please follow the website on" + ' ' +
                    "Twitter.  We are @phishjustjams.  You can follow us" + ' ' +
                    "by ", React.createElement("a", {href: follow_string}, "clicking here"), "."
                ), 
                React.createElement("h1", {className: "aboutAreaH1"}, "Legal:"), 
                React.createElement("p", {className: "aboutAreaP"}, 
                    "This site is in compliance with Phish's official taping policy as detailed" + ' ' +
                    "on ", React.createElement("a", {href: "http://phish.com/#/faq/taping-guidelines"}, "their website"), "."
                ), 
                React.createElement("button", {style: {display: "block"}, className: "btn-phish", onClick: this.dismiss}, "Dismiss")
            )
        );
    }
});

var NowPlayingArea = React.createClass({displayName: "NowPlayingArea",
    onPlayPauseClick: function(){
        if (pagePlayer.lastSound === null) {  //checks to see if anything has been played yet
            pagePlayer.playNext();//choose random track if nothing playing
            ga('send', 'event', 'UX', 'Start Random');
        }
        else{
            pagePlayer.myPlayPause();
            if (pagePlayer.lastSound._data.className == pagePlayer.css.sPlaying){
                $('#playPauseButton').attr("src", "img/pause.png");
            }
            else if (pagePlayer.lastSound._data.className == pagePlayer.css.sPaused){
                $('#playPauseButton').attr("src", "img/play.png");
            }

        }
    },
    onFwdClick: function(){
        if (pagePlayer.lastSound === null){  //checks to see if anything has been played yet
            pagePlayer.playNext();//play random track is nothing playing
            ga('send', 'event', 'UX', 'Start Random');
        }
        else {
            pagePlayer.playNext();
            ga('send', 'event', 'UX', 'Play Next');
        }
    },
    setTwitterText: function(){
        var orig_ref = "http://www.phishjustjams.com/";
        var string = "I'm listening to " + $('#npTitle')[0].innerHTML + " at phishjustjams.com";
        string = string.replace("&gt;",">");
        var final_string = "https://twitter.com/intent/tweet?original_referer="+encodeURI(orig_ref)+"&hashtags=phishjustjams,_IsMyJam&text="+encodeURI(string)+"&tw_p=tweetbutton";
        $('#twitterLink').attr("href",final_string);
    },
    componentDidMount: function(){
        this.setTwitterText();
        setInterval(this.setTwitterText, 5000);
    },
    render: function(){
        return(
            React.createElement("div", {className: "nowPlayingArea"}, 
                React.createElement("div", {className: "nowPlaying", id: "nowPlaying"}, 
                    React.createElement("div", {className: "npHeader"}, 
                        React.createElement("span", {className: "npHeaderTitle"}, "Now Playing:"), 
                        React.createElement("a", {id: "twitterLink", target: "_blank", href: "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.phishjustjams.com%2F&text=Listening%20to%20music%20at%20phishjustjams.com%20&tw_p=tweetbutton"}, 
                            React.createElement("img", {className: "twitterLogo", src: "img/Twitter_logo_blue.png"})
                        ), 
                        React.createElement("span", {className: "npHeaderInfo", id: "npHeaderInfo"}, this.props.myString)
                    ), 
                    React.createElement("span", {className: "npTitle", id: "npTitle"}, "Nothing Playing Yet"), 
                    React.createElement("br", null), 
                    React.createElement("span", {className: "npVenue"}, "Phish"), 
                    React.createElement("div", {className: "timing"}, 
                        React.createElement("div", {id: "sm2_timing", className: "timing-data"}, 
                            React.createElement("span", {className: "sm2_position"}, "330 hours"), " / ", React.createElement("span", {className: "sm2_total"}, "13+ days")
                        )
                    ), 
                    React.createElement("a", {href: "#"}, "."), 
                    React.createElement("div", {className: "icons-and-controls"}, 
                        React.createElement("div", {className: "icons"}, 
                            React.createElement("button", {className: "btn-controls"}, React.createElement("img", {className: "controlIcon", src: "img/rwd.png"})), 
                            React.createElement("button", {className: "btn-controls", onClick: this.onPlayPauseClick}, React.createElement("img", {id: "playPauseButton", className: "controlIcon", src: "img/play.png"})), 
                            React.createElement("button", {className: "btn-controls", onClick: this.onFwdClick}, React.createElement("img", {className: "controlIcon", src: "img/fwd.png"}))
                        ), 
                        React.createElement("div", {className: "controls-container"}, 
                            React.createElement("div", null, 
                                React.createElement("div", {className: "controls"}, 
                                    React.createElement("div", {className: "statusbar"}, 
                                        React.createElement("div", {className: "loading"}), 
                                        React.createElement("div", {className: "position"})
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    }
});

var TrackArea = React.createClass({displayName: "TrackArea",
    componentDidUpdate: function(prevProps,prevState){
        var _this = this;
        if ((this.props.myFirstTrack !== prevProps.myFirstTrack) && this.props.myFirstTrack !== null){
            var theAddress;
            if (isNaN(parseInt(_this.props.myFirstTrack))) {
                var yText = /\d\d/.exec(_this.props.myFirstTrack);
                var yNum = parseInt(yText);
                if (!isNaN(yNum)) {
                    yNum = yNum >= 50 ? yNum + 1900 : yNum + 2000;
                    theAddress = "mp3s/Phish/" + yNum + "/" + _this.props.myFirstTrack;
                }
            }
            else{
                theAddress = parseInt(_this.props.myFirstTrack);
            }
            if (pagePlayer !== null) {
                pagePlayer.playNext(theAddress);
            }
            else{
                setTimeout(function(){ pagePlayer.playNext(theAddress);}, 1000);
            }
        }
    },
    playNextClicked: function(test){
        playNextURL = test['target'].id.split("-")[1];
        ga('send', 'event', 'UX', 'Set Next Song',test['target'].id.split("-")[1]);
    },
    generate: function(){
        var _this = this;
        if (_this.props.myTrackList.length == 0){
            nameNodes = React.createElement("li", null, "Loading tracks, or no tracks meet your filters")
        }
        else{
            nameNodes = _this.props.myTrackList.models.map(function(track) {
                    var attr = track.attributes;
                    var extra = "";

                    if (attr.extras === ""){
                        extra = "";
                    }
                    else if (attr.extras.includes(">")){
                        extra = attr.extras;
                    }
                    else{
                        extra = "("+attr.extras+")";
                    }
                    var phishnet = "http://www.phish.net/setlists/?d="+attr.date;

                    return (
                        React.createElement("li", {key: attr.url, id: attr.url}, React.createElement("a", {href: attr.url, id: attr.id}, 
                            attr.title, " ", extra, " - ", attr.date, " ", attr.city, ", ", attr.state), 
                            React.createElement("span", {className: "spanAlbum"}, attr.venue), 
                            React.createElement("a", {className: "phishNetLink", href: phishnet, target: "_blank"}, " Setlist "), 
                            React.createElement("button", {id: "button-"+attr.url, className: "btn-playNext", onClick: _this.playNextClicked}, "Play Next"), 
                            React.createElement("span", {className: "spanDuration"}, attr.duration)
                        )
                    );
                }
            );
        }
        return nameNodes;
    },
    render: function(){
        var nodes = this.generate();
        return(
            React.createElement("ul", {className: "playlist", id: "playlist"}, 
                nodes
            )
        );
    }
});

var ContactArea = React.createClass({displayName: "ContactArea",
    onClick: function(){
        if (!document.getElementById("mainAreaAbout").hasChildNodes()) {
            ga('send', 'event', 'About Section', 'Create');
            React.render(
                React.createElement(AboutArea, null),
                document.getElementById('mainAreaAbout')
            );
        }
        localStorage.dismissed = 0;
        window.scrollTo(0,$('#AboutArea')[0].offsetTop-286);
    },
    render: function(){
        var orig_ref = "http://www.phishjustjams.com/";
        var string = "@phishjustjams";
        var final_string = "https://twitter.com/intent/tweet?original_referer="+encodeURI(orig_ref)+"&hashtags=phishjustjams&text="+encodeURI(string)+"&tw_p=tweetbutton";
        return(
            React.createElement("div", {className: "contactArea"}, 
                React.createElement("div", {className: "contactLinksArea"}, 
                    React.createElement("button", {className: "btn-aboutArea", onClick: this.onClick}, "About"), 
                    React.createElement("a", {className: "contactLinksContact", href: final_string}, "Contact"), 
                    React.createElement("a", {className: "contactLinksLegal", target: "_blank", href: "http://phish.com/faq/#taping-guidelines"}, "Legal")
                )
            )
        );
    }
});

var OptionsArea = React.createClass({displayName: "OptionsArea",
    componentDidMount: function () {
        var _this = this;
        var years = $('#years');
        years.multiselect({
            enableClickableOptGroups: true,
            maxHeight: 250,
            onDropdownShow: function(){
                _this.setState({years: years.val()});
                if (years.val().length == $('#years option').length) {
                    years.multiselect('deselectAll', false);
                }
            },
            onDropdownHidden: function(event) {
                if (years.val() === null){
                    years.multiselect('select', _this.state.years);
                }
                else {
                    if (!years.val().equals(_this.state.years)) {
                        _this.doUpdate();
                        ga('send', 'event', 'Filters', 'Years');
                    }
                }
            },
            optionLabel: function(element) {
                return $(element).val();
            },
            buttonTitle: function(options, select) {
                return "Years";
            },
            buttonClass: 'btn-phish',
            inheritClass: true,
            //buttonWidth: '110px',
            buttonText: function(options,select){
                return "Years";
            },
            includeSelectAllOption: true,
            selectAllText: "Every year",
            selectAllNumber: false,
            selectedClass: 'multiselect-selected'
        });

        var tours = $('#tours');
        tours.multiselect({
            disableIfEmpty: true,
            maxHeight: 250,
            onDropdownShow: function(){
                _this.setState({tours: tours.val()});
                if (tours.val().length == $('#tours option').length) {
                    tours.multiselect('deselectAll', false);
                }
            },
            onDropdownHidden: function(event) {
                if (tours.val() === null){
                        tours.multiselect('select', _this.state.tours);
                }
                else {
                    if (!tours.val().equals(_this.state.tours)) {
                        _this.doUpdate();
                        ga('send', 'event', 'Filters', 'Tours');
                    }
                }
            },
            optionLabel: function(element) {
                return $(element).val();
            },
            buttonTitle: function(options, select) {
                return "Tours";
            },
            buttonClass: 'btn-phish',
            inheritClass: true,
            //buttonWidth: '110px',
            buttonText: function(options,select){
                return "Tours";
            },
            includeSelectAllOption: true,
            selectAllText: "All tours",
            selectAllValue: "something",
            selectAllNumber: false,
            selectedClass: 'multiselect-selected'
        });

        var songs = $('#songs');
        songs.multiselect({
            disableIfEmpty: true,
            maxHeight: 250,
            onDropdownShow: function(){
                _this.setState({songs: songs.val()});
                if (songs.val().length == $('#songs option').length) {
                    songs.multiselect('deselectAll', false);
                }
            },
            onDropdownHidden: function(event) {
                if (songs.val() === null){
                        songs.multiselect('select', _this.state.songs);
                }
                else {
                    if (!songs.val().equals(_this.state.songs)) {
                        _this.doUpdate();
                        ga('send', 'event', 'Filters', 'Songs');
                    }
                }
            },
            optionLabel: function(element) {
                return $(element).val();
            },
            buttonTitle: function(options, select) {
                return "Songs";
            },
            buttonClass: 'btn-phish',
            inheritClass: true,
            //buttonWidth: '110px',
            buttonText: function(options,select){
                return "Songs";
            },
            includeSelectAllOption: true,
            selectAllText: "All songs",
            selectAllValue: "something",
            selectAllNumber: false,
            selectedClass: 'multiselect-selected'
        });

        durations = $('#durations');
        durations.multiselect({
            disableIfEmpty: true,
            maxHeight: 250,
            onDropdownShow: function(){
                _this.setState({durations: durations.val()});
                if (durations.val().length == $('#durations option').length) {
                    durations.multiselect('deselectAll', false);
                }
            },
            onDropdownHidden: function(event) {
                if (durations.val() === null){
                    durations.multiselect('select', _this.state.durations);
                }
                else {
                    if (!durations.val().equals(_this.state.durations)) {
                        _this.doUpdate();
                        ga('send', 'event', 'Filters', 'Durations');
                    }
                }
            },
            optionLabel: function(element) {
                return $(element).val();
            },
            buttonTitle: function(options, select) {
                return "Durations";
            },
            buttonClass: 'btn-phish',
            inheritClass: true,
            //buttonWidth: '110px',
            buttonText: function(options,select){
                return "Durations";
            },
            includeSelectAllOption: true,
            selectAllText: "All durations",
            selectAllValue: "something",
            selectAllNumber: false,
            selectedClass: 'multiselect-selected'
        });

        var locations = $('#locations');
        locations.multiselect({
            enableClickableOptGroups: true,
            maxHeight: 250,
            onDropdownShow: function(){
                _this.setState({locations: locations.val()});
                if (locations.val().length == $('#locations option').length) {
                    locations.multiselect('deselectAll', false);
                }
            },
            onDropdownHidden: function(event) {
                if (locations.val() === null){
                    locations.multiselect('select', _this.state.locations);
                }
                else {
                    if (!locations.val().equals(_this.state.locations)) {
                        _this.doUpdate();
                        ga('send', 'event', 'Filters', 'Locations');
                    }
                }
            },
            optionLabel: function(element) {
                return $(element).val();
            },
            buttonTitle: function(options, select) {
                return "Locations";
            },
            buttonClass: 'btn-phish',
            inheritClass: true,
            //buttonWidth: '110px',
            buttonText: function(options,select){
                return "Locations";
            },
            includeSelectAllOption: true,
            selectAllText: "All Locations",
            selectAllNumber: false,
            selectedClass: 'multiselect-selected'
        });
        this.onClick("initial");
    },
    doUpdate: function(){
        var years = $('#years').val() === null ? [] : $('#years').val();
        var tours = $('#tours').val() === null ? [] : $('#tours').val();
        var songs = $('#songs').val() === null ? [] : $('#songs').val();
        var durations = $('#durations').val() === null ? [] : $('#durations').val();
        var locations = $('#locations').val() === null ? [] : $('#locations').val();
        this.props.updateTrackList([years,tours,songs,durations,locations]);
        window.scrollTo(0,74*Math.floor(Math.random()*idtag)-286);
    },
    onClick: function(tf){
        $('#years').multiselect('selectAll',false);
        $('#tours').multiselect('selectAll',false);
        $('#songs').multiselect('selectAll',false);
        $('#durations').multiselect('selectAll',false);
        $('#locations').multiselect('selectAll',false);
        if (tf !== "initial")
            ga('send', 'event', 'Filters', 'Reset All');
        this.doUpdate();
    },
    onClickRandom: function(){
        if (randomized){
            randomized = false;
            $('#randomButton').attr("src", "img/play.png");
            ga('send', 'event', 'UX', 'Turned Random Off');
        }
        else{
            randomized = true;
            $('#randomButton').attr("src", "img/rand.png");
            ga('send', 'event', 'UX', 'Turned Random On');
        }
    },
    render: function(){
        return(
            React.createElement("div", {className: "options-menu"}, 
                React.createElement("div", {className: "options-buttons-container"}, 
                    React.createElement("select", {id: "years", multiple: "multiple"}, 
                        React.createElement("optgroup", {label: "1.0"}, 
                            React.createElement("option", {value: "1993"}), 
                            React.createElement("option", {value: "1994"}), 
                            React.createElement("option", {value: "1995"}), 
                            React.createElement("option", {value: "1996"}), 
                            React.createElement("option", {value: "1997"}), 
                            React.createElement("option", {value: "1998"}), 
                            React.createElement("option", {value: "1999"}), 
                            React.createElement("option", {value: "2000"})
                        ), 
                        React.createElement("optgroup", {label: "2.0"}, 
                            React.createElement("option", {value: "2003"}), 
                            React.createElement("option", {value: "2004"})
                        ), 
                        React.createElement("optgroup", {label: "3.0"}, 
                            React.createElement("option", {value: "2009"}), 
                            React.createElement("option", {value: "2010"}), 
                            React.createElement("option", {value: "2011"}), 
                            React.createElement("option", {value: "2012"}), 
                            React.createElement("option", {value: "2013"}), 
                            React.createElement("option", {value: "2014"}), 
                            React.createElement("option", {value: "2015"})
                        )
                    )
                ), 
                React.createElement("div", {className: "options-buttons-container"}, 
                    React.createElement("select", {id: "tours", multiple: "multiple"}, 
                        React.createElement("option", {value: "Winter"}), 
                        React.createElement("option", {value: "Spring"}), 
                        React.createElement("option", {value: "Summer"}), 
                        React.createElement("option", {value: "Fall"}), 
                        React.createElement("option", {value: "Holiday"})
                    )
                ), 
                React.createElement("div", {className: "options-buttons-container"}, 
                    React.createElement("select", {id: "songs", multiple: "multiple"}, 
                        React.createElement("option", {value: "2001"}), 
                        React.createElement("option", {value: "46 Days"}), 
                        React.createElement("option", {value: "AC/DC Bag"}), 
                        React.createElement("option", {value: "Antelope"}), 
                        React.createElement("option", {value: "Bathtub Gin"}), 
                        React.createElement("option", {value: "Birds"}), 
                        React.createElement("option", {value: "Boogie On"}), 
                        React.createElement("option", {value: "Bowie"}), 
                        React.createElement("option", {value: "Carini"}), 
                        React.createElement("option", {value: "Caspian"}), 
                        React.createElement("option", {value: "Chalkdust"}), 
                        React.createElement("option", {value: "Cities"}), 
                        React.createElement("option", {value: "Crosseyed"}), 
                        React.createElement("option", {value: "Disease"}), 
                        React.createElement("option", {value: "Drowned"}), 
                        React.createElement("option", {value: "Fee"}), 
                        React.createElement("option", {value: "Free"}), 
                        React.createElement("option", {value: "Ghost"}), 
                        React.createElement("option", {value: "Golden Age"}), 
                        React.createElement("option", {value: "Gumbo"}), 
                        React.createElement("option", {value: "Halley's"}), 
                        React.createElement("option", {value: "Hood"}), 
                        React.createElement("option", {value: "It's Ice"}), 
                        React.createElement("option", {value: "Jam"}), 
                        React.createElement("option", {value: "Kill Devil Falls"}), 
                        React.createElement("option", {value: "Light"}), 
                        React.createElement("option", {value: "Maze"}), 
                        React.createElement("option", {value: "Mike's"}), 
                        React.createElement("option", {value: "Number Line"}), 
                        React.createElement("option", {value: "Piper"}), 
                        React.createElement("option", {value: "Possum"}), 
                        React.createElement("option", {value: "Reba"}), 
                        React.createElement("option", {value: "Rock n' Roll"}), 
                        React.createElement("option", {value: "Roggae"}), 
                        React.createElement("option", {value: "Runaway Jim"}), 
                        React.createElement("option", {value: "Sand"}), 
                        React.createElement("option", {value: "Scents"}), 
                        React.createElement("option", {value: "Seven Below"}), 
                        React.createElement("option", {value: "Simple"}), 
                        React.createElement("option", {value: "Slave"}), 
                        React.createElement("option", {value: "Sneakin Sally"}), 
                        React.createElement("option", {value: "Split"}), 
                        React.createElement("option", {value: "Stash"}), 
                        React.createElement("option", {value: "Theme"}), 
                        React.createElement("option", {value: "Timber"}), 
                        React.createElement("option", {value: "Tube"}), 
                        React.createElement("option", {value: "Tweezer"}), 
                        React.createElement("option", {value: "Twist"}), 
                        React.createElement("option", {value: "Waves"}), 
                        React.createElement("option", {value: "Weekapaug"}), 
                        React.createElement("option", {value: "Wolfman's"}), 
                        React.createElement("option", {value: "Ya Mar"}), 
                        React.createElement("option", {value: "YEM"})
                    )
                ), 
                React.createElement("div", {className: "options-buttons-container"}, 
                    React.createElement("select", {id: "durations", multiple: "multiple"}, 
                        React.createElement("option", {value: "0-5 mins"}), 
                        React.createElement("option", {value: "5-10 mins"}), 
                        React.createElement("option", {value: "10-15 mins"}), 
                        React.createElement("option", {value: "15-20 mins"}), 
                        React.createElement("option", {value: "20+ mins"})
                    )
                ), 
                React.createElement("div", {className: "options-buttons-container"}, 
                    React.createElement("select", {id: "locations", multiple: "multiple"}, 
                        React.createElement("optgroup", {label: "AL"}, 
							React.createElement("option", {value: "All AL Cities"}), 
							React.createElement("option", {value: "Pelham"})
						), 
						React.createElement("optgroup", {label: "AZ"}, 
							React.createElement("option", {value: "All AZ Cities"}), 
							React.createElement("option", {value: "Phoenix"})
						), 
						React.createElement("optgroup", {label: "CA"}, 
							React.createElement("option", {value: "All CA Cities"}), 
							React.createElement("option", {value: "Berkeley"}), 
							React.createElement("option", {value: "Chula Vista"}), 
							React.createElement("option", {value: "Hollywood"}), 
							React.createElement("option", {value: "Indio"}), 
							React.createElement("option", {value: "Inglewood"}), 
							React.createElement("option", {value: "Los Angeles"}), 
							React.createElement("option", {value: "Monterey"}), 
							React.createElement("option", {value: "Mountain View"}), 
							React.createElement("option", {value: "San Diego"}), 
							React.createElement("option", {value: "San Francisco"})
						), 
						React.createElement("optgroup", {label: "CO"}, 
							React.createElement("option", {value: "All CO Cities"}), 
							React.createElement("option", {value: "Commerce City"}), 
							React.createElement("option", {value: "Denver"}), 
							React.createElement("option", {value: "Morrison"})
						), 
						React.createElement("optgroup", {label: "CT"}, 
							React.createElement("option", {value: "All CT Cities"}), 
							React.createElement("option", {value: "Hartford"})
						), 
						React.createElement("optgroup", {label: "DC"}, 
							React.createElement("option", {value: "All DC Cities"})
						), 
						React.createElement("optgroup", {label: "DE"}, 
							React.createElement("option", {value: "All DE Cities"})
						), 
						React.createElement("optgroup", {label: "FL"}, 
							React.createElement("option", {value: "All FL Cities"}), 
							React.createElement("option", {value: "Gainesville"}), 
							React.createElement("option", {value: "Miami"}), 
							React.createElement("option", {value: "Orlando"})
						), 
						React.createElement("optgroup", {label: "GA"}, 
							React.createElement("option", {value: "All GA Cities"}), 
							React.createElement("option", {value: "Alpharetta"}), 
							React.createElement("option", {value: "Atlanta"})
						), 
						React.createElement("optgroup", {label: "IA"}, 
							React.createElement("option", {value: "All IA Cities"})
						), 
						React.createElement("optgroup", {label: "ID"}, 
							React.createElement("option", {value: "All ID Cities"})
						), 
						React.createElement("optgroup", {label: "IL"}, 
							React.createElement("option", {value: "All IL Cities"}), 
							React.createElement("option", {value: "Chicago"}), 
							React.createElement("option", {value: "Rosemont"})
						), 
						React.createElement("optgroup", {label: "IN"}, 
							React.createElement("option", {value: "All IN Cities"}), 
							React.createElement("option", {value: "Noblesville"})
						), 
						React.createElement("optgroup", {label: "KS"}, 
							React.createElement("option", {value: "All KS Cities"}), 
							React.createElement("option", {value: "Bonner Springs"})
						), 
						React.createElement("optgroup", {label: "KY"}, 
							React.createElement("option", {value: "All KY Cities"}), 
							React.createElement("option", {value: "Louisville"})
						), 
						React.createElement("optgroup", {label: "LA"}, 
							React.createElement("option", {value: "All LA Cities"}), 
							React.createElement("option", {value: "New Orleans"})
						), 
						React.createElement("optgroup", {label: "MA"}, 
							React.createElement("option", {value: "All MA Cities"}), 
							React.createElement("option", {value: "Amherst"}), 
							React.createElement("option", {value: "Boston"}), 
							React.createElement("option", {value: "Mansfield"}), 
							React.createElement("option", {value: "Worcester"})
						), 
						React.createElement("optgroup", {label: "MD"}, 
							React.createElement("option", {value: "All MD Cities"}), 
							React.createElement("option", {value: "Columbia"})
						), 
						React.createElement("optgroup", {label: "ME"}, 
							React.createElement("option", {value: "All ME Cities"}), 
							React.createElement("option", {value: "Limestone"}), 
							React.createElement("option", {value: "Portland"})
						), 
						React.createElement("optgroup", {label: "MI"}, 
							React.createElement("option", {value: "All MI Cities"}), 
							React.createElement("option", {value: "Auburn Hills"}), 
							React.createElement("option", {value: "Grand Rapids"})
						), 
						React.createElement("optgroup", {label: "MN"}, 
							React.createElement("option", {value: "All MN Cities"}), 
							React.createElement("option", {value: "Minneapolis"})
						), 
						React.createElement("optgroup", {label: "MO"}, 
							React.createElement("option", {value: "All MO Cities"}), 
							React.createElement("option", {value: "Kansas City"}), 
							React.createElement("option", {value: "St. Louis"})
						), 
						React.createElement("optgroup", {label: "MS"}, 
							React.createElement("option", {value: "All MS Cities"})
						), 
						React.createElement("optgroup", {label: "MT"}, 
							React.createElement("option", {value: "All MT Cities"})
						), 
						React.createElement("optgroup", {label: "NC"}, 
							React.createElement("option", {value: "All NC Cities"}), 
							React.createElement("option", {value: "Charlotte"}), 
							React.createElement("option", {value: "Raleigh"}), 
							React.createElement("option", {value: "Winston-Salem"})
						), 
						React.createElement("optgroup", {label: "NE"}, 
							React.createElement("option", {value: "All NE Cities"})
						), 
						React.createElement("optgroup", {label: "NH"}, 
							React.createElement("option", {value: "All NH Cities"})
						), 
						React.createElement("optgroup", {label: "NJ"}, 
							React.createElement("option", {value: "All NJ Cities"}), 
							React.createElement("option", {value: "Atlantic City"}), 
							React.createElement("option", {value: "Camden"}), 
							React.createElement("option", {value: "Holmdel"})
						), 
						React.createElement("optgroup", {label: "NM"}, 
							React.createElement("option", {value: "All NM Cities"})
						), 
						React.createElement("optgroup", {label: "NV"}, 
							React.createElement("option", {value: "All NV Cities"}), 
							React.createElement("option", {value: "Las Vegas"}), 
							React.createElement("option", {value: "Stateline"})
						), 
						React.createElement("optgroup", {label: "NY"}, 
							React.createElement("option", {value: "All NY Cities"}), 
							React.createElement("option", {value: "Albany"}), 
							React.createElement("option", {value: "Bethel"}), 
							React.createElement("option", {value: "Canandaigua"}), 
							React.createElement("option", {value: "Darien Center"}), 
							React.createElement("option", {value: "New York"}), 
							React.createElement("option", {value: "Rochester"}), 
							React.createElement("option", {value: "Saratoga Springs"}), 
							React.createElement("option", {value: "Uniondale"}), 
							React.createElement("option", {value: "Wantagh"}), 
							React.createElement("option", {value: "Watkins Glen"})
						), 
						React.createElement("optgroup", {label: "OH"}, 
							React.createElement("option", {value: "All OH Cities"}), 
							React.createElement("option", {value: "Cincinnati"}), 
							React.createElement("option", {value: "Cleveland"}), 
							React.createElement("option", {value: "Columbus"}), 
							React.createElement("option", {value: "Cuyahoga Falls"})
						), 
						React.createElement("optgroup", {label: "OK"}, 
							React.createElement("option", {value: "All OK Cities"})
						), 
						React.createElement("optgroup", {label: "OR"}, 
							React.createElement("option", {value: "All OR Cities"}), 
							React.createElement("option", {value: "Portland"})
						), 
						React.createElement("optgroup", {label: "PA"}, 
							React.createElement("option", {value: "All PA Cities"}), 
							React.createElement("option", {value: "Burgettstown"}), 
							React.createElement("option", {value: "Hershey"}), 
							React.createElement("option", {value: "Philadelphia"}), 
							React.createElement("option", {value: "Pittsburgh"})
						), 
						React.createElement("optgroup", {label: "RI"}, 
							React.createElement("option", {value: "All RI Cities"}), 
							React.createElement("option", {value: "Providence"})
						), 
						React.createElement("optgroup", {label: "SC"}, 
							React.createElement("option", {value: "All SC Cities"}), 
							React.createElement("option", {value: "North Charleston"})
						), 
						React.createElement("optgroup", {label: "TN"}, 
							React.createElement("option", {value: "All TN Cities"}), 
							React.createElement("option", {value: "Antioch"}), 
							React.createElement("option", {value: "Knoxville"}), 
							React.createElement("option", {value: "Manchester"}), 
							React.createElement("option", {value: "Memphis"})
						), 
						React.createElement("optgroup", {label: "TX"}, 
							React.createElement("option", {value: "All TX Cities"}), 
							React.createElement("option", {value: "Austin"}), 
							React.createElement("option", {value: "Dallas"})
						), 
						React.createElement("optgroup", {label: "UT"}, 
							React.createElement("option", {value: "All UT Cities"})
						), 
						React.createElement("optgroup", {label: "VA"}, 
							React.createElement("option", {value: "All VA Cities"}), 
							React.createElement("option", {value: "Hampton"}), 
							React.createElement("option", {value: "Portsmouth"})
						), 
						React.createElement("optgroup", {label: "VT"}, 
							React.createElement("option", {value: "All VT Cities"}), 
							React.createElement("option", {value: "Burlington"})
						), 
						React.createElement("optgroup", {label: "WA"}, 
							React.createElement("option", {value: "All WA Cities"}), 
							React.createElement("option", {value: "George"}), 
							React.createElement("option", {value: "Seattle"})
						), 
						React.createElement("optgroup", {label: "WI"}, 
							React.createElement("option", {value: "All WI Cities"}), 
							React.createElement("option", {value: "East Troy"})
						), 
						React.createElement("optgroup", {label: "WV"}, 
							React.createElement("option", {value: "All WV Cities"})
						), 
						React.createElement("optgroup", {label: "Canada"}, 
							React.createElement("option", {value: "All Canada Cities"}), 
							React.createElement("option", {value: "Vancouver"}), 
							React.createElement("option", {value: "Toronto"})
						), 
						React.createElement("optgroup", {label: "Europe"}, 
							React.createElement("option", {value: "All Europe Cities"}), 
							React.createElement("option", {value: "Copenhagen"}), 
							React.createElement("option", {value: "Amsterdam"})
						), 
						React.createElement("optgroup", {label: "Japan"}, 
							React.createElement("option", {value: "All Japan Cities"}), 
							React.createElement("option", {value: "Niigata"})
						)
                    )
                ), 
                React.createElement("div", {className: "options-buttons-container"}, 
                    React.createElement("button", {className: "btn-phish", onClick: this.onClick}, "Reset All")
                ), 
                React.createElement("div", {className: "rand-button-container"}, 
                    React.createElement("button", {id: "randomButtom", title: "Shuffle", className: "btn-phish", onClick: this.onClickRandom}, React.createElement("img", {id: "randomButton", src: randomized == true ? "img/rand.png" : "img/play.png"}))
                )
            )
        );
    }
});


//The main guy who runs the whole show.  Everything that happens on the webpage goes through
//MainArea.  It sets everything up, contains most of the functions that runs things,
//and is the only React class to contain state data, all the others only deal with props.
var MainArea = React.createClass({displayName: "MainArea",
    getInitialState: function() {
        return {myTrackList: [], myString:"Full List: 2044 tracks"};
    },
    componentDidMount: function() {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        var yearsFilter = [];
        var toursFilter = [];
        var songsFilter = [];
        var durationsFilter = [];
        var locationsFilter = [];
        var playTrack = null;
        if (vars[0] != "") {
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                var list = pair[1].split(",");
                if (pair[0] == "years") {
                    for (var j = 0; j < list.length; j++) {
                        yearsFilter.push(list[j]);
                    }
                }
                else if (pair[0] == "tours") {
                    for (var j = 0; j < list.length; j++) {
                        toursFilter.push(list[j]);
                    }
                }
                else if (pair[0] == "songs") {
                    for (var j = 0; j < list.length; j++) {
                        songsFilter.push(list[j].replace("_", " ").replace("_", " ").replace("%27","'"));
                    }
                }
                else if (pair[0] == "durations") {
                    for (var j = 0; j < list.length; j++) {
                        durationsFilter.push(list[j].replace("_", " "));
                    }
                }
                else if (pair[0] == "locations") {
                    for (var j = 0; j < list.length; j++) {
                        locationsFilter.push(list[j].replace("_", " ").replace("_", " "));
                    }
                }
                else if (pair[0] == "play") {
                    playTrack = list[0];
                }
                else if (pair[0] == "random"){
                    randomized = !(list[0] == "false");
                }
            }
        }

        var _this = this;

        if (!localStorage.dismissed){
            React.render(
                React.createElement(AboutArea, null),
                document.getElementById('mainAreaAbout')
            );
        }
        else {
            if (localStorage.dismissed == 0) {
                React.render(
                    React.createElement(AboutArea, null),
                    document.getElementById('mainAreaAbout')
                );
            }
        }

        mainTrackList.status
            .done(function(){
                var years = $('#years').val() === null ? [] : $('#years').val();
                years = yearsFilter.length > 0 ? yearsFilter : years;
                var tours = $('#tours').val() === null ? [] : $('#tours').val();
                tours = toursFilter.length > 0 ? toursFilter : tours;
                var songs = $('#songs').val() === null ? [] : $('#songs').val();
                songs = songsFilter.length > 0 ? songsFilter : songs;
                var durations = $('#durations').val() === null ? [] : $('#durations').val();
                durations = durationsFilter.length > 0 ? durationsFilter : durations;
                var locations = $('#locations').val() === null ? [] : $('#locations').val();
                locations = locationsFilter.length > 0 ? locationsFilter : locations;
                currentTrackList.checkWithFilter([years,tours,songs,durations,locations]);
                //this.updateTrackList([years,tours,songs,durations]);


                var string;
                if (idtag == mainTrackList.length) {
                    string = "Full List: " + idtag + " tracks";
                }
                else{
                    string = "Filtered List: " + idtag + " tracks";
                }
                _this.setState({myTrackList: currentTrackList, myFirstTrack: playTrack, myString: string});
                //_this.setState({myString: string});

                //only scroll there if it is the first time they've visited the page
                if (!localStorage.dismissed){
                    window.scrollTo(0,$('#AboutArea')[0].offsetTop-286);
                    localStorage.dismissed = 0;
                }
                else {
                    window.scrollTo(0, 74 * Math.floor(Math.random() * idtag) - 286);
                }
            })
            .fail(function(){
                console.log("we've failed");
            });
        window.onbeforeunload = function () {
            React.unmountComponentAtNode(document.getElementById('pjj'));
            //return "you really want to close?";
        };
    },
    updateTrackList: function(array){
        currentTrackList.reset();
        var years = $('#years').val() === null ? [] : $('#years').val();
        var tours = $('#tours').val() === null ? [] : $('#tours').val();
        var songs = $('#songs').val() === null ? [] : $('#songs').val();
        var durations = $('#durations').val() === null ? [] : $('#durations').val();
        var locations = $('#locations').val() === null ? [] : $('#locations').val();
        currentTrackList.checkWithFilter([years,tours,songs,durations,locations]);
        var string;
        if (idtag == 0){
            string = "Tracks are loading, please wait";
        }
        else if (idtag == mainTrackList.length) {
            string = "Full List: " + idtag + " tracks";
        }
        else{
            string = "Filtered List: " + idtag + " tracks";
        }
        this.setState({myTrackList: currentTrackList, myString: string});
    },
    componentWillUnmount: function(){
    },
    render: function() {
        //create the main area.
        var orig_ref = "http://www.phishjustjams.com/";
        var string = "@phishjustjams";
        var follow_string = "https://twitter.com/intent/follow?original_referer="+encodeURI(orig_ref)+"&region=follow_link&screen_name=phishjustjams&tw_p=followbutton";
        return (
            React.createElement("div", {className: "scriptarea", id: "scriptarea"}, 
                React.createElement("div", {className: "header"}, 
                    React.createElement("div", {className: "container"}, 
                        React.createElement("div", {className: "actualHeader"}, 
                            React.createElement("div", {className: "twitterHeader"}, 
                                React.createElement("a", {id: "facebookLink", target: "_blank", href: "https://www.facebook.com/phishjustjams"}, 
                                    React.createElement("img", {className: "facebookLogo", src: "img/fb-art.jpg"})
                                ), 
                                React.createElement("a", {id: "twitterLinkHeader", target: "_blank", href: follow_string}, 
                                    React.createElement("img", {className: "twitterLogoHeader", src: "img/Twitter_logo_blue.png"}), "@phishjustjams"
                                )
                            ), 
                            React.createElement("div", {className: "mainTitleDiv"}, 
                                React.createElement("h1", {className: "mainTitle"}, 
                                    "Phish Just Jams"
                                )
                            ), 
                            React.createElement(ContactArea, null)
                        ), 
                        React.createElement("div", {className: "options-menu-container"}, 
                            React.createElement(OptionsArea, {updateTrackList: this.updateTrackList})
                        ), 
                        React.createElement(NowPlayingArea, {myString: this.state.myString})
                    )
                ), 
                React.createElement("div", {className: "container"}, 
                    React.createElement("div", {className: "content"}, 
                        React.createElement("div", {id: "sm2-container"}
                        ), 
                        React.createElement("div", {id: "mainArea"}, 
                            React.createElement(TrackArea, {
                                myTrackList: this.state.myTrackList, 
                                myFirstTrack: this.state.myFirstTrack}
                                ), 
                            React.createElement("div", {id: "mainAreaAbout"}
                            )
                        )
                    )
                )
            )
        );
    }
});


//This is technically the only piece of active code in this whole file.
//Here we actually render the main area.
React.render(
    React.createElement(MainArea, null),
    document.getElementById('pjj')
);

