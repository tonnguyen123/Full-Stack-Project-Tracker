import { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import '../styles/Createproject.css';

export const CreateProject = () => {
  const [showTable, setShow] = useState(false);
  const [taskRows, setTaskRows] = useState([
    { taskName: '', dueTime: '', description: '', priority: '', assignedTo: '' }
  ]);

  const UserID = localStorage.getItem('userid');
  console.log(UserID);
  const[ProjectName,setName] = useState('');

  const[ProjectDue,setProjectDue] = useState('');

  const [saveTexts, setSaveTexts] = useState<string[]>(['Save']);



  const[ProjDescription,setDescription] = useState('');

  const [saveText,setSave] = useState('Save');

  const [showProject, setShowProject] =  useState(true);

  const [TaskName, setTaskName] = useState('');
  const [TaskDescription, setTaskDescription] = useState('');
  const [AssignedTo, setAssigned] = useState<number>(0);
  const [TaskDue, setTaskDue] = useState('');
  const [TaskPriority, setaskPriority] = useState('');


  const [currProjectName, setCurrProjectName] = useState('');
  const [currUserID, setcurrUserID] = useState('');

  const saveTask = async() =>{
    if(!TaskName || !TaskDescription || !AssignedTo || !TaskDue || !TaskPriority){
      alert("Please fill all information to add the task");
    }
    else{
      const projectID = await getProjectID(currProjectName,currUserID);
      const newTask = {
        Name: TaskName,
        Description: TaskDescription,
        Due: TaskDue,
        Priority: TaskPriority,
        AssignedId: AssignedTo,
        ProjectId: projectID
      }

      

      try {
        const response = await fetch('https://full-stack-project-tracker.onrender.com/api/CreateTask',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask)
        });
        const result = await response.json();
        if(response.ok){
          alert(result.message);
        }
        else{
          alert(result.message);
        }
        
      } catch (error) {
        alert("Error creating the task");
      }
    }
  }


  const getProjectID = async(projectName:string, userID:string)=>{
    const CurrentProject = {
      UserID: userID.toString(),
      ProjectName: projectName
    }
    let currentProjectID = '';
    console.log("THis is" + JSON.stringify(CurrentProject));


    try {
      const response = await fetch('https://full-stack-project-tracker.onrender.com/api/ProjectId', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CurrentProject)
      });
      
      const result = await response.json();
      if (!response.ok) {
        console.error('Error response:', result);
        alert(result.message || 'Unknown error');
      } else {
        console.log('Project ID:', result.projectid);
        currentProjectID = result.projectid;
      }
    } catch (error) {
      alert("There is getting project's ID.")
    }
    return currentProjectID;

  }

  const handleButton = async(type: string, index:number) => {

    if (type === 'create-table' ) {
      if(!ProjectName || !ProjDescription || !ProjectDue){
          alert("Please fill all the fields below.");
          setShowProject(true);
      }
      else{
        

        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 19);
        
        const Project = {
          Name: ProjectName,
          Description: ProjDescription,
          UserId: UserID,
          DueTime: ProjectDue,
          CreatedAt: localISOTime,
          SharedUsers: [],
          Tasks:[]
        }
        

          try {
            const response = await fetch('https://full-stack-project-tracker.onrender.com/api/CreateProject',{
              method: 'POST',
              headers:{
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(Project)
            });
            const result = await response.json();
            if(response.ok){
              alert(`Project ${ProjectName} is created. You can add tasks of this project below` );
              if(ProjectName){
                setTaskRows([...taskRows, { taskName: '', dueTime: '', description: '', priority: '', assignedTo: '' }]);
                setSaveTexts([...saveTexts, 'Save']);
                
              }
                setShow(true);
                setSave('Save');
                setShowProject(false);
                console.log(result.userID);
                console.log(result.projectName);
                setCurrProjectName(result.projectName);
                setcurrUserID(result.userID);
            }
            else{
              alert(result.message);
            }
          } catch (error) {
            alert("There is some error creating project.")
          }
      }

      
    }
    else if(type === 'add'){
      setTaskRows([
        ...taskRows,
        { taskName: '', dueTime: '', description: '', priority: '', assignedTo: '' }
      ]);
    }

    else if(type=== 'save'){
      saveTask();
      const updatedSaveTexts = [...saveTexts];
      updatedSaveTexts[index] = 'Saved';
      setSaveTexts(updatedSaveTexts);
    }

    else if(type === 'delete'){
      const updatedRows = [...taskRows];
    if(index !== 0){
      updatedRows.splice(index,1);
    setTaskRows(updatedRows);
    }
    else if(index === 0){
      if(window.confirm("Would you like to delete this Project " + ProjectName + "?")){
        try {
          const response = await fetch(`https://full-stack-project-tracker.onrender.com/api/projects/delete/${UserID}/${ProjectName}`,{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
            }
          });
          const result = await response.json();
          if(response.ok){
            alert('Deleted ' + ProjectName + ' successfully!');
            
            
    
          }
        } catch (error) {
          alert("Error deletion of project.");
        }
  
        updatedRows.splice(index,1);
        setTaskRows(updatedRows);
        setShow(false);
        setShowProject(true);
        setName('');
        setDescription('');
      }
     
    }
    }
  };


  


  return (
    <div>
      <NavigationBar />
      {
        showProject && (
          <div className='create-project'>
      <h3 style={{color:'black'}}>Fill the information to create new Project Tracker</h3>
      <div>
        <span style={{color:'black'}}>Enter the name of the project tracker: </span>
        <input className='projectName' placeholder='name of the project tracker' onChange={(e)=>setName(e.target.value)} style={{marginBottom:'10px'}}/>
        <div>
        <span style={{color:'black'}}>Description of this project:</span>
        </div>
        <textarea placeholder='Enter the description of the project' className='project-description' style={{marginBottom:'10px', marginTop:'10px'}}  onChange={(e)=>setDescription(e.target.value)}></textarea>
        <span style={{color:'black', marginRight:'10px'}}>Due time of this project:</span>
        <input className='projectdue' type='datetime-local' style={{ marginTop:'10px'}} onChange={(e)=>setProjectDue(e.target.value)}
         min={new Date().toISOString().slice(0, 16)}
        />
        
        <div>
          <button onClick={() => handleButton('create-table',0)} style={{marginTop:'10px'}}>Create new Project Tracker</button>
        </div>
      </div>

      </div>
          
        )
      }
      
     

      {(showTable) && (
        <div className='userTable'>
          {
        
              <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Due Time</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskRows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input className='task' placeholder='Enter task name' onChange={(e) => {
                    const updatedSaveTexts = [...saveTexts];
                    updatedSaveTexts[index] = 'Save';
                    setSaveTexts(updatedSaveTexts);
                    setTaskName(e.target.value);
                    }}
                    />
                  </td>
                  <td>
                    <input className='due' type='datetime-local' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setTaskDue(e.target.value);
                    }}
                    />
                  </td>
                  <td>
                    <input className='description' placeholder='Enter description' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setTaskDescription(e.target.value);
                    }}
                    />
                  </td>
                  <td>
                    <select className='priority' onChange={(e) => {
                        const updatedSaveTexts = [...saveTexts];
                        updatedSaveTexts[index] = 'Save';
                        setSaveTexts(updatedSaveTexts);
                        setaskPriority(e.target.value);
                      }}
                      >
                      <option value="">Select priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </td>
                  <td>
                    <input className='assigned' placeholder='Enter assigned' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setAssigned(parseInt(e.target.value));
                    }}
                    />
                  </td>
                  <td className='ActionButtons'>
                  <button onClick={() => handleButton('save', index)}>{saveTexts[index]}</button>

                    <button onClick={()=>handleButton('add',index)}>+</button>
                    <button onClick={()=>handleButton('delete',index)}>  <i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            
          }
          
        </div>
      )}
    </div>
  );
};
