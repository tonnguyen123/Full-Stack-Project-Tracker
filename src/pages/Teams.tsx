import { Project, Team, User } from '../types';
import { NavigationBar } from './NavigationBar';
import { useState, useEffect } from 'react';
import '../styles/Teams.css';
import { useNavigate, Link} from 'react-router-dom';

export const Teams = () => {

    const [UsersProjects, setProjects] = useState<Project[]>([]);
    const UserID = localStorage.getItem('userid');
    const navigate = useNavigate();
    const [TeamName,SetTeamName] = useState("");
    const [MemberList, SetMemberList] = useState("");
    const [ChosenProject, SetProject] = useState("");
    const [UsersTeams, SetUsersTeams] = useState<Team[]>([]);
    const [SharedTeams, SetSharedTeams] = useState<Team[]>([]);
     const baseUrl = import.meta.env.VITE_SERVER_URL;


    


    const fetchProjects = async() =>{
        
        try {
          const response = await fetch(`${baseUrl}/api/projects/${UserID}`,{
            method: 'GET',
            headers:{
              'Content-Type': 'application/json',
            }
          });
          const result = await response.json();
          if(response.ok){
            console.log(result.projects);
            
            setProjects(result.projects);
    
          }
        } catch (error) {
          console.log("Error fetching projects.");
        }
    
      };

      useEffect (() =>{
        const token = localStorage.getItem("token");
        if(!token){
          navigate('/login');
        }
        else{
          fetchProjects();
          fetchTeams();
          fetchSharedTeams();
          
          console.log(UsersProjects);
        }
      }, [UserID]);

      


      const verifyTeam = async (members:string) =>{
        const userIds = members.split(",").map(id=>id.trim()).filter(id=>id !== "")
        const TeamInfo = {
            Name: TeamName,
            OwnerId: parseInt(UserID ?? ""),
            Members: userIds,
            ProjectIds: [parseInt(ChosenProject)]
        }
        try {
            const response = await fetch(`${baseUrl}/api/CreateTeam`,{
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(TeamInfo),
              });
              if(response.ok){
                console.log("Created team succcessfully!");
                fetchTeams();
              }
              else{
                console.log("Failed to create team")
              }
        } catch (error) {
          console.log("There is some error creating team.")
        }


      }

      const fetchTeams = async() =>{
        try {
            const response = await fetch(`${baseUrl}/api/CreateTeam/get-teams/${UserID}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                  },
            });
            if(response.ok){
                const result = await response.json();
               
                SetUsersTeams(result);

            }
            else{
              console.log('Error fetching teams');
                SetUsersTeams([]);

            }
        } catch (error) {
          console.log("There is some error fetching teams.");
        }
      }

      const fetchSharedTeams = async() => {
        try {
          const response = await fetch(`${baseUrl}/api/CreateTeam/get-shared-teams/${UserID}`,{
              method: 'GET',
              headers:{
                  'Content-Type': 'application/json',
                },
          });
          if(response.ok){
              const result = await response.json();
              console.log( result);
              SetSharedTeams(result);

          }
          else{
            console.log('Error fetching teams');
          }
      } catch (error) {
        console.log("There is some error fetching teams.");
      }
      }



      const CreateTeam = () => {
        if(!TeamName || !MemberList || !ChosenProject){
          console.log("Please fill all infromation");
        }
        else{
            verifyTeam(MemberList);
        }
      }

      const handleDelete = async(teamID : number, teamName:string) => {
        console.log(typeof teamID);
        const TeamInfo  = {
            Name: teamName,
            OwnerId: UserID,
            ProjectIds: [],
            Members: []

        }
        if(window.confirm('Would you like to delete the project ' + teamName +"?"))
        try {
            const response = await fetch(`${baseUrl}/api/CreateTeam/delete`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(TeamInfo),
            });
            const result = await response.json();
            console.log(result.message);
            fetchTeams();

        } catch (error) {
          console.log("Error deleting the team")
        }
      }


      const goToProject = (teamid: number, teamMems: User[], teamName: string, projectname:string) =>{
            console.log('team id is ' +teamid);
            console.log('members are ' + teamMems);
            console.log('team name is' +teamName);
            const teamData = {
                teamID: teamid,
                members: teamMems,
                teamName: teamName 
            }
            console.log(teamData);
            localStorage.setItem('teamData', JSON.stringify(teamData));
            navigate(`/project/${projectname}`);
      }

      const goToMember = (ReceiverID: number, ReceiverName: string) => {
        localStorage.setItem('Receiver', JSON.stringify(ReceiverID));
        
        navigate (`/member/${ReceiverName}`);
      
      }


      const GetOwner = async (ownerId: number) => {
        try {
          const response = await fetch(`${baseUrl}/api/CreateTeam/get-team-owner/${ownerId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            const result = await response.text(); // owner name is plain text
            console.log("Owner: " + result); // Or handle how you want to show it
            console.log("Owner's id is " + ownerId);
            localStorage.setItem('Receiver', JSON.stringify(ownerId));
            navigate(`/member/${result}`)
          } else {
            console.log('Error fetching owner of the team');
          }
        } catch (error) {
          console.log('There was an error fetching the team owner.');
        }
      };

      const viewSharedProject = (ProjectOwner:number, projectName:string) => {
        localStorage.setItem("currentProjectOwner", ProjectOwner.toString());
        localStorage.setItem("currentSharedProject",projectName);
        navigate(`/shared-project/${projectName}`);
      }
      






  return (
    <div>
        <NavigationBar></NavigationBar>
        <div className='PageBody'>
        <div className='CreateTeam'>
            <span className='createTeamTitle'>Create Team</span>
            <div className='CreateamForm'>
            <span>Name of the team: </span>
            <input placeholder='Enter the name of the team' onChange={(e)=>SetTeamName(e.target.value)}></input>
            <div>
            <span>Invite team members: </span>
            <input placeholder='Enter email or User ID of the team member'
            style={{marginTop:'20px'}}
            onChange={(e)=>SetMemberList(e.target.value)}
            ></input>
            </div>
            <div style={{marginTop:'20px'}}>
                <span>Select Project for this team: </span>

                <select onChange={(e)=>SetProject(e.target.value)}>
                      {UsersProjects.map((project,index) => (
                        <option key={index} value={project.id} >{project.name}</option>
                      ))}
                </select>

            </div>
            <div>
                <button style={{marginTop:'20px'}} onClick={CreateTeam}>Create</button>
            </div>

            </div>
            

        </div>
        <div className='AllTeams'>
            <span className='teamsTitle'>Your teams</span>
            <div className='TeamsInfo'>
            {UsersTeams.map((team) => (
                  <div className='EachTeam'>
                   
                    <div>
                    <span>Team name: {team.name}</span>
                   
                    
                    </div>
                   
                    <span style={{fontWeight:'bold'}}>Team's members: </span>
                    {
                        team.members.map((member)=>(
                            <div>
                                <Link to={`/member/${member.username}`} onClick={() => {
                                    goToMember(member.id,member.username);
                                    
                                  }}>{member.username} </Link>
                               
                            </div>
                            
                        ))
                    }
                    <span style={{ fontWeight: 'bold' }}>Projects:</span>
                        {team.projects && team.projects.length > 0 ? (
                            team.projects.map((project, pIndex) => (
                            <div key={pIndex}>
                                <Link style={{color:'blue'}} to={`/project/${project.name}`}
                                 onClick={() => {
                                    goToProject(team.id, team.members,team.name,project.name );
                                    
                                  }}
                                >{project.name}</Link>
                            </div>
                            ))
                        ) : (
                            <div>No projects</div>
                        )
                        
                        }
                         
                        <button style={{backgroundColor: 'red', marginLeft:'80%'}} onClick={()=>handleDelete(team.id,team.name)}>  <i className="fa-solid fa-trash"></i></button>
                     
                  </div>
                ))}

                {
                  UsersTeams.length === 0 && (
                    <span>You did not create any team</span>
                  )
                }

            </div>

            <div className='TeamsInfo'>
            <span className='teamsTitle'>Your Shared teams</span>
            {
              SharedTeams.length === 0 && (
                <span>You are not in any shared team.</span>
              )
            }

            {
              SharedTeams.map((team)=>(
                <div className='EachTeam'>
                   
                <div>
                <span style={{fontWeight:'bold'}}>Team name: </span>
                <span>{team.name}</span>
               
                
                </div>

                <div>
                  
                  <Link
                  style={{ color: 'blue' }}
                  to="#"
                  onClick={(e) => {
                    e.preventDefault(); // prevent full page reload
                    GetOwner(team.ownerId); // correct parameter
                  }}
                >
                  Team's owner
                </Link>

                </div>
               
                <span style={{fontWeight:'bold'}}>Team's members: </span>
                {
                    team.members.map((member)=>(
                        <div>
                          {member.id === Number(UserID) && (
                            <span>Myself</span>
                          )}

                          {
                            member.id !== Number(UserID) && (
                              <Link to={`/member/${member.username}`} onClick={() => {
                                goToMember(member.id,member.username);
                                
                              }}>{member.username} </Link>

                            )
                            
                          }
                            
                           
                        </div>
                        
                    ))
                }
                <span style={{ fontWeight: 'bold' }}>Projects:</span>
                    {team.projects && team.projects.length > 0 ? (
                        team.projects.map((project, pIndex) => (
                        <div key={pIndex}>
                            <Link style={{color:'blue'}} to={`/shared-project/${project.name}`}
                            onClick={() => viewSharedProject(project.userId, project.name)}
                            >{project.name}</Link>
                        </div>
                        ))
                    ) : (
                        <div>No projects</div>
                    )
                    
                    }
                     
                 
              </div>
              ))
            }

            </div>

            
            

        </div>

        </div>
        
       
       
    </div>
  )
}
