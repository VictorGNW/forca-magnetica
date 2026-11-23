const D=window.MODEL;
const $=id=>document.getElementById(id),dark=()=>document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
const b64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer};
const q=new Uint16Array(b64(D.v)),pos=new Float32Array(q.length),mn=D.mn,mx=D.mx;
for(let i=0;i<q.length;i+=3){const k=[0,1,2].map(j=>mn[j]+q[i+j]/65535*(mx[j]-mn[j]));pos[i]=k[0];pos[i+1]=k[2];pos[i+2]=-k[1]}
const PA=new THREE.BufferAttribute(pos,3);
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6,metalness:.05,flatShading:true},o));
const mat={book:M(0x8b9099),magS:M(0x3c6fc4),magN:M(0xc5443c),lt:M(0xf4f4f4),clip:M(0x7a828c,{metalness:.5,roughness:.35}),wL:M(0xc0392b),wR:M(0x30343b),pil:M(0xd9a21b),txt:M(0x2b3140),tP:M(0xc0392b),tN:M(0x30343b),xm:M(0x2f6fd6),aB:M(0x2f9e6f),aI:M(0xe6b422),strip:M(0xd6d9de,{metalness:.35,roughness:.3})};
const cv=$('cv'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.5,600);
scene.add(new THREE.HemisphereLight(0xffffff,0x8890a0,.95));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(30,70,60);scene.add(dl);
const ctl=new THREE.OrbitControls(cam,cv);ctl.enableDamping=true;ctl.target.set(22.7,2.5,19);ctl.maxPolarAngle=1.52;ctl.minDistance=25;ctl.maxDistance=180;
const plane=new THREE.Mesh(new THREE.PlaneGeometry(80,64),new THREE.MeshStandardMaterial({color:0xe4e1d8,roughness:1}));plane.rotation.x=-Math.PI/2;plane.position.set(22.7,-.06,19);scene.add(plane);
const root=new THREE.Group(),ann=new THREE.Group();scene.add(root,ann);ann.visible=false;
const mk=(n,m,p)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',PA);g.setIndex(new THREE.BufferAttribute(new Uint16Array(b64(D.g[n])),1));const o=new THREE.Mesh(g,m);(p||root).add(o);return o};
mk('book',mat.book);const mT=mk('magTop',mat.magS),mB=mk('magBot',mat.magN),lT=mk('letTop',mat.lt),lB=mk('letBot',mat.lt);
mk('clip',mat.clip);mk('wireL',mat.wL);mk('wireR',mat.wR);mk('pilha',mat.pil);const tP=mk('txtPos',mat.tP),tN=mk('txtNeg',mat.tN);
// Substitui as letras extrudadas do STL por etiquetas planas na tela.
const labels=[['Ponto positivo',tP,'positive'],['Ponto negativo',tN,'negative']].map(([name,mesh,kind])=>{
 mesh.geometry.computeBoundingBox();
 const center=mesh.geometry.boundingBox.getCenter(new THREE.Vector3());
 const el=document.createElement('span');el.className='terminal-label '+kind;el.textContent=name;
 $('stage').appendChild(el);mesh.visible=false;
 return {mesh,center,el};
});
// Etiquetas HTML 2D ancoradas aos fios no espaço 3D, atualizadas com a câmera.
const terminalAnchorLeft=new THREE.Vector3(10.5,2.9,33.85);
const terminalAnchorRight=new THREE.Vector3(34.5,2.9,33.85);
const projectedTerminal=new THREE.Vector3();
function updateTerminalLabels(){
 const stage=$('stage'),width=stage.clientWidth,height=stage.clientHeight;
 if(!width||!height)return;
 for(const {el} of labels){
  const positive=el.classList.contains('positive');
  const anchor=(positive===(S.pol>0))?terminalAnchorLeft:terminalAnchorRight;
  projectedTerminal.copy(anchor).project(cam);
  // Mantém a etiqueta junto ao fio, inclusive ao girar a cena.
  const x=(projectedTerminal.x+1)*width/2;
  const y=(1-projectedTerminal.y)*height/2;
  const margin=el.offsetWidth/2+5;
  el.style.left=Math.max(margin,Math.min(width-margin,x))+'px';
  el.style.top=Math.max(14,Math.min(height-14,y))+'px';
  el.style.display=projectedTerminal.z>=-1&&projectedTerminal.z<=1?'block':'none';
 }
}

