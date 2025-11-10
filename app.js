function toggle(id){ const el=document.getElementById(id); if(el) el.classList.toggle('hidden'); }
function showAll(){ document.querySelectorAll('.solution').forEach(n=>n.classList.remove('hidden')); }
function hideAll(){ document.querySelectorAll('.solution').forEach(n=>n.classList.add('hidden')); }
function wireToggles(){
  document.querySelectorAll('button[data-target]').forEach(btn=>{
    const id = btn.getAttribute('data-target');
    btn.addEventListener('click', ()=> toggle(id));
  });
  const sa=document.getElementById('show-all'); if(sa) sa.addEventListener('click', showAll);
  const ha=document.getElementById('hide-all'); if(ha) ha.addEventListener('click', hideAll);
}
document.addEventListener('DOMContentLoaded', wireToggles);
