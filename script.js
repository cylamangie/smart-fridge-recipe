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
      results.innerHTML = `
        <strong>Image:</strong> ${data.image_name}<br/>
        <strong>Ingredients:</strong> ${data.ingredients.join(", ")}<br/>
        <strong>Recipes:</strong><ul>
          ${data.recipes.map(recipe => `<li>${recipe}</li>`).join("")}
        </ul>
      `;
    })
    .catch(err => {
      loader.style.display = "none";
      results.textContent = "Upload or analysis failed: " + err.message;
    });
});
