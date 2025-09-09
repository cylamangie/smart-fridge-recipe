document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageUpload");
  const preview = document.getElementById("preview");
  const loader = document.getElementById("loader");
  const results = document.getElementById("results");

  // Show image preview when file is selected
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });

  // Handle Analyze button click
  document.getElementById("analyzeBtn").addEventListener("click", () => {
    const file = imageInput.files[0];
    if (!file) {
      results.textContent = "Please upload an image first.";
      return;
    }

    loader.style.display = "block";
    results.textContent = "";

    // Step 1: Get pre-signed URL
    fetch("https://9sn2drfprj.execute-api.ap-southeast-2.amazonaws.com/get-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_name: file.name })
    })
      .then(res => res.json())
      .then(data => {
        const uploadUrl = data.upload_url;

        // Step 2: Upload image to S3
        return fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file
        });
      })
      .then(() => {
        // Step 3: Call analysis Lambda
        return fetch("https://wipvyq4x55.execute-api.ap-southeast-2.amazonaws.com/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_name: file.name })
        });
      })
      .then(res => res.json())
     .then(data => {
  loader.style.display = "none";

  const imageName = data.image_name || "No image name provided";
  const ingredients = Array.isArray(data.ingredients) && data.ingredients.length > 0
    ? data.ingredients.join(", ")
    : "No ingredients detected";

  const recipes = Array.isArray(data.recipes) && data.recipes.length > 0
    ? data.recipes.map(recipe => `<li>${recipe}</li>`).join("")
    : "<li>No recipes available</li>";

  // If everything is missing, show a friendly fallback
  if (!data.image_name && !data.ingredients && !data.recipes) {
    results.innerHTML = `
      <strong>No results found.</strong><br/>
      Please try uploading a clearer fridge photo or check your connection.
    `;
  } else {
    results.innerHTML = `
      <strong>Image:</strong> ${imageName}<br/>
      <strong>Ingredients:</strong> ${ingredients}<br/>
      <strong>Recipes:</strong><ul>${recipes}</ul>
    `;
  }
});
      .catch(err => {
        loader.style.display = "none";
        results.textContent = "Upload or analysis failed: " + err.message;
      });
  });
});
