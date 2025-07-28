// HomePage.js - Landing page with showcases
import React from 'react';
import Card from '../components/common/Card';
import logo from '../assets/logo.svg';

const featuredProjects = [
  {
    title: 'Shea Butter Queens',
    description: 'Empowering rural women in Ghana through shea butter production.',
    image: './images/shea-butter-queens.jpg', // Local image path
    category: 'Beauty & Personal Care',
  },
  {
    title: 'Nairobi Textiles',
    description: 'Sustainable textile manufacturing by women in Kenya.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=480&q=90',
    category: 'Textiles & Fabrics',
  },
  {
    title: 'AgroSisters',
    description: 'Women-led organic farming collective in Nigeria.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=480&q=90',
    category: 'Agriculture & Farming',
  },
];

const HomePage = () => (
  <div className="home-page">
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Empowering African Women Entrepreneurs</h1>
        <p className="hero-tagline">Connect, showcase, and grow your business with WomenConnect Hub.</p>
      </div>
      <img src={logo} alt="WomenConnect Hub Logo" className="hero-image" />
    </section>
    <section>
      <h2 className="section-title">Featured Projects</h2>
      <div className="project-grid">
        {featuredProjects.map((project, idx) => (
          <Card key={idx} className="project-card" variant="elevated">
            <img src={project.image} alt={project.title} className="project-image" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: '14px 14px 0 0' }} />
            <div className="project-info" style={{ padding: '1.2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#222' }}>{project.title}</h3>
              <p style={{ color: '#444', marginBottom: 12 }}>{project.description}</p>
              <span className="project-category-badge">{project.category}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default HomePage;
