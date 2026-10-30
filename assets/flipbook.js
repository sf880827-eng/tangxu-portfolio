(function(){
  'use strict';
  var TOTAL=15, RATIO=9/16;
  function pad(n){return String(n).padStart(2,'0')}
  function src(i,big){return 'assets/pages/'+(big?'p':'m')+pad(i)+'.webp'}
  var mq=window.matchMedia('(max-width: 767px), (orientation: portrait) and (pointer: coarse)');
  var current=null;

  /* ---------------- Desktop flipbook ---------------- */
  var desk=(function(){
    var stage=document.getElementById('stage'),shift=document.getElementById('shift'),controls=document.getElementById('controls');
    var cur=document.getElementById('cur'),tot=document.getElementById('total'),prev=document.getElementById('prev'),next=document.getElementById('next');
    var modeBtn=document.getElementById('mode'),fsBtn=document.getElementById('fs');
    var pf=null,pw=0,ph=0,single=true,index=0,bound=false;
    tot.textContent=pad(TOTAL);
    function size(){
      var vw=window.innerWidth,vh=window.innerHeight;
      var h=Math.min(vh*0.85,vh-56-48), w=vw-24;
      pw=Math.floor(single?Math.min(w,h/RATIO):Math.min(w/2,h/RATIO)); ph=Math.floor(pw*RATIO);
    }
    function landscape(){return pf&&pf.getOrientation()==='landscape'}
    function visible(i){
      if(!landscape()||i===0) return [i];
      if(i%2===0) i=i-1;                 // spreads are (1,2),(3,4)...
      return [i,i+1].filter(function(x){return x<TOTAL});
    }
    function setShift(i){
      var x=0;
      if(landscape()){
        if(i===0) x=-pw/2;
        else if(visible(i).length===1) x=pw/2;   // lone last page on the left
      }
      shift.style.transform='translateX('+Math.round(x)+'px)';
    }
    function update(i){
      index=i;var v=visible(i);
      cur.textContent=v.length>1?pad(v[0]+1)+'–'+pad(v[1]+1):pad(v[0]+1);
      prev.disabled=v[0]<=0; next.disabled=v[v.length-1]>=TOTAL-1;
      setShift(i);
    }
    function build(at){
      if(pf){try{pf.destroy()}catch(e){} pf=null}
      size();
      shift.innerHTML='';
      var el=document.createElement('div');el.id='book';shift.appendChild(el);
      for(var i=1;i<=TOTAL;i++){
        var d=document.createElement('div');d.className='page';
        d.innerHTML='<img src="'+src(i,true)+'" srcset="'+src(i,false)+' 1600w, '+src(i,true)+' 3200w" sizes="'+pw+'px" alt="棠序問策網站作品集 第 '+i+' 頁" width="3200" height="1800" decoding="async"'+(i>4?' loading="lazy"':'')+'>';
        el.appendChild(d);
      }
      // container width decides orientation: < 2*pw => portrait (single page)
      el.style.width=(single?pw:pw*2)+'px'; el.style.height=ph+'px';
      pf=new St.PageFlip(el,{width:pw,height:ph,size:'fixed',showCover:true,usePortrait:true,autoSize:false,
        maxShadowOpacity:0.5,drawShadow:true,flippingTime:900,mobileScrollSupport:false,swipeDistance:25,showPageCorners:true,startPage:at||0});
      pf.loadFromHTML(el.querySelectorAll('.page'));
      shift.style.transition='none'; update(at||0); void shift.offsetWidth; shift.style.transition='';
      pf.on('flip',function(e){update(e.data)});
      pf.on('changeOrientation',function(){update(pf.getCurrentPageIndex())});
    }
    function go(dir){
      if(!pf)return;
      // centre the spread before the cover opens / closes, so the motion feels natural
      if(dir>0&&index===0&&landscape()) shift.style.transform='translateX(0px)';
      dir>0?pf.flipNext('top'):pf.flipPrev('top');
    }
    function onKey(e){
      if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(1)}
      else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(-1)}
      else if(e.key==='Home'){pf.turnToPage(0);update(0)}
      else if(e.key==='End'){pf.turnToPage(TOTAL-1);update(TOTAL-1)}
    }
    var rt;function onResize(){clearTimeout(rt);rt=setTimeout(function(){if(current===desk)build(pf?pf.getCurrentPageIndex():0)},180)}
    function hint(){
      try{if(localStorage.getItem('tx_flip_hint'))return;localStorage.setItem('tx_flip_hint','1')}catch(e){}
      var h=document.getElementById('hint');
      function run(){setTimeout(function(){h.classList.add('show')},600);setTimeout(function(){h.classList.remove('show')},4600)}
      if(window.__intro&&window.__intro.root.isConnected)document.addEventListener('tx:intro-done',run,{once:true});else run();
    }
    return {
      start:function(){
        document.body.classList.add('desk');stage.hidden=false;controls.hidden=false;
        build(0);modeBtn.classList.toggle('on',single);
        if(!bound){bound=true;
          prev.onclick=function(){go(-1)};next.onclick=function(){go(1)};
          modeBtn.onclick=function(){single=!single;modeBtn.classList.toggle('on',single);build(pf.getCurrentPageIndex())};
          fsBtn.onclick=function(){var d=document.documentElement;if(!document.fullscreenElement){(d.requestFullscreen||d.webkitRequestFullscreen).call(d)}else document.exitFullscreen()};
        }
        document.addEventListener('keydown',onKey);window.addEventListener('resize',onResize);
        hint();
      },
      stop:function(){
        document.removeEventListener('keydown',onKey);window.removeEventListener('resize',onResize);
        if(pf){try{pf.destroy()}catch(e){}pf=null}
        shift.innerHTML='';stage.hidden=true;controls.hidden=true;document.body.classList.remove('desk');
      },
      api:function(){return {pf:pf,pw:pw,ph:ph,index:index,single:single}}
    };
  })();

  /* ---------------- Mobile scroll + zoom viewer ---------------- */
  var mob=(function(){
    var wrap=document.getElementById('scroll'),built=false;
    var lb=document.getElementById('lb'),img=document.getElementById('lbImg'),num=document.getElementById('lbNum'),tip=document.getElementById('lbTip'),stageEl=document.getElementById('lbStage');
    var page=1,s=1,tx=0,ty=0,bx=0,by=0,bw=0,bh=0,ptrs={},g=null,lastTap=0,lastX=0,lastY=0;
    function base(){
      var vw=window.innerWidth,vh=window.innerHeight;bw=vw;bh=vw*RATIO;if(bh>vh){bh=vh;bw=vh/RATIO}
      bx=(vw-bw)/2;by=(vh-bh)/2;
      img.style.cssText='position:absolute;left:'+bx+'px;top:'+by+'px;width:'+bw+'px;height:'+bh+'px;max-height:none';
    }
    function clamp(){
      var vw=window.innerWidth,vh=window.innerHeight,W=bw*s,H=bh*s;
      tx=W<=vw?(bw-W)/2:Math.min(-bx,Math.max(vw-bx-W,tx));
      ty=H<=vh?(bh-H)/2:Math.min(-by,Math.max(vh-by-H,ty));
    }
    function apply(anim){img.style.transition=anim?'transform .25s ease':'none';clamp();img.style.transform='translate('+tx+'px,'+ty+'px) scale('+s+')'}
    function zoomAt(px,py,ns,anim){var u=(px-bx-tx)/s,v=(py-by-ty)/s;s=Math.max(1,Math.min(5,ns));tx=px-bx-u*s;ty=py-by-v*s;apply(anim)}
    function show(i){page=i;img.src=src(i,true);img.alt='第 '+i+' 頁';num.textContent=pad(i)+' / '+pad(TOTAL);s=1;tx=0;ty=0;base();apply(false)}
    function open(i){lb.hidden=false;document.body.style.overflow='hidden';show(i);tip.style.opacity=1;setTimeout(function(){tip.style.opacity=0},2500)}
    function close(){lb.hidden=true;document.body.style.overflow='';ptrs={};g=null}
    function pts(){return Object.keys(ptrs).map(function(k){return ptrs[k]})}
    stageEl.addEventListener('pointerdown',function(e){
      stageEl.setPointerCapture&&stageEl.setPointerCapture(e.pointerId);
      ptrs[e.pointerId]={x:e.clientX,y:e.clientY};var p=pts();
      if(p.length===2){var mx=(p[0].x+p[1].x)/2,my=(p[0].y+p[1].y)/2;
        g={type:'pinch',d0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),s0:s,u:(mx-bx-tx)/s,v:(my-by-ty)/s}}
      else if(p.length===1){g={type:'pan',x0:e.clientX,y0:e.clientY,tx0:tx,ty0:ty,t0:Date.now()}}
    });
    stageEl.addEventListener('pointermove',function(e){
      if(!ptrs[e.pointerId])return;ptrs[e.pointerId]={x:e.clientX,y:e.clientY};var p=pts();
      if(g&&g.type==='pinch'&&p.length===2){var d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),mx=(p[0].x+p[1].x)/2,my=(p[0].y+p[1].y)/2;
        s=Math.max(1,Math.min(5,g.s0*d/g.d0));tx=mx-bx-g.u*s;ty=my-by-g.v*s;apply(false)}
      else if(g&&g.type==='pan'&&s>1){tx=g.tx0+e.clientX-g.x0;ty=g.ty0+e.clientY-g.y0;apply(false)}
    });
    function up(e){
      if(!ptrs[e.pointerId])return;delete ptrs[e.pointerId];
      if(g&&g.type==='pan'){
        var dx=e.clientX-g.x0,dy=e.clientY-g.y0,dt=Date.now()-g.t0;
        if(Math.abs(dx)<10&&Math.abs(dy)<10&&dt<300){ // tap
          var now=Date.now();
          if(now-lastTap<320&&Math.hypot(e.clientX-lastX,e.clientY-lastY)<40){zoomAt(e.clientX,e.clientY,s>1?1:2.5,true);lastTap=0}
          else{lastTap=now;lastX=e.clientX;lastY=e.clientY}
        }else if(s===1&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){ // swipe between pages at 1x
          if(dx<0&&page<TOTAL)show(page+1);else if(dx>0&&page>1)show(page-1);
        }
      }
      g=pts().length===1?{type:'pan',x0:pts()[0].x,y0:pts()[0].y,tx0:tx,ty0:ty,t0:Date.now()}:null;
    }
    stageEl.addEventListener('pointerup',up);stageEl.addEventListener('pointercancel',up);
    stageEl.addEventListener('wheel',function(e){e.preventDefault();zoomAt(e.clientX,e.clientY,s*(e.deltaY<0?1.15:0.87),false)},{passive:false});
    document.getElementById('lbClose').onclick=close;
    document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowRight'&&page<TOTAL)show(page+1);else if(e.key==='ArrowLeft'&&page>1)show(page-1)});
    window.addEventListener('resize',function(){if(!lb.hidden){base();apply(false)}});
    function build(){
      if(built)return;built=true;var html='';
      for(var i=1;i<=TOTAL;i++){
        html+='<figure class="mpage" data-i="'+i+'"><img src="'+src(i,false)+'" srcset="'+src(i,false)+' 1600w, '+src(i,true)+' 3200w" sizes="100vw" alt="棠序問策網站作品集 第 '+i+' 頁" width="1600" height="900"'+(i>2?' loading="lazy"':'')+' decoding="async"><span class="num">'+pad(i)+' / '+pad(TOTAL)+'</span></figure>';
      }
      html+='<div class="mfoot"><a href="https://tangxuai.org/" target="_blank" rel="noopener">tangxuai.org</a></div>';
      wrap.innerHTML=html;
      wrap.addEventListener('click',function(e){var f=e.target.closest('.mpage');if(f)open(+f.dataset.i)});
    }
    return {start:function(){build();wrap.hidden=false},stop:function(){close();wrap.hidden=true},open:open,state:function(){return {s:s,tx:tx,ty:ty,page:page,open:!lb.hidden}},zoomAt:zoomAt};
  })();

  function choose(){
    var next=mq.matches?mob:desk;
    if(next===current)return;
    if(current)current.stop();
    current=next;current.start();
  }
  if(mq.addEventListener)mq.addEventListener('change',choose);else mq.addListener(choose);
  choose();
  window.__fb={desk:desk,mob:mob,mode:function(){return current===desk?'desktop':'mobile'}};
})();
