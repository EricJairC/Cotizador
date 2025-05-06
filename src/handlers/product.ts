import { Request, Response } from 'express'
import Product from '../models/Product.model'
import Cart from '../models/Cart.model'

export const getProducts = async (req : Request, res : Response) => { // Req es lo que enviamos (datos de un formulario) y Res es la respuesta de la página
    const products = await Product.findAll({ // Obtiene todos los productos
        where: {createdBy: req.user.idUser},
        order: [ //Establecemos el orden
            ['idProduct', 'ASC']
        ]
    })
    res.json({data: products}) // Manda como respuesta los productos
}

export const getAllProducts = async (req : Request, res : Response) => { // Req es lo que enviamos (datos de un formulario) y Res es la respuesta de la página
    const products = await Product.findAll({ // Obtiene todos los productos
        order: [ //Establecemos el orden
            ['idProduct', 'ASC']
        ],
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    res.json({data: products}) // Manda como respuesta los productos
}

export const getProductById = async (req : Request, res : Response) => {
    // Obtenemos el valor de la url
    const { idProduct } = req.params
    // Comprobamos que existe el id
    const product = await Product.findByPk(idProduct)
    // En caso de que no exista
    if(!product){
        res.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }
    res.json({data: product})
}

export const createProduct = async (req : Request, res : Response) => {
    const product = await Product.create(req.body) // Crea un producto

    product.createdBy = req.user.idUser
    await product.save()
    res.status(201).json({data: product}) // Manda como respuesta el producto creado
    return
}

export const updatedProduct = async (req : Request, res : Response) => {
    // Obtenemos el valor de la url
    const { idProduct } = req.params
    // Comprobamos que existe el id
    const product = await Product.findByPk(idProduct)
    
    // Comprobamos que existe el id en Cart
    const productCart = await Cart.findAll({
        where: {
            idProduct
        }
    })
    // En caso de que no exista
    if(!product){
        res.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }
    if(product.createdBy !== req.user.idUser){
        res.status(404).json({
            error: 'Acción no válida'
        })
        return;
    }
    // Actualizar producto
    await product.update(req.body)
    await product.save()

    // Actualizar producto en cart
    if(!productCart){
        res.json({data: product})
    }else{
        for (const cart of productCart) {
            await cart.update(req.body)
            cart.calcularAbonos()
            await cart.save()
          }
        
        res.json({data: product})
    }
}

export const deleteProduct = async (req : Request, res : Response) => {
    // Obtenemos el valor de la url
    const { idProduct } = req.params
    // Comprobamos que existe el id
    const product = await Product.findByPk(idProduct)
    
    // Comprobamos que existe el id en Cart
    const productCart = await Cart.findByPk(idProduct)
    // En caso de que no exista
    if(!product){
        res.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }

    if(product.createdBy !== req.user.idUser){
        res.status(404).json({
            error: 'Acción no válida'
        })
        return;
    }

    // Eliminar producto en cart
    if(!productCart){
        // Eliminar producto
        await product.destroy()
        res.json({data: 'Producto Eliminado'})
    }else{
        await productCart.destroy()
        await product.destroy()
        res.json({data: 'Producto Eliminado'})
    }
}