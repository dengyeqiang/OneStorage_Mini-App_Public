const AUTH_KEY='onestorage_docs_access_v1';
const AUTH_HASH='ab8ea200f8ff818dbf044864afa3bd050246c2f98e7f4a5ad04a08ae51da10d4';
const frame=document.querySelector('#doc-frame');
const title=document.querySelector('#current-title');
const links=[...document.querySelectorAll('.nav-link')];
function openDoc(link,push=true){
  links.forEach(x=>x.classList.toggle('active',x===link));
  frame.src=link.dataset.src;
  title.textContent=link.textContent.trim();
  if(push) history.replaceState(null,'','#'+link.dataset.slug);
}
function initSite(){
  links.forEach(link=>link.addEventListener('click',e=>{e.preventDefault();openDoc(link)}));
  const requested=location.hash.slice(1);
  openDoc(links.find(x=>x.dataset.slug===requested)||links[0],false);
  document.querySelector('#search').addEventListener('input',e=>{
    const q=e.target.value.trim().toLowerCase();
    links.forEach(link=>link.hidden=q&&!link.textContent.toLowerCase().includes(q));
    document.querySelectorAll('.group').forEach(group=>{
      group.hidden=![...group.querySelectorAll('.nav-link')].some(link=>!link.hidden);
    });
  });
}
async function digest(value){
  const data=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
function showLogin(){
  const gate=document.createElement('div');
  gate.className='auth-gate';
  gate.innerHTML='<form class="auth-card"><div class="auth-eyebrow">ONE STORAGE</div><h1>需求文档访问验证</h1><p>请输入固定访问密码后继续阅览。</p><label for="access-password">访问密码</label><input id="access-password" name="password" type="password" autocomplete="current-password" required autofocus><div class="auth-error" role="alert" aria-live="polite"></div><button type="submit">进入文档中心</button></form>';
  document.body.appendChild(gate);
  const form=gate.querySelector('form');
  const input=gate.querySelector('input');
  const error=gate.querySelector('.auth-error');
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector('button');
    button.disabled=true;
    error.textContent='';
    const hash=await digest(input.value);
    if(hash===AUTH_HASH){
      sessionStorage.setItem(AUTH_KEY,AUTH_HASH);
      gate.remove();
      initSite();
      return;
    }
    input.value='';
    input.focus();
    error.textContent='密码不正确，请重新输入。';
    button.disabled=false;
  });
}
if(sessionStorage.getItem(AUTH_KEY)===AUTH_HASH){initSite()}else{showLogin()}
