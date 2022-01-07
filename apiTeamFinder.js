const express = require("express");
const app = express();
const cors = require("cors")
const axios = require('axios')
let port = process.env.PORT || 3140;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

let mysql = require("mysql2");
const { info } = require("console");
let connection = mysql.createConnection(
    {
        host: "teamfinder.ch9hdwuswbp3.eu-west-2.rds.amazonaws.com",
        user: "admin",
        password: "codenotch",
        database: "TeamFinder"
    }
)

connection.connect(function (error) {
    if (error) {
        console.log(error)



    }
    else {
        console.log("Hola gamer")
    }
})

// ******************* LOGIN **********************

app.post('/login', (req, res) => {
    const user = req.body.nombre;
    const password = req.body.password;
    const params = [user, password]
    const query = `SELECT *
    FROM usuario INNER JOIN equipo ON (usuario.id_user = equipo.creador) WHERE nickname = ? and password = ?`;
    let response;
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            response = {
                error: true,
                msg: "Error al conectar con la base de datos",
                resultado: err
            };
            res.status(500).send(response);
            return;
        }
        if (results.length > 0) {
            console.log("login correcto")
            response = {
                error: false,
                msg: "Inicio de sesión completado",
                resultado: results,
            }
            res.status(200).send(response);
        } else {
            const query = `SELECT id_user,nickname,password,G_manager,lfm,idioma,imagen,id_juego_fav
            FROM usuario WHERE nickname = ? and password = ?`;
            let response;
            connection.query(query, params, (err, results) => {
                console.log("flag1")
                if (err) {
                    console.error(err);
                    response = {
                        error: false,
                        msg: "Error al conectar con la base de datos",
                        resultado: results
                    }
                    res.status(200).send(response);
                }
                else{
                    console.log("login incorrecto")
                    response = {
                        error: false,
                        msg: "El usuario o la contraseña no son correctos",
                        resultado: results,
                    }
                    res.status(200).send(response);
                    
                }
            })
        }
        console.log(response)
    });
});

// ********* REGISTRO ***********

app.post('/registro', (request, response) => {
    console.log("llega registro")
    console.log(request.body)
    
    let email= request.body.email;
    let nombre= request.body.nombre;
    let password= request.body.password;
    let G_manager= request.body.G_manager;
    let idioma= request.body.idioma;
    let lfm = request.body.lfm;
    let fecha_nacimiento= request.body.fecha_nacimiento;
    let info_ad= request.body.info_ad;
    let imagen= request.body.imagen;
    let id_juego_fav = request.body.id_juego_fav

    const sql = `INSERT INTO usuario(email, nickname, password, G_manager,idioma, lfm, 
                    fecha_nacimiento, info_ad,imagen,id_juego_fav) VALUES(\"${email}\", \"${nombre}\", \"${password}\",\"${G_manager}\", \"${idioma}\", \"${lfm}\",
                    \"${fecha_nacimiento}\", \"${info_ad}\",\"${imagen}\",\"${id_juego_fav}\")`


            connection.query(sql, function (err, res) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("creado usuario")
                    console.log(res)
                    respuesta = { error: false, codigo: 200, mensaje: "Usuario registrado", resultado: res }
                    response.send(respuesta)
                }
            })
});



app.post('/registrojuego', (request, response) => {
    console.log(request.body)

    let idbase = request.body.idbase
    let nick= request.body.nick;
    let servidor= request.body.servidor;
    let posicion= request.body.posicion;
    let id 
    let accountid
    let puuid
    let tier
    let rank
    let wr
    let champion_id
    let kda
    let elo
    const sql2 = `INSERT INTO usuario(email, nickname, password, G_manager,idioma, lfm, 
        fecha_nacimiento, info_ad,imagen,id_juego_fav) VALUES(\"${email}\", \"${nombre}\", \"${password}\",\"${G_manager}\", \"${idioma}\", \"${lfm}\",
        \"${fecha_nacimiento}\", \"${info_ad}\",\"${imagen}\",\"${id_juego_fav}\")`

            connection.query(sql2,params2, function (err, res) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("creado usuario")
                    console.log(res)
                    respuesta = { error: false, codigo: 200, mensaje: "Usuario registrado", resultado: res }
                    response.send(respuesta)
                }
            })
})




