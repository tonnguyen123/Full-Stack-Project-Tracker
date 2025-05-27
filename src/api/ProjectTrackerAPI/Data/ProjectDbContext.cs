using Microsoft.EntityFrameworkCore;
using ProjectTrackerAPI.Models; 

namespace ProjectTrackerAPI.Data
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }  
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        public DbSet<Team> Teams { get; set; }  

        public DbSet<Message> Messages {get; set;}
        public DbSet<Notification> Notifications {get; set;}
        
        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Projects)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tasks)
                .WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany()
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Project)
                .WithMany()
                .HasForeignKey(m => m.ProjectId);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Sender)
                .WithMany()
                .HasForeignKey(n => n.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Receiver)
                .WithMany()
                .HasForeignKey(n => n.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Team>()
                .HasOne(t => t.Owner)
                .WithMany()
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Team>()
               .HasMany(t => t.Projects)
               .WithMany(p => p.Teams)
               .UsingEntity<Dictionary<string, object>>(
                   "TeamProjects",
                   j => j
                       .HasOne<Project>()
                       .WithMany()
                       .HasForeignKey("ProjectId"),
                   j => j
                       .HasOne<Team>()
                       .WithMany()
                       .HasForeignKey("TeamId"));

            // Team-Member many-to-many relationship (if needed)
            modelBuilder.Entity<Team>()
            .HasMany(t => t.Members)
            .WithMany(u => u.Teams)
            .UsingEntity<Dictionary<string, object>>(
                "TeamMembers",
                j => j
                    .HasOne<User>()
                    .WithMany()
                    .HasForeignKey("MembersId"),  // <-- actual column name in your DB
                j => j
                    .HasOne<Team>()
                    .WithMany()
                    .HasForeignKey("TeamsId"));   // <-- actual column name in your DB


            base.OnModelCreating(modelBuilder);
        }
    }
}
