import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileVideo, 
  Search, 
  Settings,
  Globe,
  Shield,
  Zap,
  Clock,
  Mail,
  MessageSquare,
  CheckCircle
} from "lucide-react";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const faqs = [
    {
      question: "How do I upload a video?",
      answer: "Simply drag and drop your video file onto the upload area, or click to browse and select a file. We support MP4, AVI, MOV, MKV, WMV, and FLV formats up to 500MB.",
      icon: FileVideo,
      category: "upload"
    },
    {
      question: "What video formats are supported?",
      answer: "We support most popular video formats including MP4, AVI, MOV, MKV, WMV, and FLV. For best results, we recommend using MP4 format with H.264 encoding.",
      icon: FileVideo,
      category: "upload"
    },
    {
      question: "How accurate is the scene detection?",
      answer: "Our AI-powered scene detection is highly accurate, typically achieving 85-95% accuracy depending on video quality and scene complexity. The more descriptive you are, the better the results.",
      icon: Search,
      category: "ai"
    },
    {
      question: "Can I delete uploaded videos?",
      answer: "Yes, you can manage and delete videos in the 'Manage' section. You can select multiple videos and delete them in bulk, or delete individual videos as needed.",
      icon: Settings,
      category: "management"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption and security measures to protect your videos and data. Videos are automatically deleted after processing unless you choose to save them.",
      icon: Shield,
      category: "security"
    },
    {
      question: "How long does processing take?",
      answer: "Processing time depends on video length and complexity. Short videos (1-5 minutes) typically process in 30-60 seconds, while longer videos may take 2-5 minutes.",
      icon: Clock,
      category: "performance"
    },
    {
      question: "Can I access my videos from different devices?",
      answer: "Yes! Your video library is synced across all devices. Simply log in to your account from any device to access your uploaded videos and search results.",
      icon: Globe,
      category: "access"
    },
    {
      question: "What's the maximum video file size?",
      answer: "Currently, we support video files up to 500MB. For larger files, we recommend compressing the video or splitting it into smaller segments.",
      icon: FileVideo,
      category: "upload"
    },
    {
      question: "How do I get better search results?",
      answer: "Be as descriptive as possible when describing the scene. Include details about objects, actions, colors, lighting, people, and background elements. The more specific you are, the better the AI can find your scene.",
      icon: Search,
      category: "ai"
    },
    {
      question: "Is there a limit on the number of videos I can upload?",
      answer: "Free accounts can upload up to 10 videos per month. Premium accounts have unlimited uploads and additional features like batch processing and advanced analytics.",
      icon: Zap,
      category: "limits"
    },
    {
      question: "Can I export my search results?",
      answer: "Yes! You can export your search results as a CSV file or generate a detailed report with timestamps and scene descriptions for further analysis.",
      icon: Settings,
      category: "management"
    },
    {
      question: "What if the AI doesn't find my scene?",
      answer: "If the AI doesn't find your scene, try being more specific in your description or use different keywords. You can also try searching for broader terms and then narrow down the results.",
      icon: Search,
      category: "ai"
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "upload", name: "Upload & Files", icon: FileVideo },
    { id: "ai", name: "AI & Search", icon: Search },
    { id: "management", name: "Management", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "performance", name: "Performance", icon: Clock },
    { id: "access", name: "Access", icon: Globe },
    { id: "limits", name: "Limits", icon: Zap }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFaqs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container py-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="display-5 fw-bold mb-4">Frequently Asked Questions</h1>
        <p className="lead text-secondary fs-5">
          Find answers to common questions about our Video Scene Classification platform
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="me-2" size={16} />
                {category.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="row justify-content-center"
      >
        <div className="col-lg-8">
          {filteredFaqs.map((faq, index) => {
            const Icon = faq.icon;
            const isActive = activeIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -2 }}
                className="card border-0 shadow-sm mb-3"
              >
                <div
                  className="card-body p-4 cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-3 p-2 rounded-circle"
                        style={{ 
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <h5 className="card-title mb-0">{faq.question}</h5>
                    </div>
                    <div className="ms-3">
                      {isActive ? (
                        <ChevronUp size={20} className="text-primary" />
                      ) : (
                        <ChevronDown size={20} className="text-muted" />
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-3 border-top"
                      >
                        <p className="card-text text-secondary mb-0">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-8"
      >
        <div className="card border-0 shadow-lg bg-gradient"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
            color: 'var(--white)'
          }}
        >
          <div className="card-body p-6">
            <h3 className="mb-4">Still have questions?</h3>
            <p className="lead mb-4 opacity-90">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button className="btn btn-light btn-lg">
                <Mail className="me-2" size={20} />
                Contact Support
              </button>
              <button className="btn btn-outline-light btn-lg">
                <MessageSquare className="me-2" size={20} />
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-8"
      >
        <div className="card border-0 shadow-sm">
          <div className="card-body p-6">
            <h4 className="card-title mb-4">💡 Quick Tips</h4>
            <div className="row g-4">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1" size={16} />
                    <div>
                      <strong>Use descriptive language</strong>
                      <p className="text-muted small mb-0">The more specific you are, the better the results</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1" size={16} />
                    <div>
                      <strong>Include visual details</strong>
                      <p className="text-muted small mb-0">Mention colors, objects, and actions</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1" size={16} />
                    <div>
                      <strong>Try different keywords</strong>
                      <p className="text-muted small mb-0">If one search doesn't work, try synonyms</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1" size={16} />
                    <div>
                      <strong>Use MP4 format</strong>
                      <p className="text-muted small mb-0">For best compatibility and performance</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1" size={16} />
                    <div>
                      <strong>Keep files under 500MB</strong>
                      <p className="text-muted small mb-0">For faster processing and upload</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1" size={16} />
                    <div>
                      <strong>Organize your library</strong>
                      <p className="text-muted small mb-0">Use the manage section to keep things tidy</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FAQ;