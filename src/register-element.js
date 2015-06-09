(function(){
  var noop = function(){};
  
  function extend(a, b){
    if (arguments.length > 2)
    	[].slice.call(arguments, 1).forEach(function(c){extend(a, c)})
    else
    	Object.keys(b).forEach(function(k){a[k]=b[k]})
    return a;
  }
  
  function xhr(url){
	  return new Promise(function(resolve, reject){
		 var x = new XMLHttpRequest();
		 x.open("GET", url);
		 x.onload = resolve.bind(this, x);
		 x.onerror = reject.bind(this, x);
		 x.send(null);
	  });
  }
  
  function handleStyles(el){
      var extStyles = el.querySelectorAll('link[rel="stylesheet"]');
      [].forEach.call(extStyles, function(external){
        var inline = document.createElement("style");
        inline.setAttribute("scoped", true);
        el.replaceChild(inline, external);
        var href= external.getAttribute("href");
        href = (!href.match(/^http/) ? window.location.protocol : "") + href;
        xhr(href).then(function(req){
          inline.innerText = req.responseText.replace(/(url\(['"])([./]+[^"']+)/g, function(all, a, b){
        	  return a+ path.join(href, b);
          });
        });
      });
  }

  var proto = {
    createdCallback: function(){console.log(this.__proto__)
      var shadow = this.createShadowRoot();
      var el = this.template.content.cloneNode(true);
      handleStyles(el);
      shadow.appendChild(el);
      (this.onCreate||noop).apply(this, arguments);
      this.emit.apply(this, ["created"].concat(arguments));
    },  
    attachedCallback: function(){
      (this.onAttach||noop).apply(this, arguments);
      this.emit.apply(this, ["attached"].concat(arguments));
    },  
    detachedCallback: function(){
      (this.onDetached||noop).apply(this, arguments);
      this.emit.apply(this, ["detached"].concat(arguments));
    },  
    attributeChangedCallback: function(){
     (this.onChange||this.onchange||noop).apply(this, arguments);
     this.emit.apply(this, ["change"].concat(arguments));
    }
  };
  
  var CustomElement = document.registerElement("custom-element", {
    prototype: extend(Object.create(HTMLElement.prototype), events.EventEmitter.prototype, proto )
  });
  
  /**
   * @param {String} name element name
   * @param {Object} proto prototype containing lifecycle event handlers
   */
   window.registerCustomElement = function(name, proto){
    proto = proto || {};
    proto.template = proto.template || (document._currentScript||document.currentScript).ownerDocument.querySelector("template");
    return document.registerElement(name, {
      prototype: extend(Object.create(CustomElement.prototype), proto)
    });
  };
}());
