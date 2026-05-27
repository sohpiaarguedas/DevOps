// ═══════════════════════════════════════════════════════════════
//  PetLog · tests/petlog.test.js
//  Suite completa de pruebas unitarias — Jest
//
//  SUPUESTOS EXPLÍCITOS
//  ────────────────────
//  1. La lógica de negocio fue extraída a petlog.js (puro JS, sin Vue).
//  2. `edad` acepta 0 como valor válido (0 años es una edad legítima).
//  3. `edad` negativa o no numérica NO es validada en validarForm()
//     actualmente → se escribe un test que FALLA para exponer la deuda técnica.
//  4. `especie` no está restringida a valores del enum en validarForm()
//     actualmente → se escribe un test que FALLA para exponer la deuda técnica.
//  5. Las funciones CRUD son puras: reciben y devuelven arrays, no mutan estado.
//  6. `generarId` es inyectable en crearMascota() para pruebas deterministas.
// ═══════════════════════════════════════════════════════════════

'use strict'

const {
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
} = require('../petlog')

// ─────────────────────────────────────────────
//  Fixture reutilizable
// ─────────────────────────────────────────────
function mascotaValida(overrides = {}) {
  return {
    id:       1,
    nombre:   'Luna',
    especie:  'gato',
    edad:     3,
    color:    'blanco',
    alimento: 'atún',
    ...overrides,
  }
}

function formValido(overrides = {}) {
  return {
    id:       null,
    nombre:   'Rex',
    especie:  'perro',
    edad:     5,
    color:    'café',
    alimento: 'pollo',
    ...overrides,
  }
}

// ═══════════════════════════════════════════════════════════════
//  1. campoVacio()
// ═══════════════════════════════════════════════════════════════
describe('campoVacio()', () => {

  test('retorna un objeto con todas las propiedades del modelo', () => {
    const campos = campoVacio()
    expect(campos).toHaveProperty('id',       null)
    expect(campos).toHaveProperty('nombre',   '')
    expect(campos).toHaveProperty('especie',  '')
    expect(campos).toHaveProperty('edad',     '')
    expect(campos).toHaveProperty('color',    '')
    expect(campos).toHaveProperty('alimento', '')
  })

  test('cada llamada retorna una instancia nueva (no el mismo objeto)', () => {
    const a = campoVacio()
    const b = campoVacio()
    expect(a).not.toBe(b)
  })

  test('mutar una instancia no afecta a la siguiente', () => {
    const a = campoVacio()
    a.nombre = 'Modificado'
    const b = campoVacio()
    expect(b.nombre).toBe('')
  })

})

// ═══════════════════════════════════════════════════════════════
//  2. emojiEspecie()
// ═══════════════════════════════════════════════════════════════
describe('emojiEspecie()', () => {

  test('retorna 🐱 para gato', () => {
    expect(emojiEspecie('gato')).toBe('🐱')
  })

  test('retorna 🐶 para perro', () => {
    expect(emojiEspecie('perro')).toBe('🐶')
  })

  test('retorna 🦕 para dinosaurio', () => {
    expect(emojiEspecie('dinosaurio')).toBe('🦕')
  })

  test('retorna 🐾 para especie desconocida', () => {
    expect(emojiEspecie('dragon')).toBe('🐾')
  })

  test('retorna 🐾 para string vacío', () => {
    expect(emojiEspecie('')).toBe('🐾')
  })

  test('retorna 🐾 para undefined', () => {
    expect(emojiEspecie(undefined)).toBe('🐾')
  })

  test('distingue mayúsculas (Gato ≠ gato)', () => {
    expect(emojiEspecie('Gato')).toBe('🐾')
  })

})

// ═══════════════════════════════════════════════════════════════
//  3. colorStripe()
// ═══════════════════════════════════════════════════════════════
describe('colorStripe()', () => {

  test('retorna color correcto para gato', () => {
    expect(colorStripe('gato')).toBe('#67e8f9')
  })

  test('retorna color correcto para perro', () => {
    expect(colorStripe('perro')).toBe('#fbbf24')
  })

  test('retorna color correcto para dinosaurio', () => {
    expect(colorStripe('dinosaurio')).toBe('#a78bfa')
  })

  test('retorna #444 para especie desconocida', () => {
    expect(colorStripe('unicornio')).toBe('#444')
  })

  test('retorna #444 para undefined', () => {
    expect(colorStripe(undefined)).toBe('#444')
  })

  test('retorna #444 para null', () => {
    expect(colorStripe(null)).toBe('#444')
  })

})

