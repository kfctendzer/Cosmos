window.App = {};
(function(){
function stars(){
  var cv = document.getElementById("stars"); if(!cv) return;
  function size(){
    cv.width = innerWidth; cv.height = innerHeight;
  }
  size(); addEventListener("resize", size);
  var ctx = cv.getContext("2d"), S = [], shots = [];
  for(var i = 0; i < 160; i++) S.push({x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3, p: Math.random() * 7});
  var mx = 0.5, my = 0.5;
  addEventListener("pointermove", function(e){ mx = e.clientX / innerWidth; my = e.clientY / innerHeight; }, {passive: true});
  (function loop(t){
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, cv.width, cv.height);
    if(Math.random() < 0.008 && shots.length < 3) shots.push({x: Math.random() * 0.7 + 0.2, y: Math.random() * 0.3, v: 0.006 + Math.random() * 0.006, life: 1});
    S.forEach(function(s){
      var a = 0.35 + 0.4 * Math.abs(Math.sin(t / 1600 + s.p));
      var px = (s.x + (mx - 0.5) * 0.03 * s.r) * cv.width, py = (s.y + (my - 0.5) * 0.03 * s.r) * cv.height;
      ctx.fillStyle = "rgba(200,225,255," + a.toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(px, py, s.r, 0, 7); ctx.fill();
    });
    shots.forEach(function(s){ s.x -= s.v; s.y += s.v * 0.4; s.life -= 0.02; });
    shots = shots.filter(function(s){ return s.life > 0; });
    ctx.strokeStyle = "rgba(180,220,255,.7)"; ctx.lineWidth = 1.5;
    shots.forEach(function(s){
      var grad = ctx.createLinearGradient(s.x * cv.width, s.y * cv.height, (s.x + 0.05 * s.life) * cv.width, (s.y - 0.02 * s.life) * cv.height);
      grad.addColorStop(0, "rgba(200,230,255," + (s.life * 0.8).toFixed(2) + ")");
      grad.addColorStop(1, "rgba(200,230,255,0)");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(s.x * cv.width, s.y * cv.height);
      ctx.lineTo((s.x + 0.05 * s.life) * cv.width, (s.y - 0.02 * s.life) * cv.height);
      ctx.stroke();
    });
  })(0);
}
function tabs(){
  var btns = Array.prototype.slice.call(document.querySelectorAll("nav.tabs button"));
  btns.forEach(function(b){
    b.onclick = function(){
      btns.forEach(function(x){ x.classList.toggle("on", x === b); });
      document.querySelectorAll("section.panel").forEach(function(s){
        s.classList.toggle("on", s.id === "tab-" + b.getAttribute("data-tab"));
      });
      reveal();
      scrollTo({top: 0, behavior: "smooth"});
    };
  });
}
function reveal(){
  document.querySelectorAll(".reveal").forEach(function(el){
    var r = el.getBoundingClientRect();
    if(r.top < innerHeight * 0.92) el.classList.add("in");
  });
}
function particles(){
  var g = document.getElementById("pGrid"); if(!g) return;
  var info = document.getElementById("pInfo");
  var fam = {q: "quarks — feel all forces, locked inside hadrons", l: "leptons — ignore the strong force, roam free", b: "bosons — force carriers (+ the Higgs field quantum)"};
  var filt = "all";
  function draw(){
    g.innerHTML = "";
    window.COSMOS.PARTICLES.filter(function(p){ return filt === "all" || p.cls === filt; }).forEach(function(p){
      var d = document.createElement("div");
      d.className = "pcell " + p.cls;
      d.innerHTML = "<div class='s'>" + p.s + "</div><div class='nm'>" + p.nm + "</div><div class='m'>" + p.mass + " · Q " + p.charge + " · spin " + p.spin + "</div>";
      d.onclick = function(){
        g.querySelectorAll(".pcell").forEach(function(x){ x.classList.remove("on"); });
        d.classList.add("on");
        if(info) info.innerHTML = "<b>" + p.s + " — " + p.nm + "</b> (" + fam[p.cls] + ")<br>mass " + p.mass + " · charge " + p.charge + " · spin " + p.spin + "<br><span class='muted'>" + p.fact + "</span>";
      };
      g.appendChild(d);
    });
  }
  document.querySelectorAll("[data-fam]").forEach(function(b){
    b.onclick = function(){
      filt = b.getAttribute("data-fam");
      document.querySelectorAll("[data-fam]").forEach(function(x){ x.classList.toggle("on", x === b); });
      draw();
    };
  });
  draw();
  if(info) info.innerHTML = "Tap any particle for its story — or filter by family above. Quarks feel the strong force, leptons don't, bosons carry forces.";
}
function guide(){
  var g = document.getElementById("guideList"); if(!g) return;
  window.COSMOS.GUIDE.forEach(function(sec){
    var d = document.createElement("div");
    d.className = "guideItem reveal";
    d.innerHTML = "<h4>" + sec.t + "</h4><ul class='tight'>" + sec.b.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>";
    g.appendChild(d);
  });
}
document.addEventListener("DOMContentLoaded", function(){
  stars(); tabs(); particles(); guide();
  addEventListener("scroll", reveal, {passive: true});
  reveal();
  try{
    window.Viz.initTesseract();
    window.Viz.initTopology();
    window.Viz.initLorenz();
    window.Viz.initSolar();
    window.Viz.initBlackhole();
    window.Widgets.initTrig();
    window.Widgets.initAlgebra();
    window.Widgets.initBifurcation();
    if(window.Neutron) window.Neutron.init();
    if(window.Periodic) window.Periodic.init();
    if(window.Aero) window.Aero.init();
    var nb = document.getElementById("nsBeams");
    if(nb) nb.onclick = function(){ nb.classList.toggle("on"); };
  }catch(e){ console.error(e); }
});
})();
