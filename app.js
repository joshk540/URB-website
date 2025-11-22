
// Theme handling
function applyTheme() {
  const s = localStorage.getItem('urbTheme');
  if (s) {
    document.documentElement.dataset.theme = s;
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme === 'dark' ? '' : 'dark';
  document.documentElement.dataset.theme = current;
  localStorage.setItem('urbTheme', current);
}

// Auth + subscription flow (prototype only)
function doSignup() {
  const emailEl = document.getElementById('se');
  const passEl = document.getElementById('sp');
  if (!emailEl || !passEl) return;

  const email = emailEl.value.trim();
  const pass = passEl.value.trim();
  if (!email || !pass) {
    alert('Please enter an email and password to continue.');
    return;
  }

  localStorage.setItem('urbEmail', email);
  localStorage.setItem('urbPass', pass);
  // Reset paid state until payment step is completed
  localStorage.removeItem('urbPaid');
  location.href = 'pay.html';
}

function doLogin() {
  const emailInput = document.getElementById('le');
  const passInput = document.getElementById('lp');
  if (!emailInput || !passInput) return;

  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  const storedEmail = localStorage.getItem('urbEmail');
  const storedPass = localStorage.getItem('urbPass');

  if (email === storedEmail && pass === storedPass) {
    const isPaid = localStorage.getItem('urbPaid') === 'true';
    location.href = isPaid ? 'hub.html' : 'subs.html';
  } else {
    alert('Invalid login – this prototype only recognises the account you created on sign up.');
  }
}

function doPay() {
  // Prototype: no real card processing
  localStorage.setItem('urbPaid', 'true');
  location.href = 'hub.html';
}

function logout() {
  // Clear only auth / membership keys so student can re-run the flow
  localStorage.removeItem('urbEmail');
  localStorage.removeItem('urbPass');
  localStorage.removeItem('urbPaid');
  location.href = 'login.html';
}

// Gatekeeping for Wellness Hub
function guardHub() {
  const path = location.pathname || '';
  if (path.endsWith('hub.html')) {
    const hasAccount = !!localStorage.getItem('urbEmail');
    const isPaid = localStorage.getItem('urbPaid') === 'true';
    if (!hasAccount || !isPaid) {
      location.href = 'paywall.html';
    }
  }
}

// Wellness Hub helpers
function initHub() {
  // Soundscape: remember last choice
  const sndSelect = document.getElementById('sndSelect');
  const sndAudio = document.getElementById('snd');
  if (sndSelect && sndAudio) {
    const last = localStorage.getItem('urbSoundscape');
    if (last) {
      sndSelect.value = last;
      sndAudio.src = last;
    }
    sndSelect.addEventListener('change', function () {
      localStorage.setItem('urbSoundscape', this.value || '');
    });
  }

  // Journal autosave
  const journal = document.getElementById('journal');
  if (journal) {
    const saved = localStorage.getItem('urbJournal');
    if (saved) {
      journal.value = saved;
    }
    journal.addEventListener('input', function () {
      localStorage.setItem('urbJournal', this.value);
    });
  }

  // Mood check-in
  const moodButtons = document.querySelectorAll('[data-mood]');
  const moodMsg = document.getElementById('moodMessage');
  const savedMood = localStorage.getItem('urbMood');
  if (moodButtons.length) {
    function updateMoodUI(mood) {
      moodButtons.forEach(btn => {
        if (btn.dataset.mood === mood) {
          btn.classList.add('btn');
          btn.classList.remove('btn-outline');
        } else {
          btn.classList.remove('btn');
          btn.classList.add('btn-outline');
        }
      });
      if (moodMsg) {
        let text = '';
        if (mood === 'calm') text = 'Great – maybe lock this feeling in with a short gratitude note below.';
        if (mood === 'stressed') text = 'Totally valid. Try a 60-second breath and a quick re-prioritise before diving back in.';
        if (mood === 'tired') text = 'Your brain is flagging. A short break, water and a stretch may help more than another tab.';
        if (mood === 'overwhelmed') text = 'You don’t have to fix everything at once. Pick one tiny next step, then rest.';
        moodMsg.textContent = text;
      }
    }

    moodButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const mood = this.dataset.mood;
        localStorage.setItem('urbMood', mood);
        updateMoodUI(mood);
      });
    });

    if (savedMood) {
      updateMoodUI(savedMood);
    }
  }
}

// Global initialisation
document.addEventListener('DOMContentLoaded', function () {
  applyTheme();
  guardHub();

  const path = location.pathname || '';
  if (path.endsWith('hub.html')) {
    initHub();
  }
});
