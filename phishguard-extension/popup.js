// Check if FastAPI is reachable
async function checkAPIStatus() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');

  try {
    const response = await fetch('http://127.0.0.1:8000/', {
      method: 'GET'
    });

    if (response.ok) {
      dot.classList.add('online');
      text.textContent = 'API is online ✓';
    } else {
      throw new Error();
    }
  } catch {
    dot.classList.add('offline');
    text.textContent = 'API offline — start your FastAPI server';
  }
}

checkAPIStatus();