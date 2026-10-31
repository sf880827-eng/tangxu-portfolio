(function(){
'use strict';
gsap.registerPlugin(ScrollTrigger);
var M=window.matchMedia('(max-width: 767px)').matches;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var DPR=Math.min(window.devicePixelRatio||1,2);
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var EASE='power3.out',SOFT='power2.inOut';

/* ---------- film grain (generated once) ---------- */
(function(){var c=document.createElement('canvas');c.width=c.height=180;var x=c.getContext('2d'),d=x.createImageData(180,180);
  for(var i=0;i<d.data.length;i+=4){var v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}
  x.putImageData(d,0,0);$('.grain').style.backgroundImage='url('+c.toDataURL()+')'})();

/* ---------- smooth scroll ---------- */
var lenis=new Lenis({lerp:0.085,smoothWheel:true,wheelMultiplier:0.9});
lenis.stop();
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(function(t){lenis.raf(t*1000)});
gsap.ticker.lagSmoothing(0);

/* helper: reveal mask lines inside el */
function lines(el){return $$('.mask>span',el)}
gsap.set($$('.mask>span'),{yPercent:110});
gsap.set($$('.op-title .ln>span'),{yPercent:110});

/* ---------- opener (time-based, once, after intro) ---------- */
var openerPlayed=false;
function openerIn(){
  if(openerPlayed)return;openerPlayed=true;
  var tl=gsap.timeline({defaults:{ease:'expo.out',duration:1.4}});
  tl.from('.top',{autoAlpha:0,duration:1.2,ease:'power2.out'},0)
    .from('.opener .eyebrow',{y:16,autoAlpha:0,duration:1.1},0.1)
    .to('.op-title .ln>span',{yPercent:0,stagger:.12},0.15)
    .from('.op-en',{y:14,autoAlpha:0,duration:1.1},0.55)
    .from('.cue',{autoAlpha:0,duration:1},0.8);
}
// opener drifts away as you scroll
gsap.to('.op-inner',{yPercent:-18,ease:'none',scrollTrigger:{trigger:'#opener',start:'top top',end:'bottom top',scrub:true}});

/* ---------- 01 quiet case ---------- */
(function(){
  var sec=$('#crazyos'),dev=$('.devices',sec),scr=$('.screen',sec),ph=$('.ph-screen',sec),lImg=$('.screen .long',sec),pImg=$('.ph-screen .long',sec);
  var t=lines($('.c-text',sec));
  // title rises in as the section arrives
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top 75%',end:'top 15%',scrub:true}})
    .to(t.slice(0,2),{yPercent:0,stagger:.15,ease:'none'});
  gsap.fromTo(dev,{scale:.84,y:'10vh'},{scale:.84,y:'10vh',immediateRender:true});
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sec,start:'top top',end:'+='+(M?240:230)+'%',pin:$('.pin',sec),scrub:0.8,anticipatePin:1}});
  tl.to(dev,{scale:1,y:0,duration:.55,ease:SOFT},0)
    .to(lImg,{y:function(){return -(lImg.offsetHeight-scr.offsetHeight)*.62},duration:.82,ease:'power1.inOut'},.12)
    .to(pImg,{y:function(){return -(pImg.offsetHeight-ph.offsetHeight)*.5},duration:.82,ease:'power1.inOut'},.12)
    .to(t[2],{yPercent:0,duration:.12,ease:EASE},.22)
    .to(t[3],{yPercent:0,duration:.12,ease:EASE},.44)
    .to(t[4],{yPercent:0,duration:.12,ease:EASE},.52)
    .to({},{duration:.06});
})();

