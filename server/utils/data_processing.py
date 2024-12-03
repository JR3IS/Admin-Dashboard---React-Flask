import pandas as pd
from datetime import datetime
import pycountry
import numpy as np

## SALES DATAFRAME ##
def sales_df():
    sales_df = pd.read_csv("data/sales.csv")
    products_df = pd.read_csv("data/products.csv")
    clients_df = pd.read_csv("data/clients.csv")
    
    # Merge sales with products on product_id
    merged_df = pd.merge(sales_df, products_df, left_on="product_id", right_on="id", how="left")

    # Merge the result with clients on client_id
    merged_df = pd.merge(merged_df, clients_df, left_on="client_id", right_on="id", how="left")

    # Calculate the final price
    merged_df['finalPrice'] = (merged_df['quantity'] * merged_df['price']).round(2)

    # Drop unnecessary columns (like product_id and client_id) but keep saleId
    merged_df = merged_df.drop(columns=[col for col in ['product_id','id_y','id'] if col in merged_df.columns])

    # Rename columns for clarity
    merged_df = merged_df.rename(columns={
        'id_x': 'saleId',  # Keep saleId from the sales file
        'name': 'clientName',
        'age' : 'clientAge',
        'phone': 'clientPhone',
        'email': 'clientEmail',
        'address': 'clientAddress',
        'city': 'clientCity',
        'zipCode': 'clientZipCode',
        'country': 'clientCountry',
        'brand': 'productBrand',
        'model': 'productModel',
        'category': 'productCategory',
        'price': 'productPrice',
        'quantity': 'saleQuantity',
        'date': 'saleDate'
    })

    # Return the final DataFrame
    return merged_df

## BAR CHART DATA##
def bar_chart_data():
    # Load the site traffic data
    site_traffic_df = pd.read_csv("data/site_traffic.csv")

    # Convert the 'date' column to datetime
    site_traffic_df['date'] = pd.to_datetime(site_traffic_df['date'])

    # Extract year and month from the 'date' column
    site_traffic_df['year_month'] = site_traffic_df['date'].dt.to_period('M')

    # Group by year_month and sum inbound_traffic and unique_visitors
    grouped_data = site_traffic_df.groupby('year_month').agg({
        'inbound_traffic': 'sum',
        'unique_visitors': 'sum'
    }).reset_index()

    # Convert 'year_month' back to string for JSON serialization
    grouped_data['year_month'] = grouped_data['year_month'].astype(str)
    
    # Convert to a list of dictionaries for frontend consumption
    bar_chart_data = grouped_data.to_dict(orient="records")
    
    return bar_chart_data

## LINE CHART DATA ##
def line_chart_data(year=None):
    sales = sales_df()

    # Convert 'saleDate' to datetime and extract year and month
    sales['saleDate'] = pd.to_datetime(sales['saleDate'])
    sales['year'] = sales['saleDate'].dt.year
    sales['month'] = sales['saleDate'].dt.strftime('%b')  # Abbreviated month names

    # Filter by year if specified
    if year:
        sales = sales[sales['year'] == year]

    # Aggregate total sales by month
    grouped_sales = sales.groupby(['year', 'month']).agg({'finalPrice': 'sum'}).reset_index()

    # Sort by month order
    month_order = pd.Categorical(
        grouped_sales['month'],
        categories=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ordered=True
    )
    grouped_sales['month'] = month_order
    grouped_sales = grouped_sales.sort_values('month')

    # Convert to list of dictionaries and structure it for frontend
    line_chart_data = []

    # Group the sales data by year and prepare it in the required format
    for year, group in grouped_sales.groupby('year'):
        # Get the color for each year (you can choose based on a color palette or any logic you prefer)
        color = "#00ff00"  # For example, green for the year (this can be dynamically assigned based on year)
        data = [{"x": row["month"], "y": row["finalPrice"]} for _, row in group.iterrows()]

        line_chart_data.append({
            "id": str(year),  # Use year as the ID
            "color": color,
            "data": data
        })

    return line_chart_data

## PIE DATA CHART ##
def pie_chart_data():
    sales = sales_df()  # Load the sales DataFrame
    
    # Ensure 'saleDate' is a datetime type
    sales['saleDate'] = pd.to_datetime(sales['saleDate'])

    # Get the current year
    current_year = datetime.now().year

    # Filter sales data for the current year
    current_year_sales = sales[sales['saleDate'].dt.year == current_year]

    # Group by product category and sum up the sales
    category_sales = current_year_sales.groupby('productCategory').agg({'finalPrice': 'sum'}).reset_index()

    # Calculate total sales for the current year
    total_sales = category_sales['finalPrice'].sum()

    # Prepare the data in the required format with percentages
    pie_chart_data = []
    for _, row in category_sales.iterrows():
        pie_chart_data.append({
            "id": row["productCategory"],  # Category name
            "label": row["productCategory"],  # Category name as label
            "value": round((row["finalPrice"] / total_sales) * 100, 2),  # Percentage of total sales
        })

    return pie_chart_data

## GEO CHART DATA ##
import pycountry
import pandas as pd

