const results = document.getElementById('results');
const input = document.getElementById('searchInput');
let data = null;

fetch('travel_recommendation_api.json')
  .then(r => r.json())
  .then(d => { data = d; })
  .catch(e => console.error('Could not load data', e));

function card(item) {
  return `<article class="card"><img src="${item.imageUrl}" alt="${item.name}"><div><h3>${item.name}</h3><p>${item.description}</p></div></article>`;
}

function search() {
  const q = input.value.trim().toLowerCase();
  if (!q || !data) { results.innerHTML = ''; return; }
  let found = [];
  if (q.includes('beach')) found = data.beaches;
  else if (q.includes('temple')) found = data.temples;
  else if (q.includes('countr')) found = data.countries.flatMap(c => c.cities);
  else {
    data.countries.forEach(c => {
      if (c.name.toLowerCase().includes(q)) found.push(...c.cities);
      else c.cities.forEach(ci => { if (ci.name.toLowerCase().includes(q)) found.push(ci); });
    });
  }
  results.innerHTML = found.length
    ? found.map(card).join('')
    : '<p class="msg">No results. Try "beach", "temple", "country", or a country name like Japan.</p>';
}

function clearResults() { input.value = ''; results.innerHTML = ''; }

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('clearBtn').addEventListener('click', clearResults);
input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
