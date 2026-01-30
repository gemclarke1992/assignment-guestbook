import "./style.css";

const form = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

// STAR RENDERING//
const starRate = document.querySelectorAll(".star");
let selectedRating = 0;

starRate.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);

    starRate.forEach((s) => {
      s.classList.toggle("active", Number(s.dataset.value) <= selectedRating);
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

  const comment = document.getElementById("comment").value;

  if (selectedRating === 0 || !comment) {
    alert("Please provide both a rating and a comment.");
    return;
  }

  try {
    await fetch("https://assignment-guestbook-client.onrender.com/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: selectedRating,
        comment,
      }),
    });

    addReview(selectedRating, comment);

    form.reset();
    selectedRating = 0;
    starRate.forEach((s) => {
      s.classList.remove("active");
    });
    starRate.forEach((s) => s.classList.remove("active"));
  } catch (error) {
    console.error("Error submitting review:", error);
  }
});
