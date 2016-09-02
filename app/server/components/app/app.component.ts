import {UtilitiesService} from '../../services/utilities.service.ts';
const path = require('path');
const localforage = require('localforage');

class ServerAppComponent {
    beforeRegister() {
        this.is = 'server-app';
    }

    ready() {
        this.port = process.env.PORT || 5000;

        this.staticMW = (app, express) => {
            app.use(express.static('app/client'));
        };

        this.indexHandler = (req, res) => {
            res.sendFile(path.join(__dirname, '/../client/index.html'));
        };

        const runningSince = new Date();
        this.runningSinceHandler = (req, res) => {
            res.send(runningSince);
        };

        this.sourceCodeHandler = (req, res) => {
            res.sendFile(path.join(__dirname, '/../server/components/app/app.component.html'));
        };

        this.catHandler = (req, res) => {
            res.sendFile(path.join(__dirname, '/../server/cat-hunting.jpg'));
        };

        this.catNameHandler = async (req, res) => {
            const name = req.body.catName;
            await localforage.setItem(UtilitiesService.createUUID(), name);
            res.status(200).end();
        };

        this.catsHandler = async (req, res) => {
            const keys = await localforage.keys();
            console.log(keys)
            let catNames = [];

            for(let i=0; i < keys.length; i++) {
                catNames.push(await localforage.getItem(keys[i]));
            }

            res.json({
                catNames
            });
        };
    }
}

Polymer(ServerAppComponent);
