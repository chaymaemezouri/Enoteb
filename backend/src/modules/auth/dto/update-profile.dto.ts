import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(1, { message: 'Le nom est obligatoire.' })
  name!: string;

  @IsEmail({}, { message: 'Adresse email invalide.' })
  email!: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
