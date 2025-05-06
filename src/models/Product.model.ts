import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import UserShop from './UserShop.model'

@Table({
    tableName: 'product'
})

class Product extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idProduct: Number

    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.FLOAT()  
    })
    declare price: number

    @Column({
        type: DataType.STRING(100)
    })
    declare description: string

    @ForeignKey(() => UserShop)
    @Column({
        type: DataType.INTEGER
    })
    declare createdBy: number;

    @BelongsTo(() => UserShop)
    declare createdByUser: UserShop;
}


export default Product