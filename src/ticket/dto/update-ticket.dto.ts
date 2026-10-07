import { ApiProperty } from "@nestjs/swagger";
import { EstadoTicket } from "../../generated/prisma/enums.js";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateTicketDto{
    @ApiProperty({example: "ENPROCESO"})
    @Transform(({value}) => value.toUpperCase())
    @IsEnum(EstadoTicket,{message: "el estado solo puede tener los estados: ABIERTO, ENPROCESO, CERRADO, RESUELTO"})
    estado: EstadoTicket
}