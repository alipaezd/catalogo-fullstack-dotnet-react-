using Microsoft.EntityFrameworkCore;
using Catalogo.Api.Models;

namespace Catalogo.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Producto> Productos { get; set; }
    public DbSet<Categoria> Categorias { get; set; } // ¡Nueva tabla!

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Producto>().HasIndex(p => p.Sku).IsUnique();

        // 1. Cargar Categorías Iniciales
        modelBuilder.Entity<Categoria>().HasData(
            new Categoria { Id = 1, Nombre = "Electrónica" },
            new Categoria { Id = 2, Nombre = "Hogar" },
            new Categoria { Id = 3, Nombre = "Ropa" }
        );

        // 2. Cargar Productos vinculados a esas categorías
        modelBuilder.Entity<Producto>().HasData(
            new Producto { Id = 1, Nombre = "Laptop", Sku = "LPT01", Precio = 1000, Stock = 5, CategoriaId = 1 },
            new Producto { Id = 2, Nombre = "Sofá", Sku = "SFA02", Precio = 1500, Stock = 2, CategoriaId = 2 },
            new Producto { Id = 3, Nombre = "Audifonos", Sku = "LPT01", Precio = 100, Stock = 5, CategoriaId = 1 },
            new Producto { Id = 4, Nombre = "Pantalla", Sku = "PAN002", Precio = 800, Stock = 2, CategoriaId = 1 },
            new Producto { Id = 5, Nombre = "Camisa Estampada ", Sku = "CAM001", Precio = 50, Stock = 2, CategoriaId = 3 }
        );
    }
}