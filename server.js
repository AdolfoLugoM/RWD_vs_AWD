const express = require('express');
const expressUserAgent = require('express-useragent');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(expressUserAgent.express());
app.use(express.static(path.join(__dirname)));

// ---------- Datos del catálogo (fuera de las rutas) ----------
const TIPOS = [
    { value: 'fuente',        label: 'Fuente de Poder' },
    { value: 'tarjeta-madre', label: 'Tarjeta Madre' },
    { value: 'tarjeta-video', label: 'Tarjeta de Video' },
    { value: 'ram',           label: 'Memoria RAM' },
    { value: 'enfriamiento',  label: 'Enfriamiento Líquido' },
    { value: 'gabinete',      label: 'Gabinete' }
];

const products = [
    { id: 1,  tipo: 'fuente',        componente: 'Fuente de Poder',      name: 'Fuente de Poder Corsair RM750e 80 PLUS Gold ATX',                 specs: 'Modular, 24-pin ATX, 120mm, 750W',                                                    precio: 1619,  image: '/IMAGES/CP-CORSAIR-CP-9020295-NA-de5805.webp' },
    { id: 2,  tipo: 'tarjeta-madre', componente: 'Tarjeta Madre',        name: 'Tarjeta Madre MSI B650M GAMING WIFI',                             specs: 'Micro-ATX, Socket AM5, AMD B650, 128GB DDR5, HDMI/DP para AMD',                       precio: 2379,  image: '/IMAGES/CP-MSI-B650MGAMINGWIFI-6de82b.jpg' },
    { id: 3,  tipo: 'gabinete',      componente: 'Gabinete',             name: 'Gabinete Balam Rush DRAGONFLY VENTRA',                            specs: 'Midi-Tower, ATX/Micro-ATX/Mini-ITX, USB 2.0/3.0, sin Fuente, 4 Ventiladores Instalados, Negro', precio: 879,   image: '/IMAGES/CP-BALAMRUSH-BR-943956-82ee95.jpg' },
    { id: 4,  tipo: 'tarjeta-video', componente: 'Tarjeta de Video',     name: 'Tarjeta de Video XFX AMD Radeon RX 9050 SWIFT',                   specs: '8GB 128-bit GDDR6, PCI Express 5.0, Mín. 450W',                                       precio: 6379,  image: '/IMAGES/CP-XFX-RX-95SWFT8BE-166e37.jpg' },
    { id: 5,  tipo: 'enfriamiento',  componente: 'Enfriamiento Líquido', name: 'MSI MAG CORELIQUID A13 360 Enfriamiento Líquido',                 specs: 'CPU, 3x 120mm, hasta 2000RPM, Negro',                                                 precio: 1189,  image: '/IMAGES/CP-MSI-MAGCORELIQUIDA13360-c34f8a.jpg' },
    { id: 6,  tipo: 'ram',           componente: 'Memoria RAM',          name: 'Memoria RAM XPG Lancer Blade DDR5',                               specs: 'DDR5, 6000MHz, 16GB, CL48, XMP/EXPO, Blanco',                                         precio: 5789,  image: '/IMAGES/CP-XPG-AX5U6000C4816G-SLABRWH-0313c8.jpg' },
    { id: 7,  tipo: 'tarjeta-video', componente: 'Tarjeta de Video',     name: 'Tarjeta de Video ASUS NVIDIA GeForce RTX 5070 Ti Prime',          specs: '16GB 256-bit GDDR7, PCI Express 5.0',                                                 precio: 25449, image: '/IMAGES/CP-ASUS-90YV0MF1-M0AA00-55ef2c.jpg' },
    { id: 8,  tipo: 'fuente',        componente: 'Fuente de Poder',      name: 'Fuente de Poder Cooler Master MPX-C005-AFAG-BUS 80 PLUS Gold ATX', specs: 'Modular, 24-pin ATX, 12VHPWR, 135mm, 1200W',                                         precio: 2109,  image: '/IMAGES/CP-COOLERMASTER-MPX-C005-AFAG-BUS-3cd020.jpg' },
    { id: 9,  tipo: 'tarjeta-madre', componente: 'Tarjeta Madre',        name: 'Tarjeta Madre Gigabyte Z790 Eagle AX',                            specs: 'ATX, LGA 1700, Intel Z790, 192GB DDR5, HDMI/DP para Intel',                           precio: 3849,  image: '/IMAGES/CP-GIGABYTE-Z790EAGLEAX-6b7d39.jpg' },
    { id: 10, tipo: 'gabinete',      componente: 'Gabinete',             name: 'Gabinete Xzeal CXi1',                                             specs: 'Mini-Tower, Micro-ATX/Mini-ITX, USB 2.0/3.0, sin Fuente, 3 Ventiladores Instalados, Negro', precio: 739,   image: '/IMAGES/CP-XZEAL-XZGAMC1B-0d2ea2.jpg' },
    { id: 11, tipo: 'enfriamiento',  componente: 'Enfriamiento Líquido', name: 'Corsair iCUE Link H100i RGB AIO Enfriamiento Líquido',            specs: 'CPU, 2x 120mm, hasta 2400RPM, Negro',                                                 precio: 1849,  image: '/IMAGES/CP-CORSAIR-CW-9061001-WW-037926.jpg' },
    { id: 12, tipo: 'ram',           componente: 'Memoria RAM',          name: 'Memoria RAM XPG Spectrix D35G DDR4',                              specs: 'DDR4, 3200MHz, 16GB, CL16, XMP',                                                      precio: 2799,  image: '/IMAGES/CP-XPG-AX4U320016G16A-SBKD35G-cbcacf.jpg' }
];

// ---------- Versión A: RWD (Responsive) ----------
app.get('/responsive', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ---------- Versión B: AWD (Adaptive) con filtro en servidor ----------
app.get('/adaptive', (req, res) => {
    const isMobile = req.useragent.isMobile;

    // Filtros que llegan por la URL: /adaptive?tipo=ram&min=1000&max=3000
    const { tipo = '', min = '', max = '' } = req.query;
    const minN = Number(min) || 0;
    const maxN = Number(max) || Infinity;

    const filtrados = products.filter(p =>
        (tipo === '' || p.tipo === tipo) && p.precio >= minN && p.precio <= maxN
    );

    const datos = { products: filtrados, tipos: TIPOS, filtros: { tipo, min, max } };

    if (isMobile) {
        // En móvil no se incluye el gráfico pesado ni tablas extensas
        res.render('mobile', datos);
    } else {
        // En desktop se envía la vista completa con analíticas y gráficos
        res.render('desktop', { ...datos, includeAnalytics: true });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});