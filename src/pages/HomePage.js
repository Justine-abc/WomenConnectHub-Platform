// HomePage.js - Landing page with showcases
import React from 'react';
import Card from '../components/common/Card';
import logo from '../assets/logo.svg';
import '../styles/globals.css';

const featuredProjects = [
  {
    title: 'Shea Butter Queens',
    description: 'Empowering rural women in Ghana through shea butter production.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    category: 'Beauty & Personal Care',
  },
  {
    title: 'Nairobi Textiles',
    description: 'Sustainable textile manufacturing by women in Kenya.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    category: 'Textiles & Fabrics',
  },
  {
    title: 'AgroSisters',
    description: 'Women-led organic farming collective in Nigeria.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    category: 'Agriculture & Farming',
  },
];

const HomePage = () => (
  <div className="home-page">
    <section className="hero">
      <img src={logo} alt="WomenConnect Hub Logo" className="hero-logo" style={{ width: 120, height: 40, marginBottom: 16 }} />
      <h1>Welcome to WomenConnect Hub</h1>
      <p className="hero-tagline">Empowering African Women Entrepreneurs</p>
    </section>
    <section className="featured-projects">
      <h2>Featured Projects</h2>
      <div className="project-grid">
        {featuredProjects.map((project, idx) => (
          <Card key={idx} className="project-card" variant="elevated">
            <img src={project.image} alt={project.title} className="project-image" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="project-category">{project.category}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default HomePage;
