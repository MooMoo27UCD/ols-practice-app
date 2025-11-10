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
// === Ask AI wiring (global button + modal) ===
(function(){
  function $(id){ return document.getElementById(id); }

  const openBtn = $('ask-ai-open');
  const modal = $('ask-ai-modal');
  const input = $('ask-ai-input');
  const sendBtn = $('ask-ai-send');
  const closeBtn = $('ask-ai-close');
  const status = $('ask-ai-status');
  const out = $('ask-ai-answer');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    // Pre-fill with currently selected text, if any
    input.value = window.getSelection()?.toString() || '';
    out.classList.add('hidden');
    out.innerHTML = '';
    status.textContent = '';
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  sendBtn.addEventListener('click', async () => {
    const prompt = (input.value || '').trim();
    if (!prompt) {
      status.textContent = 'Please type or paste a question.';
      status.style.color = '#b91c1c';
      return;
    }
    status.textContent = 'Thinking…';
    status.style.color = '#374151';
    out.classList.add('hidden');
    out.innerHTML = '';

    try {
      const resp = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!resp.ok) {
        const err = await resp.text();
        status.textContent = 'Error: ' + err;
        status.style.color = '#b91c1c';
        return;
      }
      const data = await resp.json();
      out.innerHTML = `<h4>Answer</h4><div>${(data.answer || '').replace(/\n/g,'<br>')}</div>`;
      out.classList.remove('hidden');
      status.textContent = '✓ Ready';
      status.style.color = '#065f46';
    } catch (e) {
      status.textContent = 'Network error. Try again.';
      status.style.color = '#b91c1c';
    }
  });
})();
