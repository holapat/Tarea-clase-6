const fs = require("fs")
const express = require("express")
const app = express()
const PORT = 8080;

class Contenedor{
    constructor(fileName){
        this.fileName = fileName;
        this.productos = [];
    }

    save(obj){
        this.productos.push(obj);
        obj.id = this.productos.length

        if(this.productos.length <= 1){
            fs.promises.writeFile("./productos.txt", JSON.stringify(obj))
                .then( contenido =>{
                    console.log("Producto guardado")
                    //let contenidoParsed = JSON.parse(contenido)
                    //console.log(contenidoParsed.id)               <---------- Me tira error. No logro que muestre el ID del objeto guardado
                })
                .catch(err=>{
                    console.log("Hubo un error: " + err)
                })
        }else{
            fs.promises.appendFile("./productos.txt", JSON.stringify(obj))
            .then( contenido => {
                console.log("Producto guardado")
                //let contenidoParsed = JSON.parse(contenido)
                //console.log(contenidoParsed.id)               <---------- Me tira error. No logro que muestre el ID del objeto guardado
            })
            .catch(err =>{
                console.log("Hubo un error: " + err)
            })
        }

    }

    getById(num){
        if(num > 0 && num <= this.productos.length){
            let id = num - 1
            console.log(`Producto: ${this.productos[id].title}\nPrecio: ${this.productos[id].price}\nId: ${this.productos[id].id}\n`)
        }else{
            console.log("No hay producto con ese Id")
        }
    }

    getAll(){
        console.log(this.productos)
        return this.productos
    }

    deleteById(num){
        //borro el producto del array
        let id = num - 1
        console.log(`${this.productos[id].title} eliminado`)
        this.productos.splice(id, 1)

        //Reasigno los Id's
        for(let i = 0; i<this.productos.length; i++){
            let newId = i+1
            this.productos[i].id = newId;
        }
        
        //Reescribo el .txt
        fs.promises.writeFile("./productos.txt", JSON.stringify(this.productos)) // <--No se me escriben correctamente los productos al .txt
        .then( contenido =>{
            console.log("Id's reasignados")
        })
        .catch(err=>{
            console.log("Hubo un error: " + err)
        })

    }

    deleteAll(){
        this.productos = [];

        fs.unlink("./productos.txt", err =>{
            if(err){
                console.log("No se pudo borrar el archivo")
            }else{
                console.log("Productos borrados correctamente")
            }
        })
    }
}

//******************************************** TAREA CLASE 6 *****************************************
const server = app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en el puerto ${server.address().port}`)
})

app.get("/", (req, res) => {
    res.send(`<form>
      <a href="https://befitting-petal-shrine.glitch.me/productos">
          <input type="button" value="Nuestros productos">
      </a>
      <a href="https://befitting-petal-shrine.glitch.me/productosRandom">
          <input type="button" value="Producto Random">
      </a>
  </form>`);
  });

app.get('/productos', (req, res) =>{
    let arrProducto = productos.getAll()
    
    res.send(`<h1 style = "color: blue">Estos son nuestros productos:</h1>
    <div>${JSON.stringify(arrProducto)}</div>`)
    
})

app.get('/productosRandom', (req, res) =>{
    let arrProducto = productos.getAll()
    let productoRandom = Math.floor(Math.random() * (arrProducto.length - 0) + 0);

    res.send(`<h1 style = "color: blue">Producto al azar:</h1>
    <div><h1 style = "color: grey">Nombre: ${arrProducto[productoRandom].title}</h1><p style = "color: green">Precio: ${arrProducto[productoRandom].price}</p></div>`)
})
//***********************************************************************************************************

let escuadra = {
    title: "Escuadra",
    price: 49.99,
    thumbail: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Squadra_45.jpg"
}
let calculadora = {
    title: "Calculadora",
    price: 70,
    thumbail: "https://s1.eestatic.com/2019/10/03/actualidad/actualidad_433966707_134591511_1706x1280.jpg"
}
let mapa = {
    title: "Mapa",
    price: 14.50,
    thumbail: "https://www.mapamundiparaimprimir.com/wp-content/uploads/2018/07/mapamundi-fisico.jpg"
}

let productos = new Contenedor("Productos")


productos.save(escuadra)
productos.save(calculadora)
productos.save(mapa)

