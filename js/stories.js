"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
      <i id="favorite-icon" class="bi bi-star"></i>
      <i id="unfavorite-icon" class="bi bi-star-fill" style="display: none"></i>
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** gathers info from submission form, calls addStory, adds info to storyList,
 * generatesStoryMarkup and finally prepends the story to the allStoriesList
 * element
  */


async function handleStorySubmission(evt) {
  evt.preventDefault();

  const author = $('#author-input').val();
  const title = $('#title-input').val();
  const url = $('#url-input').val();


  const newStory = await storyList.addStory(currentUser,
    { author, title, url });



  const newStoryMarkup = generateStoryMarkup(newStory);

  $allStoriesList.prepend(newStoryMarkup);

}

$('#story-form').on('submit', handleStorySubmission);

function putFavoritesOnPage() {
  const currentFavorites = currentUser.favorites;
  $favoritesList.empty();

  for (let favorite of currentFavorites) {
    console.log('favorite,', favorite);
    console.log("Is this favorite an instance of Story?", favorite instanceof Story);
    const $favorite = generateStoryMarkup(favorite);
    $favoritesList.append($favorite);
  }
}

$body.on("click", "#favorite-icon", handleFavoriteClick)

async function handleFavoriteClick(evt) {
  console.log("handleFavoriteClick ran")
  console.log("storyList,", storyList)
  const favoritedId = $(evt.target).closest('li').attr('id');
  $(evt.target).hide();

  $(evt.target).closest("li").children("#unfavorite-icon").show();



  for (const story of storyList.stories) {
    if (story.storyId === favoritedId) {
      await currentUser.addFavorite(story);
    }
  }

}

async function handleUnfavoriteClick(evt) {
  const unfavoritedId = $(evt.target).closest('li').attr('id');
  $(evt.target).hide();

  $(evt.target).closest("li").children("#favorite-icon").show();

  for (const story of storyList.stories) {
    if (story.storyId === unfavoritedId) {
      await currentUser.deleteFavorite(story);
    }
  }
}

$body.on("click", "#unfavorite-icon", handleUnfavoriteClick);

