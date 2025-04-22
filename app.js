const priceSpan = document.getElementById('price');

// 테스트용 임시 값
setInterval(() => {
  const randomPrice = (Math.random() * 100000).toFixed(2);
  priceSpan.textContent = randomPrice + ' 원';
}, 2000);