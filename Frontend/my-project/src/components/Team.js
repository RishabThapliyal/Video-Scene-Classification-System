import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Users, 
  Code, 
  Brain, 
  MessageSquare, 
  Github, 
  Linkedin, 
  Mail,
  ExternalLink
} from "lucide-react";

function Team() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const teamMembers = [
    {
      id: 1,
      name: "Rishab Thapliyal",
      role: "Frontend Developer",
      description: "Expert in React, JavaScript, and modern UI/UX design. Passionate about creating intuitive and beautiful user experiences.",
      avatar: "👨‍💻",
      skills: ["React", "JavaScript", "TypeScript", "CSS3", "UI/UX"],
      experience: "3+ years",
      github: "https://github.com/rishabth",
      linkedin: "https://linkedin.com/in/rishabth",
      email: "rishab@example.com",
      color: "var(--primary-color)"
    },
    {
      id: 2,
      name: "Vimal Singh Panwar",
      role: "Backend Developer",
      description: "Specialist in Node.js, Express, and database design. Focuses on building scalable and robust server-side solutions.",
      avatar: "👨‍🔧",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Docker"],
      experience: "4+ years",
      github: "https://github.com/vimalsp",
      linkedin: "https://linkedin.com/in/vimalsp",
      email: "vimal@example.com",
      color: "var(--secondary-color)"
    },
    {
      id: 3,
      name: "Yugraj",
      role: "Data Scientist",
      description: "Experienced in AI, Machine Learning, and Data Analytics. Creates intelligent solutions for complex problems.",
      avatar: "🧠",
      skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas"],
      experience: "5+ years",
      github: "https://github.com/yugraj",
      linkedin: "https://linkedin.com/in/yugraj",
      email: "yugraj@example.com",
      color: "var(--accent-color)"
    },
    {
      id: 4,
      name: "Shubham Singh Karki",
      role: "NLP Engineer",
      description: "Natural language processing specialist. Develops advanced text analysis and language understanding systems.",
      avatar: "📝",
      skills: ["NLP", "BERT", "Transformers", "SpaCy", "NLTK"],
      experience: "3+ years",
      github: "https://github.com/shubhamkarki",
      linkedin: "https://linkedin.com/in/shubhamkarki",
      email: "shubham@example.com",
      color: "var(--primary-dark)"
    }
  ];

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
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
        <h1 className="display-5 fw-bold mb-4">Meet Our Team</h1>
        <p className="lead text-secondary fs-5">
          The talented individuals behind the Video Scene Classification project
        </p>
      </motion.div>

      {/* Team Grid */}
      <div className="row g-4 justify-content-center">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="col-lg-3 col-md-6"
          >
            <div
              className="card border-0 shadow-lg h-100 cursor-pointer"
              onClick={() => handleMemberClick(member)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body p-6 text-center">
                {/* Avatar */}
                <div 
                  className="mb-4 p-4 rounded-circle mx-auto d-inline-block"
                  style={{ 
                    backgroundColor: `${member.color}20`,
                    color: member.color,
                    fontSize: '3rem',
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {member.avatar}
                </div>

                {/* Member Info */}
                <h4 className="card-title mb-2">{member.name}</h4>
                <p className="text-primary fw-medium mb-3">{member.role}</p>
                <p className="card-text text-dark-emphasis small mb-4">
                  {member.description.substring(0, 100)}...
                </p>

                {/* Skills */}
                <div className="mb-4">
                  {member.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="badge bg-light text-dark me-1 mb-1"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="badge bg-secondary" style={{ fontSize: '0.75rem' }}>
                      +{member.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Experience */}
                <div className="text-dark-emphasis small mb-3">
                  <Code className="me-1" size={14} />
                  {member.experience} experience
                </div>

                {/* Social Links */}
                <div className="d-flex justify-content-center gap-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="btn btn-sm btn-outline-success"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="row g-4 mt-8"
      >
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <Users className="text-primary mb-3" size={32} />
              <h3 className="mb-1">{teamMembers.length}</h3>
              <p className="text-muted mb-0">Team Members</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <Code className="text-success mb-3" size={32} />
              <h3 className="mb-1">15+</h3>
              <p className="text-muted mb-0">Technologies</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <Brain className="text-warning mb-3" size={32} />
              <h3 className="mb-1">15+</h3>
              <p className="text-muted mb-0">Years Combined</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <MessageSquare className="text-info mb-3" size={32} />
              <h3 className="mb-1">24/7</h3>
              <p className="text-muted mb-0">Support</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content border-0 shadow-lg"
              >
                <div className="modal-header border-0 pb-0">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body p-6">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div 
                        className="mb-4 p-4 rounded-circle mx-auto d-inline-block"
                        style={{ 
                          backgroundColor: `${selectedMember.color}20`,
                          color: selectedMember.color,
                          fontSize: '4rem',
                          width: '150px',
                          height: '150px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {selectedMember.avatar}
                      </div>
                      <h3 className="mb-2">{selectedMember.name}</h3>
                      <p className="text-primary fw-medium mb-3">{selectedMember.role}</p>
                      <p className="text-dark-emphasis small mb-4">
                        <Code className="me-1" size={14} />
                        {selectedMember.experience} experience
                      </p>
                    </div>
                    <div className="col-md-8">
                      <h5 className="mb-3">About</h5>
                      <p className="text-dark-emphasis mb-4">{selectedMember.description}</p>
                      
                      <h5 className="mb-3">Skills & Technologies</h5>
                      <div className="mb-4">
                        {selectedMember.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark me-2 mb-2"
                            style={{ fontSize: '0.875rem' }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <h5 className="mb-3">Connect</h5>
                      <div className="d-flex gap-3">
                        <a
                          href={selectedMember.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-dark"
                        >
                          <Github className="me-2" size={16} />
                          GitHub
                          <ExternalLink className="ms-2" size={14} />
                        </a>
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                        >
                          <Linkedin className="me-2" size={16} />
                          LinkedIn
                          <ExternalLink className="ms-2" size={14} />
                        </a>
                        <a
                          href={`mailto:${selectedMember.email}`}
                          className="btn btn-outline-success"
                        >
                          <Mail className="me-2" size={16} />
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Team;