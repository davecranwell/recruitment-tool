import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

function validateNoIntersection(value1, value2) {
  const fieldValues = new Set(value1)
  const otherFieldValues = new Set(value2)

  const intersection = new Set([...fieldValues].filter((value) => otherFieldValues.has(value)))

  if (intersection.size > 0) {
    return false
  }

  return true
}

export function NoArrayIntersection(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NoArrayIntersectionConstraint,
    })
  }
}

@ValidatorConstraint({ name: 'NoArrayIntersection' })
export class NoArrayIntersectionConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]

    return validateNoIntersection(value, relatedValue)
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    return `${relatedPropertyName} and ${args.property} must not contain any of the same values`
  }
}
