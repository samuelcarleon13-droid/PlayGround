(() => {
  'use strict';
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const $ = id => document.getElementById(id);
  const W = 1800, H = 1260;
  const roadsX = [260, 680, 1100, 1520], roadsY = [190, 540, 890];
  const roadW = 82, sidewalkW = 13;
  const orders = [
    {name:'Corner Deli', initial:'M', customer:'Maya Chen', address:'14 Orchard Street', pickupAddress:'300 Olive Street', package:'1 × Market bag', tip:12, pickup:[300,280], dest:[708,486], district:'THE\nGREENWICH\nVILLAGE', street:'ORCHARD STREET', place:'GREENWICH VILLAGE'},
    {name:'Little Flower Café', initial:'L', customer:'Leo Brooks', address:'82 Grove Avenue', pickupAddress:'74 Grove Avenue', package:'2 × Iced coffees', tip:16, pickup:[738,500], dest:[1034,638], district:'THE\nWEST\nVILLAGE', street:'GROVE AVENUE', place:'WEST VILLAGE'},
    {name:'Sunday Market', initial:'S', customer:'Sam Rivera', address:'6 Mercer Lane', pickupAddress:'12 Mercer Lane', package:'1 × Fresh produce box', tip:20, pickup:[1060,620], dest:[1453,368], district:'SOHO &\nTHE\nMARKET', street:'MERCER LANE', place:'SOHO'},
    {name:'Juniper Pharmacy', initial:'J', customer:'Jamie Park', address:'29 Willow Court', pickupAddress:'45 Willow Street', package:'1 × Care package', tip:24, pickup:[1470,390], dest:[626,1010], district:'THE\nEAST\nGARDEN', street:'WILLOW COURT', place:'EAST VILLAGE'}
  ];
  const blocks = [];
  const palette = ['#d4c6a9','#c8d1b3','#d6b8a2','#c6cbb4','#dbcba9','#c5c6ad','#d5c1a8'];
  let seed = 8723;
  const rand = () => {seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const buildings = [];
  for(let ix=0;ix<roadsX.length-1;ix++) for(let iy=0;iy<roadsY.length-1;iy++){
    const left=roadsX[ix]+roadW/2+sidewalkW+10, right=roadsX[ix+1]-roadW/2-sidewalkW-10;
    const top=roadsY[iy]+roadW/2+sidewalkW+10, bottom=roadsY[iy+1]-roadW/2-sidewalkW-10;
    const park=rand()<.20 && !(ix===0&&iy===0);
    blocks.push({left,right,top,bottom,park});
    if(park) continue;
    const count=2+Math.floor(rand()*3);
    for(let i=0;i<count;i++){
      const bw=(right-left)*(count===2?.37:.25+rand()*.10);
      const bh=(bottom-top)*(rand()<.55?.34:.41);
      const cols=count===2?2:3, row=i>=cols?1:0, col=i%cols;
      const bx=left+(right-left)*(col+.12)/cols+rand()*5;
      const by=top+(bottom-top)*(row+.10)/(count>3?2:1)+rand()*5;
      buildings.push({x:bx,y:by,w:Math.min(bw,right-bx-4),h:Math.min(bh,bottom-by-4),color:palette[Math.floor(rand()*palette.length)],seed:rand(),type:rand()});
    }
  }
  const trees=[];
  for(let i=0;i<130;i++) trees.push({x:35+rand()*(W-70),y:35+rand()*(H-70),r:5+rand()*4});
  const cars=[
    {x:260,y:190,dir:1,speed:82,color:'#d48460',axis:'x',lane:-19},
    {x:680,y:540,dir:-1,speed:67,color:'#e6bc69',axis:'x',lane:18},
    {x:1100,y:890,dir:1,speed:73,color:'#7d9a83',axis:'x',lane:-18},
    {x:680,y:190,dir:1,speed:61,color:'#8498a5',axis:'y',lane:18},
    {x:1520,y:540,dir:-1,speed:75,color:'#cc8e76',axis:'y',lane:-18},
    {x:260,y:890,dir:1,speed:59,color:'#d7aa69',axis:'y',lane:18},
  ];
  let player={x:327,y:300,vx:0,vy:0,face:0};
  let camera={x:0,y:0}; let frameWidth=800, frameHeight=600, dpr=1, mapZoom=1;
  let active=false,paused=false,ended=false,loaded=false,orderIndex=0,stage='pickup';
  let timeLeft=35,score=0,streak=0,boost=100,hitCooldown=0,keys={},soundOn=false,last=0,toastTimer=0,arrivalTimer=0;
  const sounds={};
  function beep(freq=520,duration=.08,type='sine',volume=.035){if(!soundOn)return;try{const ac=beep.ac||(beep.ac=new(window.AudioContext||window.webkitAudioContext)());const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=freq;g.gain.value=volume;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.stop(ac.currentTime+duration)}catch(_){}}
  function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;frameWidth=r.width;frameHeight=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  new ResizeObserver(resize).observe(canvas); resize();
  function drawWorld(){
    ctx.fillStyle='#e3ecd9';ctx.fillRect(0,0,W,H);
    // subtle neighborhood ground grain
    ctx.save();ctx.globalAlpha=.13;for(let i=0;i<280;i++){let x=(i*193)%W,y=(i*277)%H;ctx.fillStyle=i%2?'#aabf9e':'#f8f2d9';ctx.fillRect(x,y,2,2)}ctx.restore();
    // parks and little gardens
    blocks.forEach(b=>{if(!b.park)return;ctx.fillStyle='#cee0bd';roundRect(b.left,b.top,b.right-b.left,b.bottom-b.top,12);ctx.fill();ctx.fillStyle='#d9e8ca';for(let i=0;i<7;i++){const x=b.left+18+(i*53)%(b.right-b.left-30),y=b.top+22+(i*41)%(b.bottom-b.top-34);ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fill()}ctx.strokeStyle='#eee6d0';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(b.left+12,b.top+15);ctx.lineTo(b.right-12,b.bottom-15);ctx.moveTo(b.right-14,b.top+20);ctx.lineTo(b.left+14,b.bottom-17);ctx.stroke();});
    // sidewalks and road grid
    ctx.fillStyle='#d0d5c5';roadsX.forEach(x=>ctx.fillRect(x-roadW/2-sidewalkW,0,roadW+sidewalkW*2,H));roadsY.forEach(y=>ctx.fillRect(0,y-roadW/2-sidewalkW,W,roadW+sidewalkW*2));
    ctx.fillStyle='#788782';roadsX.forEach(x=>ctx.fillRect(x-roadW/2,0,roadW,H));roadsY.forEach(y=>ctx.fillRect(0,y-roadW/2,W,roadW));
    // curb edges and center dash lines
    ctx.strokeStyle='#b9c1b1';ctx.lineWidth=2;ctx.setLineDash([]);roadsX.forEach(x=>{ctx.beginPath();ctx.moveTo(x-roadW/2,0);ctx.lineTo(x-roadW/2,H);ctx.moveTo(x+roadW/2,0);ctx.lineTo(x+roadW/2,H);ctx.stroke()});roadsY.forEach(y=>{ctx.beginPath();ctx.moveTo(0,y-roadW/2);ctx.lineTo(W,y-roadW/2);ctx.moveTo(0,y+roadW/2);ctx.lineTo(W,y+roadW/2);ctx.stroke()});
    ctx.strokeStyle='#d9d4b8';ctx.lineWidth=1.5;ctx.setLineDash([12,13]);roadsX.forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()});roadsY.forEach(y=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()});ctx.setLineDash([]);
    // crosswalks at intersections
    ctx.fillStyle='#d7dbcf';for(const x of roadsX)for(const y of roadsY){for(let i=0;i<5;i++){ctx.fillRect(x-roadW/2+6+i*14,y-roadW/2+7,7,17);ctx.fillRect(x-roadW/2+6+i*14,y+roadW/2-24,7,17);ctx.fillRect(x-roadW/2+7,y-roadW/2+6+i*14,17,7);ctx.fillRect(x+roadW/2-24,y-roadW/2+6+i*14,17,7)}}
    // street name plates
    ctx.font='700 9px Outfit, sans-serif';ctx.textAlign='center';ctx.fillStyle='#ebead8';
    roadsY.forEach((y,i)=>{ctx.save();ctx.translate(212,y-9);ctx.rotate(-Math.PI/2);ctx.fillText(['OLIVE ST','GROVE AVE','WILLOW ST'][i],0,0);ctx.restore()});
    roadsX.forEach((x,i)=>{ctx.fillText(['ORCHARD ST','MERCER LN','BLEECKER ST','HUDSON AVE'][i],x+13,roadsY[1]+35)});
    // trees outside built blocks, filtered away from roads
    trees.forEach(t=>{if(roadsX.some(x=>Math.abs(t.x-x)<61)||roadsY.some(y=>Math.abs(t.y-y)<61))return;tree(t.x,t.y,t.r)});
    // buildings with shadow, roof and windows
    buildings.forEach(b=>drawBuilding(b));
    // The current shop appears as a little delivery stop.
    const shop=currentOrder().pickup;ctx.fillStyle='#f8edd2';roundRect(shop[0]-18,shop[1]-15,36,26,5);ctx.fill();ctx.fillStyle='#749d73';ctx.fillRect(shop[0]-14,shop[1]-9,28,4);ctx.fillStyle='#c77757';ctx.fillRect(shop[0]-14,shop[1]-2,28,10);ctx.fillStyle='#f5ead1';ctx.fillRect(shop[0]-10,shop[1]+1,8,7);ctx.fillRect(shop[0]+3,shop[1]+1,8,4);ctx.fillStyle='#647d67';ctx.font='700 9px Outfit';ctx.textAlign='center';ctx.fillText(currentOrder().name.toUpperCase(),shop[0],shop[1]-21);
  }
  function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function tree(x,y,r){ctx.fillStyle='#74855e';ctx.beginPath();ctx.ellipse(x,y+3,r*.48,r*.35,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#779c73';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8db184';ctx.beginPath();ctx.arc(x-r*.2,y-r*.2,r*.57,0,Math.PI*2);ctx.fill()}
  function drawBuilding(b){ctx.fillStyle='#76827027';roundRect(b.x+4,b.y+5,b.w,b.h,5);ctx.fill();ctx.fillStyle=b.color;roundRect(b.x,b.y,b.w,b.h,5);ctx.fill();ctx.fillStyle='#ffffff38';ctx.fillRect(b.x+4,b.y+4,b.w-8,3);ctx.fillStyle='#9a886a';ctx.globalAlpha=.34;ctx.fillRect(b.x+5,b.y+b.h-6,b.w-10,2);ctx.globalAlpha=1;
    const cols=Math.max(2,Math.floor(b.w/22)),rows=Math.max(1,Math.floor(b.h/21));for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=b.x+9+c*((b.w-18)/cols),y=b.y+11+r*((b.h-20)/rows);ctx.fillStyle=b.seed>.5?'#f0e3c3':'#e9dfc3';ctx.fillRect(x,y,5,7);ctx.fillStyle='#ffffff40';ctx.fillRect(x+1,y+1,2,2)}ctx.fillStyle='#b68f70';ctx.fillRect(b.x+b.w*.45,b.y+b.h-12,7,12);if(b.type<.45){ctx.fillStyle='#8da783';ctx.beginPath();ctx.arc(b.x+b.w*.18,b.y+b.h+3,6,0,Math.PI*2);ctx.fill()}}
  function drawCar(car){ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.axis==='x'?0:Math.PI/2);ctx.fillStyle='#26383035';roundRect(-13,-7,28,18,5);ctx.fill();ctx.fillStyle=car.color;roundRect(-14,-9,28,18,5);ctx.fill();ctx.fillStyle='#dce6d6';roundRect(-6,-7,11,14,3);ctx.fill();ctx.fillStyle='#52665c';ctx.fillRect(-5,-6,8,5);ctx.fillRect(-5,1,8,5);ctx.fillStyle='#fff0c5';ctx.fillRect(11,-6,2,4);ctx.fillRect(11,2,2,4);ctx.fillStyle='#38453c';ctx.fillRect(-9,-11,5,3);ctx.fillRect(5,-11,5,3);ctx.fillRect(-9,8,5,3);ctx.fillRect(5,8,5,3);ctx.restore()}
  function currentOrder(){return orders[Math.min(orderIndex,orders.length-1)]}
  function target(){return stage==='pickup'?currentOrder().pickup:currentOrder().dest}
  function drawTarget(t,now){const pulse=1+Math.sin(now/220)*.12;ctx.save();ctx.translate(t[0],t[1]);ctx.fillStyle='#e58b5540';ctx.beginPath();ctx.arc(0,0,24*pulse,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ef965e';ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff8e9';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#df8953';ctx.font='bold 12px Outfit';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(stage==='pickup'?'↑':'⌖',0,1);ctx.restore()}
  function drawPlayer(){ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.face);ctx.fillStyle='#26382e35';ctx.beginPath();ctx.ellipse(-1,4,14,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#29352e';roundRect(-8,-9,17,4,2);ctx.fill();roundRect(-8,5,17,4,2);ctx.fill();ctx.fillStyle='#f4bf66';roundRect(-9,-7,18,14,5);ctx.fill();ctx.fillStyle='#57876b';roundRect(-5,-5,9,10,3);ctx.fill();ctx.fillStyle='#f1c29a';ctx.beginPath();ctx.arc(1,-2,4.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#32493b';ctx.beginPath();ctx.arc(1,-4,4.5,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#fff6d5';ctx.beginPath();ctx.arc(10,0,2.1,0,Math.PI*2);ctx.fill();ctx.restore()}
  function render(now){if(!loaded){drawWorld();loaded=true}const scale=Math.min(frameWidth/W,frameHeight/H)*mapZoom;const viewW=frameWidth/scale,viewH=frameHeight/scale;camera.x=Math.max(0,Math.min(W-viewW,player.x-viewW/2));camera.y=Math.max(0,Math.min(H-viewH,player.y-viewH/2));ctx.setTransform(dpr*scale,0,0,dpr*scale,-camera.x*dpr*scale,-camera.y*dpr*scale);drawWorld();cars.forEach(drawCar);if(active&&!ended)drawTarget(target(),now);drawPlayer();ctx.setTransform(dpr,0,0,dpr,0,0);requestAnimationFrame(render)}
  function updateUI(){const o=currentOrder();$('score').textContent=String(score).padStart(3,'0');$('streak').innerHTML=streak+'<span class="unit">×</span>';$('boostText').innerHTML=Math.round(boost)+'<span class="unit">%</span>';$('orderNum').innerHTML=String(Math.min(orderIndex+1,4)).padStart(2,'0')+'<span>/04</span>';$('timer').textContent='00:'+String(Math.ceil(Math.max(0,timeLeft))).padStart(2,'0');$('customerName').textContent=stage==='pickup'?o.name:o.customer;$('customerAvatar').textContent=stage==='pickup'?o.initial:o.customer.charAt(0);$('orderAction').textContent=stage==='pickup'?'PICK UP FROM':'DELIVER TO';$('address').textContent=stage==='pickup'?o.pickupAddress:o.address;$('package').textContent=o.package;$('tip').textContent='+$'+o.tip+' tip';$('streetName').textContent=o.street;$('locationText').textContent=o.place;$('districtName').innerHTML=o.district.split('\n').map((x,i)=>i===1?'<em>'+x+'</em>':x).join('<br>');$('routeTotal').textContent=orderIndex+'/4';$('routeProgress').style.width=(orderIndex/4*100)+'%';const ring=document.querySelector('.ring-progress');ring.style.strokeDashoffset=113*(1-Math.max(0,timeLeft)/35);ring.style.stroke=timeLeft<10?'#e49564':'#a8d59b';const status=$('orderStatus');status.innerHTML='<span class="status-pulse"></span><span>'+(stage==='pickup'?'HEAD TO THE PICKUP':'DELIVER THE ORDER')+'</span>';const steps=document.querySelectorAll('.route-step');steps[0].className='route-step '+(orderIndex>0?'done':'active');steps[1].className='route-step '+(orderIndex>0&&orderIndex<4?'active':orderIndex>=4?'done':'');steps[2].className='route-step '+(orderIndex>=4?'active':'');}
  function showToast(text){const el=$('toast');el.textContent=text;el.classList.add('show');toastTimer=1.7}
  function arrive(){if(stage==='pickup'){stage='deliver';showToast('Order picked up! Now make it count.');beep(640,.12);updateUI();return}const bonus=Math.max(0,Math.ceil(timeLeft))*2;score+=currentOrder().tip+bonus;streak++;orderIndex++;$('arrivalBanner').classList.add('show');arrivalTimer=1.5;beep(760,.12);setTimeout(()=>beep(980,.18),110);if(orderIndex>=4){ended=true;active=false;setTimeout(()=>showEnd(true),700)}else{stage='pickup';timeLeft=35;player.x=target()[0]+30;player.y=target()[1]+16;showToast('+$'+(currentOrder().tip+bonus)+' earned · next order!')}updateUI()}
  function showEnd(win){const overlay=$('startOverlay');overlay.innerHTML='<div class="start-card"><div class="start-badge">✦ &nbsp; SHIFT COMPLETE</div><div class="start-scooter">'+(win?'🎉':'🛵')+'</div><h1>'+(win?'You made their day.':'One more try?')+'</h1><p>'+(win?'Four deliveries, four happy customers.<br>You earned $'+score+' and made it look easy.':'The clock ran out on that order.<br>You earned $'+score+'. The city will be here when you are.')+'</p><div class="start-instructions"><span><b>'+orderIndex+' / 4</b><i>DELIVERIES</i></span><span><b>$'+score+'</b><i>TOTAL TIPS</i></span></div><button class="start-button" id="startBtn">'+(win?'ANOTHER SHIFT':'TRY AGAIN')+' <span>→</span></button><div class="start-foot">THANKS FOR RIDING WITH US.</div></div>';overlay.classList.remove('hidden');$('startBtn').addEventListener('click',resetGame)}
  function resetGame(){player={x:327,y:300,vx:0,vy:0,face:0};orderIndex=0;stage='pickup';timeLeft=35;score=0;streak=0;boost=100;active=true;paused=false;ended=false;$('startOverlay').classList.add('hidden');$('pauseOverlay').classList.add('hidden');$('arrivalBanner').classList.remove('show');updateUI();canvas.focus();beep(520,.08)}
  function togglePause(force){if(!active||ended)return;paused=force===undefined?!paused:force;$('pauseOverlay').classList.toggle('hidden',!paused);if(paused)keys={};}
  function update(dt,now){if(!active||paused||ended)return;timeLeft-=dt;if(timeLeft<=0){timeLeft=0;ended=true;active=false;showEnd(false);beep(170,.35,'triangle');return}if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('toast').classList.remove('show')}if(arrivalTimer>0){arrivalTimer-=dt;if(arrivalTimer<=0)$('arrivalBanner').classList.remove('show')}
    cars.forEach(c=>{if(c.axis==='x'){c.x+=c.speed*c.dir*dt;if(c.x>W+30)c.x=-30;if(c.x<-30)c.x=W+30}else{c.y+=c.speed*c.dir*dt;if(c.y>H+30)c.y=-30;if(c.y<-30)c.y=H+30}});
    let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);if(dx&&dy){dx*=.707;dy*=.707}const boosting=keys.boost&&boost>0&&!!(dx||dy);if(boosting)boost=Math.max(0,boost-34*dt);else boost=Math.min(100,boost+16*dt);const speed=boosting?285:205;const oldX=player.x,oldY=player.y;player.vx+=(dx*speed-player.vx)*Math.min(1,dt*9);player.vy+=(dy*speed-player.vy)*Math.min(1,dt*9);player.x=Math.max(20,Math.min(W-20,player.x+player.vx*dt));player.y=Math.max(20,Math.min(H-20,player.y+player.vy*dt));if(Math.abs(player.vx)+Math.abs(player.vy)>12)player.face=Math.atan2(player.vy,player.vx);
    // Scoot through any buildings, but let sidewalks and streets stay open.
    for(const b of buildings){if(player.x>b.x-11&&player.x<b.x+b.w+11&&player.y>b.y-11&&player.y<b.y+b.h+11){if(oldX<=b.x-11||oldX>=b.x+b.w+11)player.x=oldX;else player.y=oldY;player.vx*=.25;player.vy*=.25}}
    if(hitCooldown>0)hitCooldown-=dt;for(const c of cars){const cx=c.axis==='x'?c.x:c.x,cy=c.axis==='x'?c.y:c.y;if(Math.hypot(player.x-cx,player.y-cy)<22&&hitCooldown<=0){hitCooldown=1.1;player.vx=-player.vx*.6;player.vy=-player.vy*.6;timeLeft=Math.max(0,timeLeft-2);showToast('Oof! Watch out for traffic — 2 seconds lost.');beep(140,.12,'square',.025)}}
    const t=target();if(Math.hypot(player.x-t[0],player.y-t[1])<28)arrive();updateUI();
  }
  function loop(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;update(dt,now);requestAnimationFrame(loop)}
  const keyMap={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right', ' ':'boost'};
  window.addEventListener('keydown',e=>{if(keyMap[e.key]){e.preventDefault();keys[keyMap[e.key]]=true}if(e.key==='Escape'||e.key==='p'||e.key==='P')togglePause()});window.addEventListener('keyup',e=>{if(keyMap[e.key])keys[keyMap[e.key]]=false});window.addEventListener('blur',()=>{keys={}});
  document.querySelectorAll('.touch-key').forEach(btn=>{const dir=btn.dataset.dir;btn.addEventListener('pointerdown',e=>{e.preventDefault();keys[dir]=true;btn.setPointerCapture(e.pointerId)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>btn.addEventListener(ev,()=>keys[dir]=false))});$('touchBoost').addEventListener('pointerdown',e=>{e.preventDefault();keys.boost=true});['pointerup','pointercancel','pointerleave'].forEach(ev=>$('touchBoost').addEventListener(ev,()=>keys.boost=false));
  $('startBtn').addEventListener('click',resetGame);$('pauseBtn').addEventListener('click',()=>togglePause());$('resumeBtn').addEventListener('click',()=>togglePause(false));$('mapZoom').addEventListener('click',()=>{mapZoom=mapZoom===1?1.35:1;showToast(mapZoom>1?'Map zoomed in':'Map zoomed out')});$('soundBtn').addEventListener('click',()=>{soundOn=!soundOn;$('soundIcon').textContent=soundOn?'♫':'♪';if(soundOn)beep(500,.08)});
  updateUI();drawWorld();requestAnimationFrame(render);requestAnimationFrame(loop);
})();
