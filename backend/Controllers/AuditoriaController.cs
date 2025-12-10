using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Catalogo.Api.Data;
using Catalogo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Catalogo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditoriaController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditoriaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> UploadCsv(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Por favor sube un archivo CSV.");

        var tempPath = Path.GetTempFileName() + ".csv";
        using (var stream = new FileStream(tempPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        try 
        {
            var processInfo = new ProcessStartInfo
            {
                FileName = "python3",
                Arguments = $"auditoria.py \"{tempPath}\"", 
                RedirectStandardOutput = true, 
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = "/app" 
            };

            using var process = Process.Start(processInfo);
            using var reader = process.StandardOutput;
            string resultadoPython = await reader.ReadToEndAsync();
            string errores = await process.StandardError.ReadToEndAsync();
            process.WaitForExit();

            if (!string.IsNullOrEmpty(errores)) 
                return BadRequest($"Error técnico en script: {errores}");

            if (resultadoPython.Contains("onflictos") || resultadoPython.Contains("onflicto"))
            {
                return Ok($"⛔ IMPORTACIÓN CANCELADA POR CONFLICTOS:\n\n" +
                          $"El sistema detectó SKUs duplicados o mal escritos. " +
                          $"Por seguridad, no se guardó nada en la base de datos.\n\n" +
                          $"{resultadoPython}");
            }


            int importados = 0;
            int omitidos = 0;

            var lineas = await System.IO.File.ReadAllLinesAsync(tempPath);

            foreach (var linea in lineas.Skip(1))
            {
                var columnas = linea.Split(',');
                
                if (columnas.Length >= 2)
                {
                    var skuCsv = columnas[0].Trim();
                    var nombreCsv = columnas[1].Trim();

                    bool existe = await _context.Productos.AnyAsync(p => p.Sku == skuCsv);

                    if (!existe)
                    {
                        var nuevoProducto = new Producto
                        {
                            Sku = skuCsv,
                            Nombre = nombreCsv,
                            Precio = 1,
                            Stock = 1,
                            CategoriaId = 1
                        };

                        _context.Productos.Add(nuevoProducto);
                        importados++;
                    }
                    else
                    {
                        omitidos++;
                    }
                }
            }

            if (importados > 0)
            {
                await _context.SaveChangesAsync();
            }

            return Ok($" ÉXITO TOTAL:\n\n" +
                      $"El archivo pasó la auditoría de Python y se procesó.\n" +
                      $"- Guardados en BD: {importados}\n" +
                      $"X Omitidos (ya existían): {omitidos}\n\n" +
                      $"Reporte Auditoría:\n{resultadoPython}");

        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
        finally 
        {
            if (System.IO.File.Exists(tempPath)) System.IO.File.Delete(tempPath);
        }
    }
}