import { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import '../styles/Createproject.css';

// Main component for creating new projects and managing related tasks
export const CreateProject = () => {
  // UI control states
  const [showTable, setShow] = useState(false); // Whether to show the task table
  const [showProject, setShowProject] = useState(true); // Whether to show the project creation form

  // Task and project state
  const [taskRows, setTaskRows] = useState([{ taskName: '', dueTime: '', description: '', priority: '', assignedTo: '' }]);
  const [saveTexts, setSaveTexts] = useState<string[]>(['Save']); // Save button text for each task

  // Input fields for project creation
  const [ProjectName, setName] = useState('');
  const [ProjDescription, setDescription] = useState('');
  const [ProjectDue, setProjectDue] = useState('');

  // Inputs for task creation
  const [TaskName, setTaskName] = useState('');
  const [TaskDescription, setTaskDescription] = useState('');
  const [AssignedTo, setAssigned] = useState<number>(0);
  const [TaskDue, setTaskDue] = useState('');
  const [TaskPriority, setaskPriority] = useState('');

  // Store current created project info to link tasks later
  const [currProjectName, setCurrProjectName] = useState('');
  const [currUserID, setcurrUserID] = useState('');

  // Get the current user ID from localStorage
  const UserID = localStorage.getItem('userid');
  const baseUrl = import.meta.env.VITE_SERVER_URL; // Base URL from .env

  // Save a task to the backend
  const saveTask = async () => {
    // Validate that all fields are filled
    if (!TaskName || !TaskDescription || !AssignedTo || !TaskDue || !TaskPriority) {
      alert("Please fill all information to add the task");
    } else {
      const projectID = await getProjectID(currProjectName, currUserID);

      const newTask = {
        Name: TaskName,
        Description: TaskDescription,
        Due: TaskDue,
        Priority: TaskPriority,
        AssignedId: AssignedTo,
        ProjectId: projectID
      };

      // Send POST request to save task
      try {
        const response = await fetch(`${baseUrl}/api/CreateTask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        });
        const result = await response.json();
        alert(result.message);
      } catch (error) {
        alert("Error creating the task");
      }
    }
  };

  // Fetch project ID from backend using name and userID
  const getProjectID = async (projectName: string, userID: string) => {
    const CurrentProject = {
      UserID: userID.toString(),
      ProjectName: projectName
    };
    let currentProjectID = '';

    try {
      const response = await fetch(`${baseUrl}/api/ProjectId`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CurrentProject)
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message || 'Unknown error');
      } else {
        currentProjectID = result.projectid;
      }
    } catch (error) {
      alert("There was an error retrieving the project ID.");
    }
    return currentProjectID;
  };

  // Handle project and task-related actions based on button type
  const handleButton = async (type: string, index: number) => {
    if (type === 'create-table') {
      // Validate inputs before creating project
      if (!ProjectName || !ProjDescription || !ProjectDue) {
        alert("Please fill all the fields below.");
        setShowProject(true);
      } else {
        // Create local timestamp in ISO format
        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 19);

        // Build project object
        const Project = {
          Name: ProjectName,
          Description: ProjDescription,
          UserId: UserID,
          DueTime: ProjectDue,
          CreatedAt: localISOTime,
          SharedUsers: [],
          Tasks: []
        };

        // Send request to create the project
        try {
          const response = await fetch(`${baseUrl}/api/CreateProject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Project)
          });
          const result = await response.json();

          if (response.ok) {
            alert(`Project ${ProjectName} is created. You can add tasks of this project below`);
            setTaskRows([...taskRows, { taskName: '', dueTime: '', description: '', priority: '', assignedTo: '' }]);
            setSaveTexts([...saveTexts, 'Save']);
            setShow(true);
            setSave('Save');
            setShowProject(false);
            setCurrProjectName(result.projectName);
            setcurrUserID(result.userID);
          } else {
            alert(result.message);
          }
        } catch (error) {
          alert("There was an error creating the project.");
        }
      }
    }

    // Add a new empty row for a task
    else if (type === 'add') {
      setTaskRows([
        ...taskRows,
        { taskName: '', dueTime: '', description: '', priority: '', assignedTo: '' }
      ]);
    }

    // Save the task
    else if (type === 'save') {
      saveTask();
      const updatedSaveTexts = [...saveTexts];
      updatedSaveTexts[index] = 'Saved';
      setSaveTexts(updatedSaveTexts);
    }

    // Delete a task row or the project if it's the first task
    else if (type === 'delete') {
      const updatedRows = [...taskRows];
      if (index !== 0) {
        updatedRows.splice(index, 1);
        setTaskRows(updatedRows);
      } else if (index === 0) {
        if (window.confirm("Would you like to delete this Project " + ProjectName + "?")) {
          try {
            const response = await fetch(`${baseUrl}/api/projects/delete/${UserID}/${ProjectName}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (response.ok) {
              alert('Deleted ' + ProjectName + ' successfully!');
            }
          } catch (error) {
            alert("Error deleting the project.");
          }

          // Reset state
          updatedRows.splice(index, 1);
          setTaskRows(updatedRows);
          setShow(false);
          setShowProject(true);
          setName('');
          setDescription('');
        }
      }
    }
  };

  // JSX render logic starts here
  return (
    <div>
      <NavigationBar />

      {/* Project creation form */}
      {showProject && (
        <div className='create-project'>
          <h3 style={{ color: 'black' }}>Fill the information to create new Project Tracker</h3>
          <div>
            <span style={{ color: 'black' }}>Enter the name of the project tracker: </span>
            <input className='projectName' placeholder='name of the project tracker' onChange={(e) => setName(e.target.value)} style={{ marginBottom: '10px' }} />
            <div>
              <span style={{ color: 'black' }}>Description of this project:</span>
            </div>
            <textarea
              placeholder='Enter the description of the project'
              className='project-description'
              style={{ marginBottom: '10px', marginTop: '10px' }}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <span style={{ color: 'black', marginRight: '10px' }}>Due time of this project:</span>
            <input
              className='projectdue'
              type='datetime-local'
              style={{ marginTop: '10px' }}
              onChange={(e) => setProjectDue(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <div>
              <button onClick={() => handleButton('create-table', 0)} style={{ marginTop: '10px' }}>
                Create new Project Tracker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task table */}
      {showTable && (
        <div className='userTable'>
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
                  {/* Each task input updates corresponding state and triggers "Save" text */}
                  <td>
                    <input className='task' placeholder='Enter task name' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setTaskName(e.target.value);
                    }} />
                  </td>
                  <td>
                    <input className='due' type='datetime-local' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setTaskDue(e.target.value);
                    }} />
                  </td>
                  <td>
                    <input className='description' placeholder='Enter description' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setTaskDescription(e.target.value);
                    }} />
                  </td>
                  <td>
                    <select className='priority' onChange={(e) => {
                      const updatedSaveTexts = [...saveTexts];
                      updatedSaveTexts[index] = 'Save';
                      setSaveTexts(updatedSaveTexts);
                      setaskPriority(e.target.value);
                    }}>
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
                    }} />
                  </td>
                  <td className='ActionButtons'>
                    <button onClick={() => handleButton('save', index)}>{saveTexts[index]}</button>
                    <button onClick={() => handleButton('add', index)}>+</button>
                    <button onClick={() => handleButton('delete', index)}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
