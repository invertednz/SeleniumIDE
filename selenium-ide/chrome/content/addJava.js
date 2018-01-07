function setUpJava(){
	LOG.warn("about to initialise java?");
	window['inst'] = initialiseInst();
	LOG.warn("finished initialise java?");
	window['lastelement'] = null;
	//window['currentProject'] = "";
	//window['projectError'] = "";
	window['working'] = "no";
	window['workingproject'] = "no";
	window['loadProject'] = function(locator) {
	  //LOG.warn("starting to load Load Project "+locator +);
	  try{
		var result = window['inst'].initialiseProject(locator, Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get('AUTOMATED_HOME')+"/");
		}catch(e){
		LOG.warn(e.message);
	  }
	  LOG.warn("finished Load Project");
	  LOG.warn(result);
	};
	var result = window['inst'].initialiseProject(window['currentProject'], Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get('AUTOMATED_HOME')+"/");
}

function initialiseInst(){
  if (window['inst']!=undefined) {
      LOG.warn("inst is defined...");
      return window['inst'];
  }
  LOG.warn("INITIALISING INST!");
  LOG.warn("inst is undefined...");
  var basePath = Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get('AUTOMATED_HOME');
  var fullPath = 'file:///' + basePath + '/ScenarioFramework-jar-with-dependencies.jar';

  LOG.warn("full path = "+fullPath);
  
  var extensionUrl = "file:///" + basePath +'/javaFirefoxExtensionUtils.jar';  
  var classLoaderJarpath = extensionUrl;  
  var myJarpath = fullPath;   
  var testTidy = "file:///" + basePath +'/jtidy-r938.jar'; 
    
  var urlArray = []; 
  urlArray[0] = new java.net.URL(myJarpath);  
  urlArray[1] = new java.net.URL(classLoaderJarpath);  
  //urlArray[2] = new java.net.URL(testTidy); 
  var cl = java.net.URLClassLoader.newInstance(urlArray);  
  
  function policyAdd (loader, urls) {  
        try {       
            var str = 'edu.mit.simile.javaFirefoxExtensionUtils.URLSetPolicy';  
            var policyClass = java.lang.Class.forName(  
                   str,  
                   true,  
                   loader  
            );  
            var policy = policyClass.newInstance();  
            policy.setOuterPolicy(java.security.Policy.getPolicy());  
            java.security.Policy.setPolicy(policy);  
            policy.addPermission(new java.security.AllPermission());  
            //for (var j=0; j < urls.length; j++) {  
            //    policy.addURL(urls[j]);  
            //}  
            java.lang.System.setSecurityManager(null);
            
    	var t = java.lang.Thread.currentThread().setContextClassLoader(cl);
    	
    	//var packagesClass = cl.loadClass("edu.mit.simile.firefoxClassLoader.Packages");
    	//this._packages = packagesClass.newInstance();
        }catch(e) {  
        	//var jvm = Components.classes["@mozilla.org/oji/jvm-mgr;1"].getService(Components.interfaces.nsIJVMManager);
    			//jvm.showJavaConsole();
           logExc(e);
        }  
  }  

  policyAdd(cl, urlArray);  
  
  
  var classToLoad = "scenario.framework.main.SeleniumRunner";
  var aClass = cl.loadClass(classToLoad);
  //var aClass = java.lang.Class.forName(classToLoad, true, cl);
  //if (typeof inst == undefined) {
  window['inst'] = aClass.newInstance();
  //}
  
  //var aClass = cl.loadClass("org.w3c.tidy.Tidy");
  //var tidyClass = java.lang.Class.forName("org.w3c.tidy.Tidy", true, cl);
  //var tidyInstance = tidyClass.newInstance();
  LOG.warn("finished loading add Java");
  return window['inst'];
  };