def geo_chart_data():
    sales = sales_df()  # Load the sales DataFrame
    
    # Ensure 'saleDate' is a datetime type
    sales['saleDate'] = pd.to_datetime(sales['saleDate'])
    
    # Filter sales data for 2024
    sales_2024 = sales[sales['saleDate'].dt.year == 2024]

    # Group sales by country and calculate total sales value
    country_sales = sales_2024.groupby('clientCountry').agg({'finalPrice': 'sum'}).reset_index()

    # Convert country names to ISO 3166-1 alpha-3 codes
    def get_country_code(country_name):
        # Manually handle Russia and Turkey
        if country_name == 'Russia':
            return 'RUS'  # ISO 3166-1 alpha-3 code for Russia
        elif country_name == 'Turkey':
            return 'TUR'  # ISO 3166-1 alpha-3 code for Turkey
        
        try:
            # Look up the ISO alpha-3 code for other countries
            country = pycountry.countries.lookup(country_name)
            return country.alpha_3
        except LookupError:
            # Log an error and return None if the country is not found
            print(f"Country '{country_name}' not found in ISO 3166-1 alpha-3 codes.")
            return None

    # Apply the conversion function to each country in the data
    country_sales['id'] = country_sales['clientCountry'].apply(get_country_code)

    # Drop rows where the country code is not found (i.e., None values)
    country_sales = country_sales.dropna(subset=['id'])

    # Rename columns to match the required format
    country_sales = country_sales.rename(columns={'finalPrice': 'value'})

    # Select only 'id' and 'value' columns for the frontend
    geo_chart_data = country_sales[['id', 'value']].to_dict(orient='records')

    return geo_chart_data

## TRAFFIC DATAFRAME ##
def traffic_df():
    traffic_df = pd.read_csv("data/site_traffic.csv")

    # Convert date column to datetime
    traffic_df['date'] = pd.to_datetime(traffic_df['date'])
    
    # Extract year-month from the date
    traffic_df['year_month'] = traffic_df['date'].dt.to_period('M')

    return traffic_df

## CREATE CARDS DATA ##
def cards_data():
    sales = sales_df()
    traffic = traffic_df()

    # Convert saleDate to datetime and extract year and month
    sales['saleDate'] = pd.to_datetime(sales['saleDate'])
    sales['year_month'] = sales['saleDate'].dt.to_period('M')

    # Filter sales for November 2024
    november_sales = sales[sales['year_month'] == '2024-11']

    # Get November orders count
    november_orders = november_sales['saleId'].nunique()

    # Get total income for November 2024
    november_income = round(november_sales['finalPrice'].sum(), 2)

    # Get the number of new clients (clients who purchased for the first time in November 2024)
    first_time_clients = sales[sales['saleDate'].dt.month == 11].groupby('client_id').filter(lambda x: x['saleDate'].min().month == 11).client_id.nunique()

    # Get the total income for the entire year 2024
    annual_income_2024 = round(sales[sales['saleDate'].dt.year == 2024]['finalPrice'].sum(), 2)

    # Filter traffic data for November 2024
    november_traffic = traffic[traffic['year_month'] == '2024-11']

    # Calculate total inbound traffic and unique visitors for November 2024
    november_inbound_traffic = round(november_traffic['inbound_traffic'].sum(), 2)
    november_unique_visitors = round(november_traffic['unique_visitors'].sum(), 2)
    november_avg_session_duration = round(november_traffic['avg_session_duration'].mean(), 2)

    # Prepare the cards_data with the metrics
    cards_data = {
        'november_orders': november_orders,
        'november_income': november_income,
        'november_new_clients': first_time_clients,
        'annual_income_2024': annual_income_2024,
        'november_inbound_traffic': november_inbound_traffic,
        'november_unique_visitors': november_unique_visitors,
        'november_avg_session_duration': november_avg_session_duration,
    }

    # Get the data for the previous month (October 2024) to calculate percentages
    october_sales = sales[sales['year_month'] == '2024-10']
    october_income = october_sales['finalPrice'].sum()
    october_orders = october_sales['saleId'].nunique()
    october_clients = sales[sales['saleDate'].dt.month == 10].groupby('client_id').filter(lambda x: x['saleDate'].min().month == 10).client_id.nunique()

    # Get the traffic data for October 2024
    october_traffic = traffic[traffic['year_month'] == '2024-10']
    october_inbound_traffic = october_traffic['inbound_traffic'].sum()
    october_unique_visitors = october_traffic['unique_visitors'].sum()

    # Calculate percentage differences from October 2024
    cards_data['percentage_diff_orders'] = round((cards_data['november_orders'] - october_orders) / october_orders, 2) if october_orders != 0 else None
    cards_data['percentage_diff_income'] = round((cards_data['november_income'] - october_income) / october_income, 2) if october_income != 0 else None
    cards_data['percentage_diff_new_clients'] = round((cards_data['november_new_clients'] - october_clients) / october_clients, 2) if october_clients != 0 else None
    cards_data['percentage_diff_inbound_traffic'] = round((cards_data['november_inbound_traffic'] - october_inbound_traffic) / october_inbound_traffic, 2) if october_inbound_traffic != 0 else None
    cards_data['percentage_diff_unique_visitors'] = round((cards_data['november_unique_visitors'] - october_unique_visitors) / october_unique_visitors, 2) if october_unique_visitors != 0 else None

    # Get the total income for November 2023 (for comparison to this year's data)
    november_2023_sales = sales[sales['year_month'] == '2023-11']
    november_2023_income = november_2023_sales['finalPrice'].sum()

    # Calculate percentage difference from November 2023
    cards_data['percentage_diff_income_year'] = round((cards_data['november_income'] - november_2023_income) / november_2023_income, 2) if november_2023_income != 0 else None

    return cards_data

# HELPER FUNCTION TO CONVERT INT64 VALUES TO INT 
def convert_int64_to_int(obj):
    """Recursively convert int64 values to int."""
    if isinstance(obj, dict):
        return {key: convert_int64_to_int(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_int64_to_int(item) for item in obj]
    elif isinstance(obj, np.int64):
        return int(obj)  # Convert int64 to int
    return obj



