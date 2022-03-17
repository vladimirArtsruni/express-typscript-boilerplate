import { Application } from './server/application';

Application.createApplication().then(() => {
    console.info('The application was started! Kill it using Ctrl + C');
})
