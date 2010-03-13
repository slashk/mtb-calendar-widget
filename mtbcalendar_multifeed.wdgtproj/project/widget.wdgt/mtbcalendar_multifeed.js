// This file was generated by Dashcode from Apple Inc.
// You may edit this file to customize your Dashboard widget.

var lastUpdated = 0;       // Track last refresh time to avoid excessive updates
var updateIntervalInHours = 4; // hours between updates CHANGE HERE
var updateIntervalInTicks = updateIntervalInHours * 60 * 60 * 1000; // ticks between updates DON'T CHANGE!
var currentRegionParam = "";
var currentRegionName = "";
var source = "dataSource";

// helper function to load preferences like region
// returns undefined (no quotes) if key doesn't exist
function loadPreferences(key) {
	return widget.preferenceForKey(key);
}

// helper function to save preferences like region
function savePreferences(key, value) {
    if (window.widget) {
        widget.setPreferenceForKey(value, key);
    }
}

// helper function to open the main website
function openWebsite () {
    var url = "http://www.mtbcalendar.com/";
    widget.openURL(url);
}

// helper function to open the code repository
function openRepo () {
    var repo = "http://slashk.github.com/mtb-calendar-widget/";
    widget.openURL(repo);
}

// helper function to open apple's dashcode site
function openDashcode () {
    var url = "http://developer.apple.com/tools/dashcode/";
    widget.openURL(url);
}

// takes json event array and parses/formats them to text/html for the scrollArea
function parseEvents(events) {
    var outputHTML = "";
    var baseurl = "http://www.mtbcalendar.com/events/";
    var showLocation = loadPreferences("showLocation");
    var showFormat = loadPreferences("showFormat");

    if (events && events.length > 0) {
        events.forEach(function(event) {
            event.calendarURL = baseurl + event.id;
            outputHTML += event.list_item_normal_dates+': <span onclick=\'widget.openURL(\"'+event.calendarURL+'\")\'>' + event.name+'</span> ';
            if (showFormat) { outputHTML += '['+event.race_formats_abbr_string+'] ' };
            if (showLocation) { outputHTML += "("+event.state+")" };            
            outputHTML += "<br/>";
        });
    } else {
        outputHTML = "No upcoming events. Visit <span style=\"color:red;\" onclick=\'widget.openURL(\"http://www.mtbcalendar.com\")\'>MTB Calendar</span> and add your events.";
    }
    
    updateScrollArea(outputHTML);
}

// updating scrollArea on front of widget with new event list
function updateScrollArea(content) {
    var scrollArea = document.getElementById("scrollArea");
    scrollArea.object.content.innerHTML = content;
    scrollArea.object.refresh();
    stopAnimation("scrollArea");
}

// update preferences and front page regionName on change
function updatePrefs() {
    savePreferences("region", popup.value);
    var checkboxValue = document.getElementById("formatInput");
    savePreferences("showFormat", checkboxValue.checked);
    var checkboxValue = document.getElementById("locationInput");	
    savePreferences("showLocation", checkboxValue.checked);
}

// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
function load()
{
    // set everything up for NorCal on first load
    if (loadPreferences("region") == undefined) {
        savePreferences("region", "NorCal");        
    };
    if (loadPreferences("showLocation") == undefined) {
        savePreferences("showLocation", 1);        
    };
    if (loadPreferences("showFormat") == undefined) {
        savePreferences("showFormat", 0);        
    };    
    setupParts();
    // change the region name on bottom of front
    document.getElementById("regionName").innerHTML = loadPreferences("region");
    // change back parameters also
    
    // setup datasource for widget
    dashcodeDataSources = dashcode.getDataSource(source);
}

// change the datasource parameters to trigger scrollArea refresh
function refreshEvents() {
    // change the parameter to trigger refresh
    dashcodeDataSources.setValueForKeyPath(loadPreferences("region"), "parameters.region");
    // wait 2 seconds before trying to parse -- otherwise refresh leaves us with empty array
    setTimeout('parseEvents(dashcodeDataSources.__content)', 2000);
    // start animation that will be stopped by parseEvents()
    startAnimation("scrollArea");
}

// Function: remove()
// Called when the widget has been removed from the Dashboard
function remove()
{

}

// Function: hide()
// Called when the widget has been hidden
function hide()
{
    // Stop any timers to prevent CPU usage
}

// Function: show()
// Called when the widget has been shown
function show()
{
    // Refresh feed if 15 minutes have passed since the last update
    var now = (new Date).getTime();
    if ((now - lastUpdated) > updateIntervalInTicks ) {
        // go low-level and refresh the datasource
        dashcodeDataSources.performQuery.bindAndDelay(dashcodeDataSources,0);
        refreshEvents();
        lastUpdated = now;
    }
}

function refreshDataSource() {
    // go low-level and refresh the datasource without changing parameters
    dashcodeDataSources.performQuery.bindAndDelay(dashcodeDataSources,0);
    refreshEvents();
}

// Function: sync()
// Called when the widget has been synchronized with .Mac
function sync()
{
    // we don't sync
}

function startAnimation(element) {
    // fade out events
    var itemToFadeOut = document.getElementById(element);	
    itemToFadeOut.style.visibility = "hidden";
    //var fadeHandler = function(a, c, s, f){ itemToFadeOut.style.opacity = c; };
    //new AppleAnimator(1000, 13, 0.0, 1.0, fadeIndicatorHandler).start();
    // fade in loading text
    var itemToFadeIn = document.getElementById('loading');
    itemToFadeIn.style.visibility = "visible";
}

function stopAnimation(element) {
    var itemToFadeOut = document.getElementById('loading');	
    itemToFadeOut.style.visibility = "hidden";
    // fade in events
    var itemToFadeIn = document.getElementById(element);
    itemToFadeIn.style.opacity = 0;
    itemToFadeIn.style.visibility = "visible";
    var fadeHandler = function(a, c, s, f){ itemToFadeIn.style.opacity = c; };
    new AppleAnimator(1000, 13, 0.0, 1.0, fadeHandler).start();
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget)
        widget.prepareForTransition("ToBack");

    front.style.display="none";
    back.style.display="block";

    // set preferences values on back inputs
    popup.value = loadPreferences("region");
    formatInput.checked = loadPreferences("showFormat");
    locationInput.checked = loadPreferences("showLocation");

    if (window.widget)
        setTimeout("widget.performTransition();", 0);
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget)
        widget.prepareForTransition("ToFront");

    front.style.display = "block";
    back.style.display = "none";

    if (window.widget)
        setTimeout("widget.performTransition();", 0);

    updatePrefs();
    // change the footer to the current selected region
    document.getElementById("regionName").innerHTML = loadPreferences("region");
    refreshEvents();
}

// Initialize the Dashboard event handlers
if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}
