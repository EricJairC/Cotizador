import jwt from 'jsonwebtoken'
import UserShop from '../models/UserShop.model'

type UserPayload = {
    id: UserShop['idUser']
}

export const generateJWT = (payload: UserPayload) => {
    // Crea un jwtoken
    const token = jwt.sign( payload, process.env.JWT_SECRET, {
        // Fecha de expiración
        expiresIn: '180d'
    })
    return token
}