const imageInput = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const results = document.getElementById("results");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

document.getElementById("analyzeBtn").addEventListener("click", () => {
  if (!imageInput.files.length) {
    results.textContent = "Please upload an image first.";
    return;
  }

  loader.style.display = "block";
  results.textContent = "";

  setTimeout(() => {
    loader.style.display = "none";

    const mockResponse = {
      image_name: imageInput.files[0].name,
      ingredients: ["tomato", "cheese", "basil"],
      recipes: [
        "Caprese Salad",
        "Tomato Basil Pasta",
        "Grilled Cheese with Tomato"
      ]
    };

    results.innerHTML = `
      <strong>Image:</strong> ${mockResponse.image_name}<br/>
      <strong>Ingredients:</strong> ${mockResponse.ingredients.join(", ")}<br/>
      <strong>Recipes:</strong><ul>
        ${mockResponse.recipes.map(recipe => `<li>${recipe}</li>`).join("")}
      </ul>
    `;
  }, 1000); // Simulated delay
});
