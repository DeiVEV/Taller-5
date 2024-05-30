document.addEventListener('DOMContentLoaded', function() {
    const fechaEvento = document.getElementById('numhor');
    const horaEvento = document.getElementById('hour');
    const descripcionEvento = document.getElementById('event');
    const participantesEvento = document.getElementById('members');
    const calendario = document.getElementById('calendario');
    const actually = document.getElementById('actually');
    const btnantes = document.getElementById('antes');
    const btnnext = document.getElementById('next');
    const anual = document.getElementById('anual');
    const btnVistaMensual = document.getElementById('mensual');
    const diaria = document.getElementById('diaria');
    const formulario = document.getElementById('eventscreate');

    const btnBorrar = document.getElementById('btn-borrar');

    let eventos = [];
    let fechaActual = new Date();
    let eventoSeleccionado = null;
    let vistaActual = 'mensual';

    const horasDia = Array.from({ length: 24 }, (_, i) => {
        const hora = i % 12 === 0 ? 12 : i % 12;
        const periodo = i < 12 ? 'AM' : 'PM';
        return `${hora}:00 ${periodo}`;
    });

    function actualizarSelectHoras() {
        horaEvento.innerHTML = '';
        horasDia.forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            horaEvento.appendChild(option);
        });
    }

    function renderizarCalendario() {
        calendario.innerHTML = '';
        
        if (vistaActual === 'anual') {
            actually.textContent = `Año ${fechaActual.getFullYear()}`;
            for (let mes = 0; mes < 12; mes++) {
                const divMes = document.createElement('div');
                divMes.className = 'mes';
                divMes.innerHTML = `<h3>${new Date(fechaActual.getFullYear(), mes).toLocaleString('default', { month: 'long' })}</h3>`;
                const diasMes = document.createElement('div');
                diasMes.className = 'dias-mes';
                const primerDia = new Date(fechaActual.getFullYear(), mes, 1).getDay();
                const ultimoDia = new Date(fechaActual.getFullYear(), mes + 1, 0).getDate();
                for (let i = 0; i < primerDia; i++) {
                    const divVacio = document.createElement('div');
                    diasMes.appendChild(divVacio);
                }
                for (let dia = 1; dia <= ultimoDia; dia++) {
                    const divDia = document.createElement('div');
                    divDia.textContent = dia;
                    divDia.addEventListener('click', () => seleccionarFecha(dia, mes));
                    diasMes.appendChild(divDia);
                }
                divMes.appendChild(diasMes);
                calendario.appendChild(divMes);
            }
        } else if (vistaActual === 'mensual') {
            const year = fechaActual.getFullYear();
            const mes = fechaActual.getMonth();
            const primerDia = new Date(year, mes, 1).getDay();
            const ultimoDia = new Date(year, mes + 1, 0).getDate();
            
            actually.textContent = `${fechaActual.toLocaleString('default', { month: 'long' })} ${year}`;
            
            for (let i = 0; i < primerDia; i++) {
                const divVacio = document.createElement('div');
                calendario.appendChild(divVacio);
            }
            for (let dia = 1; dia <= ultimoDia; dia++) {
                const divDia = document.createElement('div');
                divDia.textContent = dia;
                divDia.addEventListener('click', () => seleccionarFecha(dia));
                calendario.appendChild(divDia);
            }
        } else if (vistaActual === 'diaria') {
            actually.textContent = `Eventos del ${fechaEvento.value}`;
            horasDia.forEach(hora => {
                const hour = document.createElement('div');
                hour.textContent = hora;
                const evento = eventos.find(e => e.fecha === fechaEvento.value && e.hora === hora);
                if (evento) {
                    hour.textContent += ` - ${evento.descripcion} (${evento.participantes})`;
                    hour.style.backgroundColor = '#ddd';
                } else {
                    hour.style.backgroundColor = '#fff';
                }
                calendario.appendChild(hour);
            });
        }
        
        mostrarEventos();
    }

   

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const nuevoEvento = {
            fecha: fechaEvento.value,
            hora: horaEvento.value,
            descripcion: descripcionEvento.value,
            participantes: participantesEvento.value
        };

        const index = eventos.findIndex(e => e.fecha === nuevoEvento.fecha && e.hora === nuevoEvento.hora);
        if (index > -1) {
            eventos[index] = nuevoEvento;
        } else {
            eventos.push(nuevoEvento);
        }

        mostrarEventos();
        formulario.reset();
        if (vistaActual === 'diaria') {
            renderizarCalendario();
        }
    });

    btnBorrar.addEventListener('click', function() {
        if (eventoSeleccionado) {
            eventos = eventos.filter(e => !(e.fecha === eventoSeleccionado.fecha && e.hora === eventoSeleccionado.hora));
            mostrarEventos();
            formulario.reset();
            if (vistaActual === 'diaria') {
                renderizarCalendario();
            }
        }
    });

    function seleccionarFecha(dia, mes = null) {
        const fechaSeleccionada = new Date(fechaActual.getFullYear(), mes !== null ? mes : fechaActual.getMonth(), dia);
        fechaEvento.value = fechaSeleccionada.toISOString().split('T')[0];

        eventoSeleccionado = eventos.find(e => e.fecha === fechaEvento.value);
        if (eventoSeleccionado) {
            horaEvento.value = eventoSeleccionado.hora;
            descripcionEvento.value = eventoSeleccionado.descripcion;
            participantesEvento.value = eventoSeleccionado.participantes;
        } else {
            formulario.reset();
            fechaEvento.value = fechaSeleccionada.toISOString().split('T')[0];
        }

        if (vistaActual === 'diaria') {
            renderizarCalendario();
        }
    }

    function mostrarEventos() {
        if (vistaActual === 'mensual' || vistaActual === 'anual') {
            const elementosDias = document.querySelectorAll('#calendario div');

            elementosDias.forEach((elemento, indice) => {
                const dia = indice - new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay() + 1;
                const mes = vistaActual === 'anual' ? Math.floor(indice / (35 + 7)) : fechaActual.getMonth();
                const fecha = new Date(fechaActual.getFullYear(), mes, dia).toISOString().split('T')[0];

                const evento = eventos.find(e => e.fecha === fecha);
                if (evento) {
                    elemento.style.backgroundColor = '#ddd';
                    elemento.addEventListener('click', () => seleccionarFecha(dia, mes));
                } else {
                    elemento.style.backgroundColor = '#fff';
                }
            });
        }
    }

    btnantes.addEventListener('click', () => {
        if (vistaActual === 'anual') {
            fechaActual.setFullYear(fechaActual.getFullYear() - 1);
        } else {
            fechaActual.setMonth(fechaActual.getMonth() - 1);
        }
        renderizarCalendario();
    });

    btnnext.addEventListener('click', () => {
        if (vistaActual === 'anual') {
            fechaActual.setFullYear(fechaActual.getFullYear() + 1);
        } else {
            fechaActual.setMonth(fechaActual.getMonth() + 1);
        }
        renderizarCalendario();
    });

    anual.addEventListener('click', () => {
        vistaActual = 'anual';
        renderizarCalendario();
    });

    btnVistaMensual.addEventListener('click', () => {
        vistaActual = 'mensual';
        renderizarCalendario();
    });

    diaria.addEventListener('click', () => {
        vistaActual = 'diaria';
        renderizarCalendario();
    });

    actualizarSelectHoras();
    renderizarCalendario();
});
