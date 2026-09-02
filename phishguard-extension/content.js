let lastProcessedEmail = null;
let debounceTimer = null;

function isEmailOpen() {
  const subjectEl = document.querySelector('h2.hP');
  const bodyEl = document.querySelector('div.a3s.aiL');
  return subjectEl && bodyEl && bodyEl.innerText.trim().length > 0;
}

function extractEmailData() {
  if (!isEmailOpen()) return null;

  const subjectEl = document.querySelector('h2.hP');
  const bodyEl = document.querySelector('div.a3s.aiL');

  const subject = subjectEl.innerText.trim();
  const body = bodyEl.innerText.trim();

  const fingerprint = subject + body.slice(0, 100);
  if (fingerprint === lastProcessedEmail) return null;

  lastProcessedEmail = fingerprint;

  return { subject, body };
}

function removeExistingBanner() {
  const existing = document.getElementById('phishguard-banner');
  if (existing) existing.remove();
}

function showBanner(prediction, confidence) {
  removeExistingBanner();

  const isPhishing = prediction === "Phishing";
//   const confidencePct = (confidence * 100).toFixed(1);
  const confidencePct = isPhishing
  ? (confidence * 100).toFixed(1)
  : ((1 - confidence) * 100).toFixed(1);

  const banner = document.createElement('div');
  banner.id = 'phishguard-banner';

  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99999;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-family: 'Google Sans', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    background-color: ${isPhishing ? '#d93025' : '#1e8e3e'};
    color: white;
    box-sizing: border-box;
  `;

  banner.innerHTML = `
    <span style="font-size:18px; flex-shrink:0;">${isPhishing ? '🚨' : '✅'}</span>
    <span style="flex:1; text-align:center; min-width:0;">
      <strong>PhishGuard:</strong>
      ${isPhishing
        ? `This email is likely <strong>PHISHING</strong> — be careful!`
        : `This email appears <strong>LEGITIMATE</strong>`
      }
      &nbsp;·&nbsp; Confidence: <strong>${confidencePct}%</strong>
    </span>
    <button id="phishguard-close" style="
      flex-shrink: 0;
      background: rgba(255,255,255,0.25);
      border: none;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    ">Dismiss</button>
  `;

  document.body.appendChild(banner);

  document.getElementById('phishguard-close').addEventListener('click', () => {
    banner.remove();
  });

  // if (!isPhishing) {
  //   setTimeout(() => banner.remove(), 4000);
  // }
}

function showLoadingBanner() {
  removeExistingBanner();

  const banner = document.createElement('div');
  banner.id = 'phishguard-banner';

  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99999;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Google Sans', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    background-color: #1a73e8;
    color: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;

  banner.innerHTML = `
    <span style="font-size:18px;">🔍</span>
    <span><strong>PhishGuard</strong> is analyzing this email...</span>
  `;

  document.body.appendChild(banner);
}

async function analyzeEmail() {
  const emailData = extractEmailData();
  if (!emailData) return;

  showLoadingBanner();

  try {
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: emailData.subject,
        body: emailData.body
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const result = await response.json();
    showBanner(result.prediction, result.confidence);

  } catch (error) {
    removeExistingBanner();
    console.error('PhishGuard error:', error);

    const errBanner = document.createElement('div');
    errBanner.id = 'phishguard-banner';
    errBanner.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      z-index: 99999;
      padding: 12px 24px;
      background: #f29900;
      color: white;
      font-family: 'Google Sans', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    errBanner.innerHTML = `⚠️ <strong>PhishGuard:</strong> Could not reach the API. Is your FastAPI server running?`;
    document.body.appendChild(errBanner);
    setTimeout(() => errBanner.remove(), 5000);
  }
}

let lastUrl = location.href;

const observer = new MutationObserver(() => {
  const currentUrl = location.href;

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    lastProcessedEmail = null;

    if (!isEmailOpen()) {
      removeExistingBanner();
      return;
    }
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (isEmailOpen()) {
      analyzeEmail();
    } else {
      removeExistingBanner();
    }
  }, 800);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});