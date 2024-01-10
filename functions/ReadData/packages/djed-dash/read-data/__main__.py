import os
import requests

# FUNCTIONS
def read_data():
    try:
        url = "https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app/raw_data.json"
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception
        json_data = response.json()
        return json_data
    except:
        return {
            "page": -1,
            "latest_timestamp": -1
        }

def main(args):
    data = read_data()
    return { "body": data }

print(main(0))