mk('txtCampo',mat.txt,ann);mk('txtCorr',mat.txt,ann);mk('txtForca',mat.txt,ann);mk('xmarks',mat.xm,ann);mk('arrB',mat.aB,ann);mk('arrI',mat.aI,ann);
const sg=new THREE.BoxGeometry(35,1.4,.8,80,1,1),sp=sg.attributes.position,s0=sp.array.slice(),strip=new THREE.Mesh(sg,mat.strip);strip.position.set(23.3,3.5,14.2);root.add(strip);
const shape=x=>.5*(1+Math.cos(Math.PI*Math.max(-1,Math.min(1,x/17.5))));
const bend=v=>{for(let i=0;i<sp.count;i++)sp.setY(i,s0[i*3+1]+v*shape(s0[i*3]));sp.needsUpdate=true;strip.geometry.computeBoundingSphere()};
const P=[[20.6,-33.85,2.6],[6.65,-33.85,2.6],[6.65,-14.2,3.4],[8.7,-14.2,4.45],[37.4,-14.2,4.45],[38.55,-14.2,3.4],[38.55,-33.85,2.6],[25.3,-33.85,2.6]],seg=[];let L=0;
for(let i=0;i<8;i++){const a=P[i],b=P[(i+1)%8],l=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);seg.push([a,b,l,L]);L+=l}
const at=(s,dv)=>{s=(s%L+L)%L;for(const[a,b,l,o]of seg)if(s<=o+l){const t=(s-o)/l,p=[0,1,2].map(i=>a[i]+(b[i]-a[i])*t);if(a===P[3])p[2]+=dv*shape(p[0]-23.3);return[p[0],p[2],-p[1]]}return[0,0,0]};
const NP=70,pp=new Float32Array(NP*3),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffd34d,size:1.3}));pts.frustumCulled=false;scene.add(pts);
const arr=c=>{const a=new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(),5,c,1.8,1.1);scene.add(a);return a};
const aB=arr(0x2f6fd6),aI=arr(0xe6a817),aF=arr(0xd3382f),V3=THREE.Vector3;
const S={n:1,B:.2,ts:.3,flip:false,pol:1,hold:false,latch:false,cut:false,x:0,v:0,T:22,t:0,I:0,F:0,ph:0,vec:true,msg:''};
const cRed=0xc0392b,cDk=()=>dark()?0x7b8290:0x30343b;
function paint(){mat.wL.color.setHex(S.pol>0?cRed:cDk());mat.wR.color.setHex(S.pol>0?cDk():cRed);mat.tP.color.setHex(cRed);mat.tN.color.setHex(cDk());mat.txt.color.setHex(dark()?0xd5d9e2:0x2b3140);plane.material.color.setHex(dark()?0x2a2e36:0xe4e1d8)}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',paint);paint();
function phys(dt){const on=(S.hold||S.latch)&&!S.cut,Rs=.28*(1+.0039*(S.T-20)),r=.15*S.n+.12;S.I=on?1.5*S.n/(Rs+r):0;S.F=S.B*S.I*.02*S.pol*(S.flip?-1:1);let h=dt*S.ts;S.t+=h;
 while(h>0){const e=Math.min(.0004,h);h-=e;S.v+=(S.F-1.5*S.x-.00588*S.v)/4e-4*e;S.x+=S.v*e;if(S.x<-.0093){S.x=-.0093;if(S.v<0)S.v*=-.15}S.T+=(S.I*S.I*Rs/.36-.05*(S.T-22))*e}
 if(S.T>=150){S.cut=true;S.latch=false;S.hold=false;$('latch').setAttribute('aria-pressed','false');h.classList.remove('on')}if(S.cut&&S.T<=60)S.cut=false}
