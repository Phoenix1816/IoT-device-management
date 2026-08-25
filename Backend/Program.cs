using Backend.BackgroundServices;
using Backend.Data;
using Backend.Hubs;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

//Open-Meteo
builder.Services.AddHttpClient<OpenMeteoService>();
// Controllers
builder.Services.AddControllers();

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<AuditLogService>();

// JWT Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!
                        )
                    )
            };
    });

// Password Hasher
builder.Services.AddScoped<
    IPasswordHasher<User>,
    PasswordHasher<User>
>();

// JWT Service
builder.Services.AddScoped<
    IJwtService,
    JwtService
>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// SignalR
builder.Services.AddSignalR();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        ),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString(
                "DefaultConnection"
            )
        )
    )
);

// Telemetry Simulation Worker
builder.Services.AddHostedService<
    TelemetrySimulationWorker
>();

// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",

            Type =
                Microsoft.OpenApi.Models.SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            In =
                Microsoft.OpenApi.Models.ParameterLocation.Header,

            Description =
                "JWT token giriniz. Örnek: Bearer eyJhbGciOiJIUzI1NiIs..."
        }
    );

    options.AddSecurityRequirement(
        new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference =
                        new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type =
                                Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,

                            Id = "Bearer"
                        }
                },

                Array.Empty<string>()
            }
        }
    );
});

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

// Authentication → Authorization sırası önemli
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<TelemetryHub>(
    "/hubs/telemetry"
);

app.Run();