// ═══════════════════════════════════════════════════════════════
//  4. validarForm()
// ═══════════════════════════════════════════════════════════════
describe('validarForm()', () => {

  // ── Happy path ──
  test('retorna {} cuando todos los campos son válidos', () => {
    expect(validarForm(formValido())).toEqual({})
  })

  test('edad = 0 es válida (cachorro recién nacido)', () => {
    expect(validarForm(formValido({ edad: 0 }))).toEqual({})
  })

  // ── Campos requeridos ──
  test('reporta error si nombre está vacío', () => {
    const e = validarForm(formValido({ nombre: '' }))
    expect(e).toHaveProperty('nombre')
  })

  test('reporta error si nombre es solo espacios', () => {
    const e = validarForm(formValido({ nombre: '   ' }))
    expect(e).toHaveProperty('nombre')
  })

  test('reporta error si especie está vacía', () => {
    const e = validarForm(formValido({ especie: '' }))
    expect(e).toHaveProperty('especie')
  })

  test('reporta error si edad es string vacío', () => {
    const e = validarForm(formValido({ edad: '' }))
    expect(e).toHaveProperty('edad')
  })

  test('reporta error si edad es null', () => {
    const e = validarForm(formValido({ edad: null }))
    expect(e).toHaveProperty('edad')
  })

  test('reporta error si edad es undefined', () => {
    const e = validarForm(formValido({ edad: undefined }))
    expect(e).toHaveProperty('edad')
  })

  test('reporta error si color está vacío', () => {
    const e = validarForm(formValido({ color: '' }))
    expect(e).toHaveProperty('color')
  })

  test('reporta error si alimento está vacío', () => {
    const e = validarForm(formValido({ alimento: '' }))
    expect(e).toHaveProperty('alimento')
  })

  test('acumula todos los errores cuando el form está completamente vacío', () => {
    const e = validarForm(campoVacio())
    expect(Object.keys(e).length).toBeGreaterThanOrEqual(5)
  })

  test('no reporta error si solo un campo falta (aislamiento de errores)', () => {
    const e = validarForm(formValido({ color: '' }))
    expect(e).toHaveProperty('color')
    expect(e).not.toHaveProperty('nombre')
    expect(e).not.toHaveProperty('especie')
  })

  // ── Tests que EXPONEN deuda técnica (se espera que fallen con la lógica actual) ──

  test('[DEUDA] reporta error si edad es negativa', () => {
    // La función actual NO valida edades negativas.
    // Este test FALLA intencionalmente para señalar la deuda técnica.
    const e = validarForm(formValido({ edad: -1 }))
    expect(e).toHaveProperty('edad')
  })

  test('[DEUDA] reporta error si especie no pertenece al enum válido', () => {
    // La función actual acepta cualquier string no vacío como especie.
    // Este test FALLA intencionalmente para señalar la deuda técnica.
    const e = validarForm(formValido({ especie: 'dragon' }))
    expect(e).toHaveProperty('especie')
  })

  test('[DEUDA] reporta error si edad no es un número', () => {
    // La función actual no verifica el tipo de edad.
    const e = validarForm(formValido({ edad: 'mucho' }))
    expect(e).toHaveProperty('edad')
  })

})

// ═══════════════════════════════════════════════════════════════
//  5. filtrarMascotas()
// ═══════════════════════════════════════════════════════════════
describe('filtrarMascotas()', () => {

  let lista
  beforeEach(() => {
    lista = [
      mascotaValida({ id: 1, nombre: 'Luna',  especie: 'gato' }),
      mascotaValida({ id: 2, nombre: 'Rex',   especie: 'perro' }),
      mascotaValida({ id: 3, nombre: 'Lunes', especie: 'gato' }),
      mascotaValida({ id: 4, nombre: 'Dino',  especie: 'dinosaurio' }),
    ]
  })

  test('sin filtros retorna la lista completa', () => {
    expect(filtrarMascotas(lista)).toHaveLength(4)
  })

  test('filtroActivo="todos" retorna la lista completa', () => {
    expect(filtrarMascotas(lista, { filtroActivo: 'todos' })).toHaveLength(4)
  })

  test('filtra por especie correctamente', () => {
    const result = filtrarMascotas(lista, { filtroActivo: 'gato' })
    expect(result).toHaveLength(2)
    result.forEach(m => expect(m.especie).toBe('gato'))
  })

  test('filtra por nombre (búsqueda parcial)', () => {
    const result = filtrarMascotas(lista, { busqueda: 'lun' })
    expect(result).toHaveLength(2)
  })

  test('búsqueda es case-insensitive', () => {
    const result = filtrarMascotas(lista, { busqueda: 'REX' })
    expect(result).toHaveLength(1)
    expect(result[0].nombre).toBe('Rex')
  })

  test('combina filtro de especie y búsqueda por nombre', () => {
    const result = filtrarMascotas(lista, { filtroActivo: 'gato', busqueda: 'luna' })
    expect(result).toHaveLength(1)
    expect(result[0].nombre).toBe('Luna')
  })

  test('retorna [] si no hay coincidencias', () => {
    expect(filtrarMascotas(lista, { busqueda: 'zzz' })).toHaveLength(0)
  })

  test('retorna [] si la lista está vacía', () => {
    expect(filtrarMascotas([], { filtroActivo: 'gato' })).toHaveLength(0)
  })

  test('no muta el array original', () => {
    const copia = [...lista]
    filtrarMascotas(lista, { filtroActivo: 'gato' })
    expect(lista).toEqual(copia)
  })

  test('filtro por especie inexistente retorna []', () => {
    expect(filtrarMascotas(lista, { filtroActivo: 'unicornio' })).toHaveLength(0)
  })

})