/* ---------- 02 UltraSelect: two phones scroll in opposite directions ---------- */
(function(){
  var sec=$('#ultra'),big=$('.phone.big',sec),sm=$('.phone.small',sec),bi=$('.big .long',sec),si=$('.small .long',sec),bs=$('.big .ph-screen',sec),ss=$('.small .ph-screen',sec),t=lines($('.c-text',sec));
  gsap.set(sm,{y:'8vh'});gsap.set(big,{y:'6vh',rotate:-3});
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top 70%',end:'top top',scrub:true}}).to(t.slice(0,2),{yPercent:0,stagger:.15,ease:'none'});
  function mx(img,box,f){return function(){return -(img.offsetHeight-box.offsetHeight)*f}}
  gsap.set(si,{y:function(){return -(si.offsetHeight-ss.offsetHeight)*.42}});
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sec,start:'top top',end:'+=200%',pin:$('.pin',sec),scrub:0.8,anticipatePin:1}});
  tl.to(big,{y:0,rotate:0,duration:.5,ease:SOFT},0)
    .to(sm,{y:'-4vh',duration:.9},0)
    .to(bi,{y:mx(bi,bs,.36),duration:.85,ease:'power1.inOut'},.1)
    .to(si,{y:mx(si,ss,.08),duration:.85,ease:'power1.inOut'},.1)
    .to(t[2],{yPercent:0,duration:.12,ease:EASE},.22)
    .to(t[3],{yPercent:0,duration:.12,ease:EASE},.32)
    .to({},{duration:.05});
})();

/* ---------- 03 FUZZY: wide browser rises, dark hero, gentle scroll ---------- */
(function(){
  var sec=$('#fuzzy'),br=$('.browser',sec),img=$('.viewport .long',sec),vp=$('.viewport',sec),t=lines(sec);
  gsap.set(br,{y:'18vh',scale:.92});
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top 70%',end:'top top',scrub:true}}).to(t.slice(0,3),{yPercent:0,stagger:.12,ease:'none'});
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sec,start:'top top',end:'+=190%',pin:$('.pin',sec),scrub:0.8,anticipatePin:1}});
  tl.to(br,{y:'-3vh',scale:1,duration:.6,ease:SOFT},0)
    .to(img,{y:function(){return -Math.min(img.offsetHeight-vp.offsetHeight,vp.offsetHeight*1.1)},duration:.6,ease:'power1.inOut'},.36)
    .to({},{duration:.04});
})();

/* ---------- 04 MORÉA: centred phone, panels drift ---------- */
(function(){
  var sec=$('#morea'),ph=$('.phone.mid',sec),img=$('.mid .long',sec),scr=$('.mid .ph-screen',sec),pl=$('.p-l',sec),pr=$('.p-r',sec),t=lines(sec);
  gsap.set(pl,{y:'14vh',rotate:-2});gsap.set(pr,{y:'-8vh',rotate:2});gsap.set(ph,{y:'10vh'});
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top 70%',end:'top top',scrub:true}}).to(t[0],{yPercent:0,ease:'none'});
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sec,start:'top top',end:'+=200%',pin:$('.pin',sec),scrub:0.8,anticipatePin:1}});
  tl.to(ph,{y:0,duration:.5,ease:SOFT},0)
    .to(pl,{y:'-6vh',rotate:0,duration:1},0)
    .to(pr,{y:'6vh',rotate:0,duration:1},0)
    .to(img,{y:function(){return -(img.offsetHeight-scr.offsetHeight)*.32},duration:.8,ease:'power1.inOut'},.12)
    .to(t[1],{yPercent:0,duration:.12,ease:EASE},.3)
    .to(t[2],{yPercent:0,duration:.12,ease:EASE},.38);
})();

/* ---------- interlude ---------- */
(function(){
  var sec=$('#i1'),t=lines(sec);
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top 70%',end:'center 50%',scrub:true}})
    .from($('.il-eyebrow',sec),{autoAlpha:0,ease:'none',duration:.3},0)
    .to(t,{yPercent:0,stagger:.18,ease:'none'},0);
  gsap.to($('.il-line',sec),{yPercent:-30,ease:'none',scrollTrigger:{trigger:sec,start:'center 50%',end:'bottom top',scrub:true}});
})();

