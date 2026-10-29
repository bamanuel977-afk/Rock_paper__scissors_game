
import random
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# The choices in our game
choices = ["rock", "paper", "scissors"]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/play", methods=["POST"])
def play():
    # Get the player's choice from the website
    data = request.get_json()
    user_choice = data.get("choice", "").lower()

    # Check whether the choice is valid
    if user_choice not in choices:
        return jsonify({"error": "Invalid choice"}), 400

    # Computer randomly chooses
    computer_choice = random.choice(choices)

    # Decide who wins
    if user_choice == computer_choice:
        result = "Draw!"

    elif (
        (user_choice == "rock" and computer_choice == "scissors")
        or (user_choice == "paper" and computer_choice == "rock")
        or (user_choice == "scissors" and computer_choice == "paper")
    ):
        result = "You win!"

    else:
        result = "Computer wins!"

    # Send the result back to the website
    return jsonify({
        "user_choice": user_choice,
        "computer_choice": computer_choice,
        "result": result
    })


if __name__ == "__main__":
    app.run(debug=True)
