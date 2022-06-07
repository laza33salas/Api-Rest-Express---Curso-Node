const { urlencoded } = require("express")
const debug = require("debug")("app:inicio");
//const dbDebug = require("debug")("app:db")
const express = require("express")
const Joi = require("joi")
const app = express()
const config = require("config")
//const logger = require("./logger")
const morgan = require("morgan")

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public")) //imagenes

//Configuracion de entornos
console.log("Aplicacion:" + config.get("nombre"))
console.log("BD server:" + config.get("configDB.host"))

//Uso de middleware de terceros - Morgan
if (app.get("env") === "development") {
    app.use(morgan("tiny"));
//console.log("Morgan habilitado")
debug("Morgan esta habilitado.")
}

//Trabajos con la base de datos
debug("conectado con la base de datos..")


//app.use(logger) 


//app.use(function(req,res,next) {
    //console.log("Autenticando")
    //next();})





/*
app.get();//peticion

app.post();//envio de datos

app.put();//actualizacion (modificar)

app.delete();//eliminacion
*/


//-------------------------------------------------------------------------------------------------------------------------------------------------

// USANGO GET ;)
const usuarios = [
    {id: 1, nombre: "Ana"},
    {id: 2, nombre: "Marr"},
    {id: 3, nombre: "Ceci"},
    {id: 4, nombre: "Clara"}
];


app.get("/",(req, res) => {
    res.send("hola beba estamos en tu server express")
})

app.get("/api/usuarios", (req, res) => {
    res.send(usuarios)
})


//404: ERROR
app.get("/api/usuario/:id", (req, res) =>{
    let usuario = usuarioExist(req.params.nombre)
    if(!usuario){
        res.status(404).send("El usuario no fue encontrado")
    }else{
        res.send(usuario);
    }
})


//FIN DE USANDO GET
//hacemos una consulta


//-------------------------------------------------------------------------------------------------------------------------------------------------
















//USANDO DE POST
// agregamos un valor


//400: Bad request (No es un requerimiento valido)
app.post("/api/usuarios", (req, res) =>{
    
    

        const {error, value} = valirdarUser(req.body.nombre)
        if (!error) {
            const usuario = {
                id: usuarios.length + 1,
                nombre: value
            }
            usuarios.push(usuario)
            res.send(usuario)
        }else{
            let mensaje = error.details[0].message
            res.status(400).send(mensaje)
        }
})


//FIN USO POST



//-------------------------------------------------------------------------------------------------------------------------------------------------












//USANDO PUT
//modificamos un valor


app.put("/api/usuarios/:id", (req, res) =>{
//Paso 1: encontrar el objeto fruta que quiero modificar
let usuario = usuarioExist(req.params.id)
if(!usuario){
    res.status(404).send("El usuario no fue encontrado")
    return;
}
    
const schema = Joi.object({
    nombre: Joi.string().min(3).required(),})
    
const {error, value} = valirdarUser(req.body.nombre)
    if (error) {
        let mensaje = error.details[0].message
        res.status(400).send(mensaje)
        return;
    }

    usuario.nombre = value.nombre
    res.send(usuario)


})

//FIN METODO PUT

//-----------------------------------------------------------------------------------------------------------------













//Metodo DELETE

app.delete("/api/usuarios/:id", (req,res) =>{
    let usuario = usuarioExist(req.params.id);
    if (!usuario){
        res.status(404).send("El usuario no existe")
        return;
}

const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)
    res.send(usuario)

})




function usuarioExist(id) {
    return (usuarios.find(e => e.id === parseInt(id)))
}

function valirdarUser(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),})
       return (schema.validate({nombre :nom}));
}






const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Servidor escuchado en el puerto: ${port}`)
});


