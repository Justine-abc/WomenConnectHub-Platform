// ProjectsPage.js - Browse all projects
import React from 'react';
import Card from '../components/common/Card';

const sampleProjects = [
  {
    title: 'Shea Butter Queens',
    description: 'Empowering rural women in Ghana through shea butter production.',
    image: 'https://images.unsplash.com/photo-1519121784085-9a2a9070b3a6?auto=format&fit=crop&w=480&q=90', // Women processing shea butter
    category: 'Beauty & Personal Care',
  },
  {
    title: 'Nairobi Textiles',
    description: 'Sustainable textile manufacturing by women in Kenya.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=480&q=90', // Textile/fabric
    category: 'Textiles & Fabrics',
  },
  {
    title: 'AgroSisters',
    description: 'Women-led organic farming collective in Nigeria.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=480&q=90', // Agriculture/farming
    category: 'Agriculture & Farming',
  },
];

const ProjectsPage = () => (
  <div className="projects-page">
    <h1>Browse Projects</h1>
    <p>Explore all projects submitted by entrepreneurs.</p>
    <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginTop: '2.5rem' }}>
      {sampleProjects.map((project, idx) => (
        <Card key={idx} className="project-card" variant="elevated" style={{ transition: 'box-shadow 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <img 
            src={project.image} 
            alt={project.title} 
            className="project-image" 
            style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: '14px 14px 0 0', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} 
            loading="lazy"
          />
          <div className="project-info" style={{ padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#222' }}>{project.title}</h3>
            <p style={{ color: '#444', marginBottom: 12 }}>{project.description}</p>
            <span className="project-category-badge" style={{ display: 'inline-block', background: '#e3f2fd', color: '#1976d2', fontWeight: 600, fontSize: '0.97rem', borderRadius: 6, padding: '4px 12px' }}>{project.category}</span>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default ProjectsPage;