// ═══════════════════════════════════════════════════════════════
//  6. contarPor()
// ═══════════════════════════════════════════════════════════════
describe('contarPor()', () => {

  let lista
  beforeEach(() => {
    lista = [
      mascotaValida({ especie: 'gato' }),
      mascotaValida({ especie: 'gato' }),
      mascotaValida({ especie: 'perro' }),
    ]
  })

  test('cuenta correctamente mascotas de una especie', () => {
    expect(contarPor(lista, 'gato')).toBe(2)
    expect(contarPor(lista, 'perro')).toBe(1)
  })

  test('retorna 0 para especie sin mascotas', () => {
    expect(contarPor(lista, 'dinosaurio')).toBe(0)
  })

  test('retorna 0 para lista vacía', () => {
    expect(contarPor([], 'gato')).toBe(0)
  })

  test('retorna 0 para especie undefined', () => {
    expect(contarPor(lista, undefined)).toBe(0)
  })

})

// ═══════════════════════════════════════════════════════════════
//  7. crearMascota()
// ═══════════════════════════════════════════════════════════════
describe('crearMascota()', () => {

  const ID_FIJO = 9999
  const generarId = () => ID_FIJO

  test('happy path: agrega mascota al inicio del array', () => {
    const form = formValido()
    const { ok, mascotas } = crearMascota([], form, generarId)
    expect(ok).toBe(true)
    expect(mascotas).toHaveLength(1)
    expect(mascotas[0].nombre).toBe('Rex')
    expect(mascotas[0].id).toBe(ID_FIJO)
  })

  test('la nueva mascota queda al inicio (unshift)', () => {
    const existente = mascotaValida({ id: 1, nombre: 'Luna' })
    const { mascotas } = crearMascota([existente], formValido(), generarId)
    expect(mascotas[0].nombre).toBe('Rex')
    expect(mascotas[1].nombre).toBe('Luna')
  })

  test('no muta el array original', () => {
    const original = [mascotaValida()]
    crearMascota(original, formValido(), generarId)
    expect(original).toHaveLength(1)
  })

  test('retorna ok=false y errores si el form es inválido', () => {
    const { ok, errores, mascotas } = crearMascota([], formValido({ nombre: '' }), generarId)
    expect(ok).toBe(false)
    expect(errores).toHaveProperty('nombre')
    expect(mascotas).toHaveLength(0)
  })

  test('asigna el id generado por la función inyectada', () => {
    const { mascotas } = crearMascota([], formValido(), () => 42)
    expect(mascotas[0].id).toBe(42)
  })

  test('copia todos los campos del form a la mascota creada', () => {
    const form = formValido()
    const { mascotas } = crearMascota([], form, generarId)
    expect(mascotas[0].nombre).toBe(form.nombre)
    expect(mascotas[0].especie).toBe(form.especie)
    expect(mascotas[0].color).toBe(form.color)
    expect(mascotas[0].alimento).toBe(form.alimento)
  })

  test('crear en lista con múltiples mascotas incrementa el total', () => {
    const lista = [mascotaValida({ id: 1 }), mascotaValida({ id: 2 })]
    const { mascotas } = crearMascota(lista, formValido(), generarId)
    expect(mascotas).toHaveLength(3)
  })

})

