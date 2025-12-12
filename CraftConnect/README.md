# CraftConnect 🎨

**An AI-powered marketplace platform helping local artisans showcase and sell their handcrafted products online.**

CraftConnect bridges the gap between traditional craftspeople and the digital world. We use AI to make it super easy for artisans to create beautiful product listings, even if they're not tech-savvy!

---

## 🌟 What is CraftConnect?

Imagine you're a potter in a small village. You create amazing handcrafted pottery, but setting up an online store seems overwhelming. Taking professional photos, writing descriptions, figuring out pricing... it's a lot!

That's where CraftConnect comes in. Just snap a photo of your product with your phone, and our AI does the rest:
- 📸 Analyzes the image to understand what it is
- ✍️ Generates a compelling product story
- 💰 Suggests a fair price based on materials and labor
- 🎨 Extracts colors and materials automatically

No technical knowledge needed. Just you, your craft, and your phone.

---

## ✨ Features

### For Artisans
- **Smart Image Analysis**: Upload a photo, and AI identifies colors, materials, and suggests a title
- **AI Story Generation**: Creates engaging product descriptions that tell your craft's story
- **Pricing Helper**: Suggests fair prices based on materials cost and hours of work
- **Easy Product Management**: Add, edit, and manage your products from any device



### AI Features (100% Local & Free!)
- **Image Analysis**: Uses BLIP (a vision AI model) running on your own server
- **Story Generation**: Template-based storytelling with category-specific variations
- **Pricing Suggestions**: Formula-based calculations, no external APIs needed
- **No Monthly Costs**: Everything runs on your infrastructure, no vendor lock-in!

---

## 🛠️ Tech Stack

### Backend (Python)
- **FastAPI**: Modern, fast web framework for APIs
- **SQLite**: Lightweight database (easily upgradable to PostgreSQL)
- **BLIP Model**: Local AI for image analysis (runs on your server)
- **bcrypt**: Secure password hashing
- **JWT**: Token-based authentication

### Frontend (React/Next.js)
- **Next.js 13**: React framework with server-side rendering
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Modern, utility-first styling
- **Lucide Icons**: Beautiful, consistent icons

---

## 🚀 Quick Start Guide



### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CraftConnect.git
cd CraftConnect
```

#### 2. Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment (recommended)
python -m venv myvenv

# Activate it
# On Windows:
myvenv\Scripts\activate
# On Mac/Linux:
source myvenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at `http://localhost:8000` 🎉

**Important**: The first time you upload an image, the BLIP AI model will download (~500MB). This is a one-time thing and happens automatically!

#### 3. Set Up the Frontend

Open a new terminal (keep the backend running):

```bash
# Navigate to frontend folder
cd frontend/public

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at `http://localhost:3000` 🎉

#### 4. Test It Out!

1. Open your browser to `http://localhost:3000`
2. Create an account
3. Upload a product image
4. Watch the AI analyze it!
5. Use the Story and Pricing buttons to see AI in action

---
