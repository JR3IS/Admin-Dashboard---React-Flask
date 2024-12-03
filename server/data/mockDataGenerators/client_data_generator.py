import csv
from faker import Faker

# List of valid contries
valid_countries = [
    "United States", "Canada", "Mexico", "Brazil", "Argentina", "United Kingdom", "France", 
    "Germany", "Italy", "Spain", "Russia", "China", "Japan", "South Korea", "India", 
    "Australia", "New Zealand", "South Africa", "Egypt", "Nigeria", "Turkey", "Saudi Arabia", 
    "Indonesia", "Thailand", "Vietnam", "Philippines", "Malaysia", "Singapore", "Bangladesh", 
    "Pakistan", "Afghanistan", "Ukraine", "Poland", "Netherlands", "Belgium", "Sweden", 
    "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Greece", "Portugal", 
    "Czech Republic", "Hungary", "Romania", "Chile", "Colombia", "Peru", "Venezuela", 
    "Iran", "Iraq", "Israel", "United Arab Emirates", "Qatar", "Kuwait", "Kazakhstan", 
    "Uzbekistan", "Myanmar", "Morocco", "Algeria", "Kenya"
]

# Configure Faker
fake = Faker()
Faker.seed(42)  # Para garantir resultados reproduzíveis

# Generate Records
def generate_records(num_records):
    records = []
    for i in range(1, num_records + 1):
        records.append({
            "id": i,
            "registerId": f"CL{i:03d}",
            "name": fake.name(),
            "age": fake.random_int(min=18, max=80),
            "phone": fake.phone_number(),
            "email": fake.email(),
            "address": fake.street_address(),
            "city": fake.city(),
            "zipCode": fake.zipcode(),
            "country": fake.random_element(valid_countries)

        })
    return records

# Save records in CSV
def save_to_csv(filename, records):
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)

# Generate and save data
num_records = 100000
filename = "clientes.csv"
records = generate_records(num_records)
save_to_csv(filename, records)

print(f"{num_records} registros foram salvos em {filename}")
