// src(the last answer here, for dependencies to install): https://stackoverflow.com/questions/30863565/unit-testing-using-jasmine-and-typescript 
import { Validator } from '../validator';

describe('hai', ()=>{
    it('should pass validator', ()=>{
        // console.log('in thads test', validator.validateMyStuff('p'))
        expect(Validator.validateMyStuff('p')).toBeTruthy();
        expect(Validator.validateMyStuff('i')).toBeTruthy();
        expect(Validator.validateMyStuff('v')).toBeTruthy();
        expect(Validator.validateMyStuff('t')).toBeTruthy();
        expect(Validator.validateMyStuff('d')).toBeTruthy();
        console.log('in thad test', Validator.validateMyStuff('bigserial'));
        expect(Validator.validateMyStuff('bigserial')).toBeTruthy();
        expect(Validator.validateMyStuff('boolean')).toBeTruthy();
        expect(Validator.validateMyStuff('macaddr')).toBeTruthy();
    })
    
    it('should not pass validator', ()=>{
        expect(Validator.validateMyStuff('thad')).toBeFalsy();
    })
})