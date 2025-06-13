import requests
import json

# URL API lokal
API_URL = "http://localhost:5000/recommend"

# Data contoh untuk testing
test_data = {
    "category": "Budaya",
    "price": 20000,
    "rating": 4.5,
    "lat": -6.1754,
    "lng": 106.8272
}

# Kirim request ke API
response = requests.post(API_URL, json=test_data)

# Tampilkan hasil
if response.status_code == 200:
    print("Rekomendasi berhasil:")
    print(json.dumps(response.json(), indent=2))
else:
    print("Error:", response.text)