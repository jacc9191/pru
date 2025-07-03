
    // ✅ Configuración de Firebase ya personalizada
    const firebaseConfig = {
      apiKey: "AIzaSyCdRD_7zjuRp5586wcaa2WA_ZhzecKf5jM",
      authDomain: "modaestilo-e8dec.firebaseapp.com",
      projectId: "modaestilo-e8dec",
      storageBucket: "modaestilo-e8dec.appspot.com", // ✅ CORREGIDO
      messagingSenderId: "710901651909",
      appId: "1:710901651909:web:fe0bd97a14b25e191653ac"
    };

    // ✅ Inicializar Firebase y Firestore
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
  


    // === main.js ===
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];



    function actualizarCarrito() {
      const div = document.getElementById('carrito');
      div.innerHTML = '';

      if (carrito.length === 0) {
        div.innerHTML = '<p style="text-align:center; color: #888;">🛒 El carrito está vacío</p>';
      }

      carrito.forEach((item, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'item-carrito-elegante';
        tarjeta.innerHTML = `
      <div class="carrito-info">
        <div class="info-superior">
          <h4>${item.nombre}</h4>
          <span class="icono-eliminar" onclick="eliminarProducto(${index})">❌</span>
        </div>
        <p>🎨 Color: <strong>${item.color}</strong></p>
        <p>📏 Talla: <strong>${item.talla}</strong></p>
        <p>💲 Precio: <strong>$${item.precio ? item.precio.toLocaleString() : 'N/A'}</strong></p>
      </div>
    `;
        div.appendChild(tarjeta);
      });

      const total = carrito.reduce((acc, item) => acc + item.precio, 0);
      document.getElementById('total-carrito').innerHTML = `
    <div class="total-carrito">
      🧾 <strong>Total:</strong> <span>$${total.toLocaleString()}</span>
    </div>
  `;

      localStorage.setItem('carrito', JSON.stringify(carrito));
    }


    function eliminarProducto(index) {
      carrito.splice(index, 1);
      actualizarCarrito();
    }

    function vaciarCarrito() {
      carrito.length = 0;
      actualizarCarrito();
      alert("Carrito vaciado.");
    }

