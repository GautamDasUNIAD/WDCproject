let click_count_upvote = 0;

function incrementUpvote(eventId) {
    click_count_upvote += 1;
    const upvoteElement = document.querySelector(`.upvoteCount[data-event-id="${eventId}"]`);
    let upvoteCount = parseInt(upvoteElement.textContent);

    if (click_count_upvote % 2 === 0) {
        updateVote(eventId, 'upvote', -1, (success) => {
            if (success) {
                upvoteElement.textContent = --upvoteCount;
            } else {
                click_count_upvote -= 1; // revert the click count if update fails
            }
        });
    } else {
        updateVote(eventId, 'upvote', 1, (success) => {
            if (success) {
                upvoteElement.textContent = ++upvoteCount;
            } else {
                click_count_upvote -= 1; // revert the click count if update fails
            }
        });
    }
}

let click_count_downvote = 0;

function incrementDownvote(eventId) {
    click_count_downvote += 1;
    const downvoteElement = document.querySelector(`.downvoteCount[data-event-id="${eventId}"]`);
    let downvoteCount = parseInt(downvoteElement.textContent);

    if (click_count_downvote % 2 === 0) {
        updateVote(eventId, 'downvote', -1, (success) => {
            if (success) {
                downvoteElement.textContent = --downvoteCount;
            } else {
                click_count_downvote -= 1; // revert the click count if update fails
            }
        });
    } else {
        updateVote(eventId, 'downvote', 1, (success) => {
            if (success) {
                downvoteElement.textContent = ++downvoteCount;
            } else {
                click_count_downvote -= 1; // revert the click count if update fails
            }
        });
    }
}

function updateVote(eventId, type, value, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/events/${eventId}/vote`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // Request is complete
            if (xhr.status === 201) {
                alert(xhr.responseText);
            } else if (xhr.status === 401) {
                alert('You need to be logged in to upvote/downvote for events.');
                window.location.href = '/login';
            } else {
                alert(xhr.responseText);
            }
        }
    };

    xhr.onerror = function () {
        console.error('Network error');
        callback(false);
    };

    const requestData = JSON.stringify({
        type: type,
        value: value
    });
    xhr.send(requestData);
}
