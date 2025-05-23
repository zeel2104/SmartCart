from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for frontend access

# Load dataset
csv_path = "WMT_Grocery_with_images.csv"
df = pd.read_csv(csv_path)
df.fillna("", inplace=True)

# Initialize cart
cart = []


@app.route('/')
def index():
    return "SmartCart backend is running ✅"

@app.route('/products', methods=['GET'])
def get_products():
    try:
        query = request.args.get('q', '').lower()
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        start = (page - 1) * limit
        end = start + limit
        query = request.args.get("q", "").lower()
        filtered = df[df["PRODUCT_NAME"].str.lower().str.contains(query)]

        filtered = df[df['PRODUCT_NAME'].str.lower().str.contains(query)] if query else df

        products = filtered.iloc[start:end][[
            'SKU', 'PRODUCT_NAME', 'BRAND', 'PRICE_CURRENT',
            'PRODUCT_URL', 'PRODUCT_SIZE', 'IMAGE_URL'
        ]].to_dict(orient='records')

        return jsonify({
            'products': products if products else [],
            'total': len(filtered)
        })
    except Exception as e:
        return jsonify({'products': [], 'total': 0, 'error': str(e)}), 500



@app.route('/cart', methods=['GET'])
def get_cart():
    return jsonify(cart)





@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    sku = data.get('SKU')

    for item in cart:
        if item['SKU'] == sku:
            item['quantity'] = item.get('quantity', 1) + 1
            return jsonify(cart)

    data['quantity'] = 1
    cart.append(data)
    return jsonify(cart)




@app.route('/cart/<sku>', methods=['DELETE'])
def remove_from_cart(sku):
    global cart
    print(f"🗑️ Removing SKU: {sku}")
    cart = [item for item in cart if item.get('SKU') != sku]
    print("🛒 Updated Cart:", cart)
    return jsonify(cart), 200


@app.route('/cart/<sku>', methods=['PUT'])
def update_cart_quantity(sku):
    data = request.get_json()
    delta = data.get('delta', 0)
    print(f"🔄 Updating SKU: {sku} with delta: {delta}")

    for item in cart:
        if item.get('SKU') == sku:
            item['quantity'] = max(1, item.get('quantity', 1) + delta)
            print("✅ New quantity:", item['quantity'])
            break

    return jsonify(cart), 200






if __name__ == '__main__':
    app.run(debug=True)
