import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

import 'react-calendar/dist/Calendar.css';

import '../styles/Usercalendar.css';
import { NavigationBar } from './NavigationBar';

import { Project, Task } from '../types';
import { useNavigate} from 'react-router-dom';

export const UserCalendar = () => {
  const [value, setValue] = useState<Value>(new Date());
  const [tasks, setTasks] = useState<Record<string, { task: string; time: string, status:string, description: string, priority: string, projectId: number }[]>>({});
  const [addTask,setAddTask] = useState(false);

  const [TaskShowed, setShowTask] = useState(false);
  const [dragDate, setDragDate] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  

  const UserID = localStorage.getItem('userid');
  const [UsersProjects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [chosenDate, setChosenDate] = useState('');
  const [loading, setLoading] = useState(false);
 

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/projects/${UserID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Fetched projects:", result.projects);
        setProjects(result.projects);
        setLoading(false);
      }
    } catch (error) {
      alert("Error fetching projects.");
    }
  };
  


  const markEventsOnCalendar = async () => {
    setLoading(true);
    if (UsersProjects.length === 0) {
      alert("No projects found.");
      return;
    }
    const allTasksPromises = UsersProjects.map(project => fetchProjectTasks(project.id, project.name));
    
    try {
      const allResults = await Promise.all(allTasksPromises);
  
      // Flatten all tasks into a single array
      const allTasks = allResults.flat();
  
      console.log("All fetched tasks:", allTasks);
  
      // Now mark all tasks
      setLoading(false);
      MarkEachTask(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to fetch tasks.");
    }
  };
  
  

  const MarkEachTask = (taskArray: Task[]) => {
    const newTasks: Record<string, { task: string; time: string; status: string, description: string, priority: string, projectId: number }[]> = {};
  
    taskArray.forEach(task => {
      const dueDate = new Date(task.due);
      const taskDate = dueDate.toDateString();
  
      // Initialize the date in newTasks if it doesn't exist
      if (!newTasks[taskDate]) {
        newTasks[taskDate] = [];
      }
  
      // Filter out duplicate tasks based on task name and date
      const taskExists = newTasks[taskDate].some(existingTask => existingTask.task === task.name);
  
      if (!taskExists) {
        newTasks[taskDate].push({
          task: task.name,
          time: dueDate.toLocaleTimeString(),
          status: task.status ?? "incomplete",
          description:task.description ?? "", 
          priority: task.priority ?? "low",
          projectId: task.projectId

        });

        


      }
      else{
        alert("Duplicate task");
      }
    });
  
    console.log("Updated tasks:", newTasks);
  
    setTasks(newTasks);
  };
  
  
  
  
  


  const fetchProjectTasks = async (projectId: number, projectName: string) => {
    const currentProject = {
      UserID: projectId.toString(),
      ProjectName: projectName,
    };
  
    try {
      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProject),
      });
      setLoading(true);
      const result = await response.json();
      if (!response.ok) {
        console.error('Error response:', result);
        alert(result.message || 'Unknown error');
        setLoading(false);
        return [];
        
      } else {
        console.log("Fetched tasks for project:", result);
        setLoading(false);
        return result; // Return the tasks array

      }
    } catch (error) {
      alert('There is an error getting tasks.');
      return [];
    }
  };


  const fetchIndividualTasks = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/tasks/individual-tasks/${UserID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
  
      const individualTasks: Task[] = await response.json();
  
      const formattedTasks: Record<string, typeof tasks[string]> = {};
  
      individualTasks.forEach(task => {
        const dueDate = new Date(task.due);
        const dateKey = dueDate.toDateString();
  
        if (!formattedTasks[dateKey]) {
          formattedTasks[dateKey] = [];
        }
  
        formattedTasks[dateKey].push({
          task: task.name,
          time: dueDate.toLocaleTimeString(),
          status: task.status ?? "incomplete",
          description: task.description ?? "",
          priority: task.priority ?? "low",
          projectId: task.projectId
        });
      });
  
      setTasks(prev => {
        const merged = { ...prev };
      
        for (const date in formattedTasks) {
          if (!merged[date]) {
            merged[date] = formattedTasks[date];
          } else {
            // Prevent duplicates by comparing task names
            const existingNames = new Set(merged[date].map(t => t.task));
            const newTasks = formattedTasks[date].filter(t => !existingNames.has(t.task));
            merged[date] = [...merged[date], ...newTasks];
          }
        }
      
        return merged;
      });
      
  
    } catch (error) {
      alert("Error fetching individual tasks.");
    }
  };
  
  
  
  


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    } else {
      const fetchEverything = async () => {
        await fetchProjects(); // sets UsersProjects
      };
      fetchEverything();
    }
  }, [UserID]);
  
  useEffect(() => {
    if (UsersProjects.length > 0) {
      const fetchAllTasks = async () => {
        await markEventsOnCalendar(); // fetch project tasks and mark them
        await fetchIndividualTasks(); // fetch individual tasks and merge them
      };
      fetchAllTasks();
    }
  }, [UsersProjects]);
  


    const handleDateChange = (date: Value, event: any) => {
      setValue(date);
      
    };


    

    const addTaskForDate = async () => {
      if (value && !Array.isArray(value)) {
        const task = prompt('Enter a task for ' + value.toDateString());
        const taskHour = prompt('Enter time in format HH:MM for ' + value.toDateString());
        const taskDescription = prompt('Enter description for this task: ');
        const taskPriority = prompt('Enter priority (Low, Medium, High):');
    
        if (task && taskHour && taskPriority && ['Low', 'Medium', 'High'].includes(taskPriority)) {
          const time = taskHour;
          const dateKey = value.toDateString();
          const status = "incomplete";
          const description = taskDescription ?? "";
          const priority = taskPriority;
          const projectId = 0;
    
          setTasks(prev => ({
            ...prev,
            [dateKey]: [{ task, time, status, description, priority, projectId }, ...(prev[dateKey] || [])]
          }));
          console.log(typeof task);
          console.log(typeof description);
          console.log(typeof new Date(`${chosenDate} ${time}`));
          console.log(typeof UserID);

          const newTask = {
            Name: task,
            Description: description,
            Due: new Date(`${chosenDate} ${time}`).toISOString(),
            Priority: priority, 
            AssignedId: parseInt(UserID ?? "0"),
            ProjectId: null
          };

          try {
            const response = await fetch(`${baseUrl}/api/CreateTask`,{
              method: 'POST',
              headers:{
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newTask)
            });
            const result = await response.json();
            if(response.ok){
              alert(result.message);
              window.location.reload();
            }
            else{
              alert(result.message);
            }
            
          } catch (error) {
            alert("Error creating the task");
          }
    
          alert(`Task "${task}" added on ${dateKey} at ${time} with priority "${priority}"`);
        } else {
          alert("Invalid input. Make sure you fill all fields and choose a valid priority.");
        }
      } else {
        alert("Please select a date first!");
      }
    };
    
    

    const showTasks  = (dateKey:string) =>{
      setShowTask(true);
      setChosenDate(dateKey);

    }


    const deleteTask = async (TaskName: string, TaskDescription: string, TaskPriority: string, TaskStatus: string,
      TaskProjectId : number
    ) => {
      

      const taskInfo = {
        Name: TaskName,
        Description: TaskDescription,
        Priority: TaskPriority,
        Status: TaskStatus,
        ProjectId: TaskProjectId ?? 0 // or a number if it's a project task
      };
    
      try {
        const response = await fetch(`${baseUrl}/api/tasks/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskInfo)
        });
    
        const result = await response.json();
    
        if (response.ok) {
          
          fetchProjects();
          markEventsOnCalendar();
          fetchIndividualTasks();

          alert("Deleted task");
        } else {
          alert("Error deletion");
        }
      } catch (error) {
        alert("Error deleting the task");
      }
    };

    const MoveTasks = async (tasksOnDate: {
      task: string;
      time: string;
      status: string;
      description: string;
      priority: string;
      projectId: number;
    }[] , movedDate : string) => {
      console.log(chosenDate);
      for (const Task of tasksOnDate) {
        const sentTask = {
          Name: Task.task,
          Description: Task.description,
          Due: new Date(`${movedDate} ${Task.time}`).toISOString(),
          Priority: Task.priority,
          AssignedId: UserID,
          projectId: Task.projectId
        };
    
        try {
          const response = await fetch(`${baseUrl}/api/CreateTask`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentTask) 
          });
    
          const result = await response.json();
    
          if (response.ok) {
            alert(result.message);
          } else {
            alert(result.message);
          }
        } catch (error) {
          alert("Error creating the task");
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
      <NavigationBar />
      
      <div style={{ height: '65vh', width: '100vw', padding: '1rem', overflowX: 'auto' }}>
      <Calendar
          onChange={handleDateChange}
          value={value}
          onClickDay={(date: Date, event: React.MouseEvent<HTMLButtonElement>) => {
            const dateKey = date.toDateString();
            setChosenDate(dateKey); 
          }}
          tileClassName={({ date }) => {
            const dateKey = date.toDateString();
            if (tasks[dateKey]) {
              return 'task-day';
            }
            if (date.toDateString() === new Date().toDateString()) {
              return 'today';
            }
            return '';
          }}
          tileContent={({ date }) => {
            const dateKey = date.toDateString();
            const hasTasks = !!tasks[dateKey];
          
            return (
              <div
                draggable={hasTasks}
                onDragStart={() => setDragDate(dateKey)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragDate && dragDate !== dateKey && tasks[dragDate]) {
                    setTasks(prev => {
                      const newTasks = { ...prev };
                      newTasks[dateKey] = [...(newTasks[dateKey] || []), ...newTasks[dragDate]];
                      delete newTasks[dragDate];
                      console.log(newTasks[dateKey]);
                      MoveTasks(newTasks[dateKey],dateKey);
                      return newTasks;
                    });
                    
                    setDragDate(null);
                  }
                }}
                onDragEnd={() => setDragDate(null)}
                style={{
                  minHeight: '40px',
                  backgroundColor: hasTasks ? '#ffe' : 'transparent',
                  border: hasTasks ? '1px solid #ccc' : 'none',
                  cursor: hasTasks ? 'grab' : 'default',
                }}
              >
                {hasTasks && <span>📌 {tasks[dateKey].length}</span>}
              </div>
            );
          }}
          
          

          formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'long' })}
        />
        { tasks[chosenDate] &&
          
          
           (
            <div className='TaskInfo'>
                <div>
                <span style={{marginRight:'10px'}}>TASKS ON DATE {chosenDate}</span>
                
                </div>
                
                <button style={{width:'150px', marginBottom:'5px', backgroundColor:'green'}} onClick={addTaskForDate}>ADD TASK</button>
      
            
                  {tasks[chosenDate]?.map((task, index) => (
                    <div className='specificTask'>
                       <span key={index}>Task: {task.task}</span>
    
                       <span key={index}>Time: {task.time}</span>
                       <span key={index}>Status: {task.status}</span>
                       <span key={index}>Description: {task.description}</span>
                       <span key={index}>Priority: {task.priority}</span>
                       <button onClick={()=>deleteTask(task.task, task.description
                        ,task.priority, task.status, task.projectId
                       )} style={{backgroundColor:'red', marginBottom:'5px', marginTop:'5px'}}>
                        delete
                        </button>

                    </div>
                   
                  ))}
                  
                
             
            </div>
          )
        }


        {
          !tasks[chosenDate] && (
            <div className='TaskInfo'>
              <h3>TASKS ON DATE {chosenDate}</h3>
              <button style={{width:'150px', marginBottom:'5px', backgroundColor:'green'}} onClick={addTaskForDate}>ADD TASK</button>
            </div>
          )
        }
        


      </div>
    </div>
  );
};



