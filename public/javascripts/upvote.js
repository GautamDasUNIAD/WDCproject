let click_count_upvote = 0;
function incrementUpvote(eventId) {
    const upvoteElement = document.querySelector(`.upvoteCount[data-event-id="${eventId}"]`);
    let upvoteCount = parseInt(upvoteElement.textContent);

    // Increment click count
    click_count_upvote++;

    if (click_count_upvote % 2 === 0) {
        // Perform downvote operation
        upvoteElement.textContent = --upvoteCount;
        updateVote(eventId, 'upvote', -1)
            .then(() => {
                // Success handling can be added if needed
            })
            .catch(error => {
                // Handle error if needed
                console.error('Error updating upvote:', error);
                upvoteElement.textContent = ++upvoteCount;
                // Revert UI change if necessary
                // window.location.reload();
                // upvoteElement.textContent = ++upvoteCount; // Rollback UI change on error
            });
    } else {
        // Perform upvote operation
        upvoteElement.textContent = ++upvoteCount;
        updateVote(eventId, 'upvote', 1)
            .then(() => {
                // Success handling can be added if needed
            })
            .catch(error => {
                // Handle error if needed
                console.error('Error updating upvote:', error);
                // Revert UI change if necessary
                upvoteElement.textContent = --upvoteCount; // Rollback UI change on error
            });
    }
}

let click_count_downvote = 0;
function incrementDownvote(eventId) {
    click_count_downvote += 1;
    const downvoteElement = document.querySelector(`.downvoteCount[data-event-id="${eventId}"]`);
    let downvoteCount = parseInt(downvoteElement.textContent);

    if (click_count_downvote % 2 == 0) {
        updateVote(eventId, 'downvote', -1)
        .then(() => {
            downvoteElement.textContent = --downvoteCount;
        })
        .catch(error => {
            console.error('Error updating vote:', error);
            // Optionally handle the error or provide user feedback
        });
        // downvoteElement.textContent = --downvoteCount;
    } else {
        updateVote(eventId, 'downvote', 1)
        .then(() => {
            downvoteElement.textContent = ++downvoteCount;
        })
        .catch(error => {
            console.error('Error updating vote:', error);
            // Optionally handle the error or provide user feedback
        });
        // downvoteElement.textContent = ++downvoteCount;
    }
}

function updateVote(eventId, type, value) {
    return fetch(`/events/${eventId}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: type,
            value: value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update vote');
        }
        // Assuming you might want to parse the response or handle it further
        return response.json(); // Parse response JSON if necessary
    })
    .catch(error => {
        console.error('Error updating vote:', error);
    });
}


function hasUserVoted(eventId) {
    // Check browser storage (e.g., localStorage) for user's votes
    const votedEvents = JSON.parse(localStorage.getItem('votedEvents')) || [];
    return votedEvents.includes(eventId);
}

// Function to mark an event as voted by the user
function markUserVote(eventId) {
    // Retrieve the list of voted events from browser storage
    const votedEvents = JSON.parse(localStorage.getItem('votedEvents')) || [];
    // Add the current event to the list
    votedEvents.push(eventId);
    // Save the updated list back to browser storage
    localStorage.setItem('votedEvents', JSON.stringify(votedEvents));
}
