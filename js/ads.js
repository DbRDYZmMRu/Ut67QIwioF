
(function ($) {
	"use strict"; // Start of use strict

	jQuery.fn.exists = function () {
		return this.length > 0;
	}
	
$(window).on('load resize', function () {
  
const mediaSources = [
  {
    type: "image",
    src: "/../images/ads/Crocs.gif",
    link: "https://www.crocs.com/stories/come-as-you-are.html",
    duration: 5000 // 5 seconds
  },
  {
    type: "image",
    src: "/../images/ads/Celsius.gif",
    link: "#",
    duration: 10000 // 10 seconds
  },
    {
    type: "image",
    src: "/../images/ads/818.gif",
    link: "#",
    duration: 9000 // 9 seconds
  }, 
  {
    type: "image",
    src: "/../images/ads/Rhode.gif",
    link: "https://www.rhodeskin.com",
    duration: 7500 // 7.5 seconds
  },
  {
    type: "image",
    src: "/../images/ads/Rhode1.gif",
    link: "https://www.rhodeskin.com",
    duration: 12000 // 12 seconds
  },
  {
    type: "image",
    src: "/../images/ads/cocacola.gif",
    link: "#",
    duration: 5000 // 5 seconds
  },
  {
    type: "image",
    src: "/../images/ads/Personalday.gif",
    link: "https://www.personalday.com/",
    duration: 10000 // 10 seconds
  } 
];

let currentMediaIndex = 0;
let mediaTimeout;

function shuffleMedia() {
  try {
    const mediaContainer = document.getElementById("media-container");
    const mediaLink = document.getElementById("media-link");

    if (mediaContainer && mediaLink) {
      const currentMedia = mediaSources[currentMediaIndex];

      if (currentMedia.type === "image") {
        mediaContainer.innerHTML = `<img src="${currentMedia.src}" alt="Ad" class="img-fluid mb-5">`;
      } else if (currentMedia.type === "video") {
        mediaContainer.innerHTML = `
          <video autoplay loop muted poster="${currentMedia.poster}">
            <source src="${currentMedia.src}" type="video/mp4">
          </video>
        `;
      }

      mediaLink.href = currentMedia.link;

      // Clear existing timeout
      clearTimeout(mediaTimeout);

      // Set individual timeout
      mediaTimeout = setTimeout(() => {
        currentMediaIndex = (currentMediaIndex + 1) % mediaSources.length;
        shuffleMedia();
      }, currentMedia.duration);
    } else {
      console.error("Media container or link element not found.");
    }
  } catch (error) {
    console.error("Error shuffling media:", error);
  }
}

shuffleMedia();
	}); /* end of on load */

})(jQuery); // End of use strict
