const express = require("express");
const app = express();
const cors = require("cors")
let port = process.env.PORT || 3140;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

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
    const query = `SELECT id_user,nickname,password,G_manager,lfm,idioma,imagen,id_juego_fav,nombre_equipo, equipo_id
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
            response = {
                error: false,
                msg: "El usuario o la contraseña no son correctos",
                resultado: results
            }
            res.status(200).send(response);
        }
        console.log(response)
    });
});



// ********* REGISTRO ***********

app.post('/registro', (request, res) => {
    const user = request.body.nickname;
    const password = request.body.password;
    const params = [user, password]
    const query = `SELECT id_user FROM usuario WHERE nickname = ? and password = ?`;
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
            console.log("Usuario ya existente")
            response = {
                error: false,
                msg: "Usuario ya existente",
                resultado: results,


            }
            res.status(200).send(response);
        } else {

            let crear = `INSERT INTO usuario(email, nickname, password, G_manager, Lfm, fecha_nacimiento, info_ad,imagen,n_jugador,twitter,discord ) 
                VALUES(\"${request.body.email}\", \"${request.body.nickname}\", \"${request.body.password}\", \"${request.body.fecha_nacimiento}\",\"${request.body.G_manger}\", \"${request.body.lfm}\",\"${request.body.info_ad}\",\"${request.body.imagen}\",\"${request.body.discord}\",\"${request.body.twitter}\",\"${request.body.n_jugador}\")`

            connection.query(crear, function (err, res) {

                if (err) {
                    console.log(err)
                }
                else {
                    console.log("persona creada")
                    console.log(res)
                    respuesta = { error: false, codigo: 200, mensaje: "Usuario creado", resultado: res }

                }
            })


            response = {
                error: false,
                msg: "El usuario o la contraseña no son correctos",
                resultado: results
            }
            res.status(404).send(response);
        }
    });
});



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

        let sql = `SELECT id_user, email, nickname, password, G_manager, lfm,
             fecha_nacimiento, info_ad, imagen, discord, twitter, n_jugador FROM usuario WHERE id_user = ${id}`

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

        let sql = `SELECT * FROM torneo`
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
                fecha_inicio, fecha_fin FROM torneo WHERE torneo_id = ${id}`

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
    let nombre = request.body.nombre
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

        let sql = `SELECT * FROM equipo`
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

        let sql = `SELECT * FROM equipo WHERE equipo_id = ${id}`

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

app.post("/equipo", function (request, response) {

    let respuesta;
    let sql = `INSERT INTO equipo(nombre_equipo, creador, juego_id) 
                   VALUES(\"${request.body.nombre_equipo}\", \"${request.body.creador}\", \"${request.body.juego_id}\")`

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



    let params = [nombre, creador, juego_id, id]

    let sql =
        `UPDATE equipo SET nombre_equipo = \"${request.body.nombre_equipo}\", creador = \"${request.body.creador}\",
         juego_id = \"${request.body.juego_id}\", equipo_id = \"${request.body.equipo_id}\" WHERE equipo_id = ${id}`

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


        let sql = `SELECT id_user,nickname, posicion, rk_servidor,kda,wr FROM TeamFinder.usuario AS usuario 
                   INNER JOIN TeamFinder.data_userJg AS data_userJg on (usuario.id_user = data_userJg.user_id)`
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

    let sql = `SELECT nombre_equipo, nickname,id_user FROM equipo INNER JOIN usuario ON (equipo.creador = usuario.id_user) WHERE Lfr = 1 ORDER BY RAND() LIMIT 1  `
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
    `UPDATE equipo SET Lfr = \"${request.body.lfr}\" WHERE id_equipo = ${id}`

    connection.query(sql, params, function (err, res) {
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

    let respuesta;
    let sql = `INSERT INTO alertas(equipo_id, estado, id_user, mensaje) 
                   VALUES(\"${request.body.equipo_id}\", \"${request.body.estado}\", \"${request.body.id_user}\", \"${request.body.mensaje}\")`

    connection.query(sql, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("equipo")
            console.log(res)
            respuesta = { error: false, codigo: 200, mensaje: "alerta enviada", resultado: res }
            response.send(respuesta)
        }
    })
})


    app.listen(port)