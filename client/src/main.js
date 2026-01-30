let selectedRating = 0;

const stars = document.querySelectorAll(".star");
const ratingInput = document.getElementById("rating");
const form = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    ratingValue.value = selectedRating;

    stars.forEach((s) => {
      s.classList.toggle("active", s.dataset.value <= selectedRating);
    });
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  if (!rating || !comment) {
    alert("Please provide both a rating and a comment.");
    return;
  }

  const review = document.createElement("div");
  review.classList.add("review");

  const star = document.createElement("div");
  star.classList.add("stars");
  star.textContent = "&#11088".repeat(rating);

  const commentText = document.createElement("p");
  commentText.textContent = comment;

  review.appendChild(star);
  review.appendChild(commentText);
  reviewsList.appendChild(review);

  form.reset();

  stars.forEach((s) => s.classList.remove("active"));
  selectedRating = 0;
});

app.get('/reviews', (req, res) => {
  const {data,error} = await.supabase
    .from('reviews')
    .select('*');
    .order('created_at',{ascending:false});

  if(error){
    return res.status(500).json({error:error.message});
  }
  
  res.status(200).json(data);
});

app.post('/reviews', async (req, res) => {
  const {rating, comment} = req.body;

  const {data,error} = await.supabase
    .from('reviews')
    .insert([{rating, comment}]);
    
  if(error){
    return res.status(500).json({error:error.message});
  }
  res.status(200).json({message:'Review added', review:data[0]});
});

function addReview(rating,comment){
  const review = document.createElement("div");
  review.classList.add("review");
  
  const star = document.createElement("div");
  star.classList.add("stars");
  star.textContent = "&#11088".repeat(rating);

  const commentText = document.createElement("p");
  commentText.textContent = comment;
  
  review.appendChild(star);
  review.appendChild(commentText);
  reviewsList.appendChild(review);
}

async function loadReviews(){
  const response = await fetch('https://assignment-guestbook-client.onrender.com//reviews');
  const reviews = await response.json();
  
  reviewsList.innerHTML = '';
  
  reviews.forEach(review => {
    addReview(review.rating, review.comment);
  });
  catch(error){
    console.error('Error loading reviews:',error);
  }
}
loadReviews();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const = ratingInput.value;
  const comment = document.getElementById("comment").value;
  
  if (!rating || !comment) {
    alert("Please provide both a rating and a comment.");
    return;
  }
  
  try{
    await.fetch('https://assignment-guestbook-client.onrender.com//reviews',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        rating: Number(rating),
        comment
      }),
    });

    addReview(rating, comment);

    form.reset();
    
    stars.forEach((s) => s.classList.remove("active"));
    selectedRating = 0;
  }
  catch(error){
    console.error('Error submitting review:',error);
  }
});

