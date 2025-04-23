document.addEventListener('DOMContentLoaded', async () => {
  // 국내 ETF DOM 요소
  const tigerSnpEl = document.querySelector('#tiger-snp500 .price');
  const tigerNasdaqEl = document.querySelector('#tiger-nasdaq .price');
  const kodexDividendEl = document.querySelector('#kodex-dividend .price');
  const kodexBondEl = document.querySelector('#kodex-bond .price');

  // 해외 ETF DOM 요소
  const gldEl = document.querySelector('#gld .price');
  const smhEl = document.querySelector('#smh .price');
  const xluEl = document.querySelector('#xlu .price');
  const xlvEl = document.querySelector('#xlv .price');

  async function fetchPrices() {
    // ✅ 국내 ETF
    try {
      const res1 = await fetch('/.netlify/functions/korea-snp500');
      const data1 = await res1.json();
      tigerSnpEl.textContent = data1.snp500;
    } catch {
      tigerSnpEl.textContent = '에러';
    }

    try {
      const res2 = await fetch('/.netlify/functions/korea-nasdaq');
      const data2 = await res2.json();
      tigerNasdaqEl.textContent = data2.nasdaq;
    } catch {
      tigerNasdaqEl.textContent = '에러';
    }

    try {
      const res3 = await fetch('/.netlify/functions/korea-dividend');
      const data3 = await res3.json();
      kodexDividendEl.textContent = data3.dividend;
    } catch {
      kodexDividendEl.textContent = '에러';
    }

    try {
      const res4 = await fetch('/.netlify/functions/korea-bondmix');
      const data4 = await res4.json();
      kodexBondEl.textContent = data4.bondmix;
    } catch {
      kodexBondEl.textContent = '에러';
    }

    // ✅ 해외 ETF (한 번에 요청)
    try {
      const res = await fetch('/.netlify/functions/us-etfs');
      const data = await res.json();
    
      gldEl.textContent = data['GLD'] ?? '에러';
      smhEl.textContent = data['SMH'] ?? '에러';
      xluEl.textContent = data['XLU'] ?? '에러';
      xlvEl.textContent = data['XLV'] ?? '에러';
    } catch {
      gldEl.textContent = '에러';
      smhEl.textContent = '에러';
      xluEl.textContent = '에러';
      xlvEl.textContent = '에러';
    }
  }

  // 초기 fetch
  await fetchPrices();
  // setInterval(fetchPrices, 30000); // 필요 시 주석 해제

  // 🌙 다크모드 토글
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;

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