// **********************USUARIO*****************


app.get("/usuario", function (request, response) {

    let id = request.query.id

    if (id == null) {

        let sql = `SELECT * FROM usuario`
        let respuesta;

        connection.query(sql, function (err, res) {

            if (err) {

                console.log(err)
                respuesta = { error: true, codigo: 200, resultado: res }
            }
            else {
                respuesta = { error: false, codigo: 200, resultado: res }

            }
            response.send(respuesta)
        })
    }
    else {

        let sql = `SELECT * FROM usuario WHERE id_user = ${id}`

        connection.query(sql, function (err, res) {

            if (err) {
                console.log(err)
            }
            else {
                console.log(res)
                let respuesta = { error: false, codigo: 200, resultado: res }
                response.send(respuesta)
            }
        })
    }

})

app.post("/usuario", function (request, response) {


    let sql = `INSERT INTO usuario(email, nickname, password, G_manager, lfm, fecha_nacimiento, info_ad,imagen,discord, twitter) 
                   VALUES(\"${request.body.email}\", \"${request.body.nickname}\", \"${request.body.password}\",
                   \"${request.body.G_manager}\",\"${request.body.lfm}\",\"${request.body.fecha_nacimiento}\", \"${request.body.info_ad}\",
                   \"${request.body.imagen}\",\"${request.body.discord}\", \"${request.body.twitter}\")`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("creado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "Usuario creado", resultado: res }
            response.send(respuesta)
        }
    })
    // console.log("entra")
})

app.put("/usuario", function (request, response) {

    let respuesta;
    let id = request.body.id_user
    let email = request.body.email
    let nickname = request.body.nickname
    let password = request.body.password
    let G_manager = request.body.G_manager
    let lfm = request.body.G_manager
    let fecha_nacimiento = request.body.fecha_nacimiento
    let info_ad = request.body.info_ad
    let imagen = request.body.imagen
    let discord = request.body.discord
    let twitter = request.body.twitter
    let n_jugador = request.body.n_jugador

    let params = [email, nickname, password, G_manager, lfm, fecha_nacimiento, info_ad, imagen, discord, twitter, n_jugador, id]

    let sql =
        `UPDATE usuario SET email = \"${request.body.email}\", nickname = \"${request.body.nickname}\",
         password =  \"${request.body.password}\", G_manager = \"${request.body.G_manager}\", lfm = \"${request.body.lfm}\",
         fecha_nacimiento = \"${request.body.fecha_nacimiento}\", info_ad = \"${request.body.info_ad}\", 
         imagen = \"${request.body.imagen}\", discord = \"${request.body.discord}\", twitter = \"${request.body.twitter}\",
         n_jugador = \"${request.body.n_jugador}\", id_user = \"${request.body.id_user}\" WHERE id_user = ${id}`

    connection.query(sql, params, function (err, res) {
        if (err) {
            console.log(err)
            respuesta = { error: true, codigo: 200, mensaje: "error", resultado: res }

        }
        else {
            console.log("usuario cambiado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "usuario cambiado", resultado: res }

        }
        response.send(respuesta)
    })
    // console.log("entra")
})

app.delete("/usuario", function (request, response) {

    let id = request.query.id
    console.log(id)
    if (id != null) {
        let sql2 = `DELETE FROM usuario WHERE id_user = ${id}`
        connection.query(sql2, function (err, res) {
            let respuesta;
            if (err) {





                console.log(err)
                respuesta = { error: true, codigo: 200, mensaje: "ERROR", resultado: res }
            }
            else {
                console.log("eliminado")
                console.log(res)
                respuesta = { error: false, codigo: 200, mensaje: "usuario eliminado", resultado: res }

            }

            response.send(respuesta)
        })
    }
    // console.log("entra")
})

// *************************** TORNEOS *********************


app.get("/torneo", function (request, response) {

    let id = request.query.id

    if (id == null) {

        let sql = `SELECT * FROM torneo ORDER BY patrocinado DESC`
        let respuesta;

        connection.query(sql, function (err, res) {

            if (err) {

                console.log(err)
                respuesta = { error: true, codigo: 200, resultado: res }
            }
            else {
                respuesta = { error: false, codigo: 200, resultado: res }

            }
            response.send(respuesta)
        })
    }
    else {

        let sql = `SELECT torneo_id, patrocinado, reglas, tier, juego_id, clave_torneo, nombre_torneo,
                fecha_inicio, fecha_fin, numero_equipos FROM torneo WHERE torneo_id = ${id}`

        connection.query(sql, function (err, res) {

            if (err) {
                console.log(err)
            }
            else {
                console.log(res)
                let respuesta = { error: false, codigo: 200, resultado: res }
                response.send(respuesta)
            }
        })
    }

})

app.post("/torneo", function (request, response) {
    console.log(request.body)

    let respuesta;
    let sql = `INSERT INTO torneo(patrocinado, reglas, tier, juego_id, clave_torneo, nombre_torneo, fecha_inicio, fecha_fin, numero_equipos) 
                       VALUES(\"${request.body.patrocinado}\", \"${request.body.reglas}\", \"${request.body.tier}\",
                       \"${1}\", \"${request.body.clave_torneo}\",\"${request.body.nombre_torneo}\",
                       \"${request.body.fecha_inicio}\", \"${request.body.fecha_fin}\",\"${request.body.n_equipos}\")`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("creado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "Torneo creado", resultado: res }
            response.send(respuesta)
        }
    })
})


