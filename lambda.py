def lambda_handler(event, context):
    # Extract image name from the request body
    try:
        body = event.get("body")
        if isinstance(body, str):
            import json
            body = json.loads(body)
        image_name = body.get("image_name", "unknown.jpg")
    except Exception as e:
        return {
            "statusCode": 400,
            "body": f"Invalid request format: {str(e)}"
        }

    # Simulated response based on image_name
    response = {
        "image_name": image_name,
        "ingredients": ["tomato", "cheese", "basil"],
        "recipes": [
            "Caprese Salad",
            "Tomato Basil Pasta",
            "Grilled Cheese with Tomato"
        ]
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(response)
    }
