import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioRepository } from './usuario.repository';
import { Usuariodto } from './dto/usuario.dto';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private usuarioRepository: UsuarioRepository
    ){}

    async getAll(): Promise<UsuarioEntity[]> {
        const list = await this.usuarioRepository.find();
        if (list.length === 0) {
            throw new NotFoundException({ message: 'La lista está vacía' });
        }
        return list;
    }
    
    async findById(id: number): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOneBy({ id });
        if (!usuario) {
            throw new NotFoundException({ message: 'No existe el usuario' });
        }
        return usuario;
    }
    

    async findByNombre(name: string): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne({
            where: { name }
        });
        return usuario;
    }

    async create(dto: Usuariodto):Promise<any>{
        const usuario= this.usuarioRepository.create(dto);
        await this.usuarioRepository.save(usuario);
        return{message:'usuario creado'};
    }    

    async update(id:number, dto: Usuariodto): Promise <any> { 
        const usuario= await this.findById(id);
        dto.name? usuario.name=dto.name : usuario.name=usuario.name;
        dto.email? usuario.email=dto.email : usuario.email=usuario.email;
        await this.usuarioRepository.save(usuario);
        return{message:'usuario actualizado'};
    }
    
    async delete(id: number):Promise<any>{
        const usuario= await this.findById(id);
        await this.usuarioRepository.delete(usuario);
        return{message:'usuario eliminado'};
    } 
}


