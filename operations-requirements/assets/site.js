const frame=document.querySelector('#doc-frame');
const title=document.querySelector('#current-title');
const links=[...document.querySelectorAll('.nav-link')];
function openDoc(link,push=true){
  links.forEach(x=>x.classList.toggle('active',x===link));
  frame.src=link.dataset.src;
  title.textContent=link.textContent.trim();
  if(push) history.replaceState(null,'','#'+link.dataset.slug);
}
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
