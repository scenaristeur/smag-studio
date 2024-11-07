// https://github.com/TFAGaming/quick-yaml.db

import { QuickYAML } from 'quick-yaml.db';

type Model = [
    { variable: 'name', type: string },
    { variable: 'age', type: number },
    { variable: 'alive', type: boolean },
    { variable: 'languages', type: string[] }
];

const db = new QuickYAML<Model>('./example.yaml');

// OR
// new QuickYAML<Model>('./example.yaml', {
//     model: {
//         setValuesOnReady: true,
//         defaultModelValues: [
//             { variable: 'name', value: 'John' },
//             { variable: 'age', value: 24 },
//             { variable: 'alive', value: true },
//             { variable: 'languages', value: ['English', 'French'] }
//         ]
//     }
// });

const obj = {
    name: 'John',
    age: 24,
    alive: true,
    languages: ['English', 'French']
};

type Keys = keyof typeof obj;

for (const key in obj) {
    db.set(key as Keys, obj[key as Keys]);
};