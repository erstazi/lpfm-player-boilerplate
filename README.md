LPFM Stream Player Boilerplate
=================================

LPFM Stream Player Boilerplate is a Cordova project that provides an audio stream player for Android, iOS/Apple, and many more platforms available through Cordova. Apache Cordova is a mobile application development framework using HTML5, CSS3, and JavaScript. We left the **WFSN-LP** artwork in the repository to give you an idea of what we used so you can make your own and mimic the same kind of artwork.

## First things first

### Installing Cordova

Cordova command-line runs on Node.js and is available on NPM. Follow platform specific guides to install additional platform dependencies. Open a command prompt or Terminal, and type `npm install -g cordova`

### Create your Cordova Project

Create a blank Cordova project using the command-line tool. Example:

`cordova create /home/username/projects/stationFullName com.YOURNAME.stationFullName "Your Station's Full Name"

## Changes you need to make:

### Setting the Station Name

1. Throughout the `www/index.html` file you will find `{stationFullName}` which needs replaced with your station's full name. Example: *WFSN-LP 96.7FM*

2. In the `package.json` file, you will need to change `{stationFullName}` to your station's full name.

3. In the `config.xml` file, you will need to change `{stationFullName}` to your stream URL.

### Setting your Stream URL:

1. In the `www/index.html` file, the element audio#audioplayer needs to have the following attributes to be changed:

      * The attribute `src` in the element `audio#audioplayer` needs to be set to your stream URL. Replace `{streamURL}` with your stream URL.
      * The attribute `data-src` in the element `audio#audioplayer` needs to be set to your stream URL. Replace `{streamURL}` with your stream URL. We use `data-src` as a backup for when we need to stop the player and it makes a cleaner break with the stream if we empty out `src` and reload the `src` with `data-src`

2. In the `package.json` file, you will need to change `{streamURL}` to your stream URL.

3. In the `config.xml` file, you will need to change `{streamURL}` to your stream URL.

### Creating your own images.

The WFSN-LP images are examples that need to be replaced. We suggest you follow the [Cordova Customizing Icons Documentation](https://cordova.apache.org/docs/en/latest/config_ref/images.html)

      * In the `css/index.css` file, you will find in the `body` the background-image `www/img/background.jpg` is the background image we use. You can just remove the background image completely in the CSS `body` element if you desire and choose a solid `background-color`
      * In the `www/index.html` file, the element `img#main-logo` you will find `img/logo.png` which is the main logo image we use. You can adjust this

### Changing some URLs to fit your organization

In the `www/index.html` file, change the `a` link URLs in the following:

      * In `a#radio-station-url`, change the URL to your Radio Station URL
      * In `a#organization-url`, change the URL to your Organization URL. We have a parent nonprofit for our radio station so if you do not have a parent organization then you can remove this.
      * In `a#privacy-url`, change the URL to your privacy agreement. All major app stores require this. You can mimic the [WFSN-LP Privacy agreement](http://radio.ucfsc.org/privacy/).

### Set your app's ID

Set your own apps ID. More information can be found on Wikipedia on [reverse domain name notations](https://en.wikipedia.org/wiki/Reverse_domain_name_notation).

1. In the `package.json` file, you will need to change `{ReverseDomainNameNotations}` to your own app ID. Example: `com.erstazi.wfsnlpplayer`

2. In the `config.xml` file, you will need to change `{ReverseDomainNameNotations}` to your own app ID. Example: `com.erstazi.wfsnlpplayer`