import requests
import time
import webbrowser

def check_backend():
    try:
        response = requests.get("http://localhost:5000", timeout=5)
        return True
    except:
        return False

def check_frontend():
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        return True
    except:
        return False

def main():
    print("🔍 Checking server status...")
    print("=" * 50)
    
    # Check Backend
    print("Backend (Flask): ", end="")
    if check_backend():
        print("✅ Running on http://localhost:5000")
    else:
        print("❌ Not running")
    
    # Check Frontend
    print("Frontend (React): ", end="")
    if check_frontend():
        print("✅ Running on http://localhost:3000")
    else:
        print("❌ Not running")
    
    print("=" * 50)
    
    if check_backend() and check_frontend():
        print("🎉 Both servers are running!")
        print("Opening your application...")
        webbrowser.open("http://localhost:3000")
    else:
        print("⚠️  Some servers are not running.")
        print("Please check the terminal windows for any errors.")

if __name__ == "__main__":
    main() 