// ******************** EQUIPO ******************************


app.post("/equipos", function(request,response){
    console.log(request.body)
    let nombre = request.body.nombre_equipo
    let params = [nombre]
    let sql = `SELECT * FROM equipo WHERE nombre_equipo = ?`

        connection.query(sql,params, function (err, res) {

            if (err) {
                console.log(err)
                let respuesta = { error: false, codigo: 200, resultado: err ,mensaje: "no existe ese equipo"}
                response.send(respuesta)
            }
            else {
                console.log(res)
                let respuesta = { error: false, codigo: 200, resultado: res }
                response.send(respuesta)
            }
        })
    }
)

app.get("/equipo", function (request, response) {

    let id = request.query.id


    if (id == null) {

        let sql = `SELECT * FROM equipo INNER JOIN usuario on (equipo.creador = usuario.id_user) INNER JOIN campeones on (equipo.campeon_favorito = campeones.campeon_id) `
        let respuesta;

        connection.query(sql, function (err, res) {

            if (err) {

                console.log(err)
                respuesta = { error: true, codigo: 200, resultado: res }
            }
            else {
                respuesta = { error: false, codigo: 200, resultado: res }

            }
            response.send(respuesta)
        })
    }
    else {

        let sql = `SELECT * FROM equipo INNER JOIN campeones on (equipo.campeon_favorito = campeones.campeon_id)  WHERE equipo_id = ${id}`

        connection.query(sql, function (err, res) {

            if (err) {
                console.log(err)
            }
            else {
                console.log(res)
                let respuesta = { error: false, codigo: 200, resultado: res }
                response.send(respuesta)
            }
        })
    }

})

app.post("/crearEquipo", function (request, response) {

    console.log(request.body)

    let respuesta;
    let sql = `INSERT INTO equipo(url_imagen, nombre_equipo, acronimo_equipo, creador, juego_id) 
                   VALUES(\"${request.body.url_imagen}\", \"${request.body.nombre_equipo}\", \"${request.body.acronimo_equipo}\",\"${request.body.creador_equipo}\", \"${request.body.juego_id}\")`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("equipo")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "equipo creado", resultado: res }
            response.send(respuesta)
        }
    })
})

