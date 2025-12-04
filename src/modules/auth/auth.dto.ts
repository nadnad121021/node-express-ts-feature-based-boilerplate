import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Email is invalid" })
  email!: string;

  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}

export class LoginDto {
  @IsEmail({}, { message: "Email is invalid" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
