namespace SupportDesk.Application.DTOs.Email
{
    public class IncomingEmailDto
    {
        // Required sender email with format validation and max length
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        [System.ComponentModel.DataAnnotations.StringLength(256)]
        public string FromEmail { get; set; } = null!;

        // Required subject with max length
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(200)]
        public string Subject { get; set; } = null!;

        // Required body with max length
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(5000)]
        public string Body { get; set; } = null!;
    }
}
