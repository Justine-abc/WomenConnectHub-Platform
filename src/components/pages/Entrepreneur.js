import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import ProjectCard from '../common/ProjectCard';
import axios from 'axios';

const Entrepreneur = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (isAuthenticated() && user) {
          const res = await axios.get(
            `/api/projects?entrepreneur_id=${user.id}`
          );
          setProjects(res.data.projects || []);
        }
      } catch (error) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [isAuthenticated, user]);

  if (!isAuthenticated()) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="mb-6">You must be signed in as an entrepreneur to view this page.</p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <Link
        to="/projects/new"
        className="inline-block mb-8 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-lg"
      >
        + Create New Project
      </Link>
      {loading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-600">You have not created any projects yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Entrepreneur;