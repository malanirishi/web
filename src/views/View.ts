import { Model } from '../models/Model';

export abstract class View<T extends Model<K>, K> {

    regions: { [key: string]: Element } = {};

    constructor(public parent: Element, public model: T) {
        this.model.on('change', () => {
            this.render();
        });
    }

    abstract template(): string;
    
    regionsMap(): { [key: string]: string } {
        return {};
    }

    eventsMap(): { [key: string]: () => void } {
        return {};
    }

    bindEvents(fragment: DocumentFragment): void {
        const eventsList = this.eventsMap();
        for(let eventKey in eventsList) {
            const [eventName, selector] = eventKey.split(':');
            fragment.querySelectorAll(selector).forEach(element => {
                element.addEventListener(eventName, eventsList[eventKey]);
            });
        }
    }

    mapRegions(fragment: DocumentFragment): void {
        const regionsList = this.regionsMap();
        for(let key in regionsList) {
            const selector = regionsList[key];
            const element = fragment.querySelector(selector);
            if (element) {
                this.regions[key] = element;
            }
        }
    }

    onRender(): void {}

    render(): void {
        this.parent.innerHTML = '';
        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();
        this.bindEvents(templateElement.content);
        this.mapRegions(templateElement.content);
        this.onRender();
        this.parent.append(templateElement.content);
    }
}