import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getAllProducts, getProductById, getProducts, updatedProduct } from './handlers/product'
import { createProductCart, decreaseQuantity, deleteProductCart, getProductsCart, getTotalCart, getTotalNormalInstallment, getTotalPunctualInstallment, increaseQuantity, updatePlazoPago } from './handlers/cart'
import { handleInputErrors } from './middleware'
import { createAccount, login, user } from './handlers/usershop'
import { authenticate } from './middleware/auth'

const routerProducts = Router()

const routerCart = Router()

const routerUserShop = Router()

// Routing de products
// Obtener todos los productos
routerProducts.get('/getAllProducts',
    //Validacion
    getAllProducts
)

routerProducts.get('/',
    authenticate,
    //Validacion
    getProducts
)

// Buscar producto por id
routerProducts.get('/:idProduct', 
    // Validacion
    param('idProduct').isInt().withMessage('Id no válido'),
    handleInputErrors,
    getProductById
)

// Crear un producto
routerProducts.post('/', 
    authenticate,
    // Validacion
    body('name')
        .notEmpty().withMessage('El nombre de producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede estar vacío')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('description')
        .notEmpty().withMessage('La descripcion del producto no puede ir vacía'),
    // Middleware
    handleInputErrors,
    createProduct
)

// Actualizar un producto
routerProducts.patch('/:idProduct', 
    authenticate,
    // Validacion
    param('idProduct').isInt().withMessage('Id no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede estar vacío')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('description')
        .notEmpty().withMessage('La descripcion del producto no puede ir vacía'),
    // Middleware
    handleInputErrors,
    updatedProduct
)

routerProducts.delete('/:idProduct', 
    authenticate,
    // Validacion
    param('idProduct').isInt().withMessage('Id no válido'),
    handleInputErrors,
    deleteProduct
)

// Routing de cart
// Obtiene todos los productos del carrito
routerCart.get('/', 
    authenticate,
    getProductsCart
)

// Obtiene el precio total del carrito
routerCart.get('/cartTotal', 
    authenticate,
    getTotalCart
)

// Obtiene el abonoNormal total del carrito
routerCart.get('/normalInstallment', 
    authenticate,
    getTotalNormalInstallment
)

// Obtiene el  total del carrito
routerCart.get('/punctualInstallment', 
    authenticate,
    getTotalPunctualInstallment
)

// Agrega un producto al carrito
routerCart.post('/', 
    authenticate,
    // Validacion
    body('idProduct')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El id de producto no puede ir vacio'),
    body('quantity')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('La cantidad no puede ir vacia'),
    body('name')
        .notEmpty().withMessage('El nombre de producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede estar vacío')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('description')
        .notEmpty().withMessage('La descripcion del producto no puede ir vacía'),
    // Middleware
    handleInputErrors,
    createProductCart
)

// Aumenta la cantidad de un producto en el carrito
routerCart.patch('/increaseQuantity/:idProduct', 
    authenticate,
    param('idProduct').isInt().withMessage('Id no válido'),
    handleInputErrors,
    increaseQuantity
)

// Disminuye la cantidad de un producto en el carrito
routerCart.patch('/decreaseQuantity/:idProduct', 
    authenticate,
    param('idProduct').isInt().withMessage('Id no válido'),
    handleInputErrors,
    decreaseQuantity
)

routerCart.patch('/plazo',
    authenticate,
    body('plazo')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El plazo no puede ir vacío')
            .custom(value => {
                const plazosValidos = [12, 24, 36, 48]
                if (!plazosValidos.includes(Number(value))) {
                    throw new Error('Plazo no válido')
                }
                return true
            }),
    handleInputErrors, 
    updatePlazoPago
)

// Elimina producto del carrito
routerCart.delete('/:idProduct', 
    authenticate,
    // Validacion
    param('idProduct').isInt().withMessage('Id no válido'),
    handleInputErrors,
    deleteProductCart
)

routerUserShop.post('/create-account', 
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req}) => { 
            if(value !== req.body.password){
                throw new Error('Los passwords no son iguales')
            }
            return true
        }),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    createAccount
)

routerUserShop.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacío'),
    handleInputErrors,
    login
)

routerUserShop.get('/user',
    authenticate,
    handleInputErrors,
    user
)

export {routerProducts, routerCart, routerUserShop}