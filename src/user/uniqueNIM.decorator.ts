import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserService } from './user.service';

@ValidatorConstraint({ async: true })
export class IsNIMUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}
  async validate(value: any, args: ValidationArguments) {
    const valid = await this.userService.validateNIM(value).then((user) => {
      if (user) return false;
      return true;
    });
    return valid;
  }

  defaultMessage(args: ValidationArguments) {
    return 'NIM $value already exists.';
  }
}

export function IsNIMUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNIMUniqueConstraint,
    });
  };
}
