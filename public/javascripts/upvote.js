// let upvoteCount = 0;
// let downvoteCount = 0;
// function incrementUpvote() {
//     upvoteCount++;
//     document.getElementById('upvoteCount').textContent = upvoteCount;
// }

// function incrementDownvote() {
//     downvoteCount++;
//     document.getElementById('downvoteCount').textContent = downvoteCount;
// }

let click_count_upvote = 0;
function incrementUpvote(eventId) {
    click_count_upvote += 1;
    const upvoteElement = document.querySelector(`.upvoteCount[data-event-id="${eventId}"]`);
    let upvoteCount = parseInt(upvoteElement.textContent);
    if (click_count_upvote % 2 == 0){
        upvoteElement.textContent = --upvoteCount;
    }
    else{
        upvoteElement.textContent = ++upvoteCount;
    }

}

let click_count_downvote = 0;
function incrementDownvote(eventId) {
    click_count_downvote += 1;
    const downvoteElement = document.querySelector(`.downvoteCount[data-event-id="${eventId}"]`);
    let downvoteCount = parseInt(downvoteElement.textContent);
    if (click_count_downvote % 2 == 0){
        downvoteElement.textContent = --downvoteCount;
    }
    else{
        downvoteElement.textContent = ++downvoteCount;
    }
}