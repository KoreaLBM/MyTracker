document.addEventListener('DOMContentLoaded', async () => {
  const tigerSnpEl = document.querySelector('#tiger-snp500 .price');
  const tigerNasdaqEl = document.querySelector('#tiger-nasdaq .price');
  const kodexDividendEl = document.querySelector('#kodex-dividend .price');
  const kodexBondEl = document.querySelector('#kodex-bond .price');
  const gldEl = document.querySelector('#gld .price');

  async function fetchPrices() {
    try {
      const res1 = await fetch('/.netlify/functions/korea-snp500');
      const data1 = await res1.json();
      tigerSnpEl.textContent = data1.snp500;
    } catch (e) {
      tigerSnpEl.textContent = '에러';
    }

    try {
      const res2 = await fetch('/.netlify/functions/korea-nasdaq');
      const data2 = await res2.json();
      tigerNasdaqEl.textContent = data2.nasdaq;
    } catch (e) {
      tigerNasdaqEl.textContent = '에러';
    }

    try {
      const res3 = await fetch('/.netlify/functions/korea-dividend');
      const data3 = await res3.json();
      kodexDividendEl.textContent = data3.dividend; // 👈 이 부분은 실제 key에 맞게
    } catch (e) {
      kodexDividendEl.textContent = '에러';
    }

    try {
      const res4 = await fetch('/.netlify/functions/korea-bondmix');
      const data4 = await res4.json();
      kodexBondEl.textContent = data4.bondmix; // 👈 이 부분도 실제 key에 맞게
    } catch (e) {
      kodexBondEl.textContent = '에러';
    }

    try {
      const gldRes = await fetch('/.netlify/functions/gld');
      const gldData = await gldRes.json();
      const gldPrice = gldData.quoteResponse.result[0].regularMarketPrice;
      gldEl.textContent = `$${gldPrice}`;
    } catch (e) {
      gldEl.textContent = '에러';
    }
  }

  // 초기 fetch + 30초마다 갱신
  await fetchPrices();
  setInterval(fetchPrices, 30000);

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