/* ---------- 02 SENZE: headlights ignite, a beam sweeps the site into view ---------- */
(function(){
  var sec=$('#senze'),cv=$('.lights',sec),cx=cv.getContext('2d'),site=$('.site',sec),t=lines($('.c-text',sec));
  var spill=$('.spill',sec),expo=$('.expo',sec);
  var S={drl:0,main:0,flare:0,sweep:-.3,lamp:1,spill:0,b:1.9,c:1.15};
  var W=0,H=0,sc=1,ox=0;
  // lamp geometry measured on the 1440x900 site screenshot (car is symmetric about x=719)
  var STRIP=[[160,347],[196,436],[279,503]],LENS=[223,483];
  function P(x,y,s){if(s>0)x=1438-x;return [ox+x*sc,y*sc]}
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
    sc=Math.max(W/1440,H/900);ox=(W-1440*sc)/2;
    var l=P(LENS[0],LENS[1],-1),r=P(LENS[0],LENS[1],1),rx=Math.round(215*sc),ry=Math.round(235*sc);
    var m='radial-gradient('+rx+'px '+ry+'px at '+l[0]+'px '+l[1]+'px,#000,rgba(0,0,0,.35) 45%,transparent 100%),radial-gradient('+rx+'px '+ry+'px at '+r[0]+'px '+r[1]+'px,#000,rgba(0,0,0,.35) 45%,transparent 100%)';
    spill.style.webkitMaskImage=spill.style.maskImage=m;}
  size();window.addEventListener('resize',size);
  function rg(x,y,r,stops){var g=cx.createRadialGradient(x,y,0,x,y,r);stops.forEach(function(s){g.addColorStop(s[0],s[1])});return g}
  function blob(x,y,r,sx,sy,stops){cx.save();cx.translate(x,y);cx.scale(sx,sy);cx.fillStyle=rg(0,0,r,stops);cx.beginPath();cx.arc(0,0,r,0,7);cx.fill();cx.restore()}
  function strip(s,prog,width,alpha,blur){
    var a=P(STRIP[0][0],STRIP[0][1],s),b=P(STRIP[1][0],STRIP[1][1],s),c=P(STRIP[2][0],STRIP[2][1],s);
    cx.save();cx.lineCap='round';cx.lineJoin='round';cx.strokeStyle='rgba(242,247,255,'+alpha+')';cx.lineWidth=width;
    cx.shadowColor='rgba(185,212,255,'+alpha+')';cx.shadowBlur=blur*DPR;
    var len=Math.hypot(b[0]-a[0],b[1]-a[1])+Math.hypot(c[0]-b[0],c[1]-b[1])*1.15;
    cx.setLineDash([len*prog,len*2]);
    cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1]);cx.quadraticCurveTo(b[0]+(c[0]-b[0])*.25,b[1]+(c[1]-b[1])*.62,c[0],c[1]);cx.stroke();cx.stroke();
    cx.restore();
  }
  function draw(time){
    cx.setTransform(DPR,0,0,DPR,0,0);cx.clearRect(0,0,W,H);
    var k=sc,m=S.main*S.lamp*(1+.01*Math.sin(time*9)),d=S.drl,f=S.flare*S.lamp;
    cx.globalCompositeOperation='lighter';
    [-1,1].forEach(function(s){
      var L=P(LENS[0],LENS[1],s),x=L[0],y=L[1];
      if(d>0)strip(s,Math.min(1,d),2.6*k,S.lamp*(.55+.45*Math.min(1,d)),16*k);
      if(m>0){
        blob(x,y,420*k,1,.8,[[0,'rgba(140,170,230,'+(.10*m)+')'],[1,'rgba(0,0,0,0)']]);
        blob(x,y,130*k,1,1,[[0,'rgba(228,238,255,'+(.6*m)+')'],[.35,'rgba(170,200,250,'+(.2*m)+')'],[1,'rgba(0,0,0,0)']]);
        blob(x,y,21*k,1,1,[[0,'rgba(255,255,255,'+Math.min(1,1.15*m)+')'],[.55,'rgba(238,244,255,'+(.85*m)+')'],[1,'rgba(200,220,255,0)']]);
        blob(x,y,110*k,3.4,.05,[[0,'rgba(190,215,255,'+(.32*f)+')'],[1,'rgba(0,0,0,0)']]);
      }
    });
    var e=Math.max(0,Math.min(1,(S.sweep+.25)/.35))*Math.max(0,Math.min(1,(1.25-S.sweep)/.35));
    if(e>0){
      cx.save();var bx=S.sweep*W;cx.translate(bx,H/2);cx.rotate(10*Math.PI/180);
      var g=cx.createLinearGradient(-340,0,70,0);
      g.addColorStop(0,'rgba(255,246,228,0)');g.addColorStop(.72,'rgba(255,246,228,'+(.14*e)+')');g.addColorStop(.93,'rgba(255,250,240,'+(.42*e)+')');g.addColorStop(1,'rgba(255,250,240,0)');
      cx.fillStyle=g;cx.fillRect(-340,-H,410,H*2);cx.restore();
    }
  }
  var on=false,raf=0;
  function loop(ts){draw(ts/1000);if(on)raf=requestAnimationFrame(loop)}
  function apply(){spill.style.opacity=S.spill.toFixed(3);var x=S.sweep*100,m='linear-gradient(100deg,#000 '+(x-16).toFixed(2)+'%,transparent '+(x+2).toFixed(2)+'%)';
    site.style.webkitMaskImage=m;site.style.maskImage=m;expo.style.opacity=((S.b-1)*.32).toFixed(3)}
  apply();
  var card=M?{scale:.66,y:'-9vh',x:0}:{scale:.6,x:'16vw',y:0};
  var tl=gsap.timeline({defaults:{ease:'none'},onUpdate:apply,scrollTrigger:{trigger:sec,start:'top top',end:'+=430%',pin:$('.pin',sec),scrub:0.8,anticipatePin:1,
    onToggle:function(st){on=st.isActive;if(on){cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}else{draw(0)}}}});
  tl.to({},{duration:.03})
    .to(S,{drl:1,duration:.07,ease:'power1.inOut'},.03)
    .to(S,{spill:.22,duration:.07},.03)
    .to(S,{main:1,duration:.09,ease:'power2.in'},.1)
    .to(S,{spill:.75,duration:.1,ease:'power1.in'},.1)
    .to(S,{flare:1,duration:.08,ease:SOFT},.14)
    .to(S,{sweep:1.3,duration:.44,ease:'none'},.22)
    .to(S,{lamp:.4,duration:.18,ease:'power1.inOut'},.44)
    .to(S,{b:1,c:1,duration:.22,ease:'power2.out'},.42)
    .to(S,{spill:0,duration:.14},.48)
    .to(S,{lamp:0,duration:.05,ease:'power1.in'},.68)
    .to(site,{scale:card.scale,x:card.x,y:card.y,borderRadius:26,duration:.13,ease:SOFT},.73)
    .to($('.corner',sec),{autoAlpha:0,duration:.05},.24)
    .fromTo($('.c-idx',sec),{autoAlpha:0},{autoAlpha:1,duration:.05},.8)
    .to(t,{yPercent:0,stagger:.02,duration:.09,ease:EASE},.8)
    .to({},{duration:.08});
  draw(0);
})();