// ═══════════════════════════════════════════════════════════════
//  8. actualizarMascota()
// ═══════════════════════════════════════════════════════════════
describe('actualizarMascota()', () => {

  let lista
  beforeEach(() => {
    lista = [
      mascotaValida({ id: 1, nombre: 'Luna',  color: 'blanco' }),
      mascotaValida({ id: 2, nombre: 'Rex',   color: 'café' }),
    ]
  })

  test('happy path: actualiza la mascota correcta', () => {
    const form = { ...lista[0], nombre: 'Lunita', color: 'negro' }
    const { ok, mascotas } = actualizarMascota(lista, form)
    expect(ok).toBe(true)
    expect(mascotas[0].nombre).toBe('Lunita')
    expect(mascotas[0].color).toBe('negro')
  })

  test('no altera otras mascotas de la lista', () => {
    const form = { ...lista[0], nombre: 'Lunita' }
    const { mascotas } = actualizarMascota(lista, form)
    expect(mascotas[1].nombre).toBe('Rex')
  })

  test('no muta el array original', () => {
    const form = { ...lista[0], nombre: 'Lunita' }
    actualizarMascota(lista, form)
    expect(lista[0].nombre).toBe('Luna')
  })

  test('la longitud del array no cambia al actualizar', () => {
    const form = { ...lista[0], nombre: 'Lunita' }
    const { mascotas } = actualizarMascota(lista, form)
    expect(mascotas).toHaveLength(2)
  })

  test('retorna ok=false si el id no existe en la lista', () => {
    const form = mascotaValida({ id: 999, nombre: 'Fantasma' })
    const { ok, errores } = actualizarMascota(lista, form)
    expect(ok).toBe(false)
    expect(errores).toHaveProperty('general')
  })

  test('retorna ok=false si el form es inválido', () => {
    const form = { ...lista[0], nombre: '' }
    const { ok, errores } = actualizarMascota(lista, form)
    expect(ok).toBe(false)
    expect(errores).toHaveProperty('nombre')
  })

  test('actualizar sobre lista vacía retorna ok=false', () => {
    const form = mascotaValida({ id: 1 })
    const { ok } = actualizarMascota([], form)
    expect(ok).toBe(false)
  })

})

// ═══════════════════════════════════════════════════════════════
//  9. eliminarMascota()
// ═══════════════════════════════════════════════════════════════
describe('eliminarMascota()', () => {

  let lista
  beforeEach(() => {
    lista = [
      mascotaValida({ id: 1, nombre: 'Luna' }),
      mascotaValida({ id: 2, nombre: 'Rex' }),
      mascotaValida({ id: 3, nombre: 'Dino' }),
    ]
  })

  test('happy path: elimina la mascota con el id correcto', () => {
    const { ok, mascotas } = eliminarMascota(lista, 2)
    expect(ok).toBe(true)
    expect(mascotas).toHaveLength(2)
    expect(mascotas.find(m => m.id === 2)).toBeUndefined()
  })

  test('no muta el array original', () => {
    eliminarMascota(lista, 1)
    expect(lista).toHaveLength(3)
  })

  test('las mascotas restantes quedan intactas', () => {
    const { mascotas } = eliminarMascota(lista, 2)
    expect(mascotas.map(m => m.id)).toEqual([1, 3])
  })

  test('retorna ok=false si el id no existe', () => {
    const { ok, error } = eliminarMascota(lista, 999)
    expect(ok).toBe(false)
    expect(error).toBeTruthy()
  })

  test('retorna ok=false si el id es null', () => {
    const { ok } = eliminarMascota(lista, null)
    expect(ok).toBe(false)
  })

  test('retorna ok=false si el id es undefined', () => {
    const { ok } = eliminarMascota(lista, undefined)
    expect(ok).toBe(false)
  })

  test('eliminar sobre lista vacía retorna ok=false', () => {
    const { ok } = eliminarMascota([], 1)
    expect(ok).toBe(false)
  })

  test('eliminar el último elemento deja la lista vacía', () => {
    const { mascotas } = eliminarMascota([mascotaValida({ id: 1 })], 1)
    expect(mascotas).toHaveLength(0)
  })

})

// ═══════════════════════════════════════════════════════════════
//  10. Flujo CRUD integrado
// ═══════════════════════════════════════════════════════════════
describe('Flujo CRUD integrado', () => {

  test('crear → actualizar → eliminar mantiene consistencia', () => {
    const ID = 1
    let lista = []

    // CREATE
    const { mascotas: m1 } = crearMascota(lista, formValido({ nombre: 'Max' }), () => ID)
    expect(m1).toHaveLength(1)

    // UPDATE
    const { mascotas: m2 } = actualizarMascota(m1, { ...m1[0], nombre: 'Maximiliano' })
    expect(m2[0].nombre).toBe('Maximiliano')

    // DELETE
    const { mascotas: m3 } = eliminarMascota(m2, ID)
    expect(m3).toHaveLength(0)
  })

  test('crear dos mascotas y eliminar solo una no afecta a la otra', () => {
    let lista = []
    const { mascotas: m1 } = crearMascota(lista, formValido({ nombre: 'A' }), () => 1)
    const { mascotas: m2 } = crearMascota(m1,    formValido({ nombre: 'B' }), () => 2)
    const { mascotas: m3 } = eliminarMascota(m2, 1)
    expect(m3).toHaveLength(1)
    expect(m3[0].nombre).toBe('B')
  })

  test('intentar actualizar una mascota eliminada retorna ok=false', () => {
    const { mascotas } = crearMascota([], formValido(), () => 10)
    const { mascotas: sinElla } = eliminarMascota(mascotas, 10)
    const { ok } = actualizarMascota(sinElla, { ...mascotas[0] })
    expect(ok).toBe(false)
  })

})
