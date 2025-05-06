import { Request, Response } from 'express'
import Cart from '../models/Cart.model'
import Product from '../models/Product.model'

// Obtener productos del carrito
export const getProductsCart = async (req : Request, res : Response) => { // Req es lo que enviamos (datos de un formulario) y Res es la respuesta de la página
    const idUser = req.user.idUser
    const products = await Cart.findAll({ // Obtiene todos los productos
        where: {idUser},
        order: [ //Establecemos el orden
            ['idProduct', 'ASC']
        ],
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    res.json({data: products}) // Manda como respuesta los productos
}

// Obtener el total del carrito
export const getTotalCart = async (req : Request, res : Response) => { 
    const idUser = req.user.idUser
    const products = await Cart.findAll({
        where: {idUser}
    })
    // Calculando el total del carrito
    const total = products.reduce((total, product) => {
        return total + (Number(product.price) * Number(product.quantity))
    }, 0)
    if (total == 0) {
        res.json({ montoTotal: 0})
    } else {
        res.json({ montoTotal: total }) 
    }
}

// Obtener el abonoNormal del carrito
export const getTotalNormalInstallment = async (req : Request, res : Response) => { 
    const idUser = req.user.idUser
    const products = await Cart.findAll({
        where: {idUser}
    })
    // Calculando el total del carrito
    const total = products.reduce((total, product) => {
        return total + (Number(product.abonoNormal))
    }, 0)
    if (total == 0) {
        res.json({ abonoNormal: 0})
    } else {
        res.json({ abonoNormal: total }) 
    }
}

// Obtener el total del carrito
export const getTotalPunctualInstallment = async (req : Request, res : Response) => { 
    const idUser = req.user.idUser
    const products = await Cart.findAll({
        where: {idUser}
    })
    // Calculando el total del carrito
    const total = products.reduce((total, product) => {
        return total + (Number(product.abonoPuntual))
    }, 0)
    if (total == 0) {
        res.json({ abonoPuntual: 0})
    } else {
        res.json({ abonoPuntual: total }) 
    }
}

// Crear productos en el carrito
export const createProductCart = async (req : Request, res : Response) => {
    const idProduct = req.body.idProduct
    const plazoPago = req.body.plazoPago || 12
    const idUser = req.user.idUser
    const product = await Product.findByPk(idProduct)
    const productCartExist = await Cart.findOne({
        where: {
            idProduct,
            idUser
        }
    })
    if (!product) {
        res.status(400).json({error: 'El producto no existe'})
        return;
    } else {
        if(productCartExist){
            productCartExist.quantity = productCartExist.dataValues.quantity + 1
            productCartExist.calcularAbonos()
            await productCartExist.save()
            res.json({ data: productCartExist })
            return
        }else{
            const productCart = await Cart.create({
                idProduct: product.idProduct,
                name: product.name,
                price: product.price,
                description: product.description,
                quantity: 1,
                plazoPago: plazoPago,
                idUser: req.user.idUser
            }) 
            productCart.calcularAbonos()
            await productCart.save()
            res.status(201).json({ data: productCart }) // Manda como respuesta el producto creado
            return
        }
    }
}

// Aumentar la cantidad de un producto
export const increaseQuantity = async (req : Request, res : Response) => {
    const idUser = req.user.idUser
    const { idProduct } = req.params
    const product = await Cart.findOne({
        where: {idUser, idProduct}
    })
    if (!product) {
        res.status(404).json({
            error: 'El producto no existe'
        })
        return;
    }
    product.quantity = product.dataValues.quantity + 1
    product.calcularAbonos() 
    await product.save()
    res.json({ data: product })
}

// Disminuir la cantidad de un producto
export const decreaseQuantity = async (req : Request, res : Response) => {
    const idUser = req.user.idUser
    const { idProduct } = req.params
    const product = await Cart.findOne({
        where: {idUser, idProduct}
    })
    if (!product) {
        res.status(404).json({
            error: 'El producto no existe'
        })
        return;
    }
    if (product.dataValues.quantity > 1) {
        product.quantity = product.dataValues.quantity - 1
    } else {
        product.quantity = 1
    }
    product.calcularAbonos() 
    await product.save()
    res.json({ data: product })
}

export const updatePlazoPago = async (req: Request, res: Response) => {
    const idUser = req.user.idUser
    const plazo = req.body.plazo
    const products = await Cart.findAll({
        where: {idUser}
    })
    for (const product of products) {
        product.plazoPago = plazo
        product.calcularAbonos()
        await product.save() 
    }
    
    res.json({data:products})
}

// Eliminar un producto del carrito
export const deleteProductCart = async (req : Request, res : Response) => {
    const idUser = req.user.idUser
    // Obtenemos el valor de la url
    const { idProduct } = req.params
        
    // Comprobamos que existe el id en Cart
    const productCart = await Cart.findOne({
        where: {idUser, idProduct}
    })

    // Eliminar producto en cart
    if(!productCart){
        res.status(404).json({error: 'Producto no encontrado'})
    }else{
        await productCart.destroy()
        res.json({data: 'Producto Eliminado'})
    }
}