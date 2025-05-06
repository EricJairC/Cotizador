import { exit } from 'node:process'
import db from '../config/db'

// Limpiamos la bd para las pruebas
const clearDB = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente')
        // Finaliza de manera correcta
        exit(0)
    } catch (error) {
        console.log(error)
        // Finaliza con errores
        exit(1)
    }
}

if(process.argv[2] === '--clear'){
    clearDB()
}