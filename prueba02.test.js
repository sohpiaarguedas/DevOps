const calculadora = require('./calculadora');

describe('Pruebas de calculadora', () => {

    test('Suma correctamente', () => {
        expect(calculadora.suma(10, 5)).toBe(15);
    });

    test('Resta correctamente', () => {
        expect(calculadora.resta(10, 5)).toBe(5);
    });

    test('Multiplica correctamente', () => {
        expect(calculadora.multiplicacion(4, 5)).toBe(20);
    });

    test('Divide correctamente', () => {
        expect(calculadora.division(20, 4)).toBe(5);
    });

    test('Error al dividir entre cero', () => {
        expect(() => {
            calculadora.division(10, 0);
        }).toThrow("No se puede dividir entre cero");
    });

});