/* ---------- 03 Tiao: a wave rolls in, recedes, the site surfaces ---------- */
(function(){
  var sec=$('#tiao'),cv=$('.sea',sec),site=$('.site',sec),il=$('.il-in',sec),t=lines($('.c-text',sec)),tIl=lines(il);
  var Wv={level:-.25,amp:.4,wet:1,tilt:.9};
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top 70%',end:'top top',scrub:true}})
    .from($('.il-eyebrow',il),{autoAlpha:0,ease:'none',duration:.3},0)
    .to(tIl,{yPercent:0,stagger:.18,ease:'none'},0);
  var gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});
  var SCALE=M?.55:.62,prog,u={},W=0,H=0;
  function size(){W=Math.round(cv.clientWidth*DPR*SCALE);H=Math.round(cv.clientHeight*DPR*SCALE);cv.width=W;cv.height=H;if(gl)gl.viewport(0,0,W,H)}
  if(gl){
    var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs=[
    'precision highp float;uniform vec2 R;uniform float T,L,A,K;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
    'float caus(vec2 p,float t){float v=fbm(p+vec2(t*.35,-t*.2))*2.+fbm(p*1.7-vec2(t*.2,t*.3));float c=abs(sin(v*6.2832));return pow(clamp(1.-c,0.,1.),7.);}',
    'void main(){vec2 uv=gl_FragCoord.xy/R;float as=R.x/R.y;vec2 p=vec2(uv.x*as,uv.y);',
    ' float sw=.045*sin(p.x*2.1+T*.8)+.022*sin(p.x*4.9-T*1.3+1.3)+.05*(fbm(vec2(p.x*1.4+T*.15,T*.2))-.5);',
    ' float chop=.02*(fbm(vec2(p.x*9.+T*.9,T*.6))-.5);',
    ' float s=L+A*(sw+chop+.05*sin(p.x*1.15-T*1.3))+K*(uv.x-.5)*.26;float d=uv.y-s;',
    ' float px=1.6/R.y;float sp=n(vec2(p.x*170.,(uv.y-T*.06)*170.));float spec=step(.988,sp)*exp(-max(d,0.)*28.)*A;',
    ' float mist=exp(-max(d,0.)*48.)*fbm(vec2(p.x*20.-T*.4,uv.y*30.-T))*.42*A;float mA=clamp(mist+spec*.8,0.,1.);',
    ' float k=smoothstep(-px,px,d);',
    ' if(k>=1.){gl_FragColor=vec4(vec3(.93,.97,.97)*mA,mA);return;}',
    ' float dp=max(-d,0.);',
    ' vec3 col=mix(vec3(.19,.64,.63),vec3(.035,.35,.41),smoothstep(0.,.2,dp));col=mix(col,vec3(.01,.085,.125),smoothstep(.16,.85,dp));',
    ' col+=vec3(.16,.52,.47)*exp(-dp*12.)*.55;',
    ' vec2 q=p*vec2(3.2,4.4)+vec2(fbm(p*2.+T*.08),fbm(p*2.-T*.08))*1.4;',
    ' col+=vec3(.30,.55,.50)*smoothstep(.55,.82,fbm(q*1.3+vec2(T*.12,-T*.07)))*exp(-dp*1.8)*smoothstep(.03,.16,dp)*.28;',
    ' float rays=pow(max(0.,sin(p.x*7.+fbm(vec2(p.x*2.,T*.25))*5.)),8.)*exp(-dp*2.2)*.05;col+=vec3(.55,.85,.85)*rays;',
    ' float w=.032+.022*fbm(vec2(p.x*3.,T*.3));',
    ' float fn=fbm(vec2(p.x*10.+T*.4,dp*55.-T*.7)),fn2=fbm(vec2(p.x*30.-T*.2,dp*120.+T*.5));',
    ' float crest=1.-smoothstep(0.,w,dp);float fc=crest*smoothstep(.28,.55,fn*.8+crest*.45);',
    ' float lace=(1.-smoothstep(w,w+.15,dp))*smoothstep(0.,w,dp)*smoothstep(.6,.74,fn*.6+fn2*.55);',
    ' float foam=clamp(fc+lace*.6,0.,1.);',
    ' col*=1.-.22*smoothstep(w,w+.05,dp)*(1.-smoothstep(w+.05,w+.22,dp));',
    ' col+=vec3(pow(n(vec2(p.x*70.+T*1.5,dp*220.)),20.)*exp(-dp*9.)*.7);',
    ' col=mix(col,vec3(.95,.98,.98),foam*.94);',
    ' col=clamp(col,0.,1.);float a=mix(.8,1.,smoothstep(0.,.1,dp));a=clamp(max(a,foam),0.,1.);',
    ' vec4 wa=vec4(col*a,a),ma=vec4(vec3(.93,.97,.97)*mA,mA);gl_FragColor=mix(wa,ma,k);}'].join('\n');
    function sh(type,src){var o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o}
    prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    ['R','T','L','A','K'].forEach(function(k){u[k]=gl.getUniformLocation(prog,k)});
    gl.clearColor(0,0,0,0);
  }
  size();window.addEventListener('resize',size);
  var on=false,raf=0;
  function render(ts){
    if(!gl)return;gl.clear(gl.COLOR_BUFFER_BIT);
    if(Wv.level<-.32)return;
    gl.uniform2f(u.R,W,H);gl.uniform1f(u.T,ts/1000);gl.uniform1f(u.L,Wv.level);gl.uniform1f(u.A,Wv.amp);gl.uniform1f(u.K,Wv.tilt);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  function loop(ts){render(ts);if(on)raf=requestAnimationFrame(loop)}
  var tImg=$('img',site),sheen=$('.sheen',site);
  function apply(){var w=Wv.wet;tImg.style.filter=w>0.002?'blur('+(w*10).toFixed(2)+'px) saturate('+(1+w*.25).toFixed(3)+')':'none';tImg.style.transform='scale('+(1+w*.07).toFixed(4)+')';sheen.style.opacity=w.toFixed(3)}
  var card=M?{scale:.66,y:'-9vh',x:0}:{scale:.6,x:'16vw',y:0};
  var tl=gsap.timeline({defaults:{ease:'none'},onUpdate:apply,scrollTrigger:{trigger:sec,start:'top top',end:'+='+(M?320:300)+'%',pin:$('.pin',sec),scrub:0.8,anticipatePin:1,
    onToggle:function(st){on=st.isActive;if(on){cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}}}});
  tl.to({},{duration:.04})
    .to(Wv,{level:1.14,duration:.29,ease:'power1.inOut'},.04)
    .to(Wv,{amp:1,duration:.16,ease:SOFT},.04)
    .to(Wv,{tilt:0,duration:.29,ease:'power1.inOut'},.04)
    .to(Wv,{keyframes:{tilt:[0,-.55,0]},duration:.3,ease:'none'},.35)
    .to(il,{yPercent:-5,duration:.29,ease:'power1.in'},.04)
    .set(il,{visibility:'hidden'},.33)
    .to(Wv,{level:-.3,duration:.3,ease:'power2.inOut'},.35)
    .to(Wv,{amp:.55,duration:.2,ease:SOFT},.45)
    .to(Wv,{wet:0,duration:.32,ease:'power2.out'},.42)
    .to(site,{scale:card.scale,x:card.x,y:card.y,borderRadius:M?22:26,duration:.14,ease:SOFT},.72)
    .fromTo($('.c-idx',sec),{autoAlpha:0},{autoAlpha:1,duration:.06},.8)
    .to(t,{yPercent:0,stagger:.025,duration:.1,ease:EASE},.8)
    .to({},{duration:.06});
  if(!gl){tl.set(il,{visibility:'hidden'},.2)}
})();


