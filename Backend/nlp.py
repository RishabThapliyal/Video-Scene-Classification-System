

# required libraries
# !pip install -q sentence-transformers scikit-learn transformers

# Importing libraries
from sentence_transformers import SentenceTransformer, util
from sklearn.metrics.pairwise import cosine_similarity
import torch
import numpy as np

# Loading a SentenceTransformer model ( 'all-MiniLM-L6-v2' for faster performance)
model = SentenceTransformer('all-mpnet-base-v2')


def load_scene_labels(filepath="scene_labels_2.txt"):
    """
    Loads scene labels from a text file, with each label on a new line.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        labels = [line.strip() for line in f if line.strip()]
    return labels

# Loading scene categories from the external file
scene_labels = load_scene_labels()


# Generating embeddings for all scene categories
category_embeddings = model.encode(scene_labels, convert_to_tensor=True)

# Function to process user query and find best match
def find_scene_match(user_query, top_k=1):
    # Encoding the user query
    query_embedding = model.encode(user_query, convert_to_tensor=True)

    # Computing cosine similarities
    cosine_scores = util.pytorch_cos_sim(query_embedding, category_embeddings)[0]

    # top matchches
    top_results = torch.topk(cosine_scores, k=top_k)

    print(f"\n Query: {user_query}")
    for score, idx in zip(top_results[0], top_results[1]):
        print(f"Best Match: {scene_labels[idx]} (Score: {score:.4f})")

# Example usage
find_scene_match("girl swimming")
find_scene_match("raining heavily")
find_scene_match("car racing")