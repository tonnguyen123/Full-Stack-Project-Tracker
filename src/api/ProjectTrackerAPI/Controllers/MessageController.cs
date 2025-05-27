using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Services;
using ProjectTrackerAPI.Helpers;
using Microsoft.EntityFrameworkCore;

using System;
using System.Linq;
using System.Threading.Tasks;
using ProjectTrackerAPI.Data;

namespace ProjectTrackerAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ProjectDbContext _context;

        public MessagesController(ProjectDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            Console.WriteLine("Text is " + message.MessageText);

            Console.WriteLine("Sender is " + message.SenderId);
            Console.WriteLine("Receiver is " + message.ReceiverId);
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(message);
        }

        [HttpPost("get-messages")]
        public async Task<IActionResult> GetMessages([FromBody] Message request)
        {
            var messages = await _context.Messages
                .Where(m =>
                    (m.SenderId == request.SenderId && m.ReceiverId == request.ReceiverId) ||
                    (m.SenderId == request.ReceiverId && m.ReceiverId == request.SenderId)
                )
                .OrderBy(m => m.Timestamp) // optional: keep messages in order
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("send-with-file")]
        public async Task<IActionResult> SendMessageWithFile(
            [FromForm] int SenderId,
            [FromForm] int ReceiverId,
            [FromForm] string MessageText,
            [FromForm] IFormFile file)
        {
            string? filePath = null;
            string? fileName = null;

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is missing");

            }


            if (file != null && file.Length > 0)
            {
                fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedFiles");



                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                filePath = Path.Combine(uploadPath, fileName);
                Console.WriteLine("Upload path: " + uploadPath);
                Console.WriteLine("Full file path: " + filePath);

                try
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("File saving error: " + ex.Message);
                    return StatusCode(500, "File saving failed");
                }

            }

            var message = new Message
            {
                SenderId = SenderId,
                ReceiverId = ReceiverId,
                MessageText = MessageText,
                FileName = file?.FileName,
                FilePath = "/UploadedFiles/" + fileName  // ← this makes it accessible
            };




            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }


        [HttpGet("download")]
        public IActionResult DownloadFile([FromQuery] string filePath, [FromQuery] string fileName)
        {
            // Sanitize path to avoid directory traversal
            var sanitizedFileName = Path.GetFileName(fileName);
            var sanitizedFilePath = Path.GetFileName(filePath);

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedFiles", sanitizedFilePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound("File not found.");
            }

            var fileBytes = System.IO.File.ReadAllBytes(fullPath);
            var contentType = "application/octet-stream";

            return File(fileBytes, contentType, sanitizedFileName);
        }

        [HttpPost("send-notification")]

        public async Task<IActionResult> SendNotification([FromBody] Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Notification is created!" });
        }


        [HttpGet("get-notifications/{ReceiverID}")]
        public async Task<IActionResult> GetNotification(int ReceiverID)
        {
            var notifications = await _context.Notifications.Where(n => n.ReceiverId == ReceiverID).ToListAsync();
            if (notifications != null)
            {
                return Ok(notifications);
            }
            else
            {
                return NotFound(null);
            }
        }


        [HttpPost("mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromBody] Notification notification)
        {
            var existingNotification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == notification.Id);
            if (existingNotification != null)
            {
                existingNotification.IsRead = true;
                await _context.SaveChangesAsync();
                return Ok(new {message = "Marked as Read"});
            }
            else
            {
                return BadRequest(new { message = "Error marking as Read" });
            }
            

        }
    }



}
