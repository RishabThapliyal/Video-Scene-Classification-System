from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
import time
from PIL import Image
import torch
import clip

# --- NLP Processing  ---
from sentence_transformers import SentenceTransformer, util
from sklearn.metrics.pairwise import cosine_similarity

print("Loading models...")

# --- Loading the NLP Model (SentenceTransformer) ---
try:
    global nlp_model
    nlp_model = SentenceTransformer('all-mpnet-base-v2')
    print("SentenceTransformer model loaded successfully.")
except Exception as e:
    print(f"Error loading SentenceTransformer model: {e}")
    exit()

# --- Loading Video Processing Model (CLIP) ---
try:
    global video_model, video_preprocess, device
    device = "cuda" if torch.cuda.is_available() else "cpu"
    video_model, video_preprocess = clip.load("ViT-B/32", device=device)
    print(f"CLIP model loaded successfully on {device}.")
except Exception as e:
    print(f"Error loading CLIP model: {e}")
    exit()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

scene_categories = [
    # Outdoor natural scenes
    "a beach", "a forest", "a mountain", "a desert", "a snowy landscape", "a park", "a lake", "a river", "a waterfall", "a garden", "a field", "a canyon", "a volcano", "a jungle", "a meadow", "a cliff", "a cave",
    # Outdoor urban scenes
    "a city street", "an alley", "a highway", "a road between forest", "a bridge", "a harbor", "a stadium", "a construction site", "a plaza", "a market", "a parking lot", "a train station", "an airport", "a bus stop", "a subway station",
    # Indoor scenes
    "an office", "a restaurant", "a living room", "a classroom", "a kitchen", "a bedroom", "a bathroom", "a gym", "a store", "a hospital", "a laboratory", "a library", "a museum", "a theater", "a concert hall", "a garage", "a warehouse",
    # Transport and mobility
    "a boat", "a car interior", "a train interior", "an airplane cabin", "a subway car",
    # Nature and weather
    "clouds", "a stormy sky", "a sunset", "a sunrise", "a foggy landscape", "rainy street", "snowfall", "a rainbow",
    # Water and ocean scenes
    "an ocean", "a dolphin", "a coral reef", "a ship at sea", "a swimming pool",
    # Public and event spaces
    "a school", "a church", "a mosque", "a temple", "a courthouse", "a sports arena", "a fairground", "a festival",
    # Miscellaneous
    "a zoo", "an amusement park", "a farm", "a barn", "a factory", "a power plant", "a cemetery", "a playground",
]


def load_scene_labels(filepath="scene_labels_2.txt"):
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            labels = [line.strip() for line in f if line.strip()]
        return labels
    except FileNotFoundError:
        print(f"Scene labels file {filepath} not found. Using predefined categories.")
        return scene_categories

# --- Loading scene labels ---
scene_labels = load_scene_labels()

# Generating embeddings for scene categories using SentenceTransformer
category_embeddings = nlp_model.encode(scene_labels, convert_to_tensor=True)

# --- Using CLIP for both text and image processing ---
def process_text_with_clip(text_description):
    """
    Process text using CLIP to ensure dimensional compatibility with image embeddings.
    """
    print(f"Processing text with CLIP: '{text_description}'")
    
    try:
        # Using CLIP for text processing to match image embedding dimensions
        text_tokens = clip.tokenize([text_description]).to(device)
        
        with torch.no_grad():
            text_embedding = video_model.encode_text(text_tokens)
            text_embedding = text_embedding.cpu().numpy()
        
        # Also, finding best matching scene category using SentenceTransformer
        query_embedding = nlp_model.encode(text_description, convert_to_tensor=True)
        cosine_scores = util.pytorch_cos_sim(query_embedding, category_embeddings)[0]
        best_match_idx = torch.argmax(cosine_scores)
        best_match_score = cosine_scores[best_match_idx].item()
        best_match_category = scene_labels[best_match_idx]
        
        print(f"Best matching category: {best_match_category} (Score: {best_match_score:.4f})")
        
        return {
            "embedding": text_embedding,
            "best_category": best_match_category,
            "category_score": best_match_score
        }
        
    except Exception as e:
        print(f"Text processing error: {e}")
        return None

