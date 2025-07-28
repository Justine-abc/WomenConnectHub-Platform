// ProjectsPage.js - Browse all projects
import React from 'react';
import Card from '../components/common/Card';

const sampleProjects = [
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

const ProjectsPage = () => (
  <div className="projects-page">
    <h1>Browse Projects</h1>
    <p>Explore all projects submitted by entrepreneurs.</p>
    <div className="project-grid">
      {sampleProjects.map((project, idx) => (
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
  </div>
);

export default ProjectsPage;
