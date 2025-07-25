import { AbstractControl } from '@angular/forms';

export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
        const config: { [key: string]: string } = {
            'required': 'This field is required.',
            'invalidCreditCard': 'Invalid credit card number.',
            'invalidEmailAddress': 'Invalid email address.',
            'invalidPassword': 'Invalid password. It must be at least 6 characters long and contain a number.',
            'minlength': `Minimum length is ${validatorValue?.requiredLength || 0}.`,
            'maxlength': `Maximum length is ${validatorValue?.requiredLength || 0}.`,
            'pattern': 'Invalid pattern.'
        };
    
        return config[validatorName] || 'Invalid field';
    }
    

    static creditCardValidator(control:any) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control:any) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control:any) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static ValidateWhiteSpace() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const initalValue: string = control.value && typeof control.value == 'string' ? control.value : ""
            let valueAFterTrim: string = initalValue.trim()
            return valueAFterTrim.length == 0 ? { 'invalid_white_Space': true } : null
        }
    }

    static ValidateFileType(fileTypes: Array<any>) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            return this.ValidateFileType_Helper(control.value, fileTypes) ? null : { 'invalid_File_Type': true }
        }
    }

    static ValidateFileType_Helper(controlValue: any, fileTypes: Array<any>): boolean {
        let isFileType: boolean = controlValue ? (typeof controlValue == 'object') : false
        let isValidFile: boolean = isFileType && fileTypes ? (fileTypes.indexOf(controlValue.type) != -1) : false
        return (isValidFile && isFileType)
    }

    static ValidateFileSize(size: number) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            return this.ValidateFileSize_Helper(control.value, size) ? null : { 'invalid_File_Size': true }
        }
    }

    static ValidateFileSize_Helper(controlValue: any, size: number) {
        // 
        let isFileType: boolean = controlValue ? (typeof controlValue == 'object') : false
        let isValidFileSize: boolean = isFileType && size ? (size >= controlValue.size) : false
        return (isValidFileSize && isFileType)
    }
}
