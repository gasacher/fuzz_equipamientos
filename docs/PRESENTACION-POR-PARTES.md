# Presentación al cliente — por partes

Un solo link: **https://gasacher.github.io/fuzz_equipamientos/**

Publicamos en etapas para que el build sea rápido y estable (~30 s por parte).

## Parte 1 — Ya online
- Inicio (elegir catálogo o panel)
- Catálogo web público
- Panel: stock, ventas, catálogo admin, formularios demo

## Parte 2 — Clientes
- Menú **Clientes**
- Listado con nº FUZZ, teléfono, cantidad de instrumentos
- Perfil: datos, contratos (demo), todos los instrumentos del cliente
- **Mostrar:** Panzoni (FUZZ-0012), Horacio Castro (FUZZ-0003)

## Parte 3 — Control interno
- Menú **Pendientes**
- Cola con tags y alertas por demora
- Dashboard con resumen de pendientes

## Parte 4 — Trazabilidad
- Ficha de instrumento con estado, ubicación e historial con fechas
- Ejemplos: *Estuche Gator Les Paul*, *Marshall 412* (vendido + recibo)

---

## Recorrido sugerido (cuando estén las 4 partes)

1. Inicio → Dashboard  
2. Clientes → Panzoni → instrumentos  
3. Pendientes → alertas  
4. Stock → abrir producto con historial  
5. Ventas → Catálogo web  

## Publicar cada parte

```bash
cd web
npm run build:gh-pages
# subir web/out/ a rama gh-pages
```

Si el build tarda mucho: suele ser un proceso anterior colgado. Cerrar y:

```bash
pkill -f "next build"
rm -rf web/.next web/.gh-pages-stash
npm run build:gh-pages
```
