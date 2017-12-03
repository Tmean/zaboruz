export default class Emitter {
  constructor() {
    this.eventList = [];
  }

  on(event, callback) {
    if (this.eventList[event] === undefined) {
      this.eventList[event] = [];
    }

    this.eventList[event].push(callback);

    return () => {
      this.eventList[event] = this.eventList[event]
        .filter(func => func !== callback);
    };
  }

  emit(event, ...args) {
    if (this.eventList[event] !== undefined) {
      this.eventList[event].forEach((callback) => {
        callback(...args);
      });
    }
  }
}
