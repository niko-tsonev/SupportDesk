using System.ComponentModel.DataAnnotations;

namespace SupportDesk.Application.DTOs.Tickets
{
    public class CreateTicketDto
    {
        [Required(ErrorMessage = "Subject is required")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Subject must be between 5 and 200 characters")]
        public string Subject { get; set; } = null!;

        [Required(ErrorMessage = "Customer email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string CustomerEmail { get; set; } = null!;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(2000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 2000 characters")]
        public string Description { get; set; } = null!;

        public bool IsPriority { get; set; } = false;
    }
}
