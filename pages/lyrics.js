// Consolidated DOMContentLoaded handler
document.addEventListener("DOMContentLoaded", function() {
  // === Search Icon Position Adjustment ===
  const searchIconBtn = document.getElementById("open-search-popup");
  if (searchIconBtn) {
    const stickyHeaderHeight = 90; // Height of the sticky header
    const initialTop = 20; // Initial top position of the icon
    const initialBackground = "rgba(0, 0, 0, 0.2)"; // Original background color
    const transparentBackground = "transparent"; // Transparent background color
    const searchIconInitialPosition =
      searchIconBtn.getBoundingClientRect().top + window.scrollY; // Calculate initial position
    
    // Function to adjust the position and background of the search icon
    function adjustSearchIconPosition() {
      const scrollY = window.scrollY;
      
      if (scrollY + stickyHeaderHeight >= searchIconInitialPosition) {
        // If scrolled past its initial position, adjust background and position below the sticky header
        searchIconBtn.style.position = "fixed";
        searchIconBtn.style.top = `${stickyHeaderHeight + 10}px`; // Add spacing below the header
        searchIconBtn.style.background = transparentBackground;
      } else {
        // If above its initial position, reset background and position
        searchIconBtn.style.position = "absolute";
        searchIconBtn.style.top = `${initialTop}px`;
        searchIconBtn.style.background = initialBackground;
      }
    }
    
    // Attach the scroll event listener
    window.addEventListener("scroll", adjustSearchIconPosition);
    
    // Initial adjustment to handle page load positioning
    adjustSearchIconPosition();
  }
  
  // === URL Parameter Logging ===
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log(id);
  
  // === Lyrics and Annotations ===
  const lyricsContainer = document.querySelector(".lyrics");
  const annotationPanel = document.getElementById("annotations-panel");
  if (lyricsContainer && annotationPanel) {
    const annotationText = document.getElementById("annotation-text");
    const closePanelBtn = document.getElementById("close-panel");
    const overlay = document.createElement("div");
    
    // Add overlay for clicking outside the panel
    overlay.className = "overlay";
    document.body.appendChild(overlay);
    
    // Function to open the annotation panel
    function openPanel(annotation) {
      annotationText.innerHTML = annotation || "No annotation available.";
      annotationPanel.classList.add("active");
      overlay.classList.add("active");
    }
    
    // Function to close the annotation panel
    function closePanel() {
      annotationPanel.classList.remove("active");
      overlay.classList.remove("active");
    }
    
    // Fetch lyrics and annotations from JSON
    fetch("../pages/lyrics.json")
      .then((response) => response.json())
      .then((data) => {
        const lyricsData = data.lyrics;
        
        lyricsData.forEach((entry) => {
          const lineElement = document.createElement("div");
          lineElement.classList.add("lyric-line");
          
          if (entry.line === "") {
            // Handle empty lines explicitly
            lineElement.innerHTML = " "; // Non-breaking space to preserve empty line
          } else {
            let processedLine = entry.line;
            
            // Highlight square bracket content
            processedLine = processedLine.replace(
              /\[([^\]]+)\]/g, // Match text within square brackets
              '<span class="bold-content">[$1]</span>'
            );
            
            // Highlight and annotate specific words
            if (entry.annotations) {
              for (const [word, annotation] of Object.entries(entry.annotations)) {
                // Properly escape special characters in the word for regex
                const escapedWord = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                const annotatedWord = `<span class="annotated-word" data-annotation="${annotation}">${word}</span>`;
                // Use regex to ensure the word is matched correctly
                processedLine = processedLine.replace(
                  new RegExp(`\\b${escapedWord}(?=\\s|$|[.,!?])`, "g"),
                  annotatedWord
                );
              }
            }
            
            lineElement.innerHTML = processedLine;
          }
          
          lyricsContainer.appendChild(lineElement);
        });
        
        // Add event listeners to annotated words
        const annotatedWords = document.querySelectorAll(".annotated-word");
        annotatedWords.forEach((word) => {
          word.addEventListener("click", function() {
            const annotation = word.dataset.annotation;
            openPanel(annotation);
          });
        });
      })
      .catch((error) => {
        console.error("Error loading lyrics:", error);
      });
    
    // Event listeners for closing the panel
    closePanelBtn?.addEventListener("click", closePanel);
    overlay.addEventListener("click", closePanel);
  }
  
  // === Search Popup Functionality ===
  const openSearchPopupBtn = document.getElementById("open-search-popup");
  const searchPopup = document.getElementById("search-popup");
  if (openSearchPopupBtn && searchPopup) {
    const closeSearchPopupBtn = document.getElementById("close-search-popup");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    
    // Ensure the popup is hidden on page load
    searchPopup.style.display = "none";
    
    // Open Search Popup
    openSearchPopupBtn.addEventListener("click", function() {
      searchPopup.style.display = "flex"; // Show the popup
      searchInput.focus(); // Focus on the input field
    });
    
    // Close Search Popup
    closeSearchPopupBtn.addEventListener("click", function() {
      searchPopup.style.display = "none"; // Hide the popup
      searchResults.innerHTML = ""; // Clear results
    });
    
    // Close Popup on Outside Click
    searchPopup.addEventListener("click", function(e) {
      if (e.target === searchPopup) {
        searchPopup.style.display = "none"; // Hide the popup
        searchResults.innerHTML = ""; // Clear results
      }
    });
    
    // Handle Search Input
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
  
  // === Vibrant.js Color Extraction ===
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
  
  // === Swiper Initialization ===
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
});

// === Track List Toggle Function ===
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
  
  // Reorder album cards
  reorderAlbumCards(id);
}

function reorderAlbumCards(currentAlbumId) {
  const albumList = document.querySelector('.album-list');
  const albumCards = Array.from(albumList.children);
  
  // Get the current album card index
  const currentAlbumIndex = albumCards.findIndex((albumCard) => {
    const albumItem = albumCard.querySelector('.album-item');
    const albumId = albumItem.getAttribute('onclick').match(/toggleTrackList\((\d+)\)/)[1];
    return parseInt(albumId) === currentAlbumId;
  });
  
  // Reorder the album cards
  const reorderedAlbumCards = [...albumCards.slice(currentAlbumIndex), ...albumCards.slice(0, currentAlbumIndex)];
  
  // Remove existing album cards
  albumList.innerHTML = '';
  
  // Append reordered album cards
  reorderedAlbumCards.forEach((albumCard) => albumList.appendChild(albumCard));
}