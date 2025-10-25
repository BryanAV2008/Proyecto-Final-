// servidor.js
const express = require('express');
const app = express();

app.use(express.json());

// Array de jugadores del torneo (será nuestra base de datos temporal)
let jugadores = [
    { id: 1, nickname: "DragonSlayer", juego: "League of Legends", nivel: "Pro", pais: "Colombia" },
    { id: 2, nickname: "ShadowNinja", juego: "CS:GO", nivel: "Semi-Pro", pais: "México" },
    { id: 3, nickname: "FireMage", juego: "Valorant", nivel: "Amateur", pais: "Argentina" }
];

// Obtener jugador por ID
app.get('/jugador/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jugador = jugadores.find(j => j.id === id);

    if (!jugador) {
        return res.status(404).json({ error: "Jugador no encontrado en el torneo" });
    }

    res.json(jugador);
});


//================================================================================================
// Obtener todos los jugadores (con filtros opcionales)
app.get('/jugadores', (req, res) => {
    const limite = parseInt(req.query.limite);
    const juego = req.query.juego;
    const nivel = req.query.nivel;
    const pais = req.query.pais;
    const buscar = req.query.buscar;

    let resultado = jugadores;

    // Filtrar por juego
    if (juego) {
        resultado = resultado.filter(j =>
            j.juego.toLowerCase().includes(juego.toLowerCase())
        );
    }

    // Filtrar por nivel
    if (nivel) {
        resultado = resultado.filter(j =>
            j.nivel.toLowerCase().includes(nivel.toLowerCase())
        );
    }

    // Filtrar por país
    if (pais) {
        resultado = resultado.filter(j =>
            j.pais.toLowerCase().includes(pais.toLowerCase())
        );
    }

    // Búsqueda por nickname
    if (buscar) {
        resultado = resultado.filter(j =>
            j.nickname.toLowerCase().includes(buscar.toLowerCase())
        );
    }

    // Limitar resultados
    if (limite) {
        resultado = resultado.slice(0, limite);
    }

    res.json({
        total: resultado.length,
        jugadores: resultado
    });
});



//================================================================================================
let proximoId = 4;


// Registrar nuevo jugador
app.post('/jugadores', (req, res) => {
    const { nickname, juego, nivel, pais } = req.body;

    // Validaciones
    if (!nickname) {
        return res.status(400).json({ error: "El nickname es obligatorio" });
    }
    if (!juego) {
        return res.status(400).json({ error: "El juego es obligatorio" });
    }
    if (!nivel) {
        return res.status(400).json({ error: "El nivel es obligatorio" });
    }
    if (!pais) {
        return res.status(400).json({ error: "El país es obligatorio" });
    }

    // Verificar que el nickname no esté repetido
    const nicknameExiste = jugadores.find(j =>
        j.nickname.toLowerCase() === nickname.toLowerCase()
    );

    if (nicknameExiste) {
        return res.status(409).json({ error: "Ese nickname ya está registrado" });
    }

    const nuevoJugador = {
        id: proximoId++,
        nickname: nickname,
        juego: juego,
        nivel: nivel,
        pais: pais
    };

    jugadores.push(nuevoJugador);

    res.status(201).json({
        mensaje: "¡Jugador registrado exitosamente en el torneo!",
        jugador: nuevoJugador
    });
});



//================================================================================================

// Actualizar información completa del jugador
app.put('/jugador/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nickname, juego, nivel, pais } = req.body;

    // Validaciones
    if (!nickname || !juego || !nivel || !pais) {
        return res.status(400).json({
            error: "Se requieren todos los campos: nickname, juego, nivel, pais"
        });
    }

    const jugador = jugadores.find(j => j.id === id);

    if (!jugador) {
        return res.status(404).json({ error: "Jugador no encontrado" });
    }

    // Verificar que el nuevo nickname no esté repetido (excepto el actual)
    const nicknameExiste = jugadores.find(j =>
        j.id !== id && j.nickname.toLowerCase() === nickname.toLowerCase()
    );

    if (nicknameExiste) {
        return res.status(409).json({ error: "Ese nickname ya está en uso" });
    }

    // Actualizar todos los campos
    jugador.nickname = nickname;
    jugador.juego = juego;
    jugador.nivel = nivel;
    jugador.pais = pais;

    res.json({
        mensaje: "Información del jugador actualizada exitosamente",
        jugador: jugador
    });
});



//================================================================================================

// Descalificar/eliminar jugador
app.delete('/jugador/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const indice = jugadores.findIndex(j => j.id === id);

    if (indice === -1) {
        return res.status(404).json({ error: "Jugador no encontrado" });
    }

    const jugadorEliminado = jugadores.splice(indice, 1)[0];

    res.json({
        mensaje: "Jugador descalificado del torneo",
        jugador: jugadorEliminado,
        participantesRestantes: jugadores.length
    });
});




//================================================================================================
app.listen(3000, () => {
    console.log('🏆 API Torneo Gaming en http://localhost:3000');
});