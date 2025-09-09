fetch("https://wipvyq4x55.execute-api.ap-southeast-2.amazonaws.com/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ image_name: file.name })
})
  .then(response => response.json())
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
