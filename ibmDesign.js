/******************************************************************************/
/* This module provides functionality to enable web analytics via             */
/* CoreMetrics. It is common (copied) to the external web pages site,         */
/* internal web pages and also IDL.                                           */
/*                                                                            */
/* This module must be loaded before ida_production.js                        */
/******************************************************************************/

// ensure global object exists
design = (typeof design === 'undefined') ? {} : design;
design.analytics = (typeof design.analytics === 'undefined') ? {} : design.analytics;

(function() {  // create a closure
	
	// Function for recoding a page hit.
	design.analytics.recordPageView = function() {

    	// Helper functions.
    	function getCookieValue(cookieName) {
    	    var cookieNameEquals = cookieName + "=";
    	    var cookies = document.cookie.split(';');
    	    for(var i = 0; i < cookies.length; i++) {
    	        var cookie = cookies[i];
    	        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);
    	        if (cookie.indexOf(cookieNameEquals) == 0) return cookie.substring(cookieNameEquals.length,cookie.length);
    	    }
    	    return null;
    	}

    	var getMetaTagContent = function (name) {
    		for (i = 0; i < metaTags.length; i++) {
    			if (name == metaTags[i].name || name == metaTags[i].getAttribute("property")) {
    				return metaTags[i].content;
    			}
    		} return null;
    	};
    	
    	// Get meta tags and define func to extract individual values.
    	var metaTags = document.getElementsByTagName("meta");
    	
    	// Construct page id.
    	var path = location.pathname;
    	if(path) {
    		path = path.replace(/\/+$/, "");
    	}else {
    		path = "";
    	}
    	var lastSlashPos = path.lastIndexOf("/");
    	var lastPathSegment;
    	var residualPath;
    	if(lastSlashPos >= 0) {
    		lastPathSegment = path.substring(lastSlashPos + 1);
    		residualPath = path.substring(0, lastSlashPos + 1);
    	}else{
    		lastPathSegment = path;
    		residualPath = "";
    	}
    	var indexFiles = ["index.phtml", "index.shtml", "index.wss", "index.jsp", "index.jspa", "index.htm", "index.html", "index"];
		for (var i = 0; i < indexFiles.length; i++) {
		    if (indexFiles[i] == lastPathSegment.toLowerCase()) {
		        lastPathSegment = "";
		    }
		}
		var pageId = residualPath + lastPathSegment;
		if(pageId == "") {
			pageId = "/";
		}
		pageId = location.hostname + pageId;
		
		// Construct page view attributes string.
		var pageViewAttributes = new String();
		pageViewAttributes += String(document.cookie).match(/(^| )(w3ibmProfile|w3_sauid|PD-W3-SSO-|OSCw3Session|IBM_W3SSO_ACCESS)=/) ? "1" : "0";
		pageViewAttributes += "-_-" + getMetaTagContent("IBM.Country");
		pageViewAttributes += "-_-" + getMetaTagContent("DC.Language");
		pageViewAttributes += "-_-" + getMetaTagContent("IBM.Effective");
		pageViewAttributes += "-_-" + getMetaTagContent("DC.Subject");
		pageViewAttributes += "-_-" + getMetaTagContent("DC.Type");
		pageViewAttributes += "-_-" + getMetaTagContent("Source");
		pageViewAttributes += "-_-" + getMetaTagContent("Owner");
		pageViewAttributes += "-_-" + getMetaTagContent("Description");
		pageViewAttributes += "-_-" + document.title;
		pageViewAttributes += "-_-" + getMetaTagContent("IBM.Industry");
		pageViewAttributes += "-_-" + getMetaTagContent("IBM.SpecialPurpose");
		pageViewAttributes += "-_-" + getMetaTagContent("Keywords");
		pageViewAttributes += "-_-" + getMetaTagContent("DC.Date");
		pageViewAttributes += "-_-" + getMetaTagContent("IBM.Expires");
		pageViewAttributes += "-_-" + getCookieValue("IBMISP");
		pageViewAttributes += "-_-" + getCookieValue("UnicaNIODID");
		pageViewAttributes += "-_-" + new Date().getTime();
		pageViewAttributes += "-_-" + getMetaTagContent("DC.Publisher");
		pageViewAttributes += "-_-" + (typeof (document.getElementsByTagName("h1")[0]) != "undefined" ? document.getElementsByTagName("h1")[0].innerHTML : null);
		
		
		// Generate page view metrics event.
   		cmCreatePageviewTag(pageId, getMetaTagContent("IBM.WTMCategory"), null, null, pageViewAttributes);
	};
	
	// Fix up the IBM.WTMSite meta tag to send data to the test metrics DB if not running on production.
	if (!(window.location.hostname.match(/^(www\.ibm\.com|design\.ibm\.com|releaseblueprints\.ibm\.com)$/i))) {
		var siteMetaTag = document.getElementById("meta-ibm-wtm-site");
		if(siteMetaTag) {
			siteMetaTag.content += "TEST";
		}
	}
}());