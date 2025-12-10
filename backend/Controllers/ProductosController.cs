using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Catalogo.Api.Data;
using Catalogo.Api.Models;

namespace Catalogo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Producto>>> Get(string? buscar)
    {
        var query = _context.Productos.Include(p => p.Categoria).AsQueryable();
        if (!string.IsNullOrEmpty(buscar))
        {
            query = query.Where(p => p.Nombre.Contains(buscar) || p.Sku.Contains(buscar));
        }
        return await query.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Producto>> Post(Producto producto)
    {
        // Validar si SKU existe
        if (await _context.Productos.AnyAsync(p => p.Sku == producto.Sku))
            return BadRequest("El SKU ya existe");

        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = producto.Id }, producto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Producto>> GetProducto(int id)
    {
        // Buscamos el producto Y también cargamos su categoría 
        var producto = await _context.Productos
            .Include(p => p.Categoria) 
            .FirstOrDefaultAsync(p => p.Id == id);

        if (producto == null)
        {
            return NotFound(); // Retorna 404
        }

        return producto;
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> PutProducto(int id, Producto producto)
    {
        // 1. Validación de seguridad: El ID de la URL debe coincidir con el del cuerpo
        if (id != producto.Id)
        {
            return BadRequest("el ID de la URL no coincide con el del cuerpo");
        }
        _context.Entry(producto).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductoExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent(); 
    }

    private bool ProductoExists(int id)
    {
        return _context.Productos.Any(e => e.Id == id);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProducto(int id)
    {
        // 1. Buscar el producto
        var producto = await _context.Productos.FindAsync(id);
        
        // 2. Si no existe devolvemos 404
        if (producto == null)
        {
            return NotFound();
        }

        // 3. Borrar y guardar
        _context.Productos.Remove(producto);
        await _context.SaveChangesAsync();

        // 4. Retornar 204 "Borrado con éxito"
        return NoContent();
    }
}