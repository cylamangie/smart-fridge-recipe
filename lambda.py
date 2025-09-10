import boto3
import json

def lambda_handler(event, context):
    # Extract image name from the request body
    try:
        body = event.get("body")
        if isinstance(body, str):
            body = json.loads(body)
        image_name = body.get("image_name", "unknown.jpg")
    except Exception as e:
        return {
            "statusCode": 400,
            "body": f"Invalid request format: {str(e)}"
        }

    # Initialize Rekognition client
    rekognition = boto3.client("rekognition", region_name="ap-southeast-2")

    # Define your custom food list
    food_keywords = [
        "Tomato", "Cheese", "Basil", "Broccoli", "Carrot", "Lettuce", "Egg", "Milk",
        "Yogurt", "Chicken", "Beef", "Pasta", "Apple", "Banana", "Cucumber", "Onion",
        "Garlic", "Mushroom", "Spinach", "Tofu", "Bread", "Butter", "Corn", "Peas"
    ]

    try:
        # Detect labels in the image
        response = rekognition.detect_labels(
            Image={
                "S3Object": {
                    "Bucket": "smart.fridge.photos",
                    "Name": image_name
                }
            },
            MaxLabels=50,
            MinConfidence=70
        )

        detected_labels = [label["Name"] for label in response["Labels"]]
        ingredients = [label for label in detected_labels if label in food_keywords]

        # Simulated recipe suggestions based on ingredients
        recipes = []
        if "Tomato" in ingredients and "Cheese" in ingredients:
            recipes.append("Caprese Salad")
        if "Pasta" in ingredients and "Tomato" in ingredients:
            recipes.append("Tomato Basil Pasta")
        if "Bread" in ingredients and "Cheese" in ingredients:
            recipes.append("Grilled Cheese Sandwich")
        if "Egg" in ingredients and "Milk" in ingredients:
            recipes.append("Scrambled Eggs")
        if "Chicken" in ingredients and "Broccoli" in ingredients:
            recipes.append("Chicken Stir-Fry")

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "image_name": image_name,
                "ingredients": ingredients,
                "recipes": recipes
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Error analyzing image: {str(e)}"
        }
