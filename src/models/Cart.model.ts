import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import Product from './Product.model'
import UserShop from './UserShop.model'

@Table({
    tableName: 'cart'
})

class Cart extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idCart: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare idProduct: number;

    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.FLOAT
    })
    declare price: Number

    @Column({
        type: DataType.STRING(100)
    })
    declare description: string

    @Column({
        type: DataType.INTEGER
    })
    declare quantity: Number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 12
    })
    declare plazoPago: number

    @Column({
        type: DataType.REAL,
        allowNull: true
    })
    declare abonoNormal: number

    @Column({
        type: DataType.REAL,
        allowNull: true
    })
    declare abonoPuntual: number

    // Relacionando las tablas
    @BelongsTo(() => Product)
    product: Product

    @ForeignKey(() => UserShop)
    @Column({
      type: DataType.INTEGER,
       allowNull: false,
    })
    declare idUser: number;

    @BelongsTo(() => UserShop)
    declare user: UserShop;

    
    // Función para calcular abonos
    calcularAbonos() {
        const roundToThree = (num: number) => Math.round(num * 1000) / 1000
        const tasas = this.obtenerTasas(this.plazoPago)
        const precioTotal = +this.price * +this.quantity

        // Calculando los abonos
        this.abonoNormal = roundToThree(((precioTotal * tasas.tasaNormal) + precioTotal) / this.plazoPago)
        this.abonoPuntual = roundToThree(((precioTotal * tasas.tasaPuntual) + precioTotal) / this.plazoPago)
    }

    // Función para obtener las tasas
    obtenerTasas(plazo: number) {
        const tasas = {
            12: { tasaNormal: 1.0366, tasaPuntual: 0.8963 },
            24: { tasaNormal: 1.2, tasaPuntual: 1.1 },
            36: { tasaNormal: 1.4, tasaPuntual: 1.2 },
            48: { tasaNormal: 1.6, tasaPuntual: 1.3 }
        }
        return tasas[plazo] || 12
    }
}

export default Cart