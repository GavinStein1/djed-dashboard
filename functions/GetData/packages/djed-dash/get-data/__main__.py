import os
import requests
from blockfrost import BlockFrostApi, ApiUrls
from .firebase import get_access_token

# CONSTANTS
blockfrost_api_key = os.environ.get("BLOCKFROST_API_KEY")

shen_id = "8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd615368656e4d6963726f555344"
djed_id = "8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61446a65644d6963726f555344"
reserve_addr = "addr1zxem3j9xw7gyqnry0mfdhku7grrzu0707dc9fs68zwkln5sm5kjdmrpmng059yellupyvwgay2v0lz6663swmds7hp0qul0eqc"

# CONNECTORS
api = BlockFrostApi(
    project_id=blockfrost_api_key,  # or export environment variable BLOCKFROST_PROJECT_ID
    # optional: pass base_url or export BLOCKFROST_API_URL to use testnet, defaults to ApiUrls.mainnet.value
    base_url=ApiUrls.mainnet.value,
)

# FUNCTIONS
def get_init_data():
    try:
        url = "https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app/init_data.json"
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

def write_data(data, timestamp: str) -> int:
    try:
        url = "https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app/raw_data/" + timestamp + ".json"
        access_token = get_access_token()
        headers = {
            "Authorization": "Bearer {}".format(access_token)
        }
        response = requests.put(url, json=data, headers=headers)
        if response.status_code != 200:
            raise Exception
        return 0
    except:
        return -1
    
def write_init_data(timestamp, page):
    try:
        url = "https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app/init_data.json"
        access_token = get_access_token()
        headers = {
            "Authorization": "Bearer {}".format(access_token)
        }
        init_data = {
            "page": page,
            "latest_timestamp": timestamp
        }
        response = requests.put(url, json=init_data, headers=headers)
        if response.status_code != 200:
            raise Exception
    except:
        return -1

def get_cardano_price():
    # CoinGecko API endpoint for Cardano
    url = "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"

    try:
        # Make a GET request to the API
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()

            # Extract the price of Cardano in USD
            cardano_price = data["cardano"]["usd"]

            return cardano_price
        else:
            print(f"Error: {response.status_code}")
            return 0
    except Exception as e:
        print(f"Error: {e}")
        return None

def get_data():
    init_data = get_init_data()
    page = init_data["page"]
    latest_timestamp = init_data["latest_timestamp"]
    ada_price = get_cardano_price()
    transactions = api.address_transactions(reserve_addr, page=page)
    while len(transactions) > 0:   
        for t in transactions:
            save_data = {}
            tx = api.transaction(t.tx_hash)
            timestamp = tx.block_time
            if timestamp > latest_timestamp:
                tx_utxos = api.transaction_utxos(t.tx_hash)
                for utxo in tx_utxos.outputs:
                    if utxo.address == reserve_addr:
                        for amount in utxo.amount:
                            if amount.unit == shen_id:
                                save_data["shen_reserve"] = amount.quantity
                            elif amount.unit == djed_id:
                                save_data["djed_reserve"] = amount.quantity
                            elif amount.unit == "lovelace":
                                save_data["ada_reserve"] = amount.quantity
                save_data["block"] = tx.block_height
                save_data["ada_price"] = ada_price
                
                # Write to firebase database
                write_data(save_data, str(timestamp))

        page += 1
        transactions = api.address_transactions(reserve_addr, page=page)
        write_init_data(timestamp, page)

def main(args):
    get_data()
    return { "body": "executed" }