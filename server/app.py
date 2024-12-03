from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from threading import Timer
from utils.data_processing import sales_df, bar_chart_data, line_chart_data, pie_chart_data, geo_chart_data, cards_data, convert_int64_to_int

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Cache to store the data
cache = {
    "sales_data": [],
    "team_data": [],
    "client_data": [],
    "bar_chart_data": [],
    "line_chart_data": [],
    "pie_chart_data": [],
    "geo_chart_data": [],
    "cards_data": []  # Include cards_data here
}

# Load the data once into cache
cache["sales_data"] = sales_df().to_dict(orient="records")

# Function to refresh data periodically
def refresh_cache():
    cache["team_data"] = pd.read_csv("data/team.csv").to_dict(orient="records")
    cache["client_data"] = pd.read_csv("data/clients.csv").to_dict(orient="records")
    cache["sales_data"] = sales_df().to_dict(orient="records")
    cache["bar_chart_data"] = bar_chart_data()
    cache["line_chart_data"] = line_chart_data()
    cache["pie_chart_data"] = pie_chart_data()
    cache["geo_chart_data"] = geo_chart_data()
    cache["cards_data"] = convert_int64_to_int(cards_data()) # Refresh cards data
    Timer(60, refresh_cache).start()  # Refresh every 60 seconds

# Start the periodic refresh
refresh_cache()

# API to retrieve cards data
@app.route('/api/cards_data', methods=['GET'])  # New endpoint for cards_data
def get_cards_data():
    try:
        data = cache["cards_data"]  # Fetch cards data from cache
        return jsonify(data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# API to retrieve geo chart data
@app.route('/api/geo_chart_data', methods=['GET'])
def get_geo_chart_data():
    try:
        data = cache["geo_chart_data"]  # Fetch geo chart data from cache
        return jsonify(data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# API to retrieve line chart data
@app.route('/api/line_chart_data', methods=['GET'])
def get_line_chart_data():
    year = request.args.get('year', type=int)  # Retrieve 'year' from query params
    data = line_chart_data(year=year)
    return jsonify(data)

# API to retrieve bar chart data
@app.route('/api/bar_chart_data', methods=['GET'])
def get_bar_chart_data():
    return jsonify(cache["bar_chart_data"])

# API to retrieve pie chart data
@app.route('/api/pie_chart_data', methods=['GET'])
def get_pie_chart_data():
    data = pie_chart_data()  
    return jsonify(data)

# API to retrieve team data
@app.route('/api/team_data', methods=['GET'])
def get_team_data():
    return jsonify(cache["team_data"])

# API to retrieve client data
@app.route('/api/client_data', methods=['GET'])
def get_client_data():
    return jsonify(cache["client_data"])

# API to retrieve sales data
@app.route('/api/sales_data', methods=['GET'])
def get_sales_data():
    return jsonify(cache["sales_data"])

# API to add new user
@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        # Parse incoming JSON data
        data = request.json

        # Validate required fields
        required_fields = ["firstName", "lastName", "email", "contact", "role", "accessLevel"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Field '{field}' is required"}), 400

        # Load team data
        team_file = "data/team.csv"
        try:
            team_data = pd.read_csv(team_file)
        except FileNotFoundError:
            team_data = pd.DataFrame(columns=["id", "firstName", "lastName", "email", "phone", "role", "access"])

        # Determine next ID
        next_id = team_data["id"].max() + 1 if not team_data.empty else 1

        # Append the new user
        new_user = {
            "id": next_id,
            "name": data["firstName"] + " " + data["lastName"],
            "email": data["email"],
            "phone": data["contact"],
            "role": data["role"],
            "access": data["accessLevel"]
        }
        team_data = pd.concat([team_data, pd.DataFrame([new_user])], ignore_index=True)

        # Save updated team data
        team_data.to_csv(team_file, index=False)

        # Refresh cache
        cache["team_data"] = team_data.to_dict(orient="records")

        return jsonify({"message": "User successfully added", "id": int(next_id)}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# API to delete a user
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Load team data
        team_file = "data/team.csv"
        try:
            team_data = pd.read_csv(team_file)
        except FileNotFoundError:
            return jsonify({"error": "Team data file not found"}), 404

        # Check if the user exists
        if user_id not in team_data["id"].values:
            return jsonify({"error": f"User with ID {user_id} not found"}), 404

        # Delete the user
        team_data = team_data[team_data["id"] != user_id]

        # Save updated team data
        team_data.to_csv(team_file, index=False)

        # Refresh cache
        cache["team_data"] = team_data.to_dict(orient="records")

        return jsonify({"message": f"User with ID {user_id} successfully deleted"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
