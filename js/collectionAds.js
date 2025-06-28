
const adsTop = [
  { img: '../../images/ads/Crocs.gif', link: 'https://www.crocs.com/stories/come-as-you-are.html', displayTime: 5000 },
  { img: '../../images/ads/Celsius.gif', link: '#', displayTime: 10000 },
  { img: '../../images/ads/818.gif', link: '#', displayTime: 9000 },
  { img: '../../images/ads/Rhode.gif', link: 'https://www.rhodeskin.com', displayTime: 7500 },
  { img: '../../images/ads/Rhode1.gif', link: 'https://www.rhodeskin.com', displayTime: 12000 },
  { img: '../../images/ads/cocacola.gif', link: '#', displayTime: 5000 },
  { img: '../../images/ads/Personalday.gif', link: 'https://www.personalday.com/', displayTime: 10000 }, 
  { img: '../../images/ads/slipperySoapAd1.gif', link: 'https://www.slipperysoap.com/', displayTime: 10000 }  
];

const adsBottom = [
  { img: '../../images/ads/xokhloe.gif', link: 'https://www.ulta.com/p/xo-khloe-pimprod2049077?sku=2632566&fbclid=PAZXh0bgNhZW0CMTEAAaZVXM4Lkj92LaOM2GEyeMxVRAlahdOYqvDPGzl8R2-Jsf758_E9PY8hyC8_aem__mk4AnSGz28b8amcS9xKDg', displayTime: 20000 },
  { img: '../../images/ads/skims.gif', link: 'https://www.skims.com/', displayTime: 11000 },
  { img: '../../images/ads/khy-wardrobe.gif', link: 'https://www.khy.com/pages/wardrobe?fbclid=PAY2xjawICrBJleHRuA2FlbQIxMQABpnTcHafMzC6bedRk_jGcKKLw_Qo60ipUANWhcdWC1TORtK4tF7n3YwA15w_aem__Z_2kS8T5xv2979yBkDWaw', displayTime: 10000 }, 
  { img: '../../images/ads/cosmic.gif', link: 'https://www.ulta.com/p/cosmic-kylie-jenner-eau-de-parfum-pimprod2044205', displayTime: 7000 }, 
  { img: '../../images/ads/wildflower.gif', link: 'https://www.wildflowercases.com/en-ad', displayTime: 12000 }, 
  { img: '../../images/ads/kylieCosmeticsAd1.gif', link: 'https://kyliecosmetics.com/', displayTime: 20000 }, 
  { img: '../../images/ads/miumiu.gif', link: 'https://clicklinkin.bio/miumiu?fbclid=PAY2xjawIYGF9leHRuA2FlbQIxMQABpty8JWZkrJHYl04QkNw_-SfPVWMXQp0sHioNDNUgK1sUtfpB7w56WZEwjw_aem_rWOmS-mWjRVH4jeRmbTORQ', displayTime: 18000 }, 
];

let currentTopAdIndex = 0;
let currentBottomAdIndex = 0;

let topAdStartTime = Date.now();
let bottomAdStartTime = Date.now();

function rotateAds() {
  const topAdContainer = document.getElementById('ad-top');
  const bottomAdContainer = document.getElementById('ad-bottom');

  const topAd = adsTop[currentTopAdIndex];
  const bottomAd = adsBottom[currentBottomAdIndex];

  if (Date.now() - topAdStartTime >= topAd.displayTime) {
    topAdContainer.innerHTML = `<a href="${topAd.link}" target="_blank"><img src="${topAd.img}" alt="Advertisement" class="img-fluid"></a>`;
    currentTopAdIndex = (currentTopAdIndex + 1) % adsTop.length;
    topAdStartTime = Date.now();
  }

  if (Date.now() - bottomAdStartTime >= bottomAd.displayTime) {
    bottomAdContainer.innerHTML = `<a href="${bottomAd.link}" target="_blank"><img src="${bottomAd.img}" alt="Advertisement" class="img-fluid"></a>`;
    currentBottomAdIndex = (currentBottomAdIndex + 1) % adsBottom.length;
    bottomAdStartTime = Date.now();
  }
}

const minimumDisplayTime = Math.min(
  ...adsTop.map(ad => ad.displayTime),
  ...adsBottom.map(ad => ad.displayTime)
);

setInterval(rotateAds, minimumDisplayTime);
rotateAds();