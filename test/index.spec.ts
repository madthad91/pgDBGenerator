// src(the last answer here, for dependencies to install): https://stackoverflow.com/questions/30863565/unit-testing-using-jasmine-and-typescript 
import { Validator } from '../src/validator';

describe('Testing the validator', ()=>{
    it('should pass validator', ()=>{

        expect(Validator.validateDatatype('p')).toBeTruthy();
        expect(Validator.validateDatatype('i')).toBeTruthy();
        expect(Validator.validateDatatype('v')).toBeTruthy();
        expect(Validator.validateDatatype('t')).toBeTruthy();
        expect(Validator.validateDatatype('d')).toBeTruthy();

        expect(Validator.validateDatatype('bigserial')).toBeTruthy();
        expect(Validator.validateDatatype('boolean')).toBeTruthy();
        expect(Validator.validateDatatype('macaddr')).toBeTruthy();
    })
    
    it('should not pass validator', ()=>{
        expect(Validator.validateDatatype('thad')).toBeFalsy();
    })
})