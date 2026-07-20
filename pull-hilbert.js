const centre = [32.71576, -117.1638173];
const radius = 30000;

const hits = [];
{
 const data = await (async () => {
  const centre_str = centre[0].toString() + ',' + centre[1].toString();
  const url = 'https://8nvhrd7onv-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(5.47.0)%3B%20Lite%20(5.47.0)%3B%20Browser&x-algolia-api-key=3222e669cf890dc73fa5f38241117ba5&x-algolia-application-id=8NVHRD7ONV';
  const response0 = await fetch(url,
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
       aroundLatLng: centre_str,
       aroundPrecision: 5000,
       aroundRadius: radius,
       hitsPerPage: 0,
       filters: 'status:Published'
      }
     ]
    })
   });
  const data0 = await response0.json();

  const response = await fetch(url,
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
       aroundLatLng: centre_str,
       aroundPrecision: 5000,
       aroundRadius: radius,
       attributesToHighlight: [],
       attributesToRetrieve: [
        '_geoloc',
        'main_image',
        'michelin_award',
        'name',
        'price_category',
        'cuisines',
        'main_desc',
        'phone',
        'street',
        'city',
        'website'
       ],
       hitsPerPage: data0['results'][0]['nbHits'],
       filters: 'status:Published'
      }
     ]
    })
   });
  return await response.json();
 })();

 const c0 = Math.PI * centre[0] / 180;
 const c1 = Math.PI * centre[1] / 180;
 const cc0 = Math.cos(c0);
 const sc0 = Math.sin(c0);
 const cc1 = Math.cos(c1);
 const sc1 = Math.sin(c1);
 const cx = cc0 * cc1;
 const cy = sc0;
 const cz = cc0 * sc1;
 const b0x = -sc1;
 const b0z = cc1;
 const b1x = -sc0 * cc1;
 const b1y = cc0;
 const b1z = -sc0 * sc1;

 let csv = 'WKT,name';
 data['results'][0]['hits'].forEach(hit => {
  csv += '\n"POINT (';
  csv += hit['_geoloc']['lng'].toString();
  csv += ' ';
  csv += hit['_geoloc']['lat'].toString();
  csv += ')",';
  csv += hit['name'];

  const h = [];
  const award = hit['michelin_award'];
  if (award == 'BIB_GOURMAND')
   h.push(0);
  else if (award == 'ONE_STAR')
   h.push(1);
  else if (award == 'TWO_STARS')
   h.push(2);
  else if (award == 'THREE_STARS')
   h.push(3);
  else
   h.push(-1);

  {
   const l0 = Math.PI * hit['_geoloc']['lat'] / 180;
   const l1 = Math.PI * hit['_geoloc']['lng'] / 180;

   const lcx = Math.cos(l0) * Math.cos(l1) + cx;
   const lcy = Math.sin(l0) + cy;
   const lcz = Math.cos(l0) * Math.sin(l1) + cz;

   const len = lcx * cx + lcy * cy + lcz * cz;
   const px = lcx / len - cx;
   const py = lcy / len - cy;
   const pz = lcz / len - cz;

   let b0 = Math.round((b0x * px + b0z * pz + Math.PI) * 6371000);
   let b1 = Math.round((b1x * px + b1y * py + b1z * pz + Math.PI) * 6371000);

   const b = 26;

   const M = 1 << (b - 1);

   for (let Q = M; Q > 1; Q >>= 1) {
    let P = Q - 1;

    if ((b0 ^ b1) & Q)
     b0 ^= P;

    if (!(b1 & Q)) {
     let t = (b0 ^ b1) & P;
     b0 ^= t;
     b1 ^= t;
    }
   }

   b1 ^= b0;
   let t = 0;

   for (let Q = M; Q > 1; Q >>= 1)
    if (b1 & Q)
     t ^= Q - 1;

   b0 ^= t
   b1 ^= t

   let out = 0;
   for (let i = 0; i < b; i++) {
    mask = 1 << i;
    out += (b1 & mask) * 2 ** i;
    out += (b0 & mask) * 2 ** (i + 1);
   }

   h.push(out);

  }
  h.push(hit['city']['name']);
  h.push(hit['street']);
  h.push(hit['name']);
  const price = hit['price_category']['code'];

  if (price == 'CAT_P01')
   h.push(1);
  else if (price == 'CAT_P02')
   h.push(2);
  else if (price == 'CAT_P03')
   h.push(3);
  else if (price == 'CAT_P04')
   h.push(4);
 
  try {
   h.push(hit['main_image']['url']);
  } catch {
   h.push('');
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
 console.log(csv);
}

hits.sort();

const bib = '<img src="https://guide.michelin.com/assets/images/icons/MICHELINguide-symboleBibendum_COLOR_RGB-2312dee9c12319c17d386930a0f19908.svg">';
const star = '<img src="https://guide.michelin.com/assets/images/icons/michelin-star_8519-e01f8a46cd78113499b826a74e01e7ac.svg">';

let i = 0;
let output = '<html><head><meta charset="UTF-8"><style>*{font-family:sans-serif;margin:0}.o{display:flex;justify-content:space-between;padding:1%}.j{width:29%}.j *{width:100%}.t{width:69%}.t img{width:3%}h1{font-size:3cqw}h2{font-size:2cqw}p{font-size:1.5cqw}</style></head><body>';
hits.forEach(h => {
 output += '<div class="o">'
 if (i % 2 == 0) {
  output += '<div class="j"><img src="';
  output += h[6];
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
 output += h[4];
 output += '</h1><h2>';
 output += '$'.repeat(h[5]);
 output += ' · ';
 output += h[7];
 output += '</h2><p>';
 output += h[8];
 output += '</p><br><b>';
 const phone = h[9];
 if (phone) {
  output += '<p>TEL. ';
  output += phone;
  output += '</p>'
 }
 output += '<p>';
 output += h[3];
 output += ', ';
 output += h[2];
 output += '</p>';
 const website = h[10];
 if (website) {
  output += '<p>';
  output += website;
  output += '</p>'
 }
 output += '</b></div>'
 if (i % 2 == 1) {
  output += '<div class="j"><img src="';
  output += h[6];
  output += '"></div>'
 }
 output += '</div>';
 i++;
})
output += '</body></html>'
open(URL.createObjectURL(new Blob([output], { type: 'text/html;charset=UTF-8' })), '_blank');
