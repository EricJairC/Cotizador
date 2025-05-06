import request from "supertest";
import server from "../../server";

describe('POST /api/products', () => {
    // Validando cuando se envía sin datos la creacion de producto
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)
    })

    // Validando que el precio se mayor a 0
    it('should display validation that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Teclado Curvo",
            price: -300,
            description: "Teclado Curvo"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)
    })

    // Validando que el precio sea valido
    it('should display validation that the price is a numbre and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Teclado Curvo",
            price: 'Texto',
            description: "Teclado Curvo"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)
    })

    // Validando la creacion de producto de manera correcta
    it('should create a new product', async() => { 
        const response = await request(server).post('/api/products').send({
            name: "Teclado - Testing",
            price: 2500,
            description: "Teclado Mecanico Logitech G502 Switches Blue"
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
    
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })    
})

describe('GET /api/products', () => {
    // Validando que la url exista
    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    
    // Validando que consulte los productos
    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(404)
    })
})

describe('GET /api/products/:id', () => {
    // Comprobamos que no existe un id de producto
    it('Should return a 404 response for a non existent product', async () => {
        const productId = 150
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })

    // Validamos que el id sea numerico
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })

    // Validamos que el id sea valido
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PATCH /api/products/:id', () => {
    // Validamos que el id sea numerico
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).patch('/api/products/not-valid-url').send({
            name: "Monitor Curvo 30 Pulgadas",
            price: 3500,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })

    // Validamos cuando intentamos actualizar un producto sin datos
    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).patch('/api/products/1').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que el precio sea valido
    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).patch('/api/products/1').send({
            name: "Monitor Curvo 30 Pulgadas",
            price: -10,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la respuesta es 404 ya que el producto no existe
    it('Should return a 404 response for a non existent product', async () => {
        const productId = 1000
        const response = await request(server).patch(`/api/products/${productId}`).send({
            name: "Monitor Curvo 30 Pulgadas",
            price: 3500,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // Validamos que la actualización sea correcta 
    it('Should update an existing product with valid data', async () => {
        const productId = 1
        const response = await request(server).patch(`/api/products/${productId}`).send({
            name: "Monitor Curvo 30 Pulgadas",
            price: 3500,
            description: "Monitor Samsung 30 Pulgadas 140hz Free Sync"
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('DELETE /api/products/:id', () => {
    // Validamos que el id no sea válido
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })

    // Validamos que no exista el id
    it('should return a 404 response for a non existent product', async () => {
        const productId = 1000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
    })

    // Validamos que funcione de manera correcta
    it('should delete a product', async () => {
        const productId = 1
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})