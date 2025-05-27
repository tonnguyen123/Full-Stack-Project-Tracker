using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using System;
using System.Linq;
using ProjectTrackerAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; 


namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class CreateTeam : ControllerBase
{
    private readonly ProjectDbContext _context;

    public CreateTeam(ProjectDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Createteam([FromBody] TeamInfo team)
    {
        try
        {
            Console.WriteLine("Usernames received: " + string.Join(", ", team.Members));

            var existingTeam = await _context.Teams
                .FirstOrDefaultAsync(t => t.Name == team.Name && t.OwnerId == team.OwnerId);

            if (existingTeam == null)
            {
                var members = await _context.Users
                    .Where(u => team.Members.Contains(u.Username))
                    .ToListAsync();

                var projects = await _context.Projects
                    .Where(p => team.ProjectIds.Contains(p.Id))
                    .ToListAsync();


                var newTeam = new Team
                {
                    Name = team.Name,
                    Projects = projects,
                    OwnerId = team.OwnerId,
                    Members = members
                    
                };

                _context.Teams.Add(newTeam);
                await _context.SaveChangesAsync();
                
               

                return Ok(new {  message = "Added the team successfully!"  });

            }
            else
            {
                return BadRequest(new { message = "Existing team's name in your profile. Please choose different name" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
    [HttpGet("get-teams/{UserID}")]
    
     public async Task<IActionResult> GetTeam(int UserID){

        try{
            var existingTeams = await _context.Teams.Include(t => t.Members).Include(t=>t.Projects) 
        .Where(t => t.OwnerId == UserID).ToListAsync();

        if(existingTeams == null){
            return BadRequest(new { message = "Error fetching teams' information" });
        }

        else{
             return Ok(existingTeams);
        }

        }

        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
        
     }

     [HttpGet("get-shared-teams/{UserID}")]
    
    public async Task<IActionResult> GetSharedTeam(int UserID){

        try{
             var allTeams = await _context.Teams
                .Include(t => t.Projects)
                .Include(t => t.Members)
                .ToListAsync();

            // Filter only the teams where this user is a member
            var userTeams = allTeams
                .Where(t => t.Members != null && t.Members.Any(m => m.Id == UserID))
                .ToList();
            if(userTeams.Count() > 0){
                return Ok(userTeams);
            }
            else{
                return NotFound(new {message = "No team associated with this member."});
            }

        }

        catch (Exception ex)
        {
            Console.WriteLine($"Error get shared teams: {ex}"); 
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        
        
    }
     

      [HttpPost("get-one-team")]
public async Task<IActionResult> GetOneTeam([FromBody] TeamInfo team)
{
    try
    {
        var existingTeam = await _context.Teams
            .Include(t => t.Members)
            .Include(t => t.Projects)
            .FirstOrDefaultAsync(t => t.OwnerId == team.OwnerId && t.Name == team.Name);

        if (existingTeam != null)
        {
            return Ok(existingTeam);
        }
        else
        {
            return BadRequest(new { message = "Error fetching team's information" });
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}



     [HttpPost("delete")]
     public async Task<IActionResult> DeleteTeam([FromBody] TeamInfo team){
        try{
             var existingTeam = await _context.Teams
                .Include(t=>t.Projects)
                .Include(t=>t.Members)
                .FirstOrDefaultAsync(t => t.Name == team.Name && t.OwnerId == team.OwnerId);
            
            if(existingTeam != null){
            
                _context.Teams.Remove(existingTeam);
                await _context.SaveChangesAsync();
                return Ok(new {message = "Deleted the team!"});
            }
            else{
                 return BadRequest(new {message = "Did not find the team to delete!"});
            }

        }
        catch(Exception ex){
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
        
        

     }

     [HttpPost("delete-member")]
      public async Task<IActionResult> DeleteMemberFromTeam([FromBody] TeamInfo team){
        try{
            if(team.Members == null){
                return BadRequest(new {message = "There is no team member chosen to remove"});
            }
            var existingTeam =await  _context.Teams.Include(t=>t.Members)
                                .Include(t=>t.Projects)
                                .FirstOrDefaultAsync(t => t.Name == team.Name && t.OwnerId == team.OwnerId);
            if(existingTeam == null){
                return NotFound(new {message = "There is no team associated with this member"});
            }
            string memberTobeRemoved = team.Members[0];

            if(team.ProjectIds != null ){
                int currentProject = team.ProjectIds[0];
                if (existingTeam.Projects == null || !existingTeam.Projects.Any(p => p.Id == currentProject))
{
                    return BadRequest(new {message = "Project not found in the team."});
                }
            }

            var userNeedsToBeRemoved = await _context.Users.FirstOrDefaultAsync(u=>u.Username == memberTobeRemoved);
            if(userNeedsToBeRemoved == null){
                return BadRequest(new {message = "Member not found in this team"});
            }

            if( existingTeam.Members == null){
                 return BadRequest(new {message = "No member found in this team"});
            }
            existingTeam.Members.Remove(userNeedsToBeRemoved);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Removed the member " + userNeedsToBeRemoved!.Username + " from the team " + existingTeam.Name });

        }
        catch(Exception ex){
             return StatusCode(500, new { message = "Internal server error", error = ex.Message });

        }
      }

      [HttpPost("add-member-to-team")]
      public async Task<IActionResult> AddMemberToTeam([FromBody] TeamInfo team){
        try{
            var existingMember = await _context.Users.FirstOrDefaultAsync(u=>u.Username == team.Members[0]);
        if(existingMember == null){
            return BadRequest(new {message = "There is no member with the User Name you entered"});
        }
        var existingTeam = await _context.Teams
                            .Include(t => t.Members)
                            .Include(t => t.Projects)
                            .FirstOrDefaultAsync(t => t.Name == team.Name && t.OwnerId == team.OwnerId);

        if(existingTeam == null){
            return BadRequest(new {message = "There is no team in the database"});
        }
                if (existingTeam.Members != null && existingTeam.Members.Any(m => m.Username == team.Members[0]))
                {
                    return BadRequest(new { message = "The member is already in the team" });
                }
                else
                {
                    if (existingMember != null)
                    {
                        existingTeam.Members.Add(existingMember);
                        await _context.SaveChangesAsync();
                        return Ok(new { message = "Added the member successfully!" });

                    }

                    else
                    {
                        return BadRequest(new { message = "Failed to add member." });
                }
                
     
         
        }
     
       

        }



         catch(Exception ex){
             return StatusCode(500, new { message = "Internal server error", error = ex.Message });

        }
       
}

    [HttpGet("get-team-owner/{UserID}")]
    public async Task<IActionResult> GetTeamOwner(int UserID){
        try{
            var teamOwner = await _context.Users.FirstOrDefaultAsync(u=>u.Id == UserID);
            if(teamOwner != null){
                return Ok(teamOwner.Username);
            }
            else{
                return BadRequest(new { message = "Cannot find the team's owner" });
            }

        }
        catch(Exception ex){
             return StatusCode(500, new { message = "Internal server error", error = ex.Message });

        }
    }
    

        

       


}
}
