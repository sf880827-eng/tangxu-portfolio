(function(){
  'use strict';
  var KEY='tx_intro_seen';
  try{if(sessionStorage.getItem(KEY)&&!/[?&]intro=1/.test(location.search))return}catch(e){}
  var SITES=[['crazyos','CRAZYOS1919.COM'],['ultra','ULTRASELECT.ORG'],['fuzzy','FUZZYSELECT.SHOP'],['morea','MOREA.BEAUTY'],['senze','SENZE.AUTOS'],['tiao','THAILANDTRAVEL.LIFE']];
  var mobile=window.matchMedia('(max-width: 767px), (orientation: portrait) and (pointer: coarse)').matches;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RATE=(function(){var m=/[?&]introRate=([\d.]+)/.exec(location.search);return m?parseFloat(m[1]):1})(); // >1 = slower (for recording)
  var N=mobile?8:12, W=mobile?Math.min(118,Math.round(window.innerWidth*0.3)):340, H=Math.round(W*(mobile?4/3:0.625));
  var R=mobile?0:Math.round((W/2+14)/Math.tan(Math.PI/N));    // wheel radius
  var STEP=360/N;

  var root=document.createElement('div');root.className='intro';root.setAttribute('role','dialog');root.setAttribute('aria-label','Websites We Built');
  root.innerHTML='<div class="ig"></div><button class="i-skip" type="button">Skip</button>'+
    '<div class="i-scene"><div class="i-wheel"></div></div>'+
    '<div class="i-copy"><h1>Websites We Built</h1><p>棠序問策 TANGXU</p><button class="i-open" type="button">Open Portfolio</button></div>';
  document.body.appendChild(root);
  var wheel=root.querySelector('.i-wheel'),copy=root.querySelector('.i-copy'),cards=[];
  wheel.style.setProperty('--w',W+'px');wheel.style.setProperty('--h',H+'px');
  for(var i=0;i<N;i++){
    var s=SITES[i%SITES.length],c=document.createElement('div');c.className='i-card';
    c.innerHTML='<div class="i-face i-front" style="background-image:url(assets/intro/'+s[0]+(mobile?'_m':'')+'.webp)"><span>'+s[1]+'</span></div><div class="i-face i-back"><b>TX</b></div>';
    wheel.appendChild(c);cards.push(c);
  }
  // one transform function list for every stage so the browser interpolates each value
  function T(o){return 'rotateY('+(o.wy||0)+'deg) translateZ('+(o.wz||0)+'px) translate3d('+(o.x||0)+'px,'+(o.y||0)+'px,'+(o.z||0)+'px) rotateZ('+(o.rz||0)+'deg) rotateY('+(o.fy||0)+'deg) scale('+(o.s==null?1:o.s)+')'}
  function mid(i){return i-(N-1)/2}
  var vh=window.innerHeight;
  var stage={
    below:function(i){return {y:vh*0.9+i*6,z:i*0.6,rz:(i%2?4:-4)+mid(i)*0.6,fy:180}},
    deck:function(i){return {y:-i*1.6,z:i*0.6,rz:(i%3-1)*1.5,fy:180}},
    fan:function(i){var span=mobile?60:118,a=mid(i)*(span/(N-1)),rf=mobile?Math.round(window.innerWidth*0.6):620,r=a*Math.PI/180;
      return {x:Math.sin(r)*rf,y:(1-Math.cos(r))*rf-(mobile?10:30),z:i*0.8,rz:a,fy:0}},
    wheel:function(i){return {wy:mid(i)*STEP,wz:R,fy:0}},
    collapse:function(i){return {wy:mid(i)*STEP,wz:0,fy:0,s:0.35}}
  };
  function set(name,dur,stagger,ease){
    dur*=RATE;
    cards.forEach(function(c,i){
      var dl=i*(stagger||0)*RATE;c.style.transition=dur?('transform '+dur+'ms '+(ease||'cubic-bezier(.2,.8,.2,1)')+' '+dl+'ms, opacity '+dur+'ms ease '+dl+'ms'):'none';
      c.style.transform=T(stage[name](i));
    });
  }
  // wheel spin (rAF, transform only)
  var theta=0,speed=0,target=0,tilt=mobile?0:-9,last=0,raf=0,spinning=false,zOff=0,zT0=null;
  function frame(t){
    var dt=last?Math.min(50,t-last)/1000/RATE:0;last=t;
    if(zT0!==null){var k=Math.min(1,(t-zT0)/(1100*RATE));k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;zOff=-R*k;if(k>=1)zT0=null}
    speed+=(target-speed)*Math.min(1,dt*3);theta+=speed*dt;
    wheel.style.transform='translateZ('+zOff.toFixed(1)+'px) rotateX('+tilt+'deg) rotateY('+theta+'deg)';
    raf=requestAnimationFrame(frame);
  }
  function spin(){if(spinning||mobile)return;spinning=true;target=9;zT0=performance.now();raf=requestAnimationFrame(frame)}
  wheel.addEventListener('pointerover',function(e){if(e.target.closest('.i-card'))target=1.5});
  wheel.addEventListener('pointerout',function(e){if(!e.relatedTarget||!e.relatedTarget.closest||!e.relatedTarget.closest('.i-card'))target=9});

  var timers=[];function at(ms,fn){timers.push(setTimeout(fn,ms*RATE))}
  if(RATE!==1)root.style.setProperty('--rate',RATE);
  function showCopy(){copy.classList.add('show');root.querySelector('.i-open').focus({preventScroll:true})}
  wheel.style.transform='rotateX('+tilt+'deg)';
  if(reduced){
    set(mobile?'fan':'wheel',0);if(!mobile)wheel.style.transform='translateZ('+(-R)+'px) rotateX('+tilt+'deg) rotateY(14deg)';
    copy.style.transition='none';showCopy();
  }else{
    set('below',0);void wheel.offsetWidth;
    at(60,function(){set('deck',700,45)});                                 // deck flies up
    at(1000,function(){set('fan',650,38)});                                // flip face-up into a fan
    if(mobile){at(2300,showCopy)}
    else{
      at(2000,function(){set('wheel',1100,22,'cubic-bezier(.45,.05,.25,1)');setTimeout(spin,0)}); // lift into wheel
      at(2900,showCopy);
    }
  }
  var closing=false;
  function close(fast){
    if(closing)return;closing=true;timers.forEach(clearTimeout);
    try{sessionStorage.setItem(KEY,'1')}catch(e){}
    copy.classList.remove('show');
    if(fast||reduced){root.classList.add('out')}
    else{
      if(mobile){cards.forEach(function(c,i){c.style.transition='transform '+600*RATE+'ms cubic-bezier(.5,0,.2,1) '+(i*15*RATE)+'ms, opacity '+500*RATE+'ms ease '+((100+i*15)*RATE)+'ms';c.style.transform=T({s:0.35});c.style.opacity=0})}
      else{set('collapse',650,12,'cubic-bezier(.5,0,.2,1)');cards.forEach(function(c){c.style.opacity=0});target=60}
      setTimeout(function(){root.classList.add('out')},520*RATE);
    }
    setTimeout(function(){cancelAnimationFrame(raf);root.remove();document.dispatchEvent(new CustomEvent('tx:intro-done'))},(fast||reduced?600:1100)*RATE);
  }
  root.querySelector('.i-open').addEventListener('click',function(){close(false)});
  root.querySelector('.i-skip').addEventListener('click',function(){close(true)});
  document.addEventListener('keydown',function k(e){if(!root.isConnected){document.removeEventListener('keydown',k);return}
    if(e.key==='Escape'){close(true)}else if(e.key==='Enter'&&copy.classList.contains('show')){close(false)}
    e.stopImmediatePropagation();},true);
  window.__intro={close:close,root:root};
})();
