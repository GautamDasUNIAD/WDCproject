let click_count_upvote = 0; // Initialize the upvote click count

// Function to handle upvote click
function incrementUpvote(eventId) {
    click_count_upvote += 1; // Increment the upvote click count
    const upvoteElement = document.querySelector(`.upvoteCount[data-event-id="${eventId}"]`); // Select the upvote element for the given event
    let upvoteCount = parseInt(upvoteElement.textContent); // Get the current upvote count

    // If the click count is even, it means the user is toggling the upvote off
    if (click_count_upvote % 2 === 0) {
        updateVote(eventId, 'upvote', -1, (success) => { // Decrease the upvote
            if (success) {
                upvoteElement.textContent = --upvoteCount; // Update the upvote count in the UI
            } else {
                click_count_upvote -= 1; // Revert the click count if the update fails
            }
        });
    } else { // If the click count is odd, it means the user is toggling the upvote on
        updateVote(eventId, 'upvote', 1, (success) => { // Increase the upvote
            if (success) {
                upvoteElement.textContent = ++upvoteCount; // Update the upvote count in the UI
            } else {
                click_count_upvote -= 1; // Revert the click count if the update fails
            }
        });
    }
}

let click_count_downvote = 0; // Initialize the downvote click count

// Function to handle downvote click
function incrementDownvote(eventId) {
    click_count_downvote += 1; // Increment the downvote click count
    const downvoteElement = document.querySelector(`.downvoteCount[data-event-id="${eventId}"]`); // Select the downvote element for the given event
    let downvoteCount = parseInt(downvoteElement.textContent); // Get the current downvote count

    // If the click count is even, it means the user is toggling the downvote off
    if (click_count_downvote % 2 === 0) {
        updateVote(eventId, 'downvote', -1, (success) => { // Decrease the downvote
            if (success) {
                downvoteElement.textContent = --downvoteCount; // Update the downvote count in the UI
            } else {
                click_count_downvote -= 1; // Revert the click count if the update fails
            }
        });
    } else { // If the click count is odd, it means the user is toggling the downvote on
        updateVote(eventId, 'downvote', 1, (success) => { // Increase the downvote
            if (success) {
                downvoteElement.textContent = ++downvoteCount; // Update the downvote count in the UI
            } else {
                click_count_downvote -= 1; // Revert the click count if the update fails
            }
        });
    }
}

// Function to send the upvote/downvote request to the server
function updateVote(eventId, type, value, callback) {
    const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
    xhr.open('POST', `/events/${eventId}/vote`, true); // Open a POST request to the vote endpoint
    xhr.setRequestHeader('Content-Type', 'application/json'); // Set the request header to JSON

    // Handle the response from the server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // Request is complete
            if (xhr.status === 201) { // If the vote update is successful
                alert(xhr.responseText);
            } else if (xhr.status === 401) { // If the user is not authenticated
                alert('You need to be logged in to upvote/downvote for events.');
                window.location.href = '/login'; // Redirect to the login page
            } else { // If there is an error in the request
                alert(xhr.responseText);
            }
        }
    };

    // Handle network errors
    xhr.onerror = function () {
        console.error('Network error');
        callback(false); // Call the callback with false to indicate failure
    };

    // Send the vote update request with the vote type and value
    const requestData = JSON.stringify({
        type: type,
        value: value
    });
    xhr.send(requestData);
}