app.put("/equipo", function (request, response) {

    let respuesta;
    let id = request.body.equipo_id
    let nombre = request.body.nombre_equipo
    let creador = request.body.creador
    let juego_id = request.body.juego_id
    let acronimo_equipo = request.body.acronimo_equipo


    let params = [nombre, creador, juego_id, id, acronimo_equipo]

    let sql =
        `UPDATE equipo SET nombre_equipo = \"${request.body.nombre_equipo}\", creador = \"${request.body.creador}\",
         juego_id = \"${request.body.juego_id}\", equipo_id = \"${request.body.equipo_id}\" WHERE equipo_id = ${id}, 
         acronimo_equipo = \"${request.body.acronimo_equipo}\" WHERE acronimo_equipo = ${acronimo_equipo}`

    connection.query(sql, params, function (err, res) {
        if (err) {
            console.log(err)
            respuesta = { error: true, codigo: 200, mensaje: "error", resultado: res }

        }
        else {
            console.log("usuario cambiado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "equipo cambiado", resultado: res }

        }
        response.send(respuesta)
    })
})


app.delete("/equipo", function (request, response) {

    let id = request.query.id
    console.log(id)
    if (id != null) {
        let sql2 = `DELETE FROM equipo WHERE equipo_id = ${id}`
        connection.query(sql2, function (err, res) {
            let respuesta;
            if (err) {
                console.log(err)
                respuesta = { error: true, codigo: 200, mensaje: "ERROR", resultado: res }
            }
            else {
                console.log("eliminado")
                console.log(res)
                respuesta = { error: false, codigo: 200, mensaje: "equipo eliminado", resultado: res }

            }

            response.send(respuesta)
        })
    }
})

//*****************RANKING**************


app.get("/ranking", function (request, response) {


        let sql = `SELECT * FROM TeamFinder.usuario AS usuario 
                   INNER JOIN TeamFinder.data_userJg AS data_userJg on (usuario.id_user = data_userJg.user_id) INNER JOIN equipo on(usuario.id_user = equipo.creador) INNER JOIN campeones on (equipo.campeon_favorito = campeones.campeon_id) ORDER BY id_user ASC`
        let respuesta;

        connection.query(sql, function (err, res) {

            if (err) {

                console.log(err)
                respuesta = { error: true, codigo: 200, resultado: res }
            }
            else {
                respuesta = { error: false, codigo: 200, resultado: res }

            }
            response.send(respuesta)
        })
})

//*******************LFM************************


app.put("/lfm", function (request, response) {

    let respuesta;
    let id = request.body.id
    let lfm = request.body.lfm
   

    let params = [id, lfm]

    let sql =
    `UPDATE usuario SET lfm = \"${request.body.lfm}\" WHERE id_user = ${id}`

    connection.query(sql, params, function (err, res) {
        if (err) {
            console.log(err)
            respuesta = { error: true, codigo: 200, mensaje: "error", resultado: res }

        }
        else {
            console.log("lfm cambiado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "lfm cambiado", resultado: res }

        }
        response.send(respuesta)
    })
})
//*******************LFR************************

app.get("/lfr", function (request, response) {

    console.log("llega lfr api")

    let sql = `SELECT equipo_id,nombre_equipo, nickname,id_user,url_imagen FROM equipo INNER JOIN usuario ON (equipo.creador = usuario.id_user) WHERE Lfr = 1 ORDER BY RAND() LIMIT 1  `
    let respuesta;

    connection.query(sql, function (err, res) {

        if (err) {

            console.log(err)
            respuesta = { error: true, codigo: 200, resultado: res }
        }
        else {
            respuesta = { error: false, codigo: 200, resultado: res }

        }
        response.send(respuesta)
    })
})


app.put("/lfr", function (request, response) {

    let respuesta;
    let id = request.body.id
    let lfr = request.body.lfr
   

    let sql =
    `UPDATE equipo SET Lfr = \"${request.body.lfr}\" WHERE equipo_id = ${id}`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
            respuesta = { error: true, codigo: 200, mensaje: "error", resultado: res }

        }
        else {
            console.log("lfr cambiado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "lfr cambiado", resultado: res }

        }
        response.send(respuesta)
    })
})


//*******************UNIRSE************************

