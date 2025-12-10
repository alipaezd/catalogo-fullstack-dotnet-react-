import csv
import re
import sys 

def normalizar_sku(sku_sucio):
    return re.sub(r'[^a-z0-9]', '', sku_sucio.lower())

def detectar_duplicados(archivo_csv):
    mapa_skus = {}
    resultado = []
    try:
        with open(archivo_csv, mode='r', encoding='utf-8') as f:
            lector = csv.DictReader(f)
            for fila in lector:
                sku_original = fila.get('sku', '')
                if not sku_original: continue
                
                sku_clean = normalizar_sku(sku_original)
                if sku_clean in mapa_skus:
                    mapa_skus[sku_clean].append(sku_original)
                else:
                    mapa_skus[sku_clean] = [sku_original]
    except Exception as e:
        print(f"Error leyendo CSV: {str(e)}")
        return

    encontrados = 0
    for sku_clean, lista_originales in mapa_skus.items():
        if len(lista_originales) > 1:
            encontrados += 1
            resultado.append(f"Conflicto detectado en '{sku_clean}': {', '.join(lista_originales)}")

    if encontrados == 0:
        print("Análisis completado: No se encontraron duplicados")
    else:
        print(f"Se encontraron {encontrados} conflictos:\n" + "\n".join(resultado))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        detectar_duplicados(sys.argv[1])
    else:
        print("Error: No se recibiio archivo")