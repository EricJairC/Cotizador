import { Request, Response } from 'express'
import UserShop from '../models/UserShop.model'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'

export const createAccount = async (req : Request, res : Response) => {
    try {
        const { password, email } = req.body
        // Verificar duplicados
        const userExist = await UserShop.findOne({
            where: { email }
        })
        if(userExist){
            const error = new Error('El usuario ya está registrado')
            res.status(409).json({error: error.message})
            return 
        }
        // Crea el usuario
        const usershop = new UserShop(req.body)
        // Hash password
        usershop.password = await hashPassword(password)
        await usershop.save()
        res.send('Cuenta creada correctamente')
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export const login = async (req : Request, res : Response) => {
    try {
            
        const { email, password } = req.body
        const user = await UserShop.findOne({
            where: { email }
        })
        // Verificamos que existe el correo
        if(!user){
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message})
            return
        }
        
        // Revisamos password
        const isPasswordCorrect = await checkPassword(password, user.password)

        // En caso de que no sea correcto
        if(!isPasswordCorrect){
            const error = new Error('Password incorrecto')
            res.status(404).json({ error: error.message})
            return
        }

        // Instanciamos el JWT
        const token = generateJWT({id: user.idUser})

        res.send(token)
        return

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const user = async (req : Request, res : Response) => {
    try {
        res.json(req.user)
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}