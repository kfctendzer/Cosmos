window.Aero = {};
(function(){
function fit(cv, h){
  var d = Math.min(2, window.devicePixelRatio || 1);
  var w = cv.clientWidth || cv.parentNode.clientWidth || 600;
  cv.width = Math.round(w * d); cv.height = Math.round(h * d);
  var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0);
  return {ctx: ctx, w: w, h: h};
}
function live(cv){ var s = cv.closest("section"); return s && s.classList.contains("on"); }
function naca(m, p, t, x){
  var yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1036 * x * x * x * x);
  var yc, dyc;
  if(x < p){ yc = m / (p * p) * (2 * p * x - x * x); dyc = 2 * m / (p * p) * (p - x); }
  else { yc = m / ((1 - p) * (1 - p)) * ((1 - 2 * p) + 2 * p * x - x * x); dyc = 2 * m / ((1 - p) * (1 - p)) * (p - x); }
  return {yt: yt, yc: yc, dyc: dyc};
}
window.Aero.init = function(){
  var cv = document.getElementById("aeroCv"); if(!cv) return;
  var P = [];
  for(var i = 0; i < 240; i++) P.push({x: Math.random(), y: Math.random(), s: 0.7 + Math.random() * 0.6});
  function par(id){ return parseFloat((document.getElementById(id) || {}).value || 0); }
  var dragA = false;
  function setA(e){
    var r = cv.getBoundingClientRect();
    var my = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    var a = 12 - (my / r.height) * 28;
    a = Math.max(-10, Math.min(20, a));
    var sl = document.getElementById("aeroAlpha"); if(sl) sl.value = a;
  }
  cv.style.cursor = "ns-resize";
  cv.addEventListener("pointerdown", function(e){ dragA = true; cv.setPointerCapture(e.pointerId); setA(e); });
  cv.addEventListener("pointermove", function(e){ if(dragA) setA(e); });
  cv.addEventListener("pointerup", function(){ dragA = false; });
  document.querySelectorAll("[data-preset]").forEach(function(b){
    b.onclick = function(){
      var pr = {paper: [0, 3, 2, 6], cessna: [2, 4, 12, 28], airliner: [2, 4, 12, 250], fighter: [1, 4, 5, 300]}[b.getAttribute("data-preset")];
      document.getElementById("aeroCamber").value = pr[0];
      document.getElementById("aeroThick").value = pr[2];
      document.getElementById("aeroSpeed").value = pr[3];
      document.getElementById("aeroAlpha").value = b.getAttribute("data-preset") === "paper" ? 5 : 3;
    };
  });
  function shape(m, t, W, H){
    var cx = W * 0.5, ch = Math.min(W, H) * 0.42, cy = H * 0.52;
    var up = [], lo = [];
    for(var i = 0; i <= 60; i++){
      var x = i / 60, n = naca(m, 0.4, t, x), th = Math.atan(n.dyc);
      up.push([cx - ch * 0.3 + x * ch, cy - (n.yc + n.yt) * ch]);
      lo.push([cx - ch * 0.3 + x * ch, cy - (n.yc - n.yt) * ch]);
    }
    return {up: up, lo: lo, cx: cx, ch: ch, cy: cy};
  }
  function field(px, py, U, alpha, Cl, sh){
    var a = alpha * Math.PI / 180;
    var dx = px - (sh.cx - sh.ch * 0.05), dy = py - sh.cy;
    var ca = Math.cos(-a), sa = Math.sin(-a);
    var lx = (dx * ca - dy * sa) / sh.ch + 0.3, ly = (dx * sa + dy * ca) / sh.ch;
    var vx = U, vy = 0;
    if(lx > -0.3 && lx < 1.5){
      var n = naca(0.02, 0.4, 0.12, Math.max(0, Math.min(1, lx)));
      var dTop = (ly + (n.yc + n.yt)) , dBot = (ly + (n.yc - n.yt));
      var near = Math.exp(-Math.pow(Math.min(Math.abs(dTop), Math.abs(dBot)) * 6, 2));
      vx += U * near * 0.9 * (ly < -n.yc ? 1 : -0.25);
      vy += -U * near * 0.55 * Math.sign(ly + n.yc || 1) * -1;
      var r2 = dx * dx + dy * dy + 400;
      vx += -U * Cl * 2.2 * (-dy) / r2;
      vy += U * Cl * 2.2 * (dx) / r2;
    }
    var ca2 = Math.cos(a), sa2 = Math.sin(a);
    return [vx * ca2, vx * sa2 + vy + U * Math.sin(a) * 0.9];
  }
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 420), ctx = S.ctx, W = S.w, H = S.h;
    var alpha = par("aeroAlpha"), V = Math.max(1, par("aeroSpeed") || 28);
    var m = (par("aeroCamber") || 2) / 100, t = (par("aeroThick") || 12) / 100;
    var a0 = -4 * m * 180 / Math.PI * 0.25;
    var ae = alpha - a0;
    var stalled = Math.abs(ae) > 15;
    var Cl = 2 * Math.PI * ae * Math.PI / 180;
    if(stalled) Cl *= Math.max(0.35, 1 - (Math.abs(ae) - 15) * 0.09);
    var Cd = 0.008 + 0.05 * t + Cl * Cl / (Math.PI * 8);
    var ao = document.getElementById("aeroAlphaO"); if(ao) ao.textContent = alpha.toFixed(1) + "° — drag wing to change";
    var so = document.getElementById("aeroSpeedO"); if(so) so.textContent = V.toFixed(0) + " m/s";
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(140,170,220,.12)";
    for(var gx = 0; gx < W; gx += 44){ ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    var sh = shape(m, t, W, H);
    var U = 60 + V * 1.2;
    P.forEach(function(p){
      var px = p.x * W, py = p.y * H;
      var v = field(px, py, U, alpha, Cl, sh);
      var sp = Math.hypot(v[0], v[1]);
      p.x += v[0] * 0.016 * p.s / U * (U / 90); p.y += v[1] * 0.016 * p.s / U * (U / 90);
      if(p.x > 1.02){ p.x = -0.02; p.y = Math.random(); }
      if(p.y < -0.05) p.y = 1.0; if(p.y > 1.05) p.y = 0.0;
      var f = Math.max(0, Math.min(1, (sp / U - 0.7) / 0.9));
      ctx.fillStyle = f < 0.5 ? "rgba(94,160,255," + (0.35 + f) + ")" : "rgba(255,240,200," + (0.35 + f * 0.6) + ")";
      ctx.fillRect(p.x * W, p.y * H, 2.4, 2.4);
    });
    var a = alpha * Math.PI / 180;
    ctx.save();
    ctx.translate(sh.cx + sh.ch * 0.2, sh.cy); ctx.rotate(-a); ctx.translate(-(sh.cx + sh.ch * 0.2), -sh.cy);
    ctx.fillStyle = stalled ? "rgba(255,90,110,.9)" : "rgba(94,231,255,.85)";
    ctx.beginPath();
    ctx.moveTo(sh.up[0][0], sh.up[0][1]);
    sh.up.forEach(function(q){ ctx.lineTo(q[0], q[1]); });
    for(var k = sh.lo.length - 1; k >= 0; k--) ctx.lineTo(sh.lo[k][0], sh.lo[k][1]);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(220,232,255,.8)"; ctx.font = "11px sans-serif";
    ctx.fillText("blue = slow air · white = fast air · red wing = STALLED", 12, 16);
    function set(id, v){ var e = document.getElementById(id); if(e) e.textContent = v; }
    set("aeroCl", Cl.toFixed(2) + (stalled ? " STALLED" : ""));
    set("aeroCd", Cd.toFixed(3));
    set("aeroLD", (Cl / Cd).toFixed(1) + " : 1");
    var q = 0.5 * 1.225 * V * V;
    set("aeroLift", (q * Cl * 16).toFixed(0) + " N (16 m² wing)");
    var w = document.getElementById("aeroWarn");
    if(w){
      w.textContent = stalled ? "⚠ STALL — flow separated, lift collapsing, drag spiking" :
        Math.abs(ae) > 12 ? "near stall — ease off the angle" : "smooth attached flow";
      w.style.color = stalled ? "#ff6b8a" : Math.abs(ae) > 12 ? "#ffd479" : "#5eff9c";
    }
    drawPolar(alpha, Cl, a0);
  }
  function drawPolar(alpha, Cl, a0){
    var pc = document.getElementById("aeroPolar"); if(!pc || !live(pc)) return;
    var S2 = fit(pc, 300), ctx = S2.ctx, W2 = S2.w, H2 = S2.h;
    ctx.clearRect(0, 0, W2, H2);
    function X(a){ return ((a + 10) / 32) * W2; }
    function Y(c){ return H2 - ((c + 0.8) / 3.2) * H2; }
    ctx.strokeStyle = "rgba(140,170,220,.3)";
    ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(W2, Y(0)); ctx.stroke();
    ctx.strokeStyle = "#5ee7ff"; ctx.lineWidth = 1.6; ctx.beginPath();
    for(var a = -10; a <= 22; a += 0.25){
      var ae = a - a0, c = 2 * Math.PI * ae * Math.PI / 180;
      if(Math.abs(ae) > 15) c *= Math.max(0.35, 1 - (Math.abs(ae) - 15) * 0.09);
      if(a === -10) ctx.moveTo(X(a), Y(c)); else ctx.lineTo(X(a), Y(c));
    }
    ctx.stroke();
    ctx.fillStyle = "#ffd479";
    ctx.beginPath(); ctx.arc(X(alpha), Y(Cl), 4, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(220,232,255,.7)"; ctx.font = "11px sans-serif";
    ctx.fillText("Cl vs angle of attack (thin-airfoil + stall model)", 10, 14);
  }
  frame();
};
})();
