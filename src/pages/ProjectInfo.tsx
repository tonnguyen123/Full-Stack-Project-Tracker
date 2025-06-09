import { useEffect, useState } from 'react'
import { NavigationBar } from './NavigationBar'
import { useParams } from 'react-router-dom'
import { Project, Task, TaskProgress } from '../types';
import '../styles/Projectinfo.css';
import ProgressChart from './TaskProgress';

export const ProjectInfo = () => {


  const projectName = useParams().projectname;
  const currentUser = localStorage.getItem('userid');
  const [currentProject, setCurrProject] = useState<Project>();
  const [ProjectId, setProjectId] = useState(0);
  const [TaskArray, setTaskArry] = useState<Task[]>([]);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedDue, setUpdatedDue] = useState('');

  const baseUrl = import.meta.env.VITE_SERVER_URL;

 


  const [userNameToAdd, setUserNameToAdd] = useState('');

  const [teamData, setTeamData] = useState<{ teamID?: number; members?: any[]; teamName?: string }>({});


  const [tasks,setTasks] = useState<TaskProgress[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('teamData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeamData(parsed);
      } catch (e) {
        console.error('Error parsing teamData from localStorage');
      }
    }
  }, []);
  

  const [editingField, setEditingField] = useState<string | null>(null);

  



  console.log(projectName);
  console.log("myself " +currentUser);
  console.log(typeof currentUser);


  const PutDataToChart = (taskData: Task[]) => {
    const newData = taskData.map(item => ({
      taskName: item.name,
      progress: item.percentage,
      expectation: 100
    }));
    setTasks(newData); // Replace instead of appending
  };
  

  const fetchProject = async() =>{
    const CurrentProject = {
      UserID: currentUser,
      ProjectName: projectName
    }
    try {
      const response = await fetch(`${baseUrl}/api/ProjectId/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CurrentProject)
      });
      
      const result = await response.json();
      if (!response.ok) {
        console.error('Error response:', result);
        console.error(result.message || 'Unknown error');
      } else {
        console.log(result.Name);
        console.log(result.id);
        console.log(typeof result.id );
        setCurrProject(result);
        setProjectId(result.id);
        
      }
    } catch (error) {
      console.error("There is error getting project's ID.");
    }
  }


  const CalculateProjectCompletion = (taskData: Task[]) => {
  const percentEachTask = 100 / taskData.length;
  const completedPercentage = taskData.reduce((total, task) => {
    return total + (task.percentage / 100) * percentEachTask;
  }, 0);

  console.log('Completed:', completedPercentage + '%');
  console.log(typeof completedPercentage);
  return completedPercentage;
};



  const updateProjectCompletion = async(completedPercent:number) =>{
    console.log("before sending: "+ Number(ProjectId));
    console.log("before sending: "+ completedPercent);
    console.log("before sending: "+ Number(currentUser));
    
    try {
      const Percentage = {
        ProjectID: Number(ProjectId),
        percentage: completedPercent,
  
        UserID: Number(currentUser)
      
      }
      const response = await fetch(`${baseUrl}/api/projects/update-percentage`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Percentage)
      });
      const result = await response.json();
      console.error(result.message);
    } catch (error) {
      console.error("Failed to update completion percentage of the project");
    }
  }
  


  const updateTask = async () => {
    if (editedTask.id === undefined || editedTask.id === null) {
      alert("No task selected to update.");
      return;
    }
    if(editedTask.status === "Pending"){
      editedTask.percentage = 0;
    }
    else if (editedTask.status === "Completed"){
      editedTask.percentage = 100;
    }

  
    const updated = {
      id: editedTask.id,
      name: editedTask.name,
      description: editedTask.description,
      due: editedTask.due,
      priority: editedTask.priority,
      status: editedTask.status,
      assignedId: editedTask.assignedId,
      percentage: editedTask.percentage,

      projectId: ProjectId
    };
  
    try {
      const response = await fetch(`${baseUrl}/api/CreateTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      
  
      const result = await response.json();
      if (response.ok) {
        alert("Task updated.");
        setEditingTaskId(null);
        sendNotification(Number(editedTask.assignedId));
       
        fetchTasks(); // Refresh task list
       
        
      } else {
        alert(result.message || "Update failed.");
      }
    } catch (error) {
      alert("Failed to update task.");
    }
  };


  const sendNotification = async (receiver:number) => {
        try {
          const Notification = {
            SenderId: currentUser,
            ReceiverId: receiver,
            IsRead: false,
            CreatedAt: new Date().toISOString(),
            Message: localStorage.getItem("yourUserName") + " assigned you a task.",
            NotificationLink: "http://localhost:5173/shared-project/" + projectName + "/view=true"
          };
      
          const response = await fetch(`${baseUrl}/api/messages/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Notification)
          });
      
          const result = await response.json();
          console.log(result.message);
          
      
        } catch (error) {
          console.error("Notification error:", error);
          alert("Error sending notification");
        }
      };
  


  const fetchTasks = async() =>{
   
    const CurrentProject = {
      UserID: ProjectId.toString(),
      ProjectName: projectName
    }
    try {
      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CurrentProject)
      });
      
      const result = await response.json();
      if (!response.ok) {
        
        console.error(result.message || 'Unknown error');
      } else {
        
      
        setTaskArry(result);
        PutDataToChart(result);
        const data = CalculateProjectCompletion(result);
        console.log("data after update is " + data);
        
        updateProjectCompletion(Number(data));
        
        
      }
    } catch (error) {
      alert("There is error getting tasks.")
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task }); // Pre-fill the inputs with current task values
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };
  

  const saveChange = async (type: string) => {
    const UpdatedProject = {
      UserID: currentUser ? parseInt(currentUser) : 0,
      ProjectName: projectName,
      UpdatedDescription: updatedDescription,
      UpdatedDue: updatedDue ? new Date(updatedDue) : undefined,
    };
  
    if (type === 'due' || type === 'description') {
      setEditingField(null);
    }
  
    try {
      const response = await fetch(`${baseUrl}/api/ProjectId/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(UpdatedProject),
      });
  
      const result = await response.json();
      if (response.ok) {
        fetchProject();
        alert(result.message);
      } else {
        alert(result.message || "Error saving changes");
      }
    } catch (error) {
      alert("There is error saving new info.");
    }
  };

  const addRow = () => {
    const newRow: Task = {
      id: 0,
      name: '',
      description: '',
      due: new Date(),
      status: 'pending',
      priority: '',
      assignedId: Number(currentUser),
      percentage: 0,
      projectId: currentUser? parseInt(currentUser):0
    };
    setTaskArry(prev => [...prev, newRow]);
    handleEditClick(newRow);
  };


  const deleteMemberFromTeam = async( userName:string, indexinArray: number) =>{
    if(window.confirm('Do you want to remove this member ' + userName + " from the team " + teamData.teamName + "?")){
      try {
        const TeamInfo = {
          Name:teamData.teamName,
          Members: [userName],
          ProjectIds: [ProjectId],
          OwnerId:currentUser
          
        }
        const response = await fetch(`${baseUrl}/api/CreateTeam/delete-member`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(TeamInfo)
        });
        const result = await response.json();
        if(response.ok){
          if(teamData.members !== undefined){
            const updatedMembers = teamData.members.filter((_,index) => index !==indexinArray);
            const updatedTeamData = {
              ...teamData,
              members: updatedMembers
            };
            setTeamData(updatedTeamData);
  
            localStorage.setItem('teamData', JSON.stringify(updatedTeamData));
          }
          
        }
        alert(result.message);
      } catch (error) {
        alert('unexpected error');
      }

    }
  }


  const deleteRow = async(index:number) => {
    setTaskArry(prev => prev.filter((_, i) => i !== index));
    if(index === 0){
      if(window.confirm("Would you like to delete this Project " + projectName + "?")){
        try {
          const response = await fetch(`${baseUrl}/api/projects/delete/${currentUser}/${projectName}`,{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
            }
          });
          const result = await response.json();
          if(response.ok){
            console.log(result.message);
            
            
    
          }
        } catch (error) {
          alert("Error deletion of project.");
        }
  
      }
     
    }

    else{
      const deletedTask = {
        Name: TaskArray[index].name,
        Description: TaskArray[index].description,
        Due: TaskArray[index].due,
        Priority: TaskArray[index].priority,
        Status: TaskArray[index].status,
        ProjectId: ProjectId
      };
      
      try {
        const response = await fetch(`${baseUrl}/api/tasks/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deletedTask)
        });
      
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchTasks(); // Refresh the list
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("Error deleting the task");
      }
      
    }

  }
  

  const addMemberToTeam = async () => {
    const TeamInfo = {
      Name: teamData.teamName,
      Members: [userNameToAdd],
      ProjectIds: [ProjectId],
      OwnerId: currentUser,
    };
  
    try {
      const response = await fetch(`${baseUrl}/api/CreateTeam/add-member-to-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(TeamInfo),
      });
  
      if (response.ok) {
        if (teamData.members !== undefined) {
          setTeamData(prev => {
            const updatedMembers = [...(prev.members || []), { username: TeamInfo.Members[0] }];
           
            localStorage.setItem('teamData', JSON.stringify({ ...prev, members: updatedMembers }));
            return {
              ...prev,
              members: updatedMembers,
            };
          });
        }
      }
  
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('unexpected error');
    }
  };
  



  const getTaskAssgined = (AssignedID:number) => {
    console.log("Member's id is " + AssignedID);
    
    if(teamData.members !== undefined){
      if(AssignedID === Number(currentUser)){
        return 'My self';
      }
      for(let i = 0; i < teamData.members.length; i++){
     
        if(teamData.members[i].id === AssignedID){
          return teamData.members[i].username;
      }
    }

    }
    return '';
    
  }

  function switchColor (priority:string){
    if(priority === 'High'){
      return "red";
    }
    else if (priority === 'Medium' || priority === 'Pending'){
      return "yellow";
    }
    else if (priority === 'Low' || priority === 'Completed'){
      return "green";
    }
    else if(priority === 'In Progress'){
      return "blue";
    }
  }
  

  useEffect (()=>{
    fetchProject();
  },[projectName]);

  useEffect (()=>{
    fetchTasks();
  },[ProjectId]);





  return (
   
    <div>
       <NavigationBar></NavigationBar>
       <div>
       
                  {
                    currentProject && (
            <div className='userTable'>
                        <h3>{projectName}</h3>
                        <h3>Team name: {teamData.teamName}</h3>
                        
                        {
                    editingField === 'member' ? (
                      <div>
                        {teamData.members && teamData.members.map((member, index) => (
                          <div key={member.id}>
                            <button className='memberButton'  id={member.id} onClick={() => deleteMemberFromTeam(member.username,index)}>
                              {member.username} X
                            </button>
                          </div>
                        ))}
                        <button
                          style={{ backgroundColor: 'green', marginTop: '5px' }}
                          onClick={() => setEditingField('')}
                        >
                          Save
                        </button>
                        <button
                          style={{ marginLeft: '5px' }}
                          onClick={() => setEditingField('')}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        {teamData.members && teamData.members.map((member) => (
                          <div key={member.id}>
                            <span>{member.username}</span>
                          </div>
                        ))}
                        <button
                          style={{ backgroundColor: 'green', marginTop: '5px' }}
                          onClick={() => setEditingField('member')}
                        >
                          Edit
                        </button>
                        <button
                          style={{ backgroundColor: 'blue', marginLeft: '5px' }}
                          onClick={() => addMemberToTeam()}

                        >
                          Add
                        </button>
                        <input type='text' placeholder='Enter Username to add to this team'
                        style={{marginLeft:'5px', height:'30px', width:'225px'}}
                        onChange={(e)=> setUserNameToAdd(e.target.value)}
                        ></input>
                      </div>
                    )
                  }


          
           
            {
              editingField === 'description' ? (
                <div>
                   <input placeholder='Change the description if you wish to do' 
                   value={updatedDescription}
                   onChange={(e) => setUpdatedDescription(e.target.value)}
                   ></input>
                   <button  onClick={()=>saveChange('description')} >Save</button>

                </div>
               
                
              ):
              (
                <div>
                <span style={{fontWeight:'bold'}}>Project description: </span>
                <span>{currentProject.description}</span>
                <button style={{backgroundColor:'green', marginLeft:'5px'}} onClick={()=>setEditingField('description')}><i className="fa-regular fa-pen-to-square"></i></button>
                </div>
              )
            }
            
            
            <div>
           
            {
              editingField === 'due' ? (
                <div>
                   <input type="datetime-local"
                    value={updatedDue}
                    onChange={(e) => setUpdatedDue(e.target.value)}></input>
                   <button onClick={()=>saveChange('due')}>Save</button>

                </div>
         
                 

              ): 
              (
                <div>
                  <span style={{fontWeight:'bold'}}>Due time:</span>
                  <span> {currentProject.dueTime.toLocaleString()}</span>
                  <button style={{backgroundColor:'green', marginLeft:'5px', marginTop:'5px'}} onClick={()=>setEditingField('due')}><i className="fa-regular fa-pen-to-square"></i></button>
                </div>
                
              )
            }
             </div>
            
            <div>
              <h3>Tasks</h3>
              <button className='addTaskButton' onClick={()=>addRow()} >Add Task</button>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Due Time</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Assigned to</th>
                    <th>Status</th>
                    <th>Percentage</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
           
              {TaskArray.map((task, index) => (
              <tr key={task.id || index}>
                <td>
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedTask.name || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{task.name}</span>
                  )}
                </td>
                <td>
                    {editingTaskId === task.id ? (
                      <input
                        type="datetime-local"
                        name="due"
                        value={
                          editedTask.due
                            ? new Date(editedTask.due).toISOString().slice(0, 16)
                            : ''
                        }
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{new Date(task.due).toLocaleString()}</span>
                    )}
                  </td>
                  <td>
                    {editingTaskId === task.id ? (
            <input
              type="text"
              name="description"
              value={editedTask.description || ''}
              onChange={handleInputChange}
            />
          ) : (
            <span>{task.description}</span>
          )}
        </td>
        <td style={{backgroundColor: switchColor(task.priority || '')}}>
          {editingTaskId === task.id ? (
            <select
            name="priority"
            value={editedTask.priority || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Priority</option>
            <option value="High" style={{backgroundColor:'red'}}>High</option>
            <option value="Medium" style={{backgroundColor:'yellow'}}>Medium</option>
            <option value="Low" style={{backgroundColor:'green'}}>Low</option>
          </select>
          
          ) : (
            <span>{task.priority}</span>
          )}
        </td>
        <td>
      {editingTaskId === task.id ? (
        <select
          name="assignedId"
          value={editedTask.assignedId || ''}
          onChange={(e) =>
            setEditedTask(prev => ({
              ...prev,
              assignedId: parseInt(e.target.value)
            }))
          }
        >
          <option value="">Select member</option>
          <option value = {Number(currentUser)} key = {Number(currentUser)}>My self</option>
          {teamData.members?.map(member => (
            <option key={member.id} value={member.id}>
              {member.username}
            </option>
          ))}
        </select>
      ) : (
        <span>{getTaskAssgined(task.assignedId)} {task.assignedId}</span>
      )}
    </td>

        <td  style={{backgroundColor: switchColor(task.status || '')}}>
          {editingTaskId === task.id ? (
            <select
              
              name="status"
              value={editedTask.status || ''}
              onChange={handleInputChange}
            >
              <option value=''>Select Status</option>
              <option value='Pending'>Pending</option>
              <option value='In Progress'>In Progress</option>
              <option value='Completed'>Completed</option>
            </select>
          ) : (
            <span>{task.status}</span>
          )}
        </td>
        <td>
        {editingTaskId === task.id ? (
           <input placeholder='Completion percentage'
           onChange={(e) =>
            setEditedTask(prev => ({
              ...prev,
              percentage: parseInt(e.target.value)
            }))
          }
           ></input>
          ) : (
            <span>{task.percentage}</span>
          )}
        </td>



      
        <td>
          {editingTaskId === task.id ? (
            <>
              <button style={{backgroundColor:'green'}}  onClick={() => updateTask()}>Save</button>
              <button style={{backgroundColor:'red'}} onClick={() => setEditingTaskId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <button style={{backgroundColor:'green'}} onClick={() => handleEditClick(task)}><i className="fa-regular fa-pen-to-square"></i></button>
              <button style={{backgroundColor:'red'}} onClick={()=>deleteRow(index)}><i className="fa-solid fa-trash"></i></button>
            </>
          )}
        </td>
      </tr>
    ))}

                

                    </tbody>
                  </table>
                  <div>
                    <h2>Task Progress</h2>
                    <ProgressChart data={tasks} />
                  </div>
                


                </div>
              </div>

              
            )
          }

      </div>
          
      </div>
      )
    }
