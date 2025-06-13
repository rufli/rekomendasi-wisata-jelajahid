from flask import Flask, request, jsonify
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)

# Load model dan preprocessing tools
model_artifacts = joblib.load('tourism_recommendation_model.pkl')
kmeans_model = model_artifacts['kmeans_model']
scaler = model_artifacts['scaler']
encoder = model_artifacts['encoder']

# Load data dengan cluster
df_clustered = pd.read_csv('tourism_data_with_clusters.csv')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Ambil data dari request
        data = request.json
        
        # Preprocessing
        category_encoded = encoder.transform([[data['category']]]).toarray()
        category_df = pd.DataFrame(category_encoded, columns=encoder.get_feature_names_out(['Category']))
        
        # Gabungkan dengan fitur numerik
        user_data = np.array([[data['price'], data['rating'], data['lat'], data['lng']]])
        scaled_features = scaler.transform(user_data)
        
        user_processed = np.concatenate([category_encoded, scaled_features], axis=1)
        
        # Prediksi cluster
        cluster = kmeans_model.predict(user_processed)[0]
        
        # Ambil rekomendasi
        recommendations = df_clustered[df_clustered['Cluster'] == cluster]
        recommendations = recommendations.sort_values(
            by=['Rating', 'Price'],
            ascending=[False, True]
        ).head(5)
        
        # Format output
        result = recommendations[['Place_Name', 'Category', 'City', 'Rating', 'Price', 'Description']].to_dict('records')
        
        return jsonify({
            'status': 'success',
            'cluster': int(cluster),
            'recommendations': result
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True)