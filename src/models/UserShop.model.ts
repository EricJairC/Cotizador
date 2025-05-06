import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import Product from "./Product.model";
import Cart from "./Cart.model";

@Table({
    tableName: 'usershop'
})

class UserShop extends Model {
    
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idUser: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        set(value: string) {
            this.setDataValue('email', value.toLowerCase());
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @HasMany(() => Product, 'createdBy')
    declare createdByProducts: Product[];

    @HasMany(() => Cart)
    declare carts: Cart[];
}

export default UserShop;