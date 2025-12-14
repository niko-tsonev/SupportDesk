using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SupportDesk.Domain.Entities;
using SupportDesk.Domain.Enums;
using SupportDesk.Domain.Identity;

namespace SupportDesk.Infrastructure.Data
{
    public class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<SupportDeskDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            context.TicketReplies.RemoveRange(context.TicketReplies);
            context.Tickets.RemoveRange(context.Tickets);
            await context.SaveChangesAsync();

            await SeedRolesAsync(roleManager);
            await SeedUsersAsync(userManager);
            await SeedTicketsAsync(context, userManager);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "Agent" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            // Seed system user used for email-originated tickets
            await CreateUserIfNotExistsWithId(
                userManager,
                id: "EMAIL",
                email: "system@supportdesk.local",
                password: "SystemUser123!",
                role: null);

            await CreateUserIfNotExists(
                userManager,
                "admin@supportdesk.local",
                "Admin123!",
                "Admin");

            await CreateUserIfNotExists(
                userManager,
                "agent1@supportdesk.local",
                "Agent123!",
                "Agent");

            await CreateUserIfNotExists(
                userManager,
                "agent2@supportdesk.local",
                "Agent123!",
                "Agent");
        }

        private static async Task CreateUserIfNotExists(
            UserManager<AppUser> userManager,
            string email,
            string password,
            string role)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user != null)
                return;

            user = new AppUser
            {
                UserName = email,
                Email = email
            };

            await userManager.CreateAsync(user, password);
            await userManager.AddToRoleAsync(user, role);
        }

        private static async Task CreateUserIfNotExistsWithId(
            UserManager<AppUser> userManager,
            string id,
            string email,
            string password,
            string? role)
        {
            var existing = await userManager.FindByIdAsync(id);
            if (existing != null)
                return;

            // Also check by email to avoid duplicates if created previously without fixed Id
            var byEmail = await userManager.FindByEmailAsync(email);
            if (byEmail != null)
                return;

            var user = new AppUser
            {
                Id = id,
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            await userManager.CreateAsync(user, password);
            if (!string.IsNullOrEmpty(role))
            {
                await userManager.AddToRoleAsync(user, role);
            }
        }

        private static async Task SeedTicketsAsync(
      SupportDeskDbContext context,
      UserManager<AppUser> userManager)
        {
            if (await context.Tickets.AnyAsync())
                return;

            var agents = await userManager.GetUsersInRoleAsync("Agent");
            var agentList = agents.ToList();

            if (!agentList.Any())
                return;

            var createdBy = agentList[0];
            var assignedTo = agentList.Count > 1 ? agentList[1] : agentList[0];

            var tickets = new List<Ticket>
        {
            new Ticket
            {
                Subject = "Cannot log into account",
                CustomerEmail = "customer1@test.com",
                Description = "I receive an error when trying to log in.",
                Status = TicketStatus.New,
                CreatedByUserId = createdBy.Id
            },
            new Ticket
            {
                Subject = "Payment not processed",
                CustomerEmail = "customer2@test.com",
                Description = "My card was charged but the service is not active.",
                Status = TicketStatus.InProgress,
                CreatedByUserId = createdBy.Id,
                AssignedToUserId = assignedTo.Id
            },
            new Ticket
            {
                Subject = "Feature request",
                CustomerEmail = "customer3@test.com",
                Description = "It would be great to have dark mode.",
                Status = TicketStatus.Closed,
                CreatedByUserId = createdBy.Id,
                AssignedToUserId = assignedTo.Id
            }
        };

            context.Tickets.AddRange(tickets);
            await context.SaveChangesAsync();

            await SeedRepliesAsync(context, createdBy, assignedTo, tickets);
        }

        private static async Task SeedRepliesAsync(
    SupportDeskDbContext context,
    AppUser createdBy,
    AppUser assignedTo,
    List<Ticket> tickets)
        {
            var replies = new List<TicketReply>
        {
            new TicketReply
            {
                TicketId = tickets[1].Id,
                UserId = assignedTo.Id,
                Message = "We are investigating the payment issue.",
                IsInternal = false
            },
            new TicketReply
            {
                TicketId = tickets[1].Id,
                UserId = assignedTo.Id,
                Message = "Checked payment gateway logs.",
                IsInternal = true
            },
            new TicketReply
            {
                TicketId = tickets[2].Id,
                UserId = assignedTo.Id,
                Message = "Thank you for the suggestion! We will consider it.",
                IsInternal = false
            }
        };

            context.TicketReplies.AddRange(replies);
            await context.SaveChangesAsync();
        }
    }
}
