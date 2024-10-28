import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { get } from 'http';
import { Usuariodto } from './dto/usuario.dto';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService){}

    @Get()
    async getAll(){
        return this.usuarioService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.usuarioService.findById(id);
    }

    @Post()
    async create(@Body()dto: Usuariodto){
        return await this.usuarioService.create(dto);
    }

    @Put(':id')
    async update (@Param('id', ParseIntPipe) id: number, @Body() dto: Usuariodto){
        return await this.usuarioService.update(id, dto);
    }

    @Delete(':id')
    async delete (@Param('id', ParseIntPipe) id: number){
        return await this.usuarioService.delete(id)
    }

}
