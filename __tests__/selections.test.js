import * as selectionsModule from '../src/js/selections';

describe('selectionsModule.spliceStringOnRanges', () => {
    const string = "01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 567890";
    it('should splice string on ranges', () => {
        const ranges = [[45, 47]];
        const output = selectionsModule.spliceStringOnRanges(string, ranges);
        const expected = [
            {text: '01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 ', selected: false},
            {text: '234', selected: true, occurrence: 2, occurrences: 2},
            {text: ' 567890', selected: false}
        ];
        expect(expected).toEqual(output);
    });
    it('should splice string on ranges even if only first character', () => {
        const ranges = [[0, 0]];
        const output = selectionsModule.spliceStringOnRanges(string, ranges);
        const expected = [
            {text: '0', selected: true, occurrence: 1, occurrences: 3},
            {text: '1 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 567890', selected: false}
        ];
        expect(expected).toEqual(output);
    });
    it('should splice string on ranges even if only last character', () => {
        const ranges = [[54, 54]];
        const output = selectionsModule.spliceStringOnRanges(string, ranges);
        const expected = [
            {text: '01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 56789', selected: false},
            {text: '0', selected: true, occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should splice string on ranges for two ranges', () => {
        const ranges = [[0, 0], [45, 47]];
        const output = selectionsModule.spliceStringOnRanges(string, ranges);
        const expected = [
            {text: '0', selected: true, occurrence: 1, occurrences: 3},
            {text: '1 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 ', selected: false},
            {text: '234', selected: true, occurrence: 2, occurrences: 2},
            {text: ' 567890', selected: false}
        ];
        expect(expected).toEqual(output);
    });
});

describe('selectionsModule.selectionsToRanges', () => {
    const string = "01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 567890";
    it('should return ranges from selections with one selection', () => {
        const selections = [
            {text: '234', occurrence: 2, occurrences: 2}
        ];
        const output = selectionsModule.selectionsToRanges(string, selections);
        const expected = [[45, 47]];
        expect(expected).toEqual(output);
    });
    it('should return ranges from selections with two selections', () => {
        const selections = [
            {text: 'qwerty', occurrence: 1, occurrences: 1},
            {text: '234', occurrence: 2, occurrences: 2}
        ];
        const output = selectionsModule.selectionsToRanges(string, selections);
        const expected = [[12, 17], [45, 47]];
        expect(expected).toEqual(output);
    });
});

describe('selectionsModule.selectionsToStringSplices', () => {
    const string = '01 234 56789qwertyuiopasd234fghjklzxcvbnmtyui01 234 567890';
    it('should return array of objects of selected strings from selections without spaces around it', () => {
        const selections = [
            {text: '234', occurrence: 2, occurrences: 3}
        ];
        const output = selectionsModule.selectionsToStringSplices(string, selections);
        const expected = [
            {text: '01 234 56789qwertyuiopasd', selected: false},
            {text: '234', selected: true, occurrence: 2, occurrences: 3},
            {text: 'fghjklzxcvbnmtyui01 234 567890', selected: false}
        ];
        expect(expected).toEqual(output);
    });
    it('should return array of objects of selected strings from selections with spaces around it', () => {
        const selections = [
            {text: '234', occurrence: 1, occurrences: 3}
        ];
        const output = selectionsModule.selectionsToStringSplices(string, selections);
        const expected = [
            {text: '01 ', selected: false},
            {text: '234', selected: true, occurrence: 1, occurrences: 3},
            {text: ' 56789qwertyuiopasd234fghjklzxcvbnmtyui01 234 567890', selected: false}
        ];
        expect(expected).toEqual(output);
    });
    it('should return whole string as not selected when empty array input', () => {
        const selections = [];
        const output = selectionsModule.selectionsToStringSplices(string, selections);
        const expected = [
            {text: '01 234 56789qwertyuiopasd234fghjklzxcvbnmtyui01 234 567890', selected: false}
        ];
        expect(expected).toEqual(output);
    });
    it('should return whole string as selected when whole string is in selection', () => {
        const selections = [
            {text: '01 234 56789qwertyuiopasd234fghjklzxcvbnmtyui01 234 567890', occurrence: 1, occurrences: 1}
        ];
        const output = selectionsModule.selectionsToStringSplices(string, selections);
        const expected = [
            {
                text: '01 234 56789qwertyuiopasd234fghjklzxcvbnmtyui01 234 567890',
                selected: true,
                occurrence: 1,
                occurrences: 1
            }
        ];
        expect(expected).toEqual(output);
    });
});

describe('selectionsModule.optimizeRanges', () => {
    it('should return ranges array without duplicates and overlaps merged', () => {
        const ranges = [[1, 1], [5, 9], [3, 4], [7, 10], [20, 40], [15, 16], [14, 17]];
        const output = selectionsModule.optimizeRanges(ranges);
        const expected = [[1, 1], [3, 10], [14, 17], [20, 40]];
        expect(expected).toEqual(output);
    });
    it('should return ranges array without duplicates', () => {
        const ranges = [[5, 9], [5, 9], [14, 17]];
        const output = selectionsModule.optimizeRanges(ranges);
        const expected = [[5, 9], [14, 17]];
        expect(expected).toEqual(output);
    });
    it('should return ranges array with overlaps merged', () => {
        const ranges = [[5, 9], [7, 10], [15, 16], [14, 17]];
        const output = selectionsModule.optimizeRanges(ranges);
        const expected = [[5, 10], [14, 17]];
        expect(expected).toEqual(output);
    });
    it('should return ranges array in order', () => {
        const ranges = [[6, 9], [3, 4], [20, 40], [15, 16]];
        const output = selectionsModule.optimizeRanges(ranges);
        const expected = [[3, 4], [6, 9], [15, 16], [20, 40]];
        expect(expected).toEqual(output);
    });
    it('should return work with single range', () => {
        const ranges = [[6, 9]];
        const output = selectionsModule.optimizeRanges(ranges);
        const expected = [[6, 9]];
        expect(expected).toEqual(output);
    });
    it('should return ranges empty array for empty array input', () => {
        const ranges = [];
        const output = selectionsModule.optimizeRanges(ranges);
        const expected = [];
        expect(expected).toEqual(output);
    });
});

describe('selectionsModule.rangesToSelections', () => {
    const string = "0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890";
    it('should return array of selection objects', () => {
        const ranges = [[3, 9], [14, 17], [20, 40]];
        const expected = [{text: '3456789', occurrence: 1, occurrences: 2},
            {text: 'tyui', occurrence: 1, occurrences: 2},
            {text: 'asdfghjklzxcvbnmtyui0', occurrence: 1, occurrences: 1}
        ];
        const output = selectionsModule.rangesToSelections(string, ranges);
        expect(expected).toEqual(output);
    });
    it('should return array of one selection object with one range', () => {
        const ranges = [[3, 9]];
        const expected = [{text: '3456789', occurrence: 1, occurrences: 2}];
        const output = selectionsModule.rangesToSelections(string, ranges);
        expect(expected).toEqual(output);
    });
    it('should return an empty array with an empty ranges', () => {
        const ranges = [];
        const expected = [];
        const output = selectionsModule.rangesToSelections(string, ranges);
        expect(expected).toEqual(output);
    });
});

describe('selectionsModule.optimizeSelections', () => {
    const string = '0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890';
    it('should return selections array even with one selection', () => {
        const selections = [
            {text: '234', occurrence: 2, occurrences: 2}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '234', occurrence: 2, occurrences: 2}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections array without duplicates', () => {
        const selections = [
            {text: '234', occurrence: 2, occurrences: 2},
            {text: '234', occurrence: 2, occurrences: 2}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '234', occurrence: 2, occurrences: 2}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections array with overlaps merged', () => {
        const selections = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: '3456789q', occurrence: 1, occurrences: 1}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '23456789q', occurrence: 1, occurrences: 1}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections array with missing sections removed', () => {
        const selections = [
            {text: 'not found in here', occurrence: 2, occurrences: 2},
            {text: 'querty', occurrence: 3, occurrences: 3},
            {text: '234', occurrence: 1, occurrences: 2}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '234', occurrence: 1, occurrences: 2}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections array in order when they are made out of order', () => {
        const selections = [
            {text: '0', occurrence: 3, occurrences: 3},
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections array when a single char at the end', () => {
        const selections = [
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections array when a single char at the beginning', () => {
        const selections = [
            {text: '0', occurrence: 1, occurrences: 3}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '0', occurrence: 1, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return empty selections array with empty array input', () => {
        const selections = [];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [];
        expect(expected).toEqual(output);
    });
    it('should return empty selections array with empty array input', () => {
        const selections = [
            {text: '0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890', occurrence: 1, occurrences: 1}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: '0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890', occurrence: 1, occurrences: 1}
        ];
        expect(expected).toEqual(output);
    });
    it('should return empty selections array with this edge case', () => {
        const selections = [
            {text: "", occurrence: 1, occurrences: 0}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [];
        expect(expected).toEqual(output);
    });
    it('should return previous selections array when blank is added', () => {
        const selections = [
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: "", occurrence: 1, occurrences: 0}
        ];
        const output = selectionsModule.optimizeSelections(string, selections);
        const expected = [
            {text: 'yui', occurrence: 2, occurrences: 2}
        ];
        expect(expected).toEqual(output);
    });
});


describe('selectionsModule.removeSelectionFromSelections', () => {
    const string = '0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890';
    it('should return selections with the provided selection removed', () => {
        const selection = {text: '234', occurrence: 1, occurrences: 2};
        const selections = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        const output = selectionsModule.removeSelectionFromSelections(selection, selections, string);
        const expected = [
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections with the provided stringSplice removed', () => {
        const selection = {text: '234', selected: true, occurrence: 1, occurrences: 2};
        const selections = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        const output = selectionsModule.removeSelectionFromSelections(selection, selections, string);
        const expected = [
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections with the provided stringSplice removed, matching occurrence numbers', () => {
        const selection = {text: '234', selected: true, occurrence: 1, occurrences: 2};
        const selections = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 1, occurrences: 2},
            {text: '0', occurrence: 1, occurrences: 3}
        ];
        const output = selectionsModule.removeSelectionFromSelections(selection, selections, string);
        const expected = [
            {text: '0', occurrence: 1, occurrences: 3},
            {text: 'yui', occurrence: 1, occurrences: 2}
        ];
        expect(expected).toEqual(output);
    });
});

describe('selectionsModule.addSelectionToSelections', () => {
    const string = '0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890';
    it('should return selections with the provided selection included', () => {
        const selection = {text: '234', occurrence: 1, occurrences: 2};
        const selections = [
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        const output = selectionsModule.addSelectionToSelections(selection, selections, string);
        const expected = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections with the provided stringSplice included', () => {
        const selection = {text: '234', selected: true, occurrence: 1, occurrences: 2};
        const selections = [
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        const output = selectionsModule.addSelectionToSelections(selection, selections, string);
        const expected = [
            {text: '234', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
    it('should return selections when first word/chars are added', () => {
        const selection = {text: '01', selected: true, occurrence: 1, occurrences: 2};
        const selections = [
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        const output = selectionsModule.addSelectionToSelections(selection, selections, string);
        const expected = [
            {text: '01', occurrence: 1, occurrences: 2},
            {text: 'yui', occurrence: 2, occurrences: 2},
            {text: '0', occurrence: 3, occurrences: 3}
        ];
        expect(expected).toEqual(output);
    });
});

describe('selections.generateSelection', () => {
    it('should return a selection for a single character found more than once', () => {
      const selectedText = 's';
      const prescedingText = 'Here is ';
      const entireText = 'Here is some text.';
      const output = selectionsModule.generateSelection(selectedText, prescedingText, entireText);
      const expected = {
        text: 's',
        occurrence: 2,
        occurrences: 2
      };
        expect(expected).toEqual(output);
    });
    it('should return a selection for a single space found more than once', () => {
      const selectedText = ' ';
      const prescedingText = 'Here is';
      const entireText = 'Here is some text.';
      const output = selectionsModule.generateSelection(selectedText, prescedingText, entireText);
      const expected = {
        text: ' ',
        occurrence: 2,
        occurrences: 3
      };
        expect(expected).toEqual(output);
    });
    it('should return a selection for a single word found once', () => {
      const selectedText = 'Here';
      const prescedingText = '';
      const entireText = 'Here is some text.';
      const output = selectionsModule.generateSelection(selectedText, prescedingText, entireText);
      const expected = {
        text: 'Here',
        occurrence: 1,
        occurrences: 1
      };
        expect(expected).toEqual(output);
    });
  });
  