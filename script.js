// Load interns from localStorage or start empty
let interns = JSON.parse(localStorage.getItem('interns')) || [];

function saveInterns() {
  localStorage.setItem('interns', JSON.stringify(interns));
}

function addIntern() {
  const name   = document.getElementById('intern-name').value.trim();
  const dept   = document.getElementById('intern-dept').value.trim();
  const email  = document.getElementById('intern-email').value.trim();
  const status = document.getElementById('intern-status').value;
  const errorEl = document.getElementById('error-msg');

  // Validation
  if (!name || !dept || !email || !status) {
    errorEl.textContent = 'Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.textContent = 'Please enter a valid email address.';
    return;
  }

  errorEl.textContent = '';

  const intern = {
    id: Date.now(),
    name,
    dept,
    email,
    status
  };

  interns.push(intern);
  saveInterns();
  clearForm();
  renderInterns();
}

function deleteIntern(id) {
  interns = interns.filter(i => i.id !== id);
  saveInterns();
  renderInterns();
}

function clearForm() {
  ['intern-name', 'intern-dept', 'intern-email'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('intern-status').value = '';
}

function renderInterns() {
  const searchVal  = document.getElementById('search-input').value.toLowerCase();
  const filterVal  = document.getElementById('filter-status').value;
  const listEl     = document.getElementById('intern-list');
  const emptyEl    = document.getElementById('empty-msg');

  let filtered = interns.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchVal) ||
                          i.dept.toLowerCase().includes(searchVal);
    const matchesFilter = filterVal === 'All' || i.status === filterVal;
    return matchesSearch && matchesFilter;
  });

  listEl.innerHTML = filtered.map(i => `
    <div class="intern-card">
      <div class="intern-info">
        <h3>${escapeHTML(i.name)}</h3>
        <p>📂 ${escapeHTML(i.dept)}</p>
        <p>✉️ ${escapeHTML(i.email)}</p>
        <span class="badge badge-${i.status}">${i.status}</span>
      </div>
      <div class="card-actions">
        <button class="btn-delete" onclick="deleteIntern(${i.id})">Delete</button>
      </div>
    </div>
  `).join('');

  emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
  updateStats();
}

function updateStats() {
  document.getElementById('total-count').textContent     = interns.length;
  document.getElementById('active-count').textContent    = interns.filter(i => i.status === 'Active').length;
  document.getElementById('completed-count').textContent = interns.filter(i => i.status === 'Completed').length;
  document.getElementById('pending-count').textContent   = interns.filter(i => i.status === 'Pending').length;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderInterns();