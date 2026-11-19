window.Widgets = {};
(function(){
function fit(cv, h){
  var d = Math.min(2, window.devicePixelRatio || 1);
  var w = cv.clientWidth || cv.parentNode.clientWidth || 600;
  cv.width = Math.round(w * d); cv.height = Math.round(h * d);
  var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0);
  return {ctx: ctx, w: w, h: h};
}
function live(cv){ var s = cv.closest("section"); return s && s.classList.contains("on"); }

// ---- trig ----
window.Widgets.initTrig = function(){
  var cv = document.getElementById("trigCv"); if(!cv) return;
  var ang = 0.7, drag = false;
  function setFromEvent(ev){
    var r = cv.getBoundingClientRect();
    var S = {w: r.width, h: 300}, cx = S.w / 2, cy = S.h / 2, R = Math.min(S.w, S.h) * 0.36;
    var mx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
    var my = (ev.touches ? ev.touches[0].clientY : ev.clientY) - r.top;
    ang = Math.atan2(-(my - cy), mx - cx);
    if(ang < 0) ang += Math.PI * 2;
    var sl = document.getElementById("trigAng"); if(sl) sl.value = ang;
  }
  cv.addEventListener("pointerdown", function(e){ drag = true; cv.setPointerCapture(e.pointerId); setFromEvent(e); });
  cv.addEventListener("pointermove", function(e){ if(drag) setFromEvent(e); });
  cv.addEventListener("pointerup", function(){ drag = false; });
  var sl = document.getElementById("trigAng");
  if(sl) sl.oninput = function(){ ang = parseFloat(sl.value); };
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 300), ctx = S.ctx, W = S.w, H = S.h;
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36;
    var c = Math.cos(ang), s = Math.sin(ang);
    var o = document.getElementById("trigAngO"); if(o) o.textContent = (ang * 180 / Math.PI).toFixed(1) + "°";
    var a = document.getElementById("trigSin"); if(a) a.textContent = s.toFixed(3);
    var b = document.getElementById("trigCos"); if(b) b.textContent = c.toFixed(3);
    var d = document.getElementById("trigTan");
    if(d) d.textContent = Math.abs(c) < 0.02 ? "undefined" : (s / c).toFixed(3);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(140,170,220,.35)";
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.strokeStyle = "#5ee7ff"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    var px = cx + c * R, py = cy - s * R;
    ctx.strokeStyle = "rgba(167,139,250,.8)";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, -ang, true); ctx.stroke();
    ctx.strokeStyle = "#5eff9c"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.strokeStyle = "#ffd479";
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.strokeStyle = "#ff6b8a";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(220,232,255,.8)"; ctx.font = "11px sans-serif";
    ctx.fillText("drag the dot", 12, 16);
  }
  frame();
};

