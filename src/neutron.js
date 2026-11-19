window.Neutron = {};
(function(){
function fit(cv, h){
  var d = Math.min(2, window.devicePixelRatio || 1);
  var w = cv.clientWidth || cv.parentNode.clientWidth || 600;
  cv.width = Math.round(w * d); cv.height = Math.round(h * d);
  var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0);
  return {ctx: ctx, w: w, h: h};
}
function live(cv){ var s = cv.closest("section"); return s && s.classList.contains("on"); }
window.Neutron.init = function(){
  var cv = document.getElementById("nsCv"); if(!cv) return;
  var glitch = 0, t = 0;
  var gb = document.getElementById("nsGlitch");
  function fire(){ glitch = 1; }
  if(gb) gb.onclick = fire;
  cv.style.cursor = "pointer";
  cv.addEventListener("click", fire);
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 420), ctx = S.ctx, W = S.w, H = S.h;
    var M = parseFloat((document.getElementById("nsMass") || {}).value || 1.4);
    var hz = parseFloat((document.getElementById("nsSpin") || {}).value || 30);
    var beams = document.getElementById("nsBeams");
    var showBeams = !beams || beams.classList.contains("on");
    t += 0.016;
    if(glitch > 0) glitch -= 0.01;
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.13;
    ctx.clearRect(0, 0, W, H);
    var shakeX = glitch > 0 ? (Math.random() - 0.5) * 10 * glitch : 0;
    var shakeY = glitch > 0 ? (Math.random() - 0.5) * 10 * glitch : 0;
    var pulse = 0.5 + 0.5 * Math.sin(t * 4);
    var g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 4);
    g.addColorStop(0, "rgba(140,200,255,.5)");
    g.addColorStop(0.25 + pulse * 0.1, "rgba(90,140,255,.18)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    var ang = t * hz * 0.25;
    if(showBeams){
      for(var b = 0; b < 2; b++){
        var a = ang + b * Math.PI;
        var grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * W / 2, cy + Math.sin(a) * W / 2);
        grad.addColorStop(0, "rgba(150,210,255,.55)");
        grad.addColorStop(1, "rgba(150,210,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx + shakeX, cy + shakeY);
        ctx.arc(cx + shakeX, cy + shakeY, W / 2, a - 0.09, a + 0.09);
        ctx.closePath(); ctx.fill();
      }
    }
    var sg = ctx.createRadialGradient(cx - R * 0.3 + shakeX, cy - R * 0.3 + shakeY, R * 0.1, cx + shakeX, cy + shakeY, R);
    sg.addColorStop(0, "#eaf4ff");
    sg.addColorStop(0.55, "#9fc4ff");
    sg.addColorStop(1, "#2c4d8f");
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(cx + shakeX, cy + shakeY, R, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(160,210,255,.5)";
    ctx.beginPath(); ctx.arc(cx + shakeX, cy + shakeY, R * 1.35, ang * 0.3, ang * 0.3 + 4.2); ctx.stroke();
    ctx.fillStyle = "rgba(220,232,255,.75)"; ctx.font = "11px sans-serif";
    ctx.fillText("click the star = starquake glitch", 12, 16);
    var Rkm = 13.5 - (M - 1.0) * 1.8;
    var rs = 2.95 * M;
    var compact = rs / (2 * Rkm);
    var e1 = document.getElementById("nsRadius");
    if(e1) e1.textContent = "≈ " + Rkm.toFixed(1) + " km (a city)";
    var e2 = document.getElementById("nsCompact");
    if(e2) e2.textContent = "2GM/Rc² ≈ " + compact.toFixed(2) + " (BH = 1.0)";
    var e3 = document.getElementById("nsEsc");
    if(e3) e3.textContent = "≈ " + Math.round(299792 * Math.sqrt(rs / Rkm)).toLocaleString() + " km/s";
    var e4 = document.getElementById("nsSpinO");
    if(e4) e4.textContent = hz.toFixed(0) + " Hz (" + (hz * 60).toFixed(0) + " rpm)";
    var e5 = document.getElementById("nsGlitchO");
    if(e5) e5.textContent = glitch > 0 ? "GLITCH! crust cracked, spin jumped" : "stable rotator";
    var mo = document.getElementById("nsMassO");
    if(mo) mo.textContent = M.toFixed(2) + " M☉";
  }
  frame();
  var lc = document.getElementById("nsLightCv");
  if(lc){
    var ph = 0;
    (function loop(){
      requestAnimationFrame(loop);
      if(!live(lc)) return;
      var S2 = fit(lc, 300), ctx2 = S2.ctx, W2 = S2.w, H2 = S2.h;
      var hz2 = parseFloat((document.getElementById("nsSpin") || {}).value || 30);
      ph += hz2 * 0.016 / 8;
      ctx2.clearRect(0, 0, W2, H2);
      ctx2.strokeStyle = "#5ee7ff"; ctx2.lineWidth = 1.6; ctx2.beginPath();
      for(var x = 0; x < W2; x++){
        var p = (x / W2 * 3 + ph) % 1;
        var y = H2 * 0.75 - Math.exp(-Math.pow((p - 0.5) * 9, 2)) * H2 * 0.55;
        if(x) ctx2.lineTo(x, y); else ctx2.moveTo(x, y);
      }
      ctx2.stroke();
      ctx2.fillStyle = "rgba(220,232,255,.7)"; ctx2.font = "11px sans-serif";
      ctx2.fillText("light curve: one spike per lighthouse sweep", 10, 14);
    })();
  }
};
})();
