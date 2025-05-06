import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import UserShop from "../models/UserShop.model"

declare global {
    namespace Express {
        interface Request {
            user?: UserShop
        }
    }
}

export const authenticate = async (req : Request, res : Response, next : NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer){
        const error = new Error('No autorizado')
        res.status(401).json({error: error.message})
        return
    }
    const token = bearer.split(' ')[1]

    try {
        // Verificamos el JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof decoded === 'object' && decoded.id){
            // En caso de existir el usuario
            const user = await UserShop.findByPk(decoded.id, {
                // Excluimos el password para no filtrar informacion
                attributes: {exclude: ['password']}
            })
            // Guardamos el usuario en el request
            if(user){
                req.user = user
                return next()
            }else{
                res.status(500).json({error: 'Token no válido'})
                return
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token no válido'})
        return
    }
    next()
}