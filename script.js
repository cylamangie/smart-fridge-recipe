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
  const file = imageInput.files[0]; // ✅ Define 'file' here
  if (!file) {
    results.textContent = "Please upload an image first.";
    return;
  }

  loader.style.display = "block";
  results.textContent = "";

  // Send image name to AWS Lambda via API Gateway
  fetch("https://wipvyq4x55.execute-api.ap-southeast-2.amazonaws.com/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image_name: file.name })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
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
    .catch(error => {
      loader.style.display = "none";
      results.textContent = "Error connecting to backend: " + error.message;
    });
});