def get_image_embedding_with_clip(frame):
    
    # Converting OpenCV BGR image to PIL RGB image
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(rgb_frame)
    
    # Preprocessing image for CLIP
    image_input = video_preprocess(pil_image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        image_features = video_model.encode_image(image_input)
        
    return image_features.cpu().numpy()

def find_matching_frame_with_ml(video_path, text_embedding_info):
    
    text_embedding = text_embedding_info['embedding']
    best_category = text_embedding_info.get('best_category', '')
    
    best_match_timestamp = None
    highest_similarity = -1.0
    
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return None

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if fps <= 0:
        print(f"Error: Invalid FPS ({fps}) for video {video_path}")
        cap.release()
        return None

    # Processing frames at 1 frame per second
    frame_skip = max(1, int(fps))
    current_frame_index = 0
    processed_frames_count = 0
    
    # Pre-computing text embeddings for scene categories using CLIP
    scene_text_inputs = torch.cat([clip.tokenize(f"a photo of {scene}") for scene in scene_categories]).to(device)
    
    with torch.no_grad():
        clip_text_features = video_model.encode_text(scene_text_inputs)

    while current_frame_index < frame_count:
        cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame_index)
        ret, frame = cap.read()
        
        if not ret:
            break

        # Getting image embedding using CLIP
        image_embedding = get_image_embedding_with_clip(frame)
        
        # Method 1: Direct similarity between query and image (both CLIP embeddings)
        similarity_direct = np.dot(text_embedding.flatten(), image_embedding.flatten()) / \
                           (np.linalg.norm(text_embedding.flatten()) * np.linalg.norm(image_embedding.flatten()))
        
        # Method 2: Scene classification approach
        image_tensor = torch.tensor(image_embedding).to(device)
        clip_similarities = (100.0 * image_tensor @ clip_text_features.T).softmax(dim=-1)
        max_scene_similarity = torch.max(clip_similarities).item() / 100.0  # Normalize to 0-1
        
        # Using the higher of the two similarity scores
        final_similarity = max(similarity_direct, max_scene_similarity)
        
        if final_similarity > highest_similarity:
            highest_similarity = final_similarity
            best_match_timestamp = current_frame_index / fps
            
            # Getting predicted scene for this frame
            best_scene_idx = torch.argmax(clip_similarities)
            predicted_scene = scene_categories[best_scene_idx]
            print(f"New best match at {best_match_timestamp:.2f}s - Scene: {predicted_scene} (Similarity: {final_similarity:.4f})")

        current_frame_index += frame_skip
        processed_frames_count += 1
        
        if processed_frames_count % 10 == 0:
            print(f"Processed {processed_frames_count} frames. Current best similarity: {highest_similarity:.4f}")

    cap.release()
    
    print(f"Finished processing. Best match at {best_match_timestamp:.2f}s with similarity: {highest_similarity:.4f}")
    
    # Return both timestamp and similarity score
    return {
        "timestamp": best_match_timestamp,
        "similarity": highest_similarity
    }

def seconds_to_hms(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02}:{m:02}:{s:02}"

@app.route('/process_video', methods=['POST'])
def process_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    scene_description = request.form.get('sceneDescription', '')

    if video_file.filename == '':
        return jsonify({"error": "No selected video file"}), 400

    if not scene_description:
        return jsonify({"error": "No scene description provided"}), 400

    # Saving the uploaded video temporarily
    video_filename = video_file.filename
    video_path = os.path.join(UPLOAD_FOLDER, video_filename)
    video_file.save(video_path)
    print(f"Video saved to: {video_path}")

    try:
        # Process text with to match image embeddings
        processed_text_info = process_text_with_clip(scene_description)
        if processed_text_info is None:
            return jsonify({"error": "Text processing failed."}), 500

        # Finding matching frame
        best_timestamp_info = find_matching_frame_with_ml(video_path, processed_text_info)
        if best_timestamp_info is None:
            return jsonify({"error": "Could not process video file."}), 500

        # Check if similarity is too low (scene not found)
        if best_timestamp_info["similarity"] < 0.2:
            return jsonify({
                "error": f"Scene not found. The scene '{scene_description}' was not detected in the video. Try describing the scene differently or check if the scene exists in the video.",
                "similarity": float(best_timestamp_info["similarity"])
            }), 404

        # Get video duration
        cap = cv2.VideoCapture(video_path)
        video_duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
        cap.release()
        start_sec = best_timestamp_info["timestamp"]
        end_sec = min(start_sec + 10, video_duration)  # 10 seconds scene or to end of video

        response_data = {
            "timestamp": seconds_to_hms(start_sec),
            "end_timestamp": seconds_to_hms(end_sec),
            "message": "Scene found!",
            "best_category": processed_text_info.get('best_category', ''),
            "category_score": float(processed_text_info.get('category_score', 0)),
            "similarity": float(best_timestamp_info["similarity"])
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

    finally:
        # Cleaning up
        if os.path.exists(video_path):
            os.remove(video_path)
            print(f"Removed temporary file: {video_path}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
