import 'core-js/es6';
import 'core-js/es7/reflect';
import 'reflect-metadata';
import 'ts-helpers';

let testContext = (<{ context?: Function }>require).context('./tests', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);

let coverageContext = (<{ context?: Function }>require).context('./src/app', true, /\.ts/);
coverageContext.keys().forEach(coverageContext);
