// ─────────────────────────────────────────────
//  PetLog · app.js
//  Lógica Vue 3 (Composition API)
// ─────────────────────────────────────────────
//hola grupo

const { createApp, ref, computed } = Vue
createApp({
  
  setup() {

    // ════════════════════════════════════════════
    //  MODELO DE MASCOTA
    //  Para agregar un atributo nuevo:
    //    1. Añade la propiedad aquí en campoVacio()
    //    2. Agrega el campo en el formulario (index.html)
    //    3. Agrega la fila en la tarjeta (index.html)
    //    4. Agrega la validación en validar() si es requerido
    // ════════════════════════════════════════════
    function campoVacio() {
      return {
        id:       null,
        nombre:   '',
        especie:  '',
        edad:     '',
        color:    '',
        alimento: '',
        // ✏️ Agrega propiedades nuevas aquí, por ejemplo:
        // vacunado: '',
        // peso:     '',
      }
    }

    // ── Estado ──────────────────────────────────
    const mascotas         = ref([])
    const form             = ref(campoVacio())
    const errores          = ref({})
    const editando         = ref(null)   // id de la mascota en edición (null = modo crear)
    const busqueda         = ref('')
    const filtroActivo     = ref('todos')
    const modalVisible     = ref(false)
    const aMascotaEliminar = ref(null)
    const toastVisible     = ref(false)
    const toastMsg         = ref('')

    // ── Filtros del toolbar ──────────────────────
    const filtros = [
      { label: 'Todos',      valor: 'todos' },
      { label: '🐱 Gatos',   valor: 'gato' },
      { label: ' Perros',  valor: 'perro' },
      { label: '🦕 Dinos',   valor: 'dinosaurio' },
    ]

    // ── Lista filtrada (se recalcula automáticamente) ──
    const listaMostrada = computed(() => {
      return mascotas.value.filter(m => {
        const porEspecie = filtroActivo.value === 'todos' || m.especie === filtroActivo.value
        const porNombre  = !busqueda.value || m.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
        return porEspecie && porNombre
      })
    })

    // ── Helpers de vista ────────────────────────
    const EMOJI  = { gato: '🐱', perro: '🐶', dinosaurio: '🦕' }
    const STRIPE = { gato: '#67e8f9', perro: '#fbbf24', dinosaurio: '#a78bfa' }

    function emojiEspecie(especie)  { return EMOJI[especie]  || '🐾' }
    function colorStripe(especie)   { return STRIPE[especie] || '#444' }
    function contarPor(especie)     { return mascotas.value.filter(m => m.especie === especie).length }

    // ── Validación ──────────────────────────────
    function validar() {
      const e = {}
      if (!form.value.nombre)                                 e.nombre   = 'El nombre es requerido.'
      if (!form.value.especie)                                e.especie  = 'Selecciona una especie.'
      if (form.value.edad === '' || form.value.edad === null) e.edad     = 'La edad es requerida.'
      if (!form.value.color)                                  e.color    = 'Escribe el color de pelaje.'
      if (!form.value.alimento)                               e.alimento = 'El alimento favorito es requerido.'
      // ✏️ Agrega validaciones de campos nuevos aquí, por ejemplo:
      // if (!form.value.vacunado) e.vacunado = 'Indica si está vacunado.'
      errores.value = e
      return Object.keys(e).length === 0
    }

    // ── CREATE / UPDATE ──────────────────────────
    function guardar() {
      if (!validar()) return

      if (editando.value) {
        // UPDATE — reemplaza la mascota con el mismo id
        const idx = mascotas.value.findIndex(m => m.id === editando.value)
        mascotas.value[idx] = { ...form.value }
        mostrarToast(`✎ ${form.value.nombre} actualizado.`)
        editando.value = null
      } else {
        // CREATE — agrega al inicio de la lista
        mascotas.value.unshift({ ...form.value, id: Date.now() })
        mostrarToast(`✓ ${form.value.nombre} registrado.`)
      }

      form.value    = campoVacio()
      errores.value = {}
    }

    // ── Iniciar edición ──────────────────────────
    function iniciarEdicion(mascota) {
      editando.value = mascota.id
      form.value     = { ...mascota }   // copia todos los atributos al formulario
      errores.value  = {}
    }

    function cancelar() {
      editando.value = null
      form.value     = campoVacio()
      errores.value  = {}
    }

    // ── DELETE ───────────────────────────────────
    function pedirEliminar(mascota) {
      aMascotaEliminar.value = mascota
      modalVisible.value     = true
    }

    function confirmarEliminar() {
      mascotas.value = mascotas.value.filter(m => m.id !== aMascotaEliminar.value.id)
      mostrarToast(`🗑 ${aMascotaEliminar.value.nombre} eliminado.`)
      modalVisible.value     = false
      aMascotaEliminar.value = null
    }

    // ── Toast ────────────────────────────────────
    let toastTimer
    function mostrarToast(msg) {
      toastMsg.value     = msg
      toastVisible.value = true
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => toastVisible.value = false, 2600)
    }

    // ── Exponer al template ──────────────────────
    return {
      mascotas, form, errores, editando,
      busqueda, filtroActivo, filtros, listaMostrada,
      modalVisible, aMascotaEliminar,
      toastVisible, toastMsg,
      guardar, iniciarEdicion, cancelar,
      pedirEliminar, confirmarEliminar,
      emojiEspecie, colorStripe, contarPor,
    }
  }
}).mount('#app')