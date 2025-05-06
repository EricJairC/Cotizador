import request from "supertest";
import server from "../server";

describe('GET /api', () => {
    it('should send back a json response', async () => {
        // Lo que espera
        const res = await request(server).get('/api')
        expect(res.status).toBe(200) // Status 200 es correcto
        expect(res.body.msj).toBe('Desde API')

        // Lo que no espera
        expect(res.status).not.toBe(404)
        expect(res.body.msj).not.toBe('desde api')
    })
})