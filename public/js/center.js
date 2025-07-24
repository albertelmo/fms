function setupTab() {
    center.loadList();
    const form = document.getElementById('center-add-form');
    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const name = document.getElementById('center-name').value.trim();
            const resultDiv = document.getElementById('center-add-result');
            if (!name) {
                resultDiv.innerText = '센터 이름을 입력해주세요.';
                return;
            }
            try {
                const res = await fetch('/api/centers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                const result = await res.json();
                if (res.ok) {
                    resultDiv.style.color = '#1976d2';
                    resultDiv.innerText = result.message;
                    form.reset();
                    center.loadList();
                } else {
                    resultDiv.style.color = '#d32f2f';
                    resultDiv.innerText = result.message;
                }
            } catch {
                resultDiv.style.color = '#d32f2f';
                resultDiv.innerText = '센터 추가에 실패했습니다.';
            }
        };
    }
}

async function loadList() {
    const loading = document.getElementById('center-list-loading');
    const listDiv = document.getElementById('center-list');
    if (loading) loading.style.display = 'block';
    if (listDiv) listDiv.innerHTML = '';
    try {
        const res = await fetch('/api/centers');
        const centers = await res.json();
        if (loading) loading.style.display = 'none';
        if (centers.length === 0) {
            if (listDiv) listDiv.innerHTML = '<div style="color:#888;">등록된 센터가 없습니다.</div>';
        } else {
            let html = '<ul style="padding-left:0;list-style:none;">';
            centers.forEach(c => {
                html += `<li style=\"padding:8px 0;border-bottom:1px solid #e3eaf5;display:flex;align-items:center;justify-content:space-between;\">🏢 <span>${c.name}</span> <button class=\"center-delete-btn\" data-name=\"${encodeURIComponent(c.name)}\" style=\"background:#fff;color:#d32f2f;border:1px solid #d32f2f;padding:4px 12px;border-radius:4px;font-size:0.95rem;cursor:pointer;transition:background 0.2s;\">삭제</button></li>`;
            });
            html += '</ul>';
            if (listDiv) listDiv.innerHTML = html;
            // 삭제 버튼 이벤트 바인딩
            document.querySelectorAll('.center-delete-btn').forEach(btn => {
                btn.onclick = async function() {
                    if (!confirm('정말 삭제하시겠습니까?')) return;
                    const name = btn.getAttribute('data-name');
                    try {
                        const res = await fetch(`/api/centers/${name}`, { method: 'DELETE' });
                        const result = await res.json();
                        if (res.ok) {
                            center.loadList();
                        } else {
                            alert(result.message);
                        }
                    } catch {
                        alert('센터 삭제에 실패했습니다.');
                    }
                };
            });
        }
    } catch (e) {
        if (loading) loading.style.display = 'none';
        if (listDiv) listDiv.innerHTML = '<div style=\"color:#d32f2f;\">센터 목록을 불러오지 못했습니다.</div>';
    }
}

export const center = { setupTab, loadList }; 