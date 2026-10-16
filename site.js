(function(){
  var b=document.getElementById("menuBtn"), n=document.getElementById("mainNav");
  if(b&&n){
    b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Close menu":"Open menu");});
    n.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){n.classList.remove("open");b.setAttribute("aria-expanded","false");});});
  }
  function copyText(text,btn){
    try{
      navigator.clipboard.writeText(text).then(function(){var o=btn.textContent;btn.textContent="Copied";setTimeout(function(){btn.textContent=o;},1500);},function(){btn.textContent="Select to copy";});
    }catch(e){btn.textContent="Select to copy";}
  }
  document.querySelectorAll("[data-copy]").forEach(function(btn){
    btn.addEventListener("click",function(){var el=document.getElementById(btn.getAttribute("data-copy"));if(el)copyText(el.textContent,btn);});
  });
  var f=document.getElementById("enq");
  if(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var v=function(id){var el=document.getElementById(id);return el?el.value.trim():"";};
      var out=document.getElementById("out");
      if(!v("f-name")){out.textContent="Please enter your name so we know who to reply to.";out.classList.add("show");return;}
      var lines=["Enquiry for Gillani Group","Name: "+v("f-name")];
      if(v("f-company"))lines.push("Company: "+v("f-company"));
      lines.push("Topic: "+v("f-topic"));
      if(v("f-msg"))lines.push("Message: "+v("f-msg"));
      out.textContent=lines.join("\n");out.classList.add("show");
      var note=document.getElementById("note");
      note.innerHTML='Your enquiry is ready. <button class="copy" type="button" id="copyEnq">Copy enquiry</button> Then send it to us on WhatsApp at +40 773 752 078.';
      document.getElementById("copyEnq").addEventListener("click",function(ev){copyText(out.textContent,ev.target);});
    });
  }
})();
