using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using ProjectTrackerAPI.Services;
using ProjectTrackerAPI.Data;  

using Microsoft.Extensions.FileProviders; 
using System.IO;



using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var jwtKey = builder.Configuration["Jwt:Key"] ?? "your_fallback_secret_key_here";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})

.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);


builder.Services.AddDbContext<ProjectDbContext>(option => option.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
//builder.Services.AddDbContext<ProjectDbContext>(options =>
    //options.UseSqlite("Data Source=projecttracker.db"));


// Register services in the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://localhost:5173",
            "https://full-stack-ton-project-trackers.netlify.app" // ✅ real frontend domain
            )
            .AllowAnyHeader()
            .AllowAnyMethod();

    });
});




// Register controllers
builder.Services.AddControllers();

// Register other services like EmailService
builder.Services.AddSingleton<EmailService>();
builder.Services.AddScoped<EmailUsername>();
builder.Services.AddScoped<EmailPasswordLink>();

var app = builder.Build();

app.UseStaticFiles(); 

app.UseCors("AllowLocalhost");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "Backend is running!");





app.MapControllers();
app.Run();

