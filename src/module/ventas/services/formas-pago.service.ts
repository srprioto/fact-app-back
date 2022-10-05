import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormasPago } from '../entities/formas_pago.entity';

@Injectable()
export class FormasPagoService {

    constructor(
        @InjectRepository(FormasPago) private formasPagoRepo:Repository<FormasPago>
    ){}

    async findAll() {
        return this.formasPagoRepo.find();
    }

    async create(payload:any) {
        const pagos = this.formasPagoRepo.create(payload);
        return this.formasPagoRepo.save(pagos);
    }


    // async findOne(id: number) {
    //     // const category = await this.categoryRepo.findOne(id,{
    //     //     relations: ['products']
    //     // });
    //     // if (!category) {
    //     //     throw new NotFoundException(`Category #${id} not found`);
    //     // }
    //     // return category;
    // }

    

    // async update(id: number, changes:any) {
    //     // const category = await this.findOne(id);
    //     // this.categoryRepo.merge(category, changes);
    //     // return this.categoryRepo.save(category);
    // }

    // async remove(id: number) {
    //     // return this.categoryRepo.delete(id);
    // }

}
