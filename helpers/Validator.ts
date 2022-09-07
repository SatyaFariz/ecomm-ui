import { isEmpty } from 'validator'

class Validator {
    validations: any
  constructor(validations: any) {
    // validations is an array of rules specific to a form
    this.validations = validations
  }

  static isUsernameValid(username:string) {
    if(username.length <  4 || username.length > 30)
      return false
    else {
      const regexp = /^[a-zA-Z0-9_]+$/
      return username.search(regexp) !== -1
    }
  }

  static isValidPhoneNumber(number: string) {
    if (!/^628[0-9]{7,15}$/.test(number) && !/^08[0-9]{7,15}$/.test(number)) {
      return false
    }
    return true
  }

  static isStrongPassword(pwd: string) {
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,30}$/
    return regexp.test(pwd)
  }

  static isEmpty(val: any) {
    if(typeof val === 'string')
      return isEmpty(val.trim())
    else if(Array.isArray(val))
      return val.length === 0
    
    return val === null || val === undefined
  }

  validate(state: any) {
    // start out assuming valid
    let validation: any = this.valid()
    // for each validation rule
    this.validations.forEach((rule: any) => {
    
      // if the field isn't already marked invalid by an earlier rule
      if (!validation[rule.field].isInvalid) {
        // determine the field value, the method to invoke and
        // optional args from the rule definition
 //       const field_value = state[rule.field].toString()
        const field_value = state[rule.field]
        const args = rule.args || []
        const validation_method = rule.method
        // call the validation_method with the current field value
        // as the first argument, any additional arguments, and the
        // whole state as a final argument.  If the result doesn't
        // match the rule.validWhen property, then modify the
        // validation object for the field and set the isValid
        // field to false
        if(validation_method(field_value, ...args, state) !== rule.validWhen) {
          validation[rule.field] = { 
            isInvalid: true, 
            message: rule.message 
          }
          validation.isValid = false
        }
      }
    })

    return validation
  }
  // create a validation object for a valid form
  valid() {
    const validation: any = {}
    
    this.validations.map((rule: any) => (
        validation[rule.field] = { isInvalid: false, message: '' }
    ))

    return { isValid: true, ...validation }
  }
}

export default Validator