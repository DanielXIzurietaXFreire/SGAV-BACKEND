import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength, MaxLength } from 'class-validator';

export class Usuariodto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres' })
    name: string;

    @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    @MaxLength(100, { message: 'El correo electrónico no debe exceder los 100 caracteres' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(255, { message: 'La contraseña no debe exceder los 255 caracteres' })
    password: string;

    @IsEnum(['Administrator', 'Employee', 'Customer'], { message: 'El rol debe ser Administrator, Employee o Customer' })
    @IsNotEmpty({ message: 'El rol es obligatorio' })
    role: string;
}
