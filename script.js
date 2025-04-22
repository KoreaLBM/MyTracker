// script.js
document.addEventListener('DOMContentLoaded', async () => {
  const tigerSnpEl = document.querySelector('#tiger-snp500 .price');
  const tigerNasdaqEl = document.querySelector('#tiger-nasdaq .price');
  const gldEl = document.querySelector('#gld .price');

  try {
    const koreaRes = await fetch('/.netlify/functions/korea-etfs');
    const koreaData = await koreaRes.json();
    tigerSnpEl.textContent = koreaData.snp500;
    tigerNasdaqEl.textContent = koreaData.nasdaq;
  } catch (e) {
    tigerSnpEl.textContent = '에러';
    tigerNasdaqEl.textContent = '에러';
  }

  try {
    const gldRes = await fetch('/.netlify/functions/gld');
    const gldData = await gldRes.json();
    const gldPrice = gldData.quoteResponse.result[0].regularMarketPrice;
    gldEl.textContent = gldPrice;
  } catch (e) {
    gldEl.textContent = '에러';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;

  // 초기 설정
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggle.textContent = '☀️ 라이트모드';
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    toggle.textContent = isDark ? '☀️ 라이트모드' : '🌙 다크모드';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});

function fetchData() {
  fetch('/.netlify/functions/korea-etfs')
    .then(res => res.json())
    .then(data => {
      document.querySelector('#tiger-snp500 .price').textContent = data.snp500;
      document.querySelector('#tiger-nasdaq .price').textContent = data.nasdaq;
    });

  fetch('/.netlify/functions/gld')
    .then(res => res.json())
    .then(data => {
      const gldPrice = data.quoteResponse.result[0].regularMarketPrice;
      document.querySelector('#gld .price').textContent = `$${gldPrice}`;
    });
}

fetchData(); // 최초 실행
setInterval(fetchData, 30000); // 30초마다 갱신