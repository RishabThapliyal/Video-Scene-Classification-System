import cv2
import torch
import clip
from PIL import Image
import numpy as np
from matplotlib import pyplot as plt # Import matplotlib.pyplot as plt

def extract_frames(video_path, output_folder, fps=1):
    video = cv2.VideoCapture(video_path)
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    video_fps = video.get(cv2.CAP_PROP_FPS)

    # Calculate interval to get 1 frame per second
    interval = int(video_fps)

    count = 0
    frame_id = 0

    while count < frame_count:
        success, frame = video.read()
        if not success:
            break

        if count % interval == 0:
            cv2.imwrite(f"{output_folder}/frame_{frame_id}.jpg", frame)
            frame_id += 1

        count += 1

    video.release()
    return frame_id



#upload
# from google.colab import files
# uploaded = files.upload()  # Upload a video file (e.g., "test.mp4")
# video_path = next(iter(uploaded))  # Get the uploaded filename

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)





# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Define scene categories (customize as needed)
scene_categories = [
    "a beach", "a city street", "a forest", "a mountain",
    "an office", "a restaurant", "a living room", "a highway",
    "a park", "a desert", "a snowy landscape", "a classroom","a road between forest",
    "a ocean","a dolphin"
]

# Open video
cap = cv2.VideoCapture(video_path)

# Get video FPS and calculate frame skip
fps = cap.get(cv2.CAP_PROP_FPS)
frame_skip = int(fps)  # Process 1 frame per second (every `fps`-th frame)
print(f"Video FPS: {fps}, Processing 1 frame per second (every {frame_skip} frames)")

frame_count = 0
processed_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break  # End of video

    # Only process every `frame_skip`-th frame (1 FPS)
    if frame_count % frame_skip == 0:
        # Convert BGR (OpenCV) to RGB (PIL)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb_frame)

        # Preprocess image for CLIP
        image_input = preprocess(pil_image).unsqueeze(0).to(device)
        text_inputs = torch.cat([clip.tokenize(f"a photo of {scene}") for scene in scene_categories]).to(device)

        # Get predictions
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            text_features = model.encode_text(text_inputs)
            similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            values, indices = similarity[0].topk(1)

        # Print results
        predicted_scene = scene_categories[indices[0]]
        confidence = values[0].item()
        print(f"Time: {frame_count // fps}s | Scene: {predicted_scene} (Confidence: {confidence:.2f})")

        # Display frame (optional)
        plt.imshow(rgb_frame)
        plt.title(f"Time: {frame_count//fps}s | Scene: {predicted_scene} ({confidence:.2f})")
        plt.axis('off')
        plt.show()

        processed_count += 1

    frame_count += 1

cap.release()
print(f"Total frames processed: {processed_count} (out of {frame_count})")
