import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Upload, 
  Search, 
  Settings, 
  BarChart3, 
  Globe, 
  Play,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Video,
  Brain,
  Shield,
  Rocket
} from "lucide-react";

function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [stats, setStats] = useState({ videos: 0, scenes: 0, users: 0 });
  const [isHovered, setIsHovered] = useState(null);

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const features = [
    {
      icon: Upload,
      title: "Smart Video Upload",
      description: "Drag and drop your videos for instant processing with our advanced AI algorithms.",
      color: "var(--primary-color)",
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)"
    },
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning models that understand context and content automatically.",
      color: "var(--secondary-color)",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      icon: Search,
      title: "Intelligent Scene Search",
      description: "Find any scene in your video with natural language descriptions.",
      color: "var(--accent-color)",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      icon: Settings,
      title: "Advanced Management",
      description: "Organize, categorize, and manage your video library with powerful tools.",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get insights into your video content with comprehensive analytics and reports.",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
    },
    {
      icon: Globe,
      title: "Multi-Platform Access",
      description: "Access your videos from any device, anywhere with cloud synchronization.",
      color: "#84cc16",
      gradient: "linear-gradient(135deg, #84cc16, #65a30d)"
    }
  ];

  const testimonials = [
    {
      quote: "This app has revolutionized how I manage my video content! The scene detection is incredibly accurate.",
      author: "John Smith",
      role: "Content Creator",
      avatar: "👨‍💼",
      rating: 5,
      company: "TechVideos Inc."
    },
    {
      quote: "The AI-powered search feature saves me hours of manual work. It's like having a personal video assistant.",
      author: "Sarah Johnson",
      role: "Video Editor",
      avatar: "👩‍🎬",
      rating: 5,
      company: "Creative Studios"
    },
    {
      quote: "I love the intuitive interface and powerful features. It's made my workflow so much more efficient.",
      author: "Michael Chen",
      role: "Digital Marketer",
      avatar: "👨‍💻",
      rating: 5,
      company: "Marketing Pro"
    }
  ];

  const benefits = [
    {
      text: "Save hours of manual video editing",
      icon: Clock,
      color: "var(--primary-color)"
    },
    {
      text: "Find specific scenes instantly",
      icon: Search,
      color: "var(--secondary-color)"
    },
    {
      text: "Organize content automatically",
      icon: Settings,
      color: "var(--accent-color)"
    },
    {
      text: "Access from any device",
      icon: Globe,
      color: "#8b5cf6"
    },
    {
      text: "Advanced AI technology",
      icon: Brain,
      color: "#06b6d4"
    },
    {
      text: "User-friendly interface",
      icon: Shield,
      color: "#84cc16"
    }
  ];

  // Animate stats
  useEffect(() => {
    if (statsInView) {
      const targetStats = { videos: 15000, scenes: 45000, users: 2500 };
      const duration = 2000;
      const steps = 60;
      const increment = {
        videos: targetStats.videos / steps,
        scenes: targetStats.scenes / steps,
        users: targetStats.users / steps
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setStats({
          videos: Math.floor(increment.videos * currentStep),
          scenes: Math.floor(increment.scenes * currentStep),
          users: Math.floor(increment.users * currentStep)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [statsInView]);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="container">
      {/* Hero Section */}
      <section ref={heroRef} className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={heroInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="text-primary mx-auto mb-4" size={80} />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="display-4 fw-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transform Your Video Management
          </motion.h1>
          
          <motion.p 
            className="lead text-secondary mb-6 fs-5"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Upload videos, discover scenes, and organize your content with the power of AI. 
            Experience the future of video classification.
          </motion.p>

          <motion.div 
            className="d-flex flex-column flex-md-row gap-3 justify-content-center"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/upload" className="btn btn-primary btn-lg">
                <Play className="me-2" size={20} />
                Start Searching
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="btn btn-outline btn-lg">
                <ArrowRight className="me-2" size={20} />
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="row g-4 mt-8"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="col-md-4 col-sm-6"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div 
                  className="card h-100 border-0 shadow-sm"
                  whileHover={{ 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div className="card-body text-center p-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="mb-3" size={32} style={{ color: benefit.color }} />
                    </motion.div>
                    <p className="card-text fw-medium">{benefit.text}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-8 bg-light rounded-4 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h2 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Trusted by Thousands
          </motion.h2>
          <div className="row g-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-md-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <motion.div 
                  className="display-4 fw-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                >
                  {stats.videos.toLocaleString()}+
                </motion.div>
                <p className="text-secondary">Videos Processed</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-md-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <motion.div 
                  className="display-4 fw-bold text-secondary mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                >
                  {stats.scenes.toLocaleString()}+
                </motion.div>
                <p className="text-secondary">Scenes Detected</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-md-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <motion.div 
                  className="display-4 fw-bold text-accent mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                >
                  {stats.users.toLocaleString()}+
                </motion.div>
                <p className="text-secondary">Happy Users</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="mb-4">Powerful Features</h2>
          <p className="lead text-secondary">
            Everything you need to manage and organize your video content effectively
          </p>
        </motion.div>

        <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = currentFeature === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                onHoverStart={() => setIsHovered(index)}
                onHoverEnd={() => setIsHovered(null)}
                className="card h-100 border-0 shadow-sm position-relative overflow-hidden"
              >
                <motion.div 
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                  style={{ 
                    background: feature.gradient,
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div className="card-body p-6 position-relative">
                  <motion.div 
                    className="mb-4 p-3 rounded-circle d-inline-block"
                    style={{ 
                      backgroundColor: `${feature.color}20`,
                      color: feature.color
                    }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon size={32} />
                  </motion.div>
                  <h4 className="card-title mb-3">{feature.title}</h4>
                  <p className="card-text text-secondary">{feature.description}</p>
                  
                  {/* Animated border effect */}
                  <motion.div
                    className="position-absolute bottom-0 left-0 h-1"
                    style={{ 
                      background: feature.gradient,
                      width: isHovered === index ? "100%" : "0%"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="mb-4">What Our Users Say</h2>
          <p className="lead text-secondary">
            Join thousands of satisfied users who have transformed their video workflow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 grid-cols-md-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card h-100 border-0 shadow-sm"
            >
              <div className="card-body p-6">
                <div className="d-flex align-items-center mb-4">
                  <motion.div 
                    className="fs-1 me-3"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <h5 className="mb-1">{testimonial.author}</h5>
                    <p className="text-muted mb-0 small">{testimonial.role}</p>
                    <p className="text-muted mb-0 small">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={testimonialsInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                    >
                      <Star className="text-warning" size={16} fill="currentColor" />
                    </motion.span>
                  ))}
                </div>
                
                <blockquote className="mb-0">
                  <p className="text-secondary fst-italic">"{testimonial.quote}"</p>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="card border-0 shadow-lg" style={{ background: "linear-gradient(135deg, var(--primary-color), var(--primary-dark))" }}>
          <div className="card-body p-8 text-white">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Rocket className="mx-auto mb-4" size={60} />
            </motion.div>
            <h2 className="mb-4">Ready to Transform Your Video Workflow?</h2>
            <p className="lead mb-6">Join thousands of users who are already saving time and improving their video content management.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/upload" className="btn btn-light btn-lg">
                <Video className="me-2" size={20} />
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;