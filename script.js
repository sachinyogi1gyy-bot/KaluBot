const botGrid = document.getElementById('botGrid');
const botHelp = document.getElementById('botHelp');
const guildId = document.getElementById('guildId');
const continueBtn = document.getElementById('continueBtn');
const runSection = document.getElementById('runSection');
const runSummary = document.getElementById('runSummary');
const runBtn = document.getElementById('runBtn');
const logBox = document.getElementById('logBox');
const guestCount = document.getElementById('guestCount');
const genGuestBtn = document.getElementById('genGuestBtn');
const guestOutput = document.getElementById('guestOutput');

function selectedBots() {
  return [...botGrid.querySelectorAll('input:checked')].map((x) => x.value);
}

botGrid.addEventListener('change', (e) => {
  const picks = selectedBots();
  if (picks.length > 4 && e.target.checked) {
    e.target.checked = false;
    return;
  }
  botHelp.textContent = `${selectedBots().length}/4 bots selected`;
});

continueBtn.addEventListener('click', () => {
  const bots = selectedBots();
  const id = guildId.value.trim();

  if (!id) {
    alert('Please enter Guild ID');
    return;
  }
  if (!bots.length) {
    alert('Please select at least 1 bot');
    return;
  }

  runSection.classList.remove('hidden');
  runSummary.textContent = `Ready with ${bots.join(', ')} for Guild ID: ${id}`;
  logBox.textContent = 'Flow ready. Click Run to start.';
});

async function runFlow() {
  const bots = selectedBots();
  const id = guildId.value.trim();
  const steps = [
    `Checking configuration for Guild ${id}...`,
    `Sending guild invite request from ${bots.join(', ')}...`,
    'Waiting for join confirmation...',
    'Auto squad creation started...',
    'Starting matches to increase guild glory...',
    'Run complete (demo flow).'
  ];

  logBox.textContent = '';
  for (const step of steps) {
    logBox.textContent += `${new Date().toLocaleTimeString()} - ${step}\n`;
    await new Promise((r) => setTimeout(r, 900));
  }
}

runBtn.addEventListener('click', runFlow);

genGuestBtn.addEventListener('click', () => {
  const count = Math.max(1, Math.min(50, Number(guestCount.value || 1)));
  const lines = [];
  for (let i = 0; i < count; i++) {
    const id = `GUEST_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const token = crypto.randomUUID();
    lines.push(`${i + 1}. ${id} | token=${token}`);
  }
  guestOutput.textContent = lines.join('\n');
});
