// Function to get the user's location from a geolocation API
async function getUserLocation() {
    try {
        const response = await axios.get('https://ipinfo.io/json?token=e019d762cada99');
        return response.data.country;
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

// Function to check if the user is in the special group
function isSpecialGroup(country) {
    // Define your special group countries
    const specialGroupCountries = ['NG'];
    return specialGroupCountries.includes(country);
}

// Function to check the user's location and update local storage if necessary
async function checkLocation() {
    const storedData = JSON.parse(localStorage.getItem('userLocationData'));
    const currentTime = new Date().getTime();

    if (storedData && storedData.timestamp + 7 * 24 * 60 * 60 * 1000 > currentTime) {
        // Use the stored location data if it's less than a week old
        return storedData.country;
    } else {
        // Get the user's location from the geolocation API
        const country = await getUserLocation();
        if (country) {
            // Store the location data with a timestamp
            localStorage.setItem('userLocationData', JSON.stringify({
                country: country,
                timestamp: currentTime
            }));
        }
        return country;
    }
}

// Main function to execute the logic
async function main() {
    const country = await checkLocation();
    if (country) {
        const accessAllowed = !isSpecialGroup(country);
        // Store the access status in local storage
        localStorage.setItem('accessAllowed', JSON.stringify(accessAllowed));

    }
}

// Call the main function
main();