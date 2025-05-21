// Combined JavaScript for annotations, track list, search, vibrant colors, and swiper

document.addEventListener("DOMContentLoaded", function() {
  // Annotation Panel Functionality
  const annotatedWords = document.querySelectorAll(".annotated-word");
  const annotationPanel = document.getElementById("annotations-panel");
  const annotationText = document.getElementById("annotation-text");
  const closePanelBtn = document.getElementById("close-panel");
  const overlay = document.createElement("div");
  
  
  // Add overlay for clicking outside the panel
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  
  // Function to open the panel
  function openPanel(annotation) {
    annotationText.innerHTML = annotation || "No annotation available."; // Use innerHTML to render HTML
    annotationPanel.classList.add("active");
    overlay.classList.add("active");
  }
  
  // Function to close the panel
  function closePanel() {
    annotationPanel.classList.remove("active");
    overlay.classList.remove("active");
  }
  
  // Add event listeners to annotated words
  annotatedWords.forEach((word) => {
    word.addEventListener("click", function() {
      const annotation = word.dataset.annotation;
      openPanel(annotation);
    });
  });
  
  // Event listeners for closing the panel
  closePanelBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);
  
  // Search Popup Functionality
  const openSearchPopupBtn = document.getElementById("open-search-popup");
  const closeSearchPopupBtn = document.getElementById("close-search-popup");
  const searchPopup = document.getElementById("search-popup");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  
  // Ensure the popup is hidden on page load
  if (searchPopup) {
    searchPopup.style.display = "none";
  }
  
  // Open Search Popup
  if (openSearchPopupBtn) {
    openSearchPopupBtn.addEventListener("click", function() {
      searchPopup.style.display = "flex"; // Show the popup
      searchInput.focus(); // Focus on the input field
    });
  }
  
  // Close Search Popup
  if (closeSearchPopupBtn) {
    closeSearchPopupBtn.addEventListener("click", function() {
      searchPopup.style.display = "none"; // Hide the popup
      searchResults.innerHTML = ""; // Clear results
    });
  }
  
  // Close Popup on Outside Click
  if (searchPopup) {
    searchPopup.addEventListener("click", function(e) {
      if (e.target === searchPopup) {
        searchPopup.style.display = "none"; // Hide the popup
        searchResults.innerHTML = ""; // Clear results
      }
    });
  }
  
  // Handle Search Input
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const query = searchInput.value.toLowerCase();
      searchResults.innerHTML = ""; // Clear previous results
      
      if (query.trim() === "") {
        return; // Exit if input is empty
      }
      
      // Example search data (replace with actual data or API calls)
      const data = [
        { type: "Track", name: "Song 1", link: "lyrics-song1.html" },
        { type: "Track", name: "Song 2", link: "lyrics-song2.html" },
        { type: "Album", name: "Album 1", link: "album1.html" },
        { type: "Artist", name: "Artist 1", link: "artist1.html" },
        { type: "Track", name: "Song 3", link: "lyrics-song3.html" },
      ];
      
      // Filter and display matching results
      const filteredResults = data.filter((item) => item.name.toLowerCase().includes(query));
      
      if (filteredResults.length > 0) {
        filteredResults.forEach((item) => {
          const resultItem = document.createElement("div");
          resultItem.className = "search-result-item";
          resultItem.innerHTML = `<strong>${item.type}:</strong> ${item.name}`;
          resultItem.addEventListener("click", () => {
            window.location.href = item.link; // Redirect to the item link
          });
          searchResults.appendChild(resultItem);
        });
      } else {
        // No results found
        searchResults.innerHTML = "<p class='text-secondary'>No results found.</p>";
      }
    });
  }
  
  // Vibrant.js for Dynamic Header Colors
  const trackCover = document.getElementById("track-cover");
  const header = document.getElementById("dynamic-header");
  
  if (trackCover && header && typeof Vibrant !== "undefined") {
    Vibrant.from(trackCover.src)
      .getPalette()
      .then((palette) => {
        const vibrantColor = palette.Vibrant.hex;
        const mutedColor = palette.Muted.hex;
        
        // Apply dynamic gradient background
        header.style.background = `linear-gradient(135deg, ${vibrantColor}, ${mutedColor})`;
      })
      .catch((err) => console.error("Error extracting colors:", err));
  }
  
  // Swiper Initialization
  if (typeof Swiper !== "undefined") {
    new Swiper(".swiper-container", {
      slidesPerView: 3, // Number of album covers visible at a time
      spaceBetween: 20, // Space between slides
      loop: true, // Infinite loop
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        // Adjust settings for smaller screens
        768: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        576: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    });
  }
  
  // Default stylesheet at initialization 
  const defaultStylesheet = '../css/style.css';
  const defaultView = window.store.view;
  if (defaultView == "div1") {
    loadStylesheet(defaultStylesheet);
  } else {
    loadStylesheet('../../player/music/style.css'); // Alternative stylesheet
  }
  
  function loadStylesheet(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = 'dynamic-stylesheet';
    document.head.appendChild(link);
  }
  
  
  
});

// Track List Toggle Functionality (outside DOMContentLoaded as it’s called globally)
function toggleTrackList(id) {
  const allTrackLists = document.querySelectorAll(".track-list");
  
  // Close all other track lists
  allTrackLists.forEach((list, index) => {
    if (index + 1 !== id) {
      list.classList.remove("active");
    }
  });
  
  // Toggle the selected track list
  const trackList = document.getElementById(`track-list-${id}`);
  trackList.classList.toggle("active");
}



