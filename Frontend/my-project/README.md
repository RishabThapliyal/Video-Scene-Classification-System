# Video Scene Classification - Modern Frontend

A modern, responsive web application for AI-powered video scene classification with an enhanced user interface and improved user experience.

## 🚀 Features

### ✨ Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Animations**: Smooth transitions and micro-interactions using Framer Motion
- **Professional Design System**: Consistent colors, typography, and spacing
- **Interactive Components**: Hover effects, loading states, and feedback

### 🎯 Core Functionality
- **Drag & Drop Upload**: Modern file upload with drag and drop support
- **AI Scene Detection**: Advanced scene classification using CLIP and NLP models
- **Video Player**: Integrated video player with timestamp seeking
- **Video Management**: Organize, search, and manage your video library
- **Real-time Processing**: Progress indicators and status updates

### 🔧 Technical Improvements
- **Modern React**: Updated to React 18 with latest patterns
- **Type Safety**: Better error handling and validation
- **Performance**: Optimized rendering and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation
- **Mobile-First**: Responsive design with touch-friendly interactions

## 🛠️ Tech Stack

### Frontend
- **React 18**: Latest React with hooks and modern patterns
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icons
- **React Dropzone**: Modern file upload with drag & drop
- **React Player**: Advanced video player component
- **React Hot Toast**: Elegant notifications
- **Bootstrap 5**: Responsive CSS framework
- **Custom CSS**: Modern design system with CSS variables

### Backend Integration
- **Flask API**: Python backend with AI models
- **CLIP Model**: OpenAI's CLIP for image-text understanding
- **Sentence Transformers**: Advanced NLP for text processing
- **OpenCV**: Video processing and frame extraction

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Video Scene Classification Project"
   ```

2. **Install frontend dependencies**
   ```bash
   cd Frontend/my-project
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../../Backend
   pip install -r requirements.txt
   ```

## 🚀 Running the Application

### Start the Backend Server
```bash
cd Backend
python app.py
```
The backend will run on `http://127.0.0.1:5000`

### Start the Frontend Development Server
```bash
cd Frontend/my-project
npm start
```
The frontend will run on `http://localhost:3000`

## 📱 Pages & Features

### 🏠 Home Page
- **Hero Section**: Compelling introduction with call-to-action
- **Feature Showcase**: Interactive feature cards with animations
- **Statistics**: Animated counters showing platform usage
- **Testimonials**: User reviews with ratings
- **Benefits**: Clear value propositions

### 🔍 Search Scene Page
- **Drag & Drop Upload**: Modern file upload interface
- **Video Preview**: Integrated video player
- **Scene Description**: Rich text input with suggestions
- **Progress Tracking**: Real-time processing indicators
- **Results Display**: Timestamp results with seek functionality
- **Tips Section**: Helpful guidance for better results

### 📁 Manage Page
- **Video Library**: Grid view of uploaded videos
- **Search & Filter**: Advanced filtering by type and search terms
- **Bulk Operations**: Select multiple videos for deletion
- **Video Details**: File size, duration, scenes, and metadata
- **Quick Actions**: View, download, and delete options

### 👥 Team Page
- **Team Profiles**: Detailed member information
- **Skills Display**: Technology expertise and experience
- **Social Links**: GitHub, LinkedIn, and email contacts
- **Interactive Cards**: Hover effects and modal details
- **Statistics**: Team metrics and achievements

### ❓ FAQ Page
- **Categorized Questions**: Organized by topic
- **Interactive Accordion**: Smooth expand/collapse animations
- **Search & Filter**: Find specific questions quickly
- **Contact Section**: Support options and live chat
- **Quick Tips**: Helpful guidance for users

## 🎨 Design System

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#10b981` (Emerald)
- **Accent**: `#f59e0b` (Amber)
- **Neutral**: Gray scale from 50-900

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Scale**: Responsive font sizes from xs to 5xl
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Spacing
- **Consistent Scale**: 0.25rem to 5rem
- **Responsive**: Adapts to screen size
- **Component-Specific**: Tailored spacing for different elements

### Animations
- **Page Transitions**: Smooth route changes
- **Scroll Animations**: Intersection observer-based reveals
- **Hover Effects**: Subtle interactions
- **Loading States**: Progress indicators and spinners

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://127.0.0.1:5000
REACT_APP_MAX_FILE_SIZE=524288000
REACT_APP_SUPPORTED_FORMATS=mp4,avi,mov,mkv,wmv,flv
```

### Customization
- **Colors**: Modify CSS variables in `src/App.css`
- **Animations**: Adjust timing in component files
- **API Endpoints**: Update fetch URLs in components
- **File Limits**: Change validation in upload components

## 📊 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Compressed assets and lazy loading
- **Bundle Analysis**: Optimized package sizes
- **Caching**: Efficient caching strategies

## 🔒 Security Features

- **File Validation**: Type and size checking
- **XSS Protection**: Sanitized inputs
- **CORS Configuration**: Proper cross-origin settings
- **Error Boundaries**: Graceful error handling
- **Input Sanitization**: Clean user inputs

## 📱 Mobile Responsiveness

- **Touch-Friendly**: Large touch targets
- **Gesture Support**: Swipe and pinch gestures
- **Adaptive Layout**: Flexible grid systems
- **Performance**: Optimized for mobile devices
- **Offline Support**: Service worker for caching

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Analyze bundle size
npm run build -- --analyze

# Deploy to static hosting
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI CLIP**: For advanced image-text understanding
- **Framer Motion**: For smooth animations
- **Lucide**: For beautiful icons
- **Bootstrap**: For responsive design foundation
- **React Community**: For excellent documentation and tools

## 📞 Support

- **Documentation**: Check the FAQ page
- **Issues**: Report bugs on GitHub
- **Contact**: Reach out to the team page
- **Community**: Join our Discord server

---

**Built with ❤️ using modern web technologies**
