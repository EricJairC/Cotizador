import express from 'express'
import colors from 'colors'
import { routerCart, routerProducts, routerUserShop } from './router'
import db from './config/db'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'

// Conexión a bd
async function connectDB(){
    try {
        await db.authenticate()
        // En caso de crear nuevos modelos los sincroniza
        db.sync()
        console.log(colors.magenta.bold('Conexión exitosa a la BD'))
    } catch (error) {
        // console.log(error)
        console.log(colors.bgRed.bold('Hubo un error al conectar a la bd'))
    }
}

connectDB()

// Creamos una instancia de expres
const server = express()

// Permitir conexiones de cors
const corsOptions : CorsOptions = {
    origin: function(origin, callback){
        const whiteList = [process.env.FRONTEND_URL]
        // Permitimos la conexion para probar la api y ejecutar el servidor
        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }
        if(whiteList.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

// Información de logs
server.use(morgan('dev'))

// routing
server.use('/api/products', routerProducts)
server.use('/api/cart', routerCart)
server.use('/api/auth', routerUserShop)

export default server