const fm=(v,d)=>v.toFixed(d).replace('.',',');
function frame(dt){phys(dt);const dv=Math.max(-3,Math.min(14,S.x*300)),on=(S.hold||S.latch)&&!S.cut,sg2=S.F>=0?1:-1;bend(dv);
 const hot=Math.max(0,Math.min(1,(S.T-100)/250));mat.strip.emissive.setRGB(hot,hot*.3,hot*.08);
 S.ph+=S.pol*(4+8*S.I)*dt;pts.visible=on;for(let i=0;i<NP;i++){const p=at(i/NP*L+S.ph,dv+.2);pp[i*3]=p[0];pp[i*3+1]=p[1];pp[i*3+2]=p[2]}pg.attributes.position.needsUpdate=true;
 const v=S.vec;aB.visible=v;aB.position.set(23.3,6.5,S.flip?7.8:21.8);aB.setDirection(new V3(0,0,S.flip?1:-1));aB.setLength(13.8,2,1.3);
 aI.visible=v&&on;aI.position.set(23.3-S.pol*9,9,14.2);aI.setDirection(new V3(S.pol,0,0));aI.setLength(18,2,1.3);
 aF.visible=v&&on;aF.position.set(23.3,(sg2>0?4.4:2.6)+dv,14.2);aF.setDirection(new V3(0,sg2,0));aF.setLength(Math.min(12,3+Math.abs(S.F)*1e3*.35),1.8,1.1);
 const up=S.pol*(S.flip?-1:1)>0;let m;
 if(S.cut)m='Proteção térmica: circuito aberto. Aguarde a temperatura cair até 60 °C.';
 else if(!on)m=S.T>45?'Circuito aberto. A tira ainda está quente e esfria devagar.':'Circuito aberto: sem corrente, sem força. A tira fica parada.';
 else m=(up?'Força para cima: a tira sobe.':'Força para baixo: a tira é empurrada contra a mesa e quase não se move.')+(S.T>60?' Atenção: tira muito quente, solte a ligação.':'');
 if(m!==S.msg){S.msg=m;$('status').textContent=m}
 $('hI').textContent=fm(S.I,1)+' A';$('hF').textContent=(S.F>=0?'+':'−')+fm(Math.abs(S.F)*1e3,1)+' mN';$('hD').textContent=fm(S.x*1e3,1)+' mm';$('hT').textContent=Math.round(S.T)+' °C';$('hS').textContent=fm(S.t,1)+' s'}
let last=performance.now();(function loop(n){const dt=Math.min(.05,(n-last)/1e3);last=n;frame(dt);ctl.update();updateTerminalLabels();R.render(scene,cam);requestAnimationFrame(loop)})(last);
new ResizeObserver(()=>{const s=$('stage');R.setSize(s.clientWidth,s.clientHeight,false);cam.aspect=s.clientWidth/s.clientHeight;cam.updateProjectionMatrix()}).observe($('stage'));
const view={p:[52,60,84],t:[22.7,120,27],f:[22.7,14,98]};
document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{cam.position.set(...view[b.dataset.v]);ctl.target.set(22.7,2.5,19);ctl.update()});cam.position.set(...view.p);
const h=$('hold');h.addEventListener('pointerdown',e=>{if(S.cut)return;S.hold=true;h.classList.add('on');h.setPointerCapture(e.pointerId)});['pointerup','pointercancel'].forEach(t=>h.addEventListener(t,()=>{S.hold=false;h.classList.remove('on')}));
addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat&&!['INPUT','BUTTON','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!S.cut){e.preventDefault();S.hold=true;h.classList.add('on')}});
addEventListener('keyup',e=>{if(e.code==='Space'){S.hold=false;h.classList.remove('on')}});
addEventListener('blur',()=>{S.hold=false;h.classList.remove('on')});
const tog=(id,fn)=>$(id).onclick=function(){const o=this.getAttribute('aria-pressed')!=='true';this.setAttribute('aria-pressed',o);fn(o)};
tog('latch',o=>{if(S.cut){S.latch=false;$('latch').setAttribute('aria-pressed','false');return}S.latch=o});tog('vec',o=>S.vec=o);tog('ann',o=>ann.visible=o);
$('pol').onclick=()=>{S.pol*=-1;tP.position.x=S.pol>0?0:20.3;tN.position.x=S.pol>0?0:-20.3;paint()};
$('flip').onclick=()=>{S.flip=!S.flip;mT.material=S.flip?mat.magN:mat.magS;mB.material=S.flip?mat.magS:mat.magN;lT.position.set(S.flip?.35:0,0,S.flip?21.7:0);lB.position.set(S.flip?-.35:0,0,S.flip?-21.7:0)};
$('reset').onclick=()=>{Object.assign(S,{n:1,B:.2,ts:.3,flip:false,pol:1,hold:false,latch:false,cut:false,x:0,v:0,T:22,t:0,I:0,F:0,ph:0,vec:true,msg:''});for(const [id,val,out,label] of [['n',1,'nO','1'],['b',.2,'bO','0,20 T'],['ts',.3,'tO','0,30×']]){$(id).value=val;$(out).textContent=label}for(const [id,on] of [['latch',false],['vec',true],['ann',false]])$(id).setAttribute('aria-pressed',String(on));ann.visible=false;h.classList.remove('on');mT.material=mat.magS;mB.material=mat.magN;lT.position.set(0,0,0);lB.position.set(0,0,0);tP.position.x=0;tN.position.x=0;paint()};
[['n','nO',v=>v],['b','bO',v=>fm(+v,2)+' T'],['ts','tO',v=>fm(+v,2)+'×']].forEach(([i,o,f])=>$(i).oninput=e=>{const v=+e.target.value;$(o).textContent=f(v);S[i==='b'?'B':i]=v});
