let click_count_upvote = 0;
function incrementUpvote(eventId) {
    click_count_upvote += 1;
    const upvoteElement = document.querySelector(`.upvoteCount[data-event-id="${eventId}"]`);
    let upvoteCount = parseInt(upvoteElement.textContent);

    if (click_count_upvote % 2 == 0) {
        updateVote(eventId, 'upvote', -1);
        upvoteElement.textContent = --upvoteCount;
    } else {
        upvoteElement.textContent = ++upvoteCount;
        updateVote(eventId, 'upvote', 1);
    }


}

let click_count_downvote = 0;
function incrementDownvote(eventId) {
    click_count_downvote += 1;
    const downvoteElement = document.querySelector(`.downvoteCount[data-event-id="${eventId}"]`);
    let downvoteCount = parseInt(downvoteElement.textContent);

    if (click_count_downvote % 2 == 0) {
        updateVote(eventId, 'downvote', -1);
        downvoteElement.textContent = --downvoteCount;
    } else {
        downvoteElement.textContent = ++downvoteCount;
        updateVote(eventId, 'downvote', 1);

    }


}

function updateVote(eventId, type, value) {
    fetch(`/events/${eventId}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: type,
            value: value
        })
    }).then(response => {
        if (!response.ok) {
            // Handle error
            console.error('Failed to update vote');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}


function hasUserVoted(eventId) {
    // Check browser storage (e.g., localStorage) for user's votes
    const votedEvents = JSON.parse(localStorage.getItem('votedEvents')) || [];
    return votedEvents.includes(eventId);
}

function markUserVote(eventId) {
    const votedEvents = JSON.parse(localStorage.getItem('votedEvents')) || [];
    votedEvents.push(eventId);
    localStorage.setItem('votedEvents', JSON.stringify(votedEvents));
}