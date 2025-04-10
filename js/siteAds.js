(function ($) {
    "use strict"; // Start of use strict

    jQuery.fn.exists = function () {
        return this.length > 0;
    };

    $(window).on("load resize", function () {

// Define the image array with durations and links
const mediaSources = [
  {
    
    src: '/../images/ads/Crocs.gif',
    link: 'https://www.crocs.com/stories/come-as-you-are.html',
    duration: 5000 // 5 seconds
  },
  {
    
    src: '/../images/ads/Celsius.gif',
    link: '#',
    duration: 10000 // 10 seconds
  },
    {
    
    src: '/../images/ads/818.gif',
    link: '#',
    duration: 9000 // 9 seconds
  }, 
  {
    
    src: '/../images/ads/Rhode.gif',
    link: 'https://www.rhodeskin.com',
    duration: 7500 // 7.5 seconds
  },
  {
    
    src: '/../images/ads/Rhode1.gif',
    link: 'https://www.rhodeskin.com',
    duration: 12000 // 12 seconds
  },
  {
    
    src: '/../images/ads/cocacola.gif',
    link: '#',
    duration: 30000 // 30 seconds
  },
  {
    
    src: '/../images/ads/Personalday.gif',
    link: 'https://www.personalday.com/',
    duration: 10000 // 10 seconds
  } 
];


    const mediaContainer = $("#media-container");
    const mediaLink = $("#media-link");

    let currentMediaIndex = 0;
    let startTime = new Date().getTime();

    function updateMedia() {
      const currentMedia = mediaSources[currentMediaIndex];

      mediaContainer.html(`<img src="${currentMedia.src}" alt="Ad" width="100%" height="100%">`);
      mediaLink.attr("href", currentMedia.link);
    }

    function checkDuration() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime >= mediaSources[currentMediaIndex].duration) {
        currentMediaIndex = (currentMediaIndex + 1) % mediaSources.length;
        startTime = new Date().getTime();
        updateMedia();
      }

      requestAnimationFrame(checkDuration);
    }

    updateMedia();
    checkDuration();
  
      
      
      
    }); /* end of on load */
})(jQuery); // End of use strict
        