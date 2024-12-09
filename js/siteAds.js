(function ($) {
    "use strict"; // Start of use strict

    jQuery.fn.exists = function () {
        return this.length > 0;
    };

    $(window).on("load resize", function () {

// Define the image array with durations and links
const mediaSources = [
  {
    
    src: "/../images/ads/Crocs.gif",
    link: "https://www.crocs.com/stories/come-as-you-are.html",
    duration: 5000 // 5 seconds
  },
  {
    
    src: "/../images/ads/Celsius.gif",
    link: "#",
    duration: 10000 // 10 seconds
  },
    {
    
    src: "/../images/ads/818.gif",
    link: "#",
    duration: 9000 // 9 seconds
  }, 
  {
    
    src: "/../images/ads/Rhode.gif",
    link: "https://www.rhodeskin.com",
    duration: 7500 // 7.5 seconds
  },
  {
    
    src: "/../images/ads/Rhode1.gif",
    link: "https://www.rhodeskin.com",
    duration: 12000 // 12 seconds
  },
  {
    
    src: "/../images/ads/cocacola.gif",
    link: "#",
    duration: 5000 // 5 seconds
  },
  {
    
    src: "/../images/ads/Personalday.gif",
    link: "https://www.personalday.com/",
    duration: 10000 // 10 seconds
  } 
];


// Initialize the current image index
var currentIndex = 0;

// Initialize the start time of the current image
var startTime = new Date().getTime();

// Function to switch images
function switchImage() {
  // Get the current time
  var currentTime = new Date().getTime();

  // Check if the current image's duration has passed
  if (currentTime - startTime >= mediaSources[currentIndex].duration) {
    // Increment the current index
    currentIndex = (currentIndex + 1) % mediaSources.length;

    // Update the start time
    startTime = currentTime;
  }

  // Update the image and link
  $('#media-container').css('background-image', 'url(' + mediaSources[currentIndex].src + ')');
  $('#media-link').attr('href', mediaSources[currentIndex].link);

  // Request the next animation frame
  requestAnimationFrame(switchImage);
}

// Start the image switching
switchImage();

      
      
      
      
      
    }); /* end of on load */
})(jQuery); // End of use strict
