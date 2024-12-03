import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Generate 50000 sales records
n_records = 5000

# Generate client_ids 
client_ids = np.random.randint(1, 100000, n_records)

# Generate product_ids 
product_ids = np.random.randint(1, 201, n_records)

# Generate quantities (reasonable range for sales)
quantities = np.random.randint(1, 5, n_records)

# Generate dates evenly spaced 
start_date = datetime(2024, 11, 29)
end_date = datetime(2024, 11, 30)
date_range = (end_date - start_date).days
dates = [start_date + timedelta(days=int(i * date_range / n_records)) for i in range(n_records)]

# Create DataFrame
sales_df = pd.DataFrame({
    'id': range(50001, 50001 + n_records),
    'client_id': client_ids,
    'product_id': product_ids,
    'quantity': quantities,
    'date': dates
})


# Save to CSV
sales_df.to_csv('large_sales_dataset.csv', index=False)
print(sales_df.head())
print(f"\nTotal records: {len(sales_df)}")