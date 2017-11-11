const shannon = require('../lib/shannon').shannon;

// used http://www.shannonentropy.netmark.pl/calculate for test assertion values

describe('shannon', () => {

    it('this is a sample string', () => {

        const sample = 'this is a sample string';
        const expected = 3.44726;

        const entropy = shannon(sample);

        if (Math.round(expected * 100000) != Math.round(entropy * 100000)) {
            throw new Error('does not match');
        }
    });

    it('ababababababababababa', () => {

        const sample = 'ababababababababababa';
        const expected = 0.99836;

        const entropy = shannon(sample);

        if (Math.round(expected * 100000) != Math.round(entropy * 100000)) {
            throw new Error('does not match');
        }
    });

    it('abcdefghijklmnopqrstuvwxyz', () => {

        const sample = 'abcdefghijklmnopqrstuvwxyz';
        const expected = 4.70044;

        const entropy = shannon(sample);

        if (Math.round(expected * 100000) != Math.round(entropy * 100000)) {
            throw new Error('does not match');
        }
    });

    it('11111111111111111111111111', () => {

        const sample = '11111111111111111111111111';
        const expected = 0;

        const entropy = shannon(sample);

        if (Math.round(expected * 100000) != Math.round(entropy * 100000)) {
            throw new Error('does not match');
        }
    });

    it('this ! involves $ more % funny & characters / ?', () => {

        const sample = 'this ! involves $ more % funny & characters / ?';
        const expected = 4.14525;

        const entropy = shannon(sample);

        if (Math.round(expected * 100000) != Math.round(entropy * 100000)) {
            throw new Error('does not match');
        }
    });

});