import request from "supertest";
import server from "../../server";
import Cart from "../../models/Cart.model";
import Product from "../../models/Product.model";

describe('POST /api/products', () => {
    // Creando un producto para probar el carrito de compras
    it('should create a new product', async() => { 
        const response = await request(server).post('/api/products').send({
            name: "Monitor Curvo 32 Pulgadas",
            price: 4000,
            description: "Monitor Samsung 32 Pulgadas 140hz Free Sync"
        })
        await request(server).post('/api/products').send({
            name: "Monitor Curvo 38 Pulgadas",
            price: 4000,
            description: "Monitor Samsung 38 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
    
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })    
})

describe('POST /api/cart', () => {
    // Validando cuando se envía sin datos la creacion de producto en el carrito
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/cart').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(9)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)
    })

    // Validando que el precio se mayor a 0
    it('should display validation that the price is greater than 0', async () => {
        const response = await request(server).post('/api/cart').send({
            idProduct: 1,
            quantity: 1,
            name: "Monitor Curvo 30 Pulgadas",
            price: -300,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)
    })

    // Validando que el producto existe en el catalogo de productos
    it('should return error when product does not exist in the cart', async () => {
        // Simulamos que el producto no existe
        const mockFindByPk = jest.spyOn(Product, 'findByPk').mockResolvedValue(null);
        const response = await request(server).post('/api/cart').send({
            idProduct: 9999,
            quantity: 1,
            name: "Monitor Curvo 30 Pulgadas",
            price: 3500,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        });
        expect(response.status).toBe(400);  
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('El producto no existe');

        // Limpiamos la simulación
        mockFindByPk.mockRestore();
    });

    // Validando que el precio sea valido
    it('should display validation that the price is a numbre and greater than 0', async () => {
        const response = await request(server).post('/api/cart').send({
            idProduct: 1,
            quantity: 1,
            name: "Monitor Curvo 30 Pulgadas",
            price: 'Texto',
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)
    })

    // Validando la creacion de producto de manera correcta
    it('should create a new product', async() => { 
        const response = await request(server).post('/api/cart').send({
            idProduct: 2,
            quantity: 1,
            name: "Monitor Curvo 30 Pulgadas",
            price: 3500,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
    
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })    
})

describe('PATCH /api/cart', () => {
    // Validamos que la actualización sea correcta 
    it('Should update an existing product with valid data', async () => {
        const productId = 2
        const response = await request(server).patch(`/api/products/${productId}`).send({
            name: "Monitor Curvo 30 Pulgadas",
            price: 4000,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/cart', () => {
    // Validando que la url exista
    it('should check if api/cart url exists', async () => {
        const response = await request(server).get('/api/cart')
        expect(response.status).not.toBe(404)
    })
    
    // Validando que consulte los productos
    it('GET a JSON response with products in cart', async () => {
        const response = await request(server).get('/api/cart')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(404)
    })
})

describe('PATCH /api/cart/increaseQuantity/:id', () => {
    // Validamos que el id sea numerico
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).patch('/api/cart/increaseQuantity/not-valid-url').send({
            quantity: 1
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })
    // Validamos cuando intentamos incrementar la cantidad de un producto sin datos
    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).patch('/api/cart/increaseQuantity/2').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la cantidad sea valida
    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).patch('/api/cart/increaseQuantity/2').send({
            quantity: "Hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Valor no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la respuesta es 404 ya que el producto no existe
    it('Should return a 404 response for a non existent product', async () => {
        const productId = 1000
        const response = await request(server).patch(`/api/cart/increaseQuantity/${productId}`).send({
            quantity: 1
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('El producto no existe')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la actualización sea correcta 
    it('Should update an existing product with valid quantity', async () => {
        const productId = 2
        const response = await request(server).patch(`/api/cart/increaseQuantity/${productId}`).send({
            quantity: 1
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/cart/decreaseQuantity/:id', () => {
    // Validamos que el id sea numerico
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).patch('/api/cart/decreaseQuantity/not-valid-url').send({
            quantity: 1
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })
    // Validamos cuando intentamos incrementar la cantidad de un producto sin datos
    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).patch('/api/cart/decreaseQuantity/2').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la cantidad sea valida
    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).patch('/api/cart/decreaseQuantity/2').send({
            quantity: "Hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Valor no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la respuesta es 404 ya que el producto no existe
    it('Should return a 404 response for a non existent product', async () => {
        const productId = 1000
        const response = await request(server).patch(`/api/cart/decreaseQuantity/${productId}`).send({
            quantity: 1
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('El producto no existe')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la actualización sea correcta 
    it('Should update an existing product with valid quantity', async () => {
        const productId = 2
        const response = await request(server).patch(`/api/cart/decreaseQuantity/${productId}`).send({
            quantity: 1
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/cart/cartTotal', () => {
    // Validando que la url exista
    it('should check if api/cart url exists', async () => {
        const response = await request(server).get('/api/cart/cartTotal')
        expect(response.status).not.toBe(404)
    })

    it('should simulate deletion and return empty cart message', async () => {
        // Simulacion de carrito vacío
        const mockFindAll = jest.spyOn(Cart, 'findAll').mockResolvedValue([]);
        const response = await request(server).get('/api/cart/cartTotal');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('montoTotal');
        expect(response.body.montoTotal).toBe('No hay productos en el carrito');
    
        // Limpiando la simulacion
        mockFindAll.mockRestore();
    });
    
    // Validando que consulte los productos
    it('GET a JSON response with cartTotal', async () => {
        const response = await request(server).get('/api/cart/cartTotal')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('montoTotal')
        expect(response.body.montoTotal).toBe(4000);

        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(404)
    })

})

describe('DELETE /api/cart/:id', () => {
    // Validamos que el id no sea válido
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/cart/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })

    // Validamos que no exista el id
    it('should return a 404 response for a non existent product', async () => {
        const productId = 1000
        const response = await request(server).delete(`/api/cart/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
    })

    // Validamos que funcione de manera correcta
    it('should delete a product', async () => {
        const productId = 2
        const response = await request(server).delete(`/api/cart/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})

describe('DELETE /api/products/:id', () => {
    // Validamos que funcione de manera correcta
    it('should delete a product', async () => {
        const responseProduct = await request(server).post('/api/cart').send({
            idProduct: 3,
            quantity: 1,
            name: "Monitor Curvo 38 Pulgadas",
            price: 4000,
            description: "Monitor Samsung 38 Pulgadas 140hz Free Sync"
        })
        expect(responseProduct.status).toBe(201)
        
        const productId = 3
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})