// ========== Utility + Core Toggles ==========
function toggle(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden');
}

function showAll() {
  document.querySelectorAll('.solution').forEach(n => n.classList.remove('hidden'));
}

function hideAll() {
  document.querySelectorAll('.solution').forEach(n => n.classList.add('hidden'));
}

function wireToggles() {
  // Per-question toggles
  document.querySelectorAll('button[data-target]').forEach(btn => {
    const id = btn.getAttribute('data-target');
    btn.addEventListener('click', () => toggle(id));
  });
  // Global show/hide all
  const sa = document.getElementById('show-all');
  if (sa) sa.addEventListener('click', showAll);
  const ha = document.getElementById('hide-all');
  if (ha) ha.addEventListener('click', hideAll);
}

// ========== Ask AI Modal Wiring ==========
function wireAskAI() {
  const openBtn  = document.getElementById('ask-ai-btn');
  const modal    = document.getElementById('ask-ai-modal');
  const closeBtn = document.getElementById('ask-ai-close');
  const input    = document.getElementById('ask-ai-input');
  const sendBtn  = document.getElementById('ask-ai-send');
  const statusEl = document.getElementById('ask-ai-status');
  const answerEl = document.getElementById('ask-ai-answer');

  // If the Ask-AI UI isn't present on this page, bail silently.
  if (!openBtn || !modal) return;

  function openModal() {
    // Prefill with selected text (if any)
    try { input && (input.value = (window.getSelection()?.toString() || '').trim()); } catch {}
    if (statusEl) statusEl.textContent = '';
    if (answerEl) {
      answerEl.textContent = '';
      answerEl.classList.add('hidden');
    }
    modal.classList.remove('hidden');
    input && input.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  async function askAI() {
    const typed = (input?.value || '').trim();
    const selected = (window.getSelection?.().toString() || '').trim();
    const prompt = typed || selected;

    if (!prompt) {
      if (statusEl) {
        statusEl.textContent = 'Please type a question (or select text on the page).';
      }
      return;
    }

    if (sendBtn) sendBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Thinking…';
    if (answerEl) {
      answerEl.textContent = '';
      answerEl.classList.add('hidden');
    }

    try {
      const resp = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend expects { prompt }
        body: JSON.stringify({ prompt })
      });

      let data;
      try { data = await resp.json(); } catch {
        // If backend returns text/plain in error, fall back to text
        const txt = await resp.text();
        throw new Error(txt || 'Invalid server response');
      }

      if (!resp.ok) {
        throw new Error(data?.error || data?.detail || resp.statusText || 'Request failed');
      }

      const txt = (data?.answer || '').trim();
      if (answerEl) {
        // Use textContent to avoid injecting HTML; preserve line breaks visually with CSS if needed
        answerEl.textContent = txt || '(no answer)';
        answerEl.classList.remove('hidden');
      }
      if (statusEl) statusEl.textContent = '';
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Error: ' + (err?.message || err);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  // Open / Close bindings
  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click backdrop to close
  });
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden') && e.key === 'Escape') closeModal();
  });

  // Submit
  sendBtn?.addEventListener('click', askAI);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      askAI();
    }
  });
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  wireToggles();
  wireAskAI();
  console.log('app.js initialized');
});
