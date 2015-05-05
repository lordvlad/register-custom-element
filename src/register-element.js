(function(){
  var noop = function(){}
  var CustomElement = (function(){
    var p = Object.create(HTMLElement.prototype).__proto__;
    Object.keys(events.EventEmitter.prototype).forEach(function(k){
      p[k] = events.EventEmitter.prototype[k];
    });

    p.createdCallback = function(){
      var shadow = this.createShadowRoot();
      var el = this.template.content.cloneNode(true);
      shadow.appendChild(el);
      (this.onCreate||noop).apply(this, arguments);
      this.emit("created");
    }
    p.attachedCallback = function(){
      (this.onAttach||noop).apply(this, arguments);
      this.emit("attached");
    }
    p.detachedCallback = function(){
      (this.onDetached||noop).apply(this, arguments);
      this.emit("detached");
    }
    p.attributeChangedCallback = function(){
      (this.onChange||this.onchange||noop).apply(this, arguments);
      this.emit.apply(this, ["change"].concat(arguments))
    }

    return p;
  }());
  /**
   * @param {String} n element name
   * @param {Object} x prototype containing livecycle event handlers
   */
   window.registerCustomElement = function(n, x){
    var p = Object.create(CustomElement);
    p.template = (document._currentScript||document.currentScript).ownerDocument.querySelector("template");
    if (x && typeof x === "object")
      Object.keys(x).forEach(function(k){p[k] = x[k];})
    document.registerElement(n, {prototype: p});
  }
}())
