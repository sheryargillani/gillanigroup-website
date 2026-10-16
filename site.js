(function(){
  var b=document.getElementById("menuBtn"), n=document.getElementById("mainNav");
  if(b&&n){
    b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o);});
    n.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){n.classList.remove("open");b.setAttribute("aria-expanded","false");});});
  }
  // copy buttons
  document.querySelectorAll("[data-copy]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var el=document.getElementById(btn.getAttribute("data-copy")); if(!el)return;
      var o=btn.textContent;
      try{navigator.clipboard.writeText(el.textContent).then(function(){btn.textContent="✓";setTimeout(function(){btn.textContent=o;},1500);});}catch(e){}
    });
  });
  // scroll reveal
  var els=[].slice.call(document.querySelectorAll(".reveal"));
  function showAll(){els.forEach(function(e){e.classList.add("in");});}
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el=en.target, sib=[].slice.call(el.parentNode.children).filter(function(c){return c.classList.contains("reveal");});
          el.style.transitionDelay=(Math.min(sib.indexOf(el),5)*90)+"ms";
          el.classList.add("in"); io.unobserve(el);
        }
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:.08});
    els.forEach(function(e){io.observe(e);});
    setTimeout(showAll,4000); // safety: never leave content hidden
  } else showAll();
  // form result messages (?sent=request / ?error=contact)
  var q=new URLSearchParams(location.search), sent=q.get("sent"), err=q.get("error");
  if(sent||err){
    var key=sent||err, cls=sent?"ok":"err";
    var m=document.querySelector('.form-msg.'+cls+'[data-for="'+key+'"]');
    if(m){m.hidden=false; var f=m.closest("form"); if(f){f.classList.add("in"); f.scrollIntoView({block:"center"});}}
  }
})();
