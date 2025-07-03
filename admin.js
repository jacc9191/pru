const firebaseConfig = {
  apiKey: "AIzaSyCdRD_7zjuRp5586wcaa2WA_ZhzecKf5jM",
  authDomain: "modaestilo-e8dec.firebaseapp.com",
  projectId: "modaestilo-e8dec",
  storageBucket: "modaestilo-e8dec.appspot.com",
  messagingSenderId: "710901651909",
  appId: "1:710901651909:web:fe0bd97a14b25e191653ac"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function loginFirebase() {
  const correo = document.getElementById("correo").value;
  const clave = document.getElementById("clave").value;
  auth.signInWithEmailAndPassword(correo, clave)
    .then(() => {
      document.getElementById("login").style.display = "none";
      document.getElementById("admin").style.display = "block";
      cargarProductos();
    })
    .catch(err => {
      alert("❌ Error: " + err.message);
    });
}

function actualizarPreview() {
  const imagen = document.getElementById("nuevoImagenes").value.trim();
  const color = document.getElementById("nuevoColor").value.trim().toLowerCase();
  const imagenes = {};
  imagen.split(",").forEach(par => {
    const [c, url] = par.split("|").map(s => s.trim());
    if (c && url) imagenes[c.toLowerCase()] = url;
  });
  const preview = document.getElementById("preview");
  preview.src = imagenes[color] || '';
}

function agregarProducto() {
  const nombre = document.getElementById("nuevoNombre").value.trim();
  const precio = parseInt(document.getElementById("nuevoPrecio").value);
  const precioOriginal = parseInt(document.getElementById("nuevoPrecioOriginal").value);
  const imagen = document.getElementById("nuevoImagenes").value.trim();
  const color = document.getElementById("nuevoColor").value.trim();
  const tallas = document.getElementById("nuevoTallas").value.split(',').map(t => t.trim());
  if (!nombre || isNaN(precio) || isNaN(precioOriginal) || !imagen || !color || tallas.length === 0) {
    alert("❌ Por favor completa todos los campos correctamente.");
    return;
  }
  const imagenes = {};
  imagen.split(",").forEach(par => {
    const [c, url] = par.split("|").map(s => s.trim());
    if (c && url) imagenes[c.toLowerCase()] = url;
  });
  const data = {
    nombre,
    precio,
    precioOriginal,
    imagen: imagenes[color.toLowerCase()],
    color,
    tallas,
    imagenes
  };
  db.collection("productos").add(data)
    .then(() => {
      alert("✅ Producto agregado exitosamente.");
      document.getElementById("nuevoNombre").value = "";
      document.getElementById("nuevoPrecio").value = "";
      document.getElementById("nuevoPrecioOriginal").value = "";
      document.getElementById("nuevoImagenes").value = "";
      document.getElementById("nuevoColor").value = "";
      document.getElementById("nuevoTallas").value = "";
      document.getElementById("preview").src = "";
    })
    .catch(err => {
      console.error("Error al agregar:", err);
      alert("❌ No se pudo agregar el producto.");
    });
}

function eliminarProducto(id) {
  if (confirm("¿Eliminar este producto?")) {
    db.collection("productos").doc(id).delete()
      .then(() => alert("✅ Producto eliminado."))
      .catch(err => alert("❌ Error al eliminar: " + err.message));
  }
}

function cargarProductos() {
  db.collection("productos").onSnapshot(snapshot => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      const div = document.createElement("div");
      div.className = "producto-item";
      div.innerHTML = `
        <strong>${p.nombre}</strong><br>
        💰 Precio: $${p.precio.toLocaleString()} - <s>$${p.precioOriginal.toLocaleString()}</s><br>
        <div style="display: flex; gap: 8px; overflow-x: auto; white-space: nowrap; padding: 5px 0;">
          🎨 ${Object.keys(p.imagenes).map(color =>
            `<div style="display: inline-block; text-align: center;">
              <img src="${p.imagenes[color]}" alt="${color}" style="height: 50px; border-radius: 6px;"><br>
              <span style="font-size: 12px;">${color}</span>
            </div>`).join('')}
        </div>
        <div style="display: flex; gap: 8px; overflow-x: auto; white-space: nowrap; padding: 5px 0;">
          📏 ${p.tallas.map(t => `
            <span style="display: inline-block; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 14px;">
              ${t}
            </span>`).join('')}
        </div>
        <div class="acciones">
          <button onclick="eliminarProducto('${doc.id}')">Eliminar</button>
        </div>`;
      contenedor.appendChild(div);
    });
  });
}
