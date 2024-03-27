// Define the base URL for fetching currency exchange rate data
const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// Select all dropdown select elements and the button
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

// Select elements for 'From' and 'To' currencies and the message display
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Loop through each dropdown select element
for (const select of dropdowns) {
    // Populate dropdowns with currency options
    for (const currCode in countryList) {
        // Create a new option element for each currency code
        const newOption = document.createElement("option");
        // Set the inner HTML of the option to the currency code
        newOption.innerHTML = currCode;
        // Set 'selected' attribute for default currency selection
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        // Append the new option to the select element
        select.append(newOption);
    }
    // Add event listener to each select element for flag update
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update the exchange rate and display result
const updateExchangeRate = async () => {
    try {
        // Get the input amount value
        let amount = document.querySelector(".amount input");
        let amtVal = amount.value;
        // If input amount is invalid, set it to 1
        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }
        // Construct URL for fetching exchange rate data
        const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
        // Fetch exchange rate data from API
        let response = await fetch(URL);
        // Throw error if fetching fails
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate data');
        }
        // Parse the response as JSON
        let data = await response.json();
        // Get the exchange rate for the selected currency
        let rate = data[toCurr.value.toLowerCase()];
        // Calculate the final amount
        let finalAmount = amtVal * rate;
        // Display the conversion result
        msg.innerText = `${amtVal}${fromCurr.value} = ${finalAmount}${toCurr.value}`;
    } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
    }
};

// Function to update flag based on currency selection
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    // Construct URL for flag image based on country code
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    // Select the flag image element
    let img = element.parentElement.querySelector("img");
    // Update the flag image source
    img.src = newSrc;
};

// Add event listener to button for fetching exchange rate
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Add event listener to window for updating exchange rate on page load
window.addEventListener("load", () => {
    updateExchangeRate();
});
