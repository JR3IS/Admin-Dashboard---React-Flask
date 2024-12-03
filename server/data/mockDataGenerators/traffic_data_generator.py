import csv
import random
from datetime import datetime, timedelta

# Generate random date range
def generate_dates(start_date, end_date):
    delta = end_date - start_date
    return [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(delta.days + 1)]

# Generate traffic data for a given day
def generate_daily_traffic():
    inbound_traffic = random.randint(100, 5000)  # Random visits per day
    unique_visitors = random.randint(50, inbound_traffic)  # Unique visitors <= inbound traffic
    avg_session_duration = round(random.uniform(30, 600), 2)  # Average session time in seconds
    return inbound_traffic, unique_visitors, avg_session_duration

# Generate CSV file
def generate_traffic_csv(filename, start_date, end_date):
    dates = generate_dates(start_date, end_date)
    with open(filename, "w", newline="") as csvfile:
        fieldnames = ["date", "inbound_traffic", "unique_visitors", "avg_session_duration"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for date in dates:
            inbound_traffic, unique_visitors, avg_session_duration = generate_daily_traffic()
            writer.writerow({
                "date": date,
                "inbound_traffic": inbound_traffic,
                "unique_visitors": unique_visitors,
                "avg_session_duration": avg_session_duration
            })

# Usage
start_date = datetime(2018, 1, 1)  # Start date
end_date = datetime.now()  # End date (today)
generate_traffic_csv("site_traffic.csv", start_date, end_date)
