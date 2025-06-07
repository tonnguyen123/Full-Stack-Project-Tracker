import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/Projects.css";
import { useNavigate} from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { Project } from '../types';
import ProjectCompletionChart from './ProjectCompletionChart';

export const Projects = () => {
  
  const UserID = localStorage.getItem('userid');
  console.log("User's id is " + UserID);
  const [UsersProjects, setProjects] = useState<Project[]>([]);
  const [SharedProjects, setSharedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();



   useEffect (() =>{
    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login');
    }
    else{
      fetchProjects();
      fetchSharedProjects();
      console.log(UsersProjects);
    }
  }, [UserID]);

  const fetchProjects = async() =>{
    //setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5041/api/projects/${UserID}`,{
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if(response.ok){
        console.log(result.projects);
        
        setProjects(result.projects);
        setLoading(false);
        

      }
    } catch (error) {
      alert("Error fetching projects.");
    }

  };


  const fetchSharedProjects = async() =>{
    //setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5041/api/projects/shared-projects/${UserID}`,{
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if(response.ok){
        console.log(result);
        
        setSharedProjects(result.projects);
        setLoading(false);
        

      }
    } catch (error) {
      alert("Error fetching projects.");
    }

  };

  const viewSharedProject = (ProjectOwner:number, projectName:string) => {
    localStorage.setItem("currentProjectOwner", ProjectOwner.toString());
    localStorage.setItem("currentSharedProject",projectName);
    navigate(`/shared-project/${projectName}`);
  }


  const deleteProject = async(name:string)=>{

    if(window.confirm("Do you want to delete project " + name)){
      try {
        const response = await fetch(`http://localhost:5041/api/projects/delete/${UserID}/${name}`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          }
        });
        const result = await response.json();
        if(response.ok){
         fetchProjects();
         setProjects((prevProjects) => prevProjects.filter((project) => project.name !== name))
          console.log(result.message);
          
          
  
        }
      } catch (error) {
        alert("Error deletion of project.");
      }

    }
    
    


  };



  

  return (
    <div>
      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}
            
      <NavigationBar/>
      <div className='ProjectsSection'>
      <h3>Your Projects</h3>
      {UsersProjects.length === 0 &&(
        <span>There is no project tracker created yet. Please click 'Create' button above to create one.</span>
      )}
        {
          UsersProjects &&(
            <div className='scrollWrapper'>
              <div className='ProjectsButtons'>
                {UsersProjects.map((project, index) => (
                  <div className='eachProject' key={index}>
                    <h3>{project.name}</h3>
                    <span>Created at: {new Date(project.createdAt).toLocaleString()}</span>
                    <span>Due time: {new Date(project.dueTime).toLocaleString()}</span>
                    <ProjectCompletionChart completion={project.percentage} />
                    <div>
                      <button onClick={() => navigate(`/project/${project.name}`)}>
                        View Project
                      </button>
                      <button style={{marginLeft:'10px', marginTop:'5px'}}  onClick={()=>deleteProject(project.name)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          )
        }
      <h3>Your Shared Projects</h3>
      {
        SharedProjects.length === 0 && (
          <span>There is no project shared with you.</span>
        ) 
      }
      {
        SharedProjects && (
          <div className='scrollWrapper'>
              <div className='ProjectsButtons'>
                {SharedProjects.map((project, index) => (
                  <div className='eachProject' key={index}>
                    <h3>{project.name}</h3>
                    <span>Created at: {new Date(project.createdAt).toLocaleString()}</span>
                    <span>Due time: {new Date(project.dueTime).toLocaleString()}</span>
                    <ProjectCompletionChart completion={72} />
                    <div>
                      <button onClick={() => viewSharedProject(project.userId, project.name)}>
                        View Project
                      </button>
                      <button style={{marginLeft:'10px', marginTop:'5px'}}  onClick={()=>deleteProject(project.name)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>


        )
      }
      

     
      
      
      </div>
      
    </div>
  );
};
