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

## Parte 5 — Citas showroom
- Inicio → **Agendar visita** (calendario lun–vie 11–19 h)
- Desde un producto del catálogo: **Agendar visita al showroom**
- Panel → **Citas**: calendario, confirmar o cancelar

---

## Recorrido sugerido (cuando estén las 5 partes)

1. Inicio → Catálogo  
2. Agendar visita (elegir día y horario)  
3. Dashboard → Citas (aparece la reserva)  
4. Clientes → Panzoni → instrumentos  
5. Pendientes → alertas  
6. Stock → abrir producto con historial  
7. Ventas  

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