// ---- algebra ----
window.Widgets.initAlgebra = function(){
  function gcd(a, b){ return b ? gcd(b, a % b) : a; }
  function render(){
    var n = Math.max(2, Math.min(12, parseInt((document.getElementById("znN") || {}).value || 6, 10)));
    var t = "<table class='cayley'><tr><th>+</th>";
    for(var i = 0; i < n; i++) t += "<th>" + i + "</th>";
    t += "</tr>";
    for(var a = 0; a < n; a++){
      t += "<tr><th>" + a + "</th>";
      for(var b = 0; b < n; b++) t += "<td>" + ((a + b) % n) + "</td>";
      t += "</tr>";
    }
    var el = document.getElementById("znTable"); if(el) el.innerHTML = t + "</table>";
    var gens = [];
    for(var k = 0; k < n; k++) if(gcd(k, n) === 1) gens.push(k);
    var g = document.getElementById("znGen");
    if(g) g.innerHTML = "generators of Z<sub>" + n + "</sub>: <b>" + gens.join(", ") + "</b> — elements k with gcd(k," + n + ") = 1 (φ(" + n + ") = " + gens.length + ")";
  }
  var inp = document.getElementById("znN");
  if(inp) inp.oninput = render;
  render();
  var cv = document.getElementById("d3Cv");
  if(cv){
    var word = [], shown = "e";
    var target = 0, cur = 0;
    var log = document.getElementById("d3Word");
    function triPts(rot, flip){
      var S = {w: cv.clientWidth || 300, h: 300};
      var cx = S.w / 2, cy = S.h / 2 + 10, R = 80;
      var P = [];
      for(var i = 0; i < 3; i++){
        var a = -Math.PI / 2 + i * 2 * Math.PI / 3 + rot;
        var x = Math.cos(a) * R, y = Math.sin(a) * R;
        if(flip) x = -x;
        P.push([cx + x, cy + y]);
      }
      return P;
    }
    function draw(){
      var S = fit(cv, 300), ctx = S.ctx, W = S.w, H = S.h;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(140,170,220,.3)";
      ctx.beginPath(); ctx.arc(W / 2, H / 2 + 10, 84, 0, 7); ctx.stroke();
      var flips = word.filter(function(x){ return x === "s"; }).length % 2;
      var rots = word.filter(function(x){ return x === "r"; }).length % 3;
      cur += ((rots * 2 * Math.PI / 3 + (flips ? Math.PI : 0) + target * 0) - cur) * 0.12;
      var P = triPts(cur, flips);
      ctx.fillStyle = "rgba(94,231,255,.15)";
      ctx.strokeStyle = "#5ee7ff"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(P[0][0], P[0][1]); ctx.lineTo(P[1][0], P[1][1]); ctx.lineTo(P[2][0], P[2][1]);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px sans-serif";
      P.forEach(function(p, i){ ctx.fillText("ABC"[i], p[0] - 4, p[1] + 4); });
      requestAnimationFrame(draw);
    }
    draw();
    function push(sym){
      word.push(sym);
      var flips = word.filter(function(x){ return x === "s"; }).length % 2;
      var rots = word.filter(function(x){ return x === "r"; }).length % 3;
      var names = {e:"e", 1:"r", 2:"r²"};
      shown = flips ? (rots ? "r" + (rots > 1 ? "²" : "") + "s" : "s") : (names[rots] || "e");
      if(log) log.innerHTML = "word: <b>" + (word.join("·") || "e") + "</b> = <b>" + shown + "</b>";
    }
    var b1 = document.getElementById("d3r"); if(b1) b1.onclick = function(){ push("r"); };
    var b2 = document.getElementById("d3f"); if(b2) b2.onclick = function(){ push("s"); };
    var b3 = document.getElementById("d3Reset");
    if(b3) b3.onclick = function(){ word = []; shown = "e"; if(log) log.innerHTML = "word: <b>e</b> = <b>e</b>"; };
    var dt = document.getElementById("d3Table");
    if(dt){
      var els = ["e", "r", "r²", "s", "rs", "r²s"];
      function mul(a, b){
        var pa = {e:[0,0], r:[1,0], "r²":[2,0], s:[0,1], rs:[1,1], "r²s":[2,1]}[a];
        var pb = {e:[0,0], r:[1,0], "r²":[2,0], s:[0,1], rs:[1,1], "r²s":[2,1]}[b];
        var f = (pa[1] + (pa[1] ? -pb[0] : pb[0])) % 3; if(f < 0) f += 3;
        var fl = (pa[1] + pb[1]) % 2;
        return els.find(function(e){
          var pe = {e:[0,0], r:[1,0], "r²":[2,0], s:[0,1], rs:[1,1], "r²s":[2,1]}[e];
          return pe[0] === ((f % 3) + 3) % 3 && pe[1] === fl;
        });
      }
      var h = "<table class='cayley'><tr><th>·</th>" + els.map(function(e){ return "<th>" + e + "</th>"; }).join("") + "</tr>";
      els.forEach(function(a){ h += "<tr><th>" + a + "</th>" + els.map(function(b){ return "<td>" + mul(a, b) + "</td>"; }).join("") + "</tr>"; });
      dt.innerHTML = h + "</table>";
    }
  }
};

// ---- bifurcation ----
window.Widgets.initBifurcation = function(){
  var cv = document.getElementById("bifurCv");
  if(cv){
    var cache = null;
    function compute(){
      var W = 220, H = 120, img = [];
      for(var i = 0; i < W; i++){
        var r = 2.5 + (i / W) * 1.5, x = 0.5;
        for(var k = 0; k < 300; k++) x = r * x * (1 - x);
        var col = [];
        for(var k2 = 0; k2 < 80; k2++){ x = r * x * (1 - x); col.push(x); }
        img.push(col);
      }
      cache = img;
    }
    compute();
    function draw(){
      if(!live(cv)){ requestAnimationFrame(draw); return; }
      var S = fit(cv, 300), ctx = S.ctx, W = S.w, H = S.h;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(94,231,255,.8)";
      cache.forEach(function(col, i){
        var x = (i / cache.length) * W;
        col.forEach(function(v){ ctx.fillRect(x, H - v * H, 1, 1); });
      });
      var r = parseFloat((document.getElementById("logR") || {}).value || 3.7);
      var lx = ((r - 2.5) / 1.5) * W;
      ctx.strokeStyle = "#ffd479"; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
      ctx.fillStyle = "rgba(220,232,255,.7)"; ctx.font = "11px sans-serif";
      ctx.fillText("r: 2.5 → 4.0  (logistic bifurcation)", 10, 14);
      requestAnimationFrame(draw);
    }
    draw();
  }
  var oc = document.getElementById("orbitCv");
  if(oc){
    function frame(){
      requestAnimationFrame(frame);
      if(!live(oc)) return;
      var S = fit(oc, 300), ctx = S.ctx, W = S.w, H = S.h;
      var r = parseFloat((document.getElementById("logR") || {}).value || 3.7);
      var x0 = parseFloat((document.getElementById("logX0") || {}).value || 0.5);
      var o1 = document.getElementById("logRO"); if(o1) o1.textContent = r.toFixed(3);
      var o2 = document.getElementById("logX0O"); if(o2) o2.textContent = x0.toFixed(2);
      var x = x0;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1.4; ctx.beginPath();
      for(var i = 0; i < W; i++){
        x = r * x * (1 - x);
        var y = H - x * H;
        if(i) ctx.lineTo(i, y); else ctx.moveTo(i, y);
      }
      ctx.stroke();
      var rg = document.getElementById("logRegime");
      if(rg) rg.textContent = r < 3 ? "settles to a fixed point" : r < 3.449 ? "2-cycle" : r < 3.57 ? "period doubling cascade" : "chaotic (positive Lyapunov)";
    }
    frame();
  }
};
})();
