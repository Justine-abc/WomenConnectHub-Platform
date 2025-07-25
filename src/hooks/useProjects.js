// useProjects.js - Project management
import { useState } from 'react';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const addProject = (project) => setProjects([...projects, project]);
  return { projects, addProject };
};

export default useProjects;
