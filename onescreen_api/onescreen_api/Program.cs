using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using System.Data.Common;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

DbProviderFactories.RegisterFactory("Microsoft.Data.SqlClient", Microsoft.Data.SqlClient.SqlClientFactory.Instance);
builder.Services.AddSingleton<Microsoft.AspNetCore.Http.IHttpContextAccessor, Microsoft.AspNetCore.Http.HttpContextAccessor>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowOrigin",
        builder =>
        {
            builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
        });
});
builder.Services.AddControllers(options =>
{
    options.RespectBrowserAcceptHeader = true; // false by default
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.Never;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); // for enum as strings
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBoundaryLengthLimit = 134217728;
});
builder.Services.AddResponseCompression();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "onescreen");
    });
}
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});
app.UseResponseCompression();
app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.Use(async (context, next) =>
{
    context.Response.GetTypedHeaders().CacheControl =
        new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
        {
            Public = true,
            MaxAge = System.TimeSpan.FromSeconds(10)
        };
    context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Vary] =
        new string[] { "Accept-Encoding" };

    try
    {
        await next();
    }
    catch (Exception ex)
    {
        // Create log folder & file
        var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs", "errors.txt");
        Directory.CreateDirectory(Path.GetDirectoryName(logPath)!);

        // Write error
        var logEntry = $"{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} | {context.Request.Path} | {ex.Message} {Environment.NewLine}{ex.StackTrace}{Environment.NewLine}";
        await File.AppendAllTextAsync(logPath, logEntry);

        // Return 500 response
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("Internal Server Error. Please check logs.");
    }
});

app.UseCors("AllowOrigin");

app.MapControllers();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
               Path.Combine(Directory.GetCurrentDirectory(), "FileStorage")),
    RequestPath = "/FileStorage"
});

app.Run();
