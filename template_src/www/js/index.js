/*
 * LPFM Player Boilerplate by Seth keiper (WFSN-LP 96.7FM)
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


/*
  Playing Now List JSON
  This is automatically generated on the server side.
  And example can be seen at:

  http://radio.ucfsc.org/playing_now_list.json

  You can set this URL in div#playing-now-list-url in the index.html
*/
var playing_now_list_url = '';

var message_NETWORK_DOWN = 'Please, connect to either WiFi or your mobile network!';

var isCordova = false;
var isPlaying = false;
var playerStatus = 'startup';
var icon_play  = 'res://ic_menu_play.png';
var icon_pause = 'res://ic_menu_pause.png';
var icon_stop = 'res://ic_menu_stop.png';


$(function(){
  var app = {

    /*
     * app.initialize();
     *
     * Initializing Cordova
     *
     * In this section, we check to see if it is a Cordova instance
     * or not. This allows us to test it in a real browser on the
     * desktop. You could use cordova build browser but this is the
     * lazyman's way of doing so.
     */

    initialize: function() {
      var is_it_cordova = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && document.URL.indexOf( 'file:///home/' ) === -1;
      if( is_it_cordova == true ){
          isCordova = true;
          document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
      } else {
          isCordova = false;
          this.onDeviceReady();
      }
    },

    /*
     * app.onDeviceReady();
     *
     * run all that is needed when the device is ready
     *
     */

    onDeviceReady: function() {
      this.receivedEvent('deviceready');
    },

    /*
     * app.getNewTime();
     *
     * getting the new time so caching is a nonissue
     *
     * There are other methods of disabling cache however,
     * we think this version is the least painful
     *
     */

    getNewTime: function(){
      return new Date().getTime();
    },

    /*
     * app.getData(name);
     *
     * We use localeStorage to lessen the XHR/AJAX calls
     * So this is getting item (e.g. like database name) from the local storage
     *
     */

    getData: function(name){
      var storage;
      if(localStorage.getItem(name) === null){
        storage = null;
      }else{
        storage = JSON.parse(localStorage.getItem(name));
      }
      return storage;
    },

    /*
     * app.checkConnection();
     *
     * Quick way to check if the device is connected, not connected,
     * what signal strength, etc
     *
     */

    checkConnection: function() {
      var networkState = navigator.connection.type;

      var states = {};
      if(typeof Connection !== 'undefined'){
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]   = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]   = 'Cell generic connection';
        states[Connection.NONE]   = 'No network connection';

        return states[networkState];
      }
    },

    /*
     * app.showNetworkDownDialog();
     *
     * Display a dialog to user if connection is down
     *
     */

    showNetworkDownDialog: function(){
      var noticeText = $('#network-connection-null .comment').text();

      if(typeof HTMLDialogElement === 'function'){
        var dialog = document.querySelector('#network-connection-null');
        if (! dialog.showModal) dialogPolyfill.registerDialog(dialog);

        dialog.showModal();

        dialog.querySelector('.network-connection-null-close').addEventListener('click', function() {
          dialog.close();
        });
      }else{
        alert(noticeText);
      }
    },

    /*
     * app.scheduleNotification(id, title, message, schedule_time);
     *
     * Here we are setting a custom local notification
     *
     */

    scheduleNotification: function (id, title, message, schedule_time){
      cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        message: message,
        at: schedule_time
      });

      var array = [id, title, message, schedule_time];
      info.data[info.data.length] = array;
      localStorage.setItem("playing_now_data", JSON.stringify(info));

      navigator.notification.alert("Reminder added successfully")
    },

    /*
     * app.updateFullNotification(textMessage);
     *
     * Here we are updating the local notification if
     * there were any changes to the player's status (e.g. stop, play, pause)
     *
     */

    updateFullNotification: function(textMessage){
      use_icon = icon_play;
      switch(window.playerStatus){
        case 'play': use_icon = icon_play; break;
        case 'stop': use_icon = icon_stop; break;
        case 'pause': use_icon = icon_pause; break;
      }
      if(isCordova == true){
        cordova.plugins.notification.local.update({
            id: 1,
            text: textMessage,
            icon: use_icon,
            smallIcon: use_icon
        });
      }
    },

    /*
     * app.showLocalNotification(textMessage);
     *
     * Here we are creating the "normal" local notification we use if
     * there were any changes to the player's status (e.g. stop, play, pause)
     *
     */

    showLocalNotification: function(textMessage){
      var now = app.getNewTime(),
          _10_millisec_from_now = new Date(now + 1 * 10);
      use_icon = icon_play;
      switch(window.playerStatus){
        case 'play': use_icon = icon_play; break;
        case 'stop': use_icon = icon_stop; break;
        case 'pause': use_icon = icon_pause; break;
      }
      if(isCordova == true){
        cordova.plugins.notification.local.schedule({
          id: 1,
          title: $('title').text(),
          text: textMessage,
          //~ at: _10_millisec_from_now,
          icon: use_icon,
          smallIcon: use_icon,
          sound: null,
          data: { key: new Date().getTime() }
        });
      }
      console.log(app.getNewTime() + ' window.playerStatus: ' + window.playerStatus);
    },

    /*
     * app.getPlayingNowListJSON();
     *
     * We use an automatically generated JSON file on our servers to gather
     * what shows are currently playing and will play next.
     *
     * The format of the JSON file can be seen at: http://radio.ucfsc.org/playing_now_list.json
     *
     * You can set your url in the data-url attribute in div#playing-now-list-url element in index.html
     *
     */

    getPlayingNowListJSON: function(){
      playing_now_list_url = $('#playing-now-list-url').data('url');
      if(playing_now_list_url.length > 0 && playing_now_list_url != '{playing_now_list_json}' ){
        console.log(app.getNewTime() + ' Going to load Playing Now List');

        $.getJSON(playing_now_list_url, {_: new Date().getTime()}, function( data ) {
          //~ console.table(data);
          if(typeof data.current_show !== 'undefined'){
            $('#current_show_name').html( data.current_show.name );
            $('#current_show_datetime').html( data.current_show.start_date + ' ' + data.current_show.start_time + ' - ' + data.current_show.end_time );
            $('#current_show_item').show();

            var currentShowObject = {playerStatus: window.playerStatus, name: data.current_show.name, start_date: data.current_show.start_date, start_time: data.current_show.start_time, end_time: data.current_show.end_time };
            localStorage.setItem('playing_now_data', JSON.stringify(currentShowObject));
            console.log(app.getNewTime() + ' SHOW CURRENT SHOW');
          }
          if(typeof data.next_show !== 'undefined'){
            $('#next_show_name').html( data.next_show.name );
            $('#next_show_datetime').html( data.next_show.start_date + ' ' + data.next_show.start_time + ' - ' + data.next_show.end_time );
            $('#next_show_item').show();
            console.log(app.getNewTime() + ' SHOW NEXT SHOW');
          }
          $('.shows_info_list').show();
        });
      }
    },

    /*
     * app.updatePlayingNowList();
     *
     * This is the updater for the Playing Now List that will
     * also change the local notification. We use local storage again to
     * lesson the calls with XHR/AJAX.
     *
     */

    updatePlayingNowList: function(){
      var newData;

      if(!localStorage.getItem('playing_now_data')){
        var playing_now_data = {};
        localStorage.setItem('playing_now_data', JSON.stringify(playing_now_data));
      }

      data = this.getData('playing_now_data');

      if(!localStorage.getItem('playing_now_data_old')){
        new_data_old = this.getData('playing_now_data');
        localStorage.setItem('playing_now_data_old', JSON.stringify(new_data_old));
      }else{
        data_old = this.getData('playing_now_data_old');
        if(data_old == null){
          new_data_old = this.getData('playing_now_data');
          localStorage.setItem('playing_now_data_old', JSON.stringify(new_data_old));
        }
      }

      data_old = this.getData('playing_now_data_old');

      if(data != null && typeof data.name !== 'undefined' && data_old != null && typeof data_old.name !== 'undefined'){
        if(data.name != data_old.name || window.playerStatus != data_old.playerStatus || data.start_time != data_old.start_time){
          newData = {playerStatus: window.playerStatus, name: data.name, start_date: data.start_date, start_time: data.start_time, end_time: data.end_time};
          localStorage.setItem('playing_now_data', JSON.stringify(newData));
          localStorage.setItem('playing_now_data_old', JSON.stringify(newData));
          this.showLocalNotification('Playing Now: ' + newData.name );
          console.log(app.getNewTime() + ' changing showLocalNotification FROM updatePlayingNowList() with new data');
        }
        if(isCordova == true){
          cordova.plugins.notification.local.isPresent(1, function (present) {
            if(present == false){
              app.showLocalNotification('Playing Now: ' + data.name );
              console.log(app.getNewTime() + ' adding showLocalNotification FROM updatePlayingNowList() because it was not present');
            }
          });
        }
      }
    },

    /*
     * app.playerActions(action);
     *
     * This function manipulates the audio element
     *
     */

    playerActions: function(action){
      var audioplayer = $('#audioplayer').get(0);
      var audioSrc = $('#audioplayer').attr("src");
      var audioDataSrc = $('#audioplayer').attr("data-src");

      var networkState = navigator.connection.type;
      if(isCordova == true && networkState === Connection.NONE){
        $('#audioplayer').attr('src', '');
        $('#audioplayer').get(0).pause();
        app.showNetworkDownDialog();
        return;
      }

      switch(action){
        case 'startup':
          $('#current-status').html( $('#current-status').data('loading-text') ).addClass('warning').addClass('blink');
          setTimeout(function(){
            app.playerActions('play');
          }, 1000);
        break;
        case 'play':
          if(window.playerStatus != 'startup'){
            $('#current-status').html( $('#current-status').data('loading-text') ).addClass('warning').addClass('blink');
          }
          $('#audioplayer').attr('src', audioDataSrc);
          $('#audioplayer').get(0).pause();
          $('#audioplayer').get(0).load();
          console.log(app.getNewTime() + ' sending off to pre-defined on() events for audio streaming');
        break;
        case 'pause':
          $('#audioplayer').get(0).pause();
          $('#play-audio').show();
          $('#pause-audio').hide();
          window.playerStatus = action;
          console.log(app.getNewTime() + ' ' + window.playerStatus + ' player');
        break;
        case 'stop':
          $('#audioplayer').attr('src', '');
          $('#audioplayer').get(0).pause();
          $('#audioplayer').get(0).currentTime = 0;
          $('#play-audio').show();
          $('#pause-audio').hide();
          window.playerStatus = action;
          console.log(app.getNewTime() + ' ' + window.playerStatus + ' player');
        break;
      }
      this.updatePlayingNowList();
    },


    /*
     * app.runWhenOnline();
     *
     * When online, we want to start automatically playing the stream.
     * Also, we want to update the notifications to show that we are playing and
     * what show it is if you enabled Playing Now List
     *
     */

    runWhenOnline: function(){
      console.log(app.getNewTime() + ' window.playerStatus is currently: ' + window.playerStatus);
      if(window.playerStatus == 'startup'){
        this.playerActions('startup');
      }else{
        this.playerActions('play');
      }
      this.getPlayingNowListJSON();
      data = this.getData('playing_now_data');
      if(data != null){
        this.showLocalNotification('Playing Now: ' + data.name );
        console.log(app.getNewTime() + ' doing showLocalNotification FROM runWhenOnline() ');
      }
      console.log(app.getNewTime() + ' did runWhenOnline()');
    },

    /*
     * app.runWhenOffline();
     *
     * When offline, we want to stop playing the stream.
     * and update the notifications
     *
     */

    runWhenOffline: function(){
      this.playerActions('stop');
    },

    /*
     * app.receivedEvent();
     *
     * When app.onDeviceReady(deviceStatus); gets a status change, we work it here.
     *
     * We did remove some of the cases that the original player app had as they
     * don't pertain to most app needs.
     *
     * This is another form of initiation of the app with verifying that the
     * device is ready to go and start displaying all content and stream
     *
     */

    receivedEvent: function(deviceStatus) {
      switch(deviceStatus){
        case 'deviceready':
          console.log(app.getNewTime() + ' Device is ready!');

          if(isCordova == true){
            this.runWhenOnline();
            console.log(app.getNewTime() + ' this is cordova!!!');

            window.addEventListener("unload", function(){
              cordova.plugins.notification.local.cancel(1, function() {
                console.log(app.getNewTime() + " cancelled the notification");
              });
            });

          }else{
            this.runWhenOnline();
            console.log(app.getNewTime() + ' regular browser, AAAAAYYYYY');
          }

          if(isCordova == true){
            document.addEventListener("offline", this.runWhenOffline, false);
            document.addEventListener("online", this.runWhenOnline, false);
          }

          if(!localStorage.getItem('playing_now_data')){
            var playing_now_data = {};
            localStorage.setItem('playing_now_data', JSON.stringify(playing_now_data));
          }
          if(!localStorage.getItem('playing_now_data_old')){
            var playing_now_data_old = {playerStatus: window.playerStatus, name: '', start_date: '', start_time: '', end_time: '' };
            localStorage.setItem('playing_now_data_old', JSON.stringify(playing_now_data_old));
          }

          $('#connection-type').html( this.checkConnection() );

          var browserWidth = document.body.clientWidth;
          var browserHeight = document.body.clientHeight;
          $('#debug-layer').html( browserWidth + ' x ' + browserHeight );


          var updatePlayingNowListInterval = setInterval(function(){
              app.updatePlayingNowList();
              var newBrowserWidth = document.body.clientWidth;
              var newBrowserHeight = document.body.clientHeight;
              $('#debug-layer').html( newBrowserWidth + ' x ' + newBrowserHeight );
            }, 1000);

          var getPlayingNowListInterval = setInterval(this.getPlayingNowListJSON, 60000);

        break;
      }
    }
  };

  /*
   *
   * Let's initialize the app and go!
   *
   */
  app.initialize();


  /*
   *
   * Capture all clicks on #stop-audio
   *
   * For when the user taps/clicks the stop button
   *
   */

  $('body').on('click', '#stop-audio', function(event){
    event.preventDefault();
    console.log(app.getNewTime() + ' onClick Stop player');
    app.playerActions('stop');
  });

  /*
   *
   * Capture all clicks on #pause-audio
   *
   * For when the user taps/clicks the pause button
   *
   */

  $('body').on('click', '#pause-audio', function(event){
    event.preventDefault();
    console.log(app.getNewTime() + ' onClick Pause player');
    app.playerActions('pause');
  });

  /*
   *
   * Capture all clicks on #play-audio
   *
   * For when the user taps/clicks the play button
   *
   */

  $('body').on('click', '#play-audio', function(event){
    event.preventDefault();
    if(window.playerStatus != 'play'){
      console.log(app.getNewTime() + ' onClick Play player');
      app.playerActions('play');
    }
  });

  /*
   *
   * Capture all clicks on .link-to-outside
   *
   * For when the user taps/clicks any <a> element that has the
   * class .link-to-outside so Cordova properly handles
   * the outside non-local link
   *
   */

  $('body').on('click', '.link-to-outside', function(event){
    event.preventDefault();
    console.log(app.getNewTime() + ' Link to outside: ' + $(this).data('href') );
    window.open($(this).data('href'), '_system');
  });

  /*
   *
   * Capture all clicks on #header-info img.logo
   *
   * Prevent the image/logo link from being tapped/clicked. You could change this
   * so it is similar to how .link-to-outside is handled
   *
   */

  $('body').on('click', '#header-info img.logo', function(event){
    event.preventDefault();
  });

  /*
   *
   * Capture all clicks on .menu-button a
   *
   * Handle how the menu toggles
   *
   */

  $("body").on('click', '.menu-button a', function(){
    $(".menu-overlay").fadeToggle(200);
    $(this).toggleClass('menu-btn-open').toggleClass('menu-btn-close');
  });

  /*
   *
   * Capture all clicks on .menu-overlay
   *
   * Handle how the menu toggles
   *
   */

  $('body').on('click', '.menu-overlay', function(){
    $(".menu-overlay").fadeToggle(200);
    $(".menu-button a").toggleClass('menu-btn-open').toggleClass('menu-btn-close');
    open = false;
  });

  /*
   *
   * Capture when the player is stalled
   *
   * The stalled event is fired when the user agent is trying to
   * fetch media data, but data is unexpectedly not forthcoming.
   *
   * https://developer.mozilla.org/en-US/docs/Web/Events/stalled
   *
   */

  $('#audioplayer').on('stalled', function(){
    console.log(app.getNewTime() + ' STALLED for the stream');
  });

  /*
   *
   * Capture when the player is waiting
   *
   * The waiting event is fired when playback has stopped
   * because of a temporary lack of data.
   *
   * https://developer.mozilla.org/en-US/docs/Web/Events/waiting
   *
   */

  $('#audioplayer').on('waiting', function(){
    console.log(app.getNewTime() + ' WAITING for the stream');
  });

  /*
   *
   * Capture when the player is loadeddata
   *
   * The loadeddata event is fired when the first
   * frame of the media has finished loading.
   *
   * https://developer.mozilla.org/en-US/docs/Web/Events/loadeddata
   *
   */

  $('#audioplayer').on('loadeddata', function(){
    console.log(app.getNewTime() + ' LOADEDDATA for the stream');
    $('#current-status').html( $('#current-status').data('almost-text') );
  });

  /*
   *
   * Capture when the player is canplay
   *
   * The canplay event is fired when the user agent can play the media, but
   * estimates that not enough data has been loaded to play the media up to
   * its end without having to stop for further buffering of content.
   *
   * https://developer.mozilla.org/en-US/docs/Web/Events/canplay
   *
   */

  $('#audioplayer').on('canplay', function(){
    console.log(app.getNewTime() + ' almost there ready to play');
    $('#current-status').html( $('#current-status').data('almost-text') );
  });

  /*
   *
   * Capture when the player is canplaythrough
   *
   * The canplaythrough event is fired when the user agent can play the media,
   * and estimates that enough data has been loaded to play the media up to its
   * end without having to stop for further buffering of content.
   *
   * https://developer.mozilla.org/en-US/docs/Web/Events/canplaythrough
   *
   */

  $('#audioplayer').on('canplaythrough', function(){
    $('#audioplayer').get(0).play();
    $('#play-audio').hide();
    $('#pause-audio').show();
    window.playerStatus = 'play';
    console.log(app.getNewTime() + ' ' + window.playerStatus + ' player');
    console.log(app.getNewTime() + ' canplaythrough says that we can play ');
    $('#current-status').html( $('#current-status').data('original') ).removeClass('warning').removeClass('blink');
  });

});