let selectedRating = 0;

const stars = document.querySelectorAll(".star");
const ratingInput = document.getElementById("rating");
const form = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

/* ⭐ STAR CLICK HANDLING */
stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    ratingInput.value = selectedRating;

    stars.forEach((s) => {
      s.classList.toggle("active", s.dataset.value <= selectedRating);
    });
  });
});

/* 🧱 RENDER REVIEW */
function addReview(rating, comment) {
  const review = document.createElement("div");
  review.classList.add("review");

  const starDiv = document.createElement("div");
  starDiv.classList.add("stars");
  starDiv.textContent = "⭐".repeat(rating);

  const commentText = document.createElement("p");
  commentText.textContent = comment;

  review.appendChild(starDiv);
  review.appendChild(commentText);
  reviewsList.appendChild(review);
}

/* 🔄 LOAD REVIEWS (GET) */
async function loadReviews() {
  try {
    const response = await fetch(
      "https://assignment-guestbook-client.onrender.com/reviews",
    );
    const reviews = await response.json();

    reviewsList.innerHTML = "";

    reviews.forEach((review) => {
      addReview(review.rating, review.comment);
    });
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

loadReviews();

/* 📤 SUBMIT REVIEW (POST) */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rating = ratingInput.value;
  const comment = document.getElementById("comment").value;

  if (!rating || !comment) {
    alert("Please provide both a rating and a comment.");
    return;
  }

  try {
    await fetch("https://assignment-guestbook-client.onrender.com//reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: Number(rating),
        comment,
      }),
    });

    addReview(rating, comment);

    form.reset();
    stars.forEach((s) => s.classList.remove("active"));
    selectedRating = 0;
  } catch (error) {
    console.error("Error submitting review:", error);
  }
});
