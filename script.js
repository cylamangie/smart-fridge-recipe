document.getElementById("analyzeBtn").addEventListener("click", () => {
  const imageInput = document.getElementById("imageUpload");
  const results = document.getElementById("results");

  if (!imageInput.files.length) {
    results.textContent = "Please upload an image first.";
    return;
  }

  // Simulated response from backend
  const mockResponse = {
    ingredients: ["tomato", "cheese", "basil"],
    recipes: [
      "Caprese Salad",
      "Tomato Basil Pasta",
      "Grilled Cheese with Tomato"
    ]
  };

  results.textContent = JSON.stringify(mockResponse, null, 2);
});
