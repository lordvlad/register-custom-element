window.NameBadge=registerCustomElement("name-badge", {
  onAttach: function(){
    var l=this.shadowRoot.querySelector(".outer").classList;
    setTimeout(function(){
      l.remove("zoom")
    },100)
  }
});
