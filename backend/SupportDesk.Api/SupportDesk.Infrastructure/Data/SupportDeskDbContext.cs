using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SupportDesk.Domain.Entities;
using SupportDesk.Domain.Identity;

namespace SupportDesk.Infrastructure.Data
{
    public class SupportDeskDbContext : IdentityDbContext<AppUser>
    {
        public SupportDeskDbContext(DbContextOptions<SupportDeskDbContext> options)
            : base(options)
        {
        }

        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<TicketReply> TicketReplies => Set<TicketReply>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Ticket>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.HasOne(t => t.AssignedToUser)
                      .WithMany()
                      .HasForeignKey(t => t.AssignedToUserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.CreatedByUser)
                      .WithMany()
                      .HasForeignKey(t => t.CreatedByUserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<TicketReply>(entity =>
            {
                entity.HasKey(r => r.Id);

                entity.HasOne(r => r.Ticket)
                      .WithMany(t => t.Replies)
                      .HasForeignKey(r => r.TicketId);

                entity.HasOne(r => r.User)
                      .WithMany()
                      .HasForeignKey(r => r.UserId);
            });
        }
    }
}