/* ---------- capabilities + CTA ---------- */
gsap.timeline({scrollTrigger:{trigger:'#caps',start:'top 75%',end:'top 20%',scrub:true}})
  .to(lines($('#caps')),{yPercent:0,ease:'none',duration:.3},0)
  .from('.cap',{y:50,autoAlpha:0,stagger:.08,ease:'power2.out',duration:.5},.1);
gsap.from('.flow li',{y:30,autoAlpha:0,stagger:.08,ease:'power2.out',scrollTrigger:{trigger:'.flow',start:'top 92%',end:'top 55%',scrub:true}});
gsap.timeline({scrollTrigger:{trigger:'#cta',start:'top 70%',end:'top 10%',scrub:true}})
  .to(lines($('#cta')),{yPercent:0,stagger:.1,ease:'none',duration:.3},0)
  .from('.cta-sub,.cta-btn,.cta-info',{y:24,autoAlpha:0,stagger:.08,ease:'none',duration:.25},.2)
  .from('.cta-phone .phone',{y:'14vh',rotate:4,ease:'none',duration:.6},0);


/* ---------- start after the intro ---------- */
function start(){
  document.documentElement.classList.remove('is-locked');
  window.scrollTo(0,0);
  ScrollTrigger.refresh();lenis.start();openerIn();
}
if(window.__intro&&window.__intro.root&&window.__intro.root.isConnected){
  // build the opener under the closing intro so it is already there when the intro fades
  document.addEventListener('tx:intro-done',start,{once:true});
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.i-open'))setTimeout(openerIn,420)},true);
}else start();
window.addEventListener('load',function(){ScrollTrigger.refresh()});
window.__cine={lenis:lenis,ST:ScrollTrigger,
  pos:function(id,p){var st=ScrollTrigger.getAll().filter(function(s){return s.pin&&s.trigger&&s.trigger.id===id})[0];return st?st.start+(st.end-st.start)*p:0},
  top:function(id){return $('#'+id).getBoundingClientRect().top+window.scrollY}};
})();
