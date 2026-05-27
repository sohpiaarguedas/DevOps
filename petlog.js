// ─────────────────────────────────────────────
//  PetLog · petlog.js
//  Lógica de negocio pura — sin Vue, sin DOM.
//  Importado por app.js y por las pruebas Jest.
// ─────────────────────────────────────────────

// ── Constantes de dominio ────────────────────
const EMOJI  = { gato: '🐱', perro: '🐶', dinosaurio: '🦕' }
const STRIPE = { gato: '#67e8f9', perro: '#fbbf24', dinosaurio: '#a78bfa' }

const ESPECIES_VALIDAS = ['gato', 'perro', 'dinosaurio']

// ── Modelo vacío ─────────────────────────────
// ✏️ Para agregar un atributo nuevo, añádelo aquí también.
function campoVacio() {
  return {
    id:       null,
    nombre:   '',
    especie:  '',
    edad:     '',
    color:    '',
    alimento: '',
  }
}

// ── Helpers de vista ─────────────────────────
function emojiEspecie(especie) {
  return EMOJI[especie] || '🐾'
}

function colorStripe(especie) {
  return STRIPE[especie] || '#444'
}

// ── Filtrado ─────────────────────────────────
function filtrarMascotas(mascotas, { filtroActivo = 'todos', busqueda = '' } = {}) {
  return mascotas.filter(m => {
    const porEspecie = filtroActivo === 'todos' || m.especie === filtroActivo
    const porNombre  = !busqueda || m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return porEspecie && porNombre
  })
}

// ── Conteo por especie ────────────────────────
function contarPor(mascotas, especie) {
  return mascotas.filter(m => m.especie === especie).length
}

// ── Validación ───────────────────────────────
// Retorna un objeto con los errores encontrados.
// Retorna {} si el formulario es válido.
// ✏️ Para validar un campo nuevo, agrégalo aquí.
function validarForm(form) {
  const e = {}
  if (!form.nombre || !String(form.nombre).trim())
    e.nombre = 'El nombre es requerido.'
  if (!form.especie || !String(form.especie).trim())
    e.especie = 'Selecciona una especie.'
  if (form.edad === '' || form.edad === null || form.edad === undefined)
    e.edad = 'La edad es requerida.'
  if (!form.color || !String(form.color).trim())
    e.color = 'Escribe el color de pelaje.'
  if (!form.alimento || !String(form.alimento).trim())
    e.alimento = 'El alimento favorito es requerido.'
  return e
}

// ── CRUD puro (operaciones sobre arrays) ─────

// CREATE: retorna nuevo array con la mascota añadida al inicio.
function crearMascota(mascotas, form, generarId = () => Date.now()) {
  const errores = validarForm(form)
  if (Object.keys(errores).length > 0) return { ok: false, errores, mascotas }
  const nueva = { ...form, id: generarId() }
  return { ok: true, errores: {}, mascotas: [nueva, ...mascotas] }
}

// UPDATE: retorna nuevo array con la mascota actualizada.
function actualizarMascota(mascotas, form) {
  const errores = validarForm(form)
  if (Object.keys(errores).length > 0) return { ok: false, errores, mascotas }
  const idx = mascotas.findIndex(m => m.id === form.id)
  if (idx === -1) return { ok: false, errores: { general: 'Mascota no encontrada.' }, mascotas }
  const nuevas = [...mascotas]
  nuevas[idx] = { ...form }
  return { ok: true, errores: {}, mascotas: nuevas }
}

// DELETE: retorna nuevo array sin la mascota eliminada.
function eliminarMascota(mascotas, id) {
  if (id === null || id === undefined)
    return { ok: false, mascotas, error: 'ID requerido.' }
  const existe = mascotas.some(m => m.id === id)
  if (!existe)
    return { ok: false, mascotas, error: 'Mascota no encontrada.' }
  return { ok: true, mascotas: mascotas.filter(m => m.id !== id), error: null }
}

// ── Exports ──────────────────────────────────
module.exports = {
  campoVacio,
  emojiEspecie,
  colorStripe,
  filtrarMascotas,
  contarPor,
  validarForm,
  crearMascota,
  actualizarMascota,
  eliminarMascota,
  ESPECIES_VALIDAS,
}
