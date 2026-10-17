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

  // hero network: slow-drifting gold points joined by fine lines
  var cv=document.querySelector(".hero-net");
  if(cv&&cv.getContext){
    var ctx=cv.getContext("2d"),pts=[],W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),run=true,raf=0;
    var still=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.round(Math.min(70,Math.max(24,W*H/16000)));pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+.6});}
    function draw(){ctx.clearRect(0,0,W,H);var max=150;
      for(var i=0;i<pts.length;i++){var p=pts[i];
        if(!still){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
        for(var j=i+1;j<pts.length;j++){var q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<max){ctx.strokeStyle="rgba(217,188,120,"+(0.34*(1-d/max))+")";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
        ctx.fillStyle="rgba(217,188,120,.75)";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();}
      if(run&&!still)raf=requestAnimationFrame(draw);}
    size();draw();
    var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){size();if(still)draw();},150);});
    if("IntersectionObserver" in window){new IntersectionObserver(function(e){var v=e[0].isIntersecting;if(v&&!run&&!still){run=true;draw();}else if(!v){run=false;cancelAnimationFrame(raf);}}).observe(cv);}
    document.addEventListener("visibilitychange",function(){if(document.hidden){run=false;cancelAnimationFrame(raf);}else if(!still&&!run){run=true;draw();}});
  }

  // Lottie scene players: each division plays several scenes in turn (each at least ~12 s)
  var SEQ={trade:["trade-1","trade-2","trade-3"],fashion:["fashion-1","fashion-2","fashion-3","fashion-4"],recruit:["recruit-1"],hero:["trade-3","fashion-1","recruit-1","trade-2","fashion-3","recruit-1","trade-1","fashion-4","recruit-1","fashion-2"]};
  var lots=document.querySelectorAll(".lot[data-anim]");
  if(lots.length&&"IntersectionObserver" in window&&window.fetch&&window.Promise){
    var sEl=document.querySelector('script[src*="site.js"]'),base=sEl?sEl.src.replace(/site\.js.*$/,""):"";var qv=sEl&&sEl.src.indexOf("?")>0?sEl.src.slice(sEl.src.indexOf("?")):"";
    var calm=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,lib=null,cache={};
    function getLib(){if(lib)return lib;lib=new Promise(function(ok,no){var s=document.createElement("script");s.src=base+"assets/js/lottie_light.min.js"+qv;s.onload=function(){ok(window.lottie)};s.onerror=no;document.head.appendChild(s);});return lib;}
    function getData(n){if(!cache[n])cache[n]=new Promise(function(ok,no){var L=window.__LOT||{};if(L[n])return ok(L[n]);var s=document.createElement("script");s.src=base+"assets/anim/"+n+".js"+qv;s.onload=function(){var d=(window.__LOT||{})[n];d?ok(d):no();};s.onerror=no;document.head.appendChild(s);});return cache[n];}
    function fit(a,box){try{var svg=box.querySelector("svg");if(!svg)return;var g=svg.querySelector("g"),x1=1e9,y1=1e9,x2=-1e9,y2=-1e9,n=8,cur=a.currentFrame;
      for(var k=0;k<n;k++){a.goToAndStop(Math.floor(a.totalFrames*k/n),true);var b=g.getBBox();if(b.width>0&&b.height>0){x1=Math.min(x1,b.x);y1=Math.min(y1,b.y);x2=Math.max(x2,b.x+b.width);y2=Math.max(y2,b.y+b.height);}}
      a.goToAndStop(cur,true);var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height;
      x1=Math.max(0,x1);y1=Math.max(0,y1);x2=Math.min(W,x2);y2=Math.min(H,y2);var w=x2-x1,h=y2-y1;
      if(w>W*0.2&&h>H*0.2&&(w<W*0.92||h<H*0.92)){var p=Math.max(w,h)*0.04;svg.setAttribute("viewBox",(x1-p)+" "+(y1-p)+" "+(w+2*p)+" "+(h+2*p));}}catch(e){}}
    function Player(el){
      var list=SEQ[el.getAttribute("data-anim")]||[],i=0,cur=null,vis=false,timer=0,self=this,dots=null;
      var hero=el.parentNode.classList.contains("hero-show"),cap=hero?el.parentNode.querySelector(".hero-cap span"):null,labels=hero?(el.parentNode.getAttribute("data-labels")||"").split("|"):[];
      if(list.length>1&&!hero){dots=document.createElement("div");dots.className="lot-dots";list.forEach(function(){dots.appendChild(document.createElement("i"));});el.parentNode.appendChild(dots);}
      function mark(){if(cap){var k={trade:0,fashion:1,recruit:2}[list[i].split("-")[0]];if(labels[k]){cap.parentNode.classList.remove("in");void cap.offsetWidth;cap.textContent=labels[k];cap.parentNode.classList.add("in");}}if(dots)[].forEach.call(dots.children,function(d,k){d.classList.toggle("on",k===i);});}
      function show(n){
        Promise.all([getLib(),getData(list[n])]).then(function(v){
          var box=document.createElement("div");box.className="sc";el.appendChild(box);
          var a=v[0].loadAnimation({container:box,renderer:"svg",loop:!calm,autoplay:false,animationData:v[1],rendererSettings:{preserveAspectRatio:"xMidYMid meet"}});
          a.addEventListener("DOMLoaded",function(){
            if(!/^trade-[12]$/.test(list[n]))fit(a,box);
            if(calm)a.goToAndStop(Math.floor(a.totalFrames*0.6),true);else if(vis)a.play();
            requestAnimationFrame(function(){box.classList.add("on");});
            el.parentNode.classList.add("lot-on");
            var old=cur;cur={a:a,box:box,start:Date.now(),played:0};i=n;mark();
            if(old){old.box.classList.remove("on");setTimeout(function(){old.a.destroy();old.box.remove();},800);}
            if(!calm&&list.length>1){var dur=a.totalFrames/a.frameRate*1000,loops=Math.max(1,Math.ceil((hero?10000:12000)/dur));
              cur.need=loops;a.addEventListener("loopComplete",function(){if(cur&&cur.a===a&&++cur.played>=cur.need)next();});
              getData(list[(n+1)%list.length]);}
          });
        }).catch(function(){});
      }
      function next(){show((i+1)%list.length);}
      this.vis=function(v){vis=v;if(!cur){if(v&&!self.started){self.started=1;show(0);}return;}if(calm)return;if(v)cur.a.play();else cur.a.pause();};
    }
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var el=e.target;if(!el._p)el._p=new Player(el);el._p.vis(e.isIntersecting);});},{rootMargin:"150px 0px"});
    for(var li=0;li<lots.length;li++){var le=lots[li];if(le.parentNode.classList.contains("hero-show")){le._p=new Player(le);le._p.vis(true);}io.observe(le);}
  }
  setTimeout(function(){document.documentElement.classList.add("anim-done");},3500);
})();
