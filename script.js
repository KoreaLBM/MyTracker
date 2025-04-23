document.addEventListener('DOMContentLoaded', async () => {
  // 국내 ETF DOM 요소
  const tigerSnpEl = document.querySelector('#tiger-snp500 .price');
  const tigerSnpChangeEl = document.querySelector('#tiger-snp500 .change');
  const tigerNasdaqEl = document.querySelector('#tiger-nasdaq .price');
  const tigerNasdaqChangeEl = document.querySelector('#tiger-nasdaq .change');
  const kodexDividendEl = document.querySelector('#kodex-dividend .price');
  const kodexBondEl = document.querySelector('#kodex-bond .price');

  // 해외 ETF DOM 요소
  const gldEl = document.querySelector('#gld .price');
  const smhEl = document.querySelector('#smh .price');
  const xluEl = document.querySelector('#xlu .price');
  const xlvEl = document.querySelector('#xlv .price');

  // 전일 대비 표시
  const gldChangeEl = document.querySelector('#gld .change');
  const smhChangeEl = document.querySelector('#smh .change');
  const xluChangeEl = document.querySelector('#xlu .change');
  const xlvChangeEl = document.querySelector('#xlv .change');

  async function fetchPrices() {
    // ✅ 국내 ETF
    try {
      const res1 = await fetch('/.netlify/functions/korea-snp500');
      const data1 = await res1.json();
      const price = parseFloat(data1.snp500.replace(/,/g, ''));
      const prev = parseFloat(data1.prevClose.replace(/,/g, ''));
      const diff = ((price - prev) / prev * 100).toFixed(2);
    
      console.log('SNP500 현재가:', price);
      console.log('SNP500 전일가:', prev);
      console.log('SNP500 변동률:', diff);
    
      tigerSnpEl.textContent = `${data1.snp500}원`;
      tigerSnpChangeEl.textContent = `${diff > 0 ? '+' : ''}${diff}%`;
      tigerSnpChangeEl.className = `change ${diff > 0 ? 'up' : 'down'}`;
    } catch (e) {
      console.error('SNP500 에러:', e);
      tigerSnpEl.textContent = '에러';
      tigerSnpChangeEl.textContent = '';
    }

    try {
      const res2 = await fetch('/.netlify/functions/korea-nasdaq');
      const data2 = await res2.json();
      const price = parseFloat(data2.nasdaq.replace(/,/g, ''));
      const prev = parseFloat(data2.prevClose.replace(/,/g, ''));
      const diff = ((price - prev) / prev * 100).toFixed(2);
      tigerNasdaqEl.textContent = `${data2.nasdaq}원`;
      tigerNasdaqChangeEl.textContent = `${diff > 0 ? '+' : ''}${diff}%`;
      tigerNasdaqChangeEl.className = `change ${diff > 0 ? 'up' : 'down'}`;
    } catch {
      tigerNasdaqEl.textContent = '에러';
      tigerNasdaqChangeEl.textContent = '';
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

      function update(etf, el, changeEl) {
        const price = parseFloat(data[etf]?.price);
        const prev = parseFloat(data[etf]?.prevClose);

        if (!price || !prev) {
          el.textContent = '에러';
          changeEl.textContent = '';
          return;
        }

        const diff = ((price - prev) / prev * 100).toFixed(2);
        el.textContent = `$${price.toFixed(2)}`;
        changeEl.textContent = `${diff > 0 ? '+' : ''}${diff}%`;
        changeEl.className = `change ${diff > 0 ? 'up' : 'down'}`;
      }

      update('GLD', gldEl, gldChangeEl);
      update('SMH', smhEl, smhChangeEl);
      update('XLU', xluEl, xluChangeEl);
      update('XLV', xlvEl, xlvChangeEl);
    } catch {
      [gldEl, smhEl, xluEl, xlvEl].forEach(el => el.textContent = '에러');
      [gldChangeEl, smhChangeEl, xluChangeEl, xlvChangeEl].forEach(el => el.textContent = '');
    }
  }

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