const form = document.getElementById('filtros');
const tarjetas = document.querySelectorAll('.product-card');
const contador = document.getElementById('contador');

function aplicarFiltros() {
    const tipo = form.elements.tipo.value;
    const min = parseFloat(form.elements.min.value) || 0;
    const max = parseFloat(form.elements.max.value) || Infinity;
    let visibles = 0;

    tarjetas.forEach(card => {
        const precio = Number(card.dataset.precio);
        const coincideTipo = tipo === '' || card.dataset.tipo === tipo;
        const coincidePrecio = precio >= min && precio <= max;
        const mostrar = coincideTipo && coincidePrecio;   // "y/o": se combinan ambos

        card.hidden = !mostrar;
        if (mostrar) visibles++;
    });

    contador.textContent = visibles
        ? `Mostrando ${visibles} de ${tarjetas.length} productos`
        : 'Ningún producto coincide con los filtros';
}

form.addEventListener('input', aplicarFiltros);                     // filtra mientras escribes o eliges
form.addEventListener('reset', () => setTimeout(aplicarFiltros, 0)); // espera a que se limpien los campos
form.addEventListener('submit', e => e.preventDefault());           // Enter no recarga la página
aplicarFiltros();