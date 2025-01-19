import { CatalogueDto } from '@common/dto';
import {IsBoolean} from "class-validator";
import {isBooleanValidationOptions} from "@shared/validation";

export class SeedCatalogueDto extends CatalogueDto {
    @IsBoolean(isBooleanValidationOptions())
    readonly required: boolean;
}