app.post("/unirse", function (request, response) {
    console.log("recibido2")
    console.log(request.body)

    let respuesta;
    let sql = `INSERT INTO alertas(equipo_id, estado, id_user, mensaje) 
                   VALUES(\"${request.body.equipo_id}\", \"${request.body.estado}\", \"${request.body.id_user}\", \"${request.body.mensaje}\")`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "alerta enviada", resultado: res }
            response.send(respuesta)
        }
    })
})
//*******************CONECTAR************************

app.post("/conectar", function (request, response) {
    console.log("recibido23")
    console.log(request.body)

    let respuesta;
    let sql = `INSERT INTO alertas(equipo_id, estado, equipo_id_sender, mensaje) 
                   VALUES(\"${request.body.equipo_id}\", \"${request.body.estado}\", \"${request.body.sender_id}\", \"${request.body.mensaje}\")`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "alerta  conecxion enviada", resultado: res }
            response.send(respuesta)
        }
    })
})

//**********************ALERTAS*************** *

app.post("/alertas", function(request,response){
    console.log(request.body)
    let equipo = request.body.equipo
    let params = [equipo]

    let sql = `SELECT * FROM alertas WHERE equipo_id = ? AND estado = 'espera'`

        connection.query(sql,params, function (err, res) {

            if (err) {
                console.log(err)
                let respuesta = { error: false, codigo: 200, resultado: err ,mensaje: "no hay alertas"}
                response.send(respuesta)
            }
            else {
                console.log(res)
                let respuesta = { error: false, codigo: 200, resultado: res, mensaje: "alertas encontradas" }
                response.send(respuesta)
            }
        })
    }
)
app.put("/alertas", function (request, response) {
    console.log(request.body)
    let respuesta;
    let id = request.body.id

    let sql =
    `DELETE FROM alertas WHERE id = ${id}`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
            respuesta = { error: true, codigo: 200, mensaje: "error", resultado: res }

        }
        else {
            console.log("lfr cambiado")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "alerta borradaS", resultado: res }

        }
        response.send(respuesta)
    })
})

//****************COMPROBAR SI HAY ADMIN CREADO***************

app.get("/admin", function (request, response) {

    console.log("llega manager api")


    let sql = `SELECT G_manager FROM usuario  WHERE G_manager = 1  `
    let respuesta;

    connection.query(sql, function (err, res) {

        if (err) {

            console.log(err)
            respuesta = { error: true, codigo: 200, resultado: res }
        }
        else {
            respuesta = { error: false, codigo: 200, resultado: res }

        }
        response.send(respuesta)
    })
})
//****************ID***********

app.post("/id", function (request, response) {

    let nombre = request.body.nombre

    console.log("llega id api")


    let sql = `SELECT id_user FROM usuario  WHERE nickname = '${nombre}'  `
    let respuesta;

    connection.query(sql, function (err, res) {

        if (err) {

            console.log(err)
            respuesta = { error: true, codigo: 200, resultado: res }
        }
        else {
            respuesta = { error: false, codigo: 200, resultado: res, mensaje: "este es el usuario" }

        }
        response.send(respuesta)
    })
})


//****************AÑADIR DATOS JUEGO***************
// ********* APIS ***********

let id 
let accountid
let puuid
let tier
let rank
let wins
let losses
let wr
let champion_id
let matches =[]

let kills1
let deaths1
let assists1
let kda1

let kills2
let deaths2
let assists2
let kda2

let kills3
let deaths3
let assists3
let kda3

let kda

let elo

