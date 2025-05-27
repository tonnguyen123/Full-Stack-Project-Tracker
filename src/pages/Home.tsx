import { useEffect, useState } from "react";
import { Project } from "../types";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() =>{
    
    
  })

  

  return (
    <div>
      <h1>Project Tracker</h1>
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