function toggleCarrito() {
  const contenedor = document.getElementById('bloqueCarrito');
  const btn = document.querySelector('.fila-carrito button');

  const visible = !contenedor.classList.toggle('oculto');
  document.getElementById('formularioCliente').classList.add('oculto');

  btn.textContent = visible ? 'Ocultar Carrito' : 'Ver Carrito';
  btn.classList.remove('ver-carrito', 'ocultar-carrito');
  btn.classList.add(visible ? 'ocultar-carrito' : 'ver-carrito');

  actualizarCarrito();
}



 

    function mostrarFormulario() {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      const formContainer = document.getElementById('formularioCliente');
      formContainer.classList.remove('oculto');
    }

    function ocultarFormulario() {
      const formulario = document.getElementById('formularioCliente');
      formulario.classList.add('oculto');

      const carrito = document.getElementById('bloqueCarrito');
      carrito.classList.remove('oculto');
    }



    function mostrarNotificacion(mensaje = "Producto agregado al carrito 🛒") {
      const notif = document.getElementById("notificacion");
      notif.textContent = mensaje;
      notif.classList.remove("oculto");
      notif.classList.add("mostrar");
      setTimeout(() => {
        notif.classList.remove("mostrar");
        notif.classList.add("oculto");
      }, 3000);
    }

    function confirmarEnvioWhatsApp() {
      const campos = {
        nombre: document.getElementById('nombreCliente').value.trim(),
        departamento: document.getElementById('departamentoCliente').value.trim(),
        ciudad: document.getElementById('ciudadCliente').value.trim(),
        direccion: document.getElementById('direccionCliente').value.trim(),
        celular: document.getElementById('celularCliente').value.trim(),
        metodo: document.getElementById('metodoPagoCliente').value
      };

      for (const [key, value] of Object.entries(campos)) {
        if (!value) {
          alert('Por favor completa todos los campos del formulario.');
          return;
        }
      }

      if (!/^\d{10}$/.test(campos.celular)) {
        alert('Por favor ingresa un número de celular válido de 10 dígitos.');
        return;
      }


      if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }

      // Crear mensaje de pedido
      const fecha = new Date();
      const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
      let mensaje = `📦 *NUEVO PEDIDO*\n\n🗓️ *Fecha:* ${fechaFormateada}\n\n`;

      carrito.forEach((item, i) => {
        mensaje += `🥿 *Producto ${i + 1}*: ${item.nombre} - Color: ${item.color} - Talla: ${item.talla} - Precio: $${item.precio.toLocaleString()}\n`;
      });

      const total = carrito.reduce((acc, item) => acc + item.precio, 0);
      mensaje += `\n💰 *Total:* $${total.toLocaleString()}\n\n`;
      mensaje += `📍 *Nombre:* ${campos.nombre}\n`;
      mensaje += `🏛️ *Departamento:* ${campos.departamento}\n`;
      mensaje += `🏙️ *Ciudad:* ${campos.ciudad}\n`;
      mensaje += `🏠 *Dirección:* ${campos.direccion}\n`;
      mensaje += `📞 *Celular:* ${campos.celular}\n`;
      mensaje += `💳 *Método de pago:* ${campos.metodo}\n\n✅ Gracias por tu compra.`;

      const numeroWhatsApp = '573185634316';
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');

      // Limpiar y ocultar
      vaciarCarrito();

      const formulario = document.getElementById('formularioCliente');
      formulario.classList.add('oculto');

      const carritoContenedor = document.getElementById('bloqueCarrito');
      carritoContenedor.classList.remove('oculto');
    }


    function iniciarDescuentoIndividual(productoNode, minutosDescuento = 10) {
      const id = productoNode.getAttribute("data-id");
      const precioTag = productoNode.querySelector(".precio-producto");
      const precioConDescuento = productoNode.querySelector(".precio-con-descuento");
      const contador = productoNode.querySelector(".contador-individual");
      const mensajeDescuento = productoNode.querySelector(".descuento-tiempo");

      const precioOriginal = parseFloat(precioTag.getAttribute("data-precio-original"));
      const precioBase = parseFloat(precioTag.getAttribute("data-precio"));

      const precioExtraDescuento = Math.round(precioBase * 0.9);

      let inicio = localStorage.getItem(`descuentoInicio_${id}`);
      if (!inicio) {
        inicio = new Date().getTime();
        localStorage.setItem(`descuentoInicio_${id}`, inicio);
      } else {
        inicio = parseInt(inicio);
      }

      const fin = inicio + minutosDescuento * 60 * 1000;
      const ahora = new Date().getTime();

      if (ahora < fin) {
        precioConDescuento.textContent = `$${precioExtraDescuento.toLocaleString()}`;
        precioTag.setAttribute("data-precio", precioExtraDescuento);
      } else {
        precioConDescuento.textContent = `$${precioBase.toLocaleString()}`;
        precioTag.setAttribute("data-precio", precioBase);

        if (mensajeDescuento) mensajeDescuento.style.display = "none";

        const tachado = precioTag.querySelector("s");
        if (tachado) tachado.remove();
        return;
      }

      function actualizar() {
        const ahora = new Date().getTime();
        const distancia = fin - ahora;

        if (distancia <= 0) {
          clearInterval(intervalo);

          // Restaurar precio
          precioConDescuento.textContent = `$${precioBase.toLocaleString()}`;
          precioTag.setAttribute("data-precio", precioBase);

          // Quitar tachado
          const tachado = precioTag.querySelector("s");
          if (tachado) tachado.remove();

          // ✅ Ocultar mensaje
          if (mensajeDescuento) mensajeDescuento.style.display = "none";

          return;
        }

        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        contador.textContent =
          `${horas.toString().padStart(2, '0')}:` +
          `${minutos.toString().padStart(2, '0')}:` +
          `${segundos.toString().padStart(2, '0')}`;
      }

      actualizar();
      const intervalo = setInterval(actualizar, 1000);
    }


    function cargarProductosDesdeFirebase() {
      db.collection("productos").onSnapshot(snapshot => {
        const contenedor = document.getElementById("contenedor-productos");
        contenedor.innerHTML = "";

        snapshot.forEach(doc => {
          const p = doc.data();
          const id = doc.id;

          const contenedorProducto = document.createElement("div");
          contenedorProducto.className = "producto";
          contenedorProducto.setAttribute("data-id", id);
          contenedorProducto.setAttribute("data-imagenes", JSON.stringify(p.imagenes || {}));

          contenedorProducto.innerHTML = `
        <img class="main-img" src="${Object.values(p.imagenes || {})[0] || ''}" alt="${p.nombre}">

        <div class="imagenes-carrusel carrusel-scroll">
          ${(Object.entries(p.imagenes || {})).map(([color, url]) =>
            `<img src="${url}" alt="${color}" class="img-mini" data-color="${color}">`).join("")}
        </div>

        <h2>${p.nombre}</h2>

        <p class="precio-producto" data-precio="${p.precio}" data-precio-original="${p.precioOriginal}">
          Precio: <s>$${parseInt(p.precioOriginal).toLocaleString()}</s>
          <strong class="precio-con-descuento">$${parseInt(p.precio).toLocaleString()}</strong>
        </p>

        <div class="cuenta-producto descuento-tiempo" style="font-size:0.9rem; margin-top:0.5rem; color: red;">
  ⏳ Descuento 10% extra termina en: <span class="contador-individual">00:00:00</span>
</div>


        <div class="carrusel-colores carrusel-scroll">
          ${(p.colores || Object.keys(p.imagenes || {})).map(color => `
            <div class="color-item">${color}</div>`).join("")}
        </div>

        <div class="carrusel-tallas carrusel-scroll">
          ${(p.tallas || []).map(talla => `
            <div class="talla-item">${talla}</div>`).join("")}
        </div>

        <button class="btn-agregar">Agregar al carrito</button>
      `;

          contenedor.appendChild(contenedorProducto);
          inicializarCarruselInteractivo(contenedorProducto);
          iniciarDescuentoIndividual(contenedorProducto, 10);
        });
      });
    }

    function inicializarCarruselInteractivo(producto) {
      const imagenes = JSON.parse(producto.getAttribute('data-imagenes') || '{}');
      const mainImg = producto.querySelector('.main-img');
      const miniaturas = hacerCarruselInfinito(producto.querySelector('.imagenes-carrusel'), '.img-mini');
      const colores = hacerCarruselInfinito(producto.querySelector('.carrusel-colores'), '.color-item');
      const tallas = hacerCarruselInfinito(producto.querySelector('.carrusel-tallas'), '.talla-item');

      const boton = producto.querySelector('.btn-agregar');
      const nombre = producto.querySelector('h2').textContent;
      const precioTexto = producto.querySelector('.precio-con-descuento').textContent.replace(/[$.]/g, '');
      const precio = parseInt(precioTexto);

      let colorSeleccionado = null;
      let tallaSeleccionada = null;

      miniaturas.forEach(img => {
        img.addEventListener('click', () => {
          miniaturas.forEach(i => i.classList.remove('active'));
          img.classList.add('active');
          mainImg.src = img.src;
          colorSeleccionado = img.getAttribute('data-color');
          colores.forEach(c => {
            c.classList.remove('active');
            if (c.textContent.trim() === colorSeleccionado) c.classList.add('active');
          });
          centrarElementoEnCarrusel(producto.querySelector('.imagenes-carrusel'), img);
        });
      });

      colores.forEach(c => {
        c.addEventListener('click', () => {
          colores.forEach(i => i.classList.remove('active'));
          c.classList.add('active');
          colorSeleccionado = c.textContent.trim();
          if (imagenes[colorSeleccionado]) {
            mainImg.src = imagenes[colorSeleccionado];
            miniaturas.forEach(img => {
              img.classList.toggle('active', img.getAttribute('data-color') === colorSeleccionado);
            });
          }
          centrarElementoEnCarrusel(producto.querySelector('.carrusel-colores'), c);
        });
      });

      tallas.forEach(t => {
        t.addEventListener('click', () => {
          tallas.forEach(i => i.classList.remove('active'));
          t.classList.add('active');
          tallaSeleccionada = t.textContent.trim();
          centrarElementoEnCarrusel(producto.querySelector('.carrusel-tallas'), t);
        });
      });

      boton.addEventListener('click', () => {
        if (!colorSeleccionado || !tallaSeleccionada) {
          alert("Selecciona color y talla antes de agregar al carrito.");
          return;
        }

        const imagen = mainImg.src;
        carrito.push({
          nombre,
          color: colorSeleccionado,
          talla: tallaSeleccionada,
          precio,
          imagen
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        mostrarNotificacion();
      });

    }


    function hacerCarruselInfinito(carrusel, claseItem) {
      const originales = Array.from(carrusel.querySelectorAll(claseItem));
      const total = originales.length;
      if (total <= 1) return originales;

      // ✅ Duplica 10 veces para dar efecto de cinta
      let clones = [];
      for (let i = 0; i < 9; i++) {
        originales.forEach(item => {
          const clon = item.cloneNode(true);
          clon.classList.add("clon");
          clones.push(clon);
        });
      }

      carrusel.innerHTML = '';
      clones.forEach(n => carrusel.appendChild(n));

      // No se fuerza scrollLeft: dejamos que el usuario lo controle
      return Array.from(carrusel.querySelectorAll(claseItem));
    }


    function actualizarActivoCentral(carrusel, claseItem) {
      const items = Array.from(carrusel.querySelectorAll(claseItem));

      // Si el usuario ya seleccionó manualmente, no forzar
      const seleccionado = items.find(i => i.classList.contains("active") && !i.classList.contains("clon"));
      if (seleccionado) return;

      const centro = carrusel.scrollLeft + carrusel.offsetWidth / 2;
      let mejor = null;
      let menor = Infinity;

      items.forEach(item => {
        const centroItem = item.offsetLeft + item.offsetWidth / 2;
        const distancia = Math.abs(centro - centroItem);
        if (distancia < menor) {
          menor = distancia;
          mejor = item;
        }
      });

      if (mejor) {
        items.forEach(i => i.classList.remove("active"));
        mejor.classList.add("active");
      }
    }


    function centrarElementoEnCarrusel(carrusel, elemento) {
      const items = Array.from(carrusel.querySelectorAll(`.${elemento.classList[0]}`));

      // Buscar el clon más cercano visualmente al centro del carrusel
      const centroCarrusel = carrusel.scrollLeft + carrusel.offsetWidth / 2;

      let mejor = elemento;
      let menorDistancia = Infinity;

      items.forEach(item => {
        if (item.textContent.trim() !== elemento.textContent.trim()) return;

        const centroItem = item.offsetLeft + item.offsetWidth / 2;
        const distancia = Math.abs(centroItem - centroCarrusel);

        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          mejor = item;
        }
      });

      const carruselRect = carrusel.getBoundingClientRect();
      const elemRect = mejor.getBoundingClientRect();
      const offset = elemRect.left - carruselRect.left - carrusel.offsetWidth / 2 + elemRect.width / 2;

      carrusel.scrollTo({
        left: carrusel.scrollLeft + offset,
        behavior: 'smooth'
      });
    }


    window.addEventListener("DOMContentLoaded", () => {
      actualizarCarrito();
      cargarProductosDesdeFirebase();
    });

  