app.post("/juego",function(req,response){

        console.log(req.body)
        let nombre = req.body.name
        let id_base = req.body.id_base
        let servidor= req.body.servidor;
        let posicion= req.body.posicion;
        let clave = `?api_key=RGAPI-77502b1e-b8d0-40e1-bd16-b0a19476a674`

        let url =`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/` +`${nombre}`+ `${clave}`
        let url2 =`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/`
        let url3 = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/`
        let url4 = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/`
        let urlmatch = `https://europe.api.riotgames.com/lol/match/v5/matches/`
        let urlmatch1
        let urlmatch2
        let urlmatch3
        let urlelo = `https://euw.whatismymmr.com/api/v1/summoner?name=`



        axios.get((url))       
        .then((data) =>{
                console.log(data.data)
                id = data.data.id
                accountid = data.data.accountId
                puuid = data.data.puuid
                // Actualizo la url para la siguiente peticion
                url2=url2+id+clave
                // Llamo a la siguiente llamada asincrona
                return axios.get((url2))
        })
        .then((data) =>{
                console.log("segunda query")

                tier = data.data[0].tier
                rank = data.data[0].rank
                wins = data.data[0].wins
                losses = data.data[0].losses
                wr = wins/(wins+losses)*100 +"%"
                url3 = url3 + id + clave
                return axios.get((url3))
        })
        .then((data) =>{
                console.log("tercera query")
                champion_id = data.data[0].championId
                url4 = url4 + puuid + `/ids?start=0&count=3&api_key=RGAPI-77502b1e-b8d0-40e1-bd16-b0a19476a674`
                return axios.get(url4)
        })
        .then((data) =>{
                console.log("cuarta query")
                console.log(data.data)
                matches = data.data
                urlmatch1 = urlmatch + matches[0] + clave
                return axios.get(urlmatch1)
        })
        .then((data)=>{
                console.log("quinta query")
                kills1 = data.data.info.participants[0].assists
                deaths1 = data.data.info.participants[0].deaths
                assists1 = data.data.info.participants[0].kills

                kda1 = (kills1 + assists1)/deaths1

                urlmatch2 = urlmatch +matches[1] + clave
                return axios.get(urlmatch2)
        })
        .then((data)=>{
                console.log("sexta query")
                kills2 = data.data.info.participants[1].assists
                deaths2 = data.data.info.participants[1].deaths
                assists2 = data.data.info.participants[1].kills

                kda2 = (kills2 + assists2)/deaths2

                urlmatch3 = urlmatch +matches[2] + clave
                return axios.get(urlmatch3)
        })
        .then((data)=>{
                console.log("septima query")
                kills3 = data.data.info.participants[2].assists
                deaths3 = data.data.info.participants[2].deaths
                assists3 = data.data.info.participants[2].kills

                kda3 = (kills3 + assists3)/deaths3
                kda = (kda1 + kda2 + kda3)/3
                console.log(kda)

                urlelo = urlelo + nombre
                return axios.get(urlelo)
        })
        .then((data)=>{
                console.log("octava query")
                console.log(urlelo)
                console.log(data.data.normal.avg)
                elo = data.data.normal.avg
            let datos = {
                id,accountid,
            }
                return datos
        })
        .then((data)=>{
            console.log(data)
            console.log("y lanzamos insert")

            const sql2 = `INSERT INTO data_userJg( nick, posicion, rk_global,kda, wr, servidor, victorias, derrotas, 
                            elo, tier, id_dentro_juego,puuid, encrypted_id,champion_id) 
                    VALUES(\"${nombre}\", \"${posicion}\", \"${rank}\",\"${kda}\", \"${wr}\", \"${servidor}\",
                     \"${wins}\",\"${losses}\",\"${elo}\" ,\"${tier}\",\"${id}\",\"${puuid}\",\"${accountid}\",\"${champion_id}\")`
        
                    connection.query(sql2, function (err, res) {
                        if (err) {
                            console.log(err)
                            
                        }
                        else {
                            console.log("creado usuario en el juego")
                            console.log(res)
                            respuesta = { error: false, codigo: 200, mensaje: "Usuario de juego registrado", resultado: res }
                            response.send(respuesta)
                        }
                    })
        })
            
        .catch((e) =>{
                console.log(e)
        })
})
//****************ID***********

app.post("/apuntados", function (request, response) {

    let id = request.body.id

    console.log("llega id api")


    let sql = `SELECT torneo_id FROM torneo  ORDER BY RAND() LIMIT 1`
    let respuesta;

    connection.query(sql, function (err, res) {

        if (err) {

            console.log(err)
            respuesta = { error: true, codigo: 200, resultado: res }
        }
        else {
            respuesta = { error: false, codigo: 200, resultado: res, mensaje: "estos sonlos id" }

        }
        response.send(respuesta)
    })
})

    app.listen(port)