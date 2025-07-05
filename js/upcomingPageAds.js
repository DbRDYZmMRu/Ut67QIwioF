const adsTop = [
  { img: '../images/ads/drinksprinter.gif', link: '#', displayTime: 9000 }, { img: '../images/ads/kyliecosmeticsHybridIII.gif', link: 'http://kyliecosmetics.com/', displayTime: 6000 },
  { img: '../images/ads/Crocs.gif', link: 'https://www.crocs.com/stories/come-as-you-are.html', displayTime: 5000 },
  { img: '../images/ads/Celsius.gif', link: '#', displayTime: 10000 },
  { img: '../images/ads/818.gif', link: '#', displayTime: 9000 },
  { img: '../images/ads/kimsSecret.gif', link: 'https://shop.kims-secret.com, ', displayTime: 10000 },
  { img: '../images/ads/Rhode1.gif', link: 'https://www.rhodeskin.com', displayTime: 12000 },
  { img: '../images/ads/cocacola.gif', link: '#', displayTime: 30000 },
  { img: '../images/ads/Personalday.gif', link: 'https://www.personalday.com/', displayTime: 10000 },
  { img: '../images/ads/RenneJuly2.gif', link: 'https://www.estellaco.co/products/dulce-vita-corset-micro-short-set', displayTime: 10000 }
  
];

const adsBottom = [
  { img: '../images/ads/xokhloe.gif', link: 'https://www.ulta.com/p/xo-khloe-pimprod2049077?sku=2632566&fbclid=PAZXh0bgNhZW0CMTEAAaZVXM4Lkj92LaOM2GEyeMxVRAlahdOYqvDPGzl8R2-Jsf758_E9PY8hyC8_aem__mk4AnSGz28b8amcS9xKDg', displayTime: 20000 },
  { img: '../images/ads/kyliecosmeticsHybridIII.gif', link: 'http://kyliecosmetics.com/', displayTime: 6000 },
  { img: '../images/ads/skims.gif', link: 'https://www.skims.com/', displayTime: 11000 },
  { img: '../images/ads/khy-wardrobe.gif', link: 'https://www.khy.com/pages/wardrobe?fbclid=PAY2xjawICrBJleHRuA2FlbQIxMQABpnTcHafMzC6bedRk_jGcKKLw_Qo60ipUANWhcdWC1TORtK4tF7n3YwA15w_aem__Z_2kS8T5xv2979yBkDWaw', displayTime: 10000 },
  { img: '../images/ads/cosmic.gif', link: 'https://www.ulta.com/p/cosmic-kylie-jenner-eau-de-parfum-pimprod2044205', displayTime: 7000 },
  { img: '../images/ads/wildflower.gif', link: 'https://www.wildflowercases.com/en-ad', displayTime: 12000 },
    { img: '../images/ads/GartoradeJuly5.gif', link: '#', displayTime: 9000 },
  { img: '../images/ads/kylieCosmeticsAd1.gif', link: 'https://kyliecosmetics.com/', displayTime: 20000 },
  { img: '../images/ads/KylieJuly4.gif', link: 'http://kyliecosmetics.com/', displayTime: 18000 },
];


const adsMiddle = [
    { img: '../images/ads/GartoradeJuly5.gif', link: '#', displayTime: 9000 },
  { img: '../images/ads/skimsJune10.gif', link: 'https://skims.com/en-ng/collections/coming-soon?utm_source=instagram-story&utm_medium=owned-social&utm_campaign=coming-soon&fbclid=PAZXh0bgNhZW0CMTEAAaei-K58mSObsPCBHWNbCpsqhKEjl9pdszWV0md-E0gMlNp3FEx49r5QiFe99A_aem_IweLTL5knnu1hmZ2eN4RGg', displayTime: 6500 },
  { img: '../images/ads/RhodeJuly5.gif', link: 'https://www.rhodeskin.com', displayTime: 9000 },
  { img: '../images/ads/LVJuly5.gif', link: 'https://us.louisvuitton.com/eng-us/new/for-men/fall-winter-2025-show/_/N-t12jpbgi?utm_source=instagram&utm_medium=social&utm_campaign=PUBL_MENSCAMPAIGNFW25_IG_WW_ENG_AW_20250703_20250713_MEN_RTW_MEN_FW25', displayTime: 9000 },
  { img: '../images/ads/SkimsAdJune6.gif', link: 'https://skims.com/en-ng/collections/skims-ultimate-edit?utm_source=ig&utm_medium=owned-social&utm_campaign=ultimate-edit&fbclid=PAQ0xDSwKv7GtleHRuA2FlbQIxMQABpzbyA74E5sCYgCUWUyyYVgROlPmgUwOfL2EGEikPL9D0Ztko7x0lYfYaUKtD_aem_iWqvZwXXJEHjrzIrE3qX5Q', displayTime: 6500 },
  { img: '../images/ads/slipperySoapAd1.gif', link: 'https://www.slipperysoap.com/', displayTime: 6500 },
  { img: '../images/ads/KhyXDilaraAd.gif', link: 'https://khy.com/', displayTime: 6500 },
  { img: '../images/ads/kyliecosmeticsHybridI.gif', link: 'http://kyliecosmetics.com/', displayTime: 6500 },
  { img: '../images/ads/kyliecosmeticsHybridII.gif', link: 'http://kyliecosmetics.com/', displayTime: 9000 },
  { img: '../images/ads/RenneJune11.gif', link: 'https://www.estellaco.co/?fbclid=PAZXh0bgNhZW0CMTEAAaeovaITzRO_X6U138m8o8I9gp6T3SufTa0Yd1i0FtWkjLR3uJTBEvvBrrMNiw_aem_GVqF1qFhX7LRFZAgi0D6yA', displayTime: 10000 }
];




let currentTopAdIndex = 0;
let currentBottomAdIndex = 0;
let currentMiddleAdIndex = 0;

let topAdStartTime = Date.now();
let bottomAdStartTime = Date.now();
let middleAdStartTime = Date.now();

function rotateAds() {
  const topAdContainer = document.getElementById('ad-top');
  const bottomAdContainer = document.getElementById('ad-bottom');
  const middleAdContainer = document.getElementById('ad-middle');
  
  const topAd = adsTop[currentTopAdIndex];
  const bottomAd = adsBottom[currentBottomAdIndex];
  const middleAd = adsMiddle[currentMiddleAdIndex];
  
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
  
  if (Date.now() - middleAdStartTime >= middleAd.displayTime) {
    middleAdContainer.innerHTML = `<a href="${middleAd.link}" target="_blank"><img src="${middleAd.img}" alt="Advertisement" class="img-fluid"></a>`;
    currentMiddleAdIndex = (currentMiddleAdIndex + 1) % adsMiddle.length;
    middleAdStartTime = Date.now();
  }
}


const minimumDisplayTime = Math.min(
  ...adsTop.map(ad => ad.displayTime),
  ...adsBottom.map(ad => ad.displayTime),
  ...adsMiddle.map(ad => ad.displayTime)
);

setInterval(rotateAds, minimumDisplayTime);
rotateAds();