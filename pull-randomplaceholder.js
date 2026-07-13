const url = 'https://8nvhrd7onv-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(5.47.0)%3B%20Lite%20(5.47.0)%3B%20Browser&x-algolia-api-key=3222e669cf890dc73fa5f38241117ba5&x-algolia-application-id=8NVHRD7ONV';
var response, data;

response = await fetch(url,
{
 method: 'POST',
 headers: {
  'accept': 'application/json',
  'content-type': 'text/plain'
 },
 body: JSON.stringify({
  requests: [
   {
    indexName: 'prod-restaurants-en',
    aroundLatLng:'32.71576,-117.1638173',
    aroundPrecision: 5000,
    aroundRadius: 30000,
    hitsPerPage: 0,
    filters: 'status:Published'
   }
  ]
 })
});
data = await response.json();

response = await fetch(url,
{
 method: 'POST',
 headers: {
  'accept': 'application/json',
  'content-type': 'text/plain'
 },
 body: JSON.stringify({
  requests: [
   {
    indexName: 'prod-restaurants-en',
    aroundLatLng:'32.71576,-117.1638173',
    aroundPrecision: 5000,
    aroundRadius: 30000,
    attributesToHighlight: [],
    attributesToRetrieve: [
     'main_image',
     'michelin_award',
     'name',
     'price_category',
     'cuisines',
     'main_desc',
     'phone',
     'street',
     'city',
     'region',
     'country',
     'website'  
    ],
    hitsPerPage: data['results'][0]['nbHits'],
    filters: 'status:Published'
   }
  ]
 })
});
data = await response.json();

const bib = '<img src="https://guide.michelin.com/assets/images/icons/MICHELINguide-symboleBibendum_COLOR_RGB-2312dee9c12319c17d386930a0f19908.svg">';
const star = '<img src="https://guide.michelin.com/assets/images/icons/michelin-star_8519-e01f8a46cd78113499b826a74e01e7ac.svg">';

const hits = [];

data['results'][0]['hits'].forEach(hit => {
 const h = [];
 const award = hit['michelin_award'];
 if (award == 'BIB_GOURMAND') {
  h.push(0);
 } else if (award == 'ONE_STAR') {
  h.push(1);
 } else if (award == 'TWO_STARS') {
  h.push(2);
 } else if (award == 'THREE_STARS') {
  h.push(3);
 } else {
  h.push(-1);
 }
 h.push(hit['country']['name']);
 h.push(hit['region']['name']);
 h.push(hit['city']['name']);
 h.push(hit['area_name']);
 h.push(hit['street']);
 h.push(hit['name']);
 const price = hit['price_category']['code'];
 if (price == 'CAT_P01') {
  h.push(1);
 } else if (price == 'CAT_P02') {
  h.push(2);
 } else if (price == 'CAT_P03') {
  h.push(3);
 } else if (price == 'CAT_P04') {
  h.push(4);
 }
 try {
  h.push(hit['main_image']['url']);
 } catch {
  const r = Math.floor(Math.random()*12).toString();
  h.push('https://d3h1lg3ksw6i6b.cloudfront.net/guide/placeholder/pic_poilist_default_' + r + '.jpg');
 }
 var j = false;
 var c = '';
 hit['cuisines'].forEach(cuisine => {
  if (j) c += ', ';
  c += cuisine['label'];
  j = true;
 });
 h.push(c);
 h.push(hit['main_desc'].replace(/^(?:\s|<br\s*\/?>)+|(?:\s|<br\s*\/?>)+$/gi, ''));
 h.push(hit['phone']);
 h.push(hit['website']);
 hits.push(h);
});

hits.sort();

var i = 0;
var output = '<html><head><meta charset="UTF-8"><style>*{font-family:sans-serif;margin:0}.o{display:flex;justify-content:space-between;padding:1%}.j{width:29%}.j *{width:100%}.t{width:69%}.t img{width:3%}h1{font-size:3cqw}h2{font-size:2cqw}p{font-size:1.5cqw}</style></head><body>';
hits.forEach(h => {
 output += '<div class="o">'
 if (i % 2 == 0) {
  output += '<div class="j"><img src="';
  output += h[8];
  output += '"></div>'
 }
 output += '<div class="t">'
 const award = h[0];
 if (award == 0) {
  output += bib;
 } else if (award > 0) {
  output += star.repeat(award);
 }
 output += '<h1>';
 output += h[6];
 output += '</h1><h2>';
 output += '$'.repeat(h[7]);
 const price = h[8];
 output += ' · ';
 output += h[9];
 output += '</h2><p>';
 output += h[10];
 output += '</p><br><b>';
 const phone = h[11];
 if (phone) {
  output += '<p>TEL. ';
  output += phone;
  output += '</p>'
 }
 output += '<p>';
 output += h[5];
 output += ', ';
 output += h[3];
 output += '</p>';
 const website = h[12];
 if (website) {
  output += '<p>';
  output += website;
  output += '</p>'
 }
 output += '</b></div>'
 if (i % 2 == 1) {
  output += '<div class="j"><img src="';
  output += h[8];
  output += '"></div>'
 }
 output += '</div>';
 i++;
})
output += '</body></html>'
open(URL.createObjectURL(new Blob([output],{type:'text/html;charset=UTF-8'})),'_blank');
