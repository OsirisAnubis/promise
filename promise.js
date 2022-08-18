const FULFILLED = 'fulfilled';
const PENDING = 'pending';
const REJECTED = 'rejected';

class ImpPromise {
  constructor(executor) {
    this.state = PENDING;
    this.result = undefined;
    this.onFulfilledFn = [];
    this.onRejectedFn = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.result = value;
        this.onFulfilledFn.forEach((fn) => fn(value));
      }
    };

    const reject = (error) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.result = error;
        this.onRejectedFn.forEach((fn) => fn(error));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    return new ImpPromise((resolve, reject) => {
      if (this.state === PENDING) {
        if (onFulfilled) {
          this.onFulfilledFn.push(() => {
            try {
              const newResult = onFulfilled(this.result);
              if (newResult instanceof MyPromise) {
                newResult.then(resolve, reject);
              } else {
                resolve(newResult);
              }
            } catch (error) {
              reject(error);
            }
          });
        }
        if (onRejected) {
          this.onRejectedFn.push(() => {
            try {
              const newResult = onRejectedFn(this.result);
              if (newResult instanceof MyPromise) {
                newResult.then(resolve, reject);
              } else {
                reject(newResult);
              }
            } catch (error) {
              reject(error);
            }
          });
        }
        return;
      }

      if (onFulfilled && this.state === FULFILLED) {
        try {
          const newResult = onFulfilled(this.result);
          if (newResult instanceof MyPromise) {
            newResult.then(resolve, reject);
          } else {
            resolve(newResult);
          }
        } catch (error) {
          reject(error);
        }
        return;
      }

      if (onRejected && this.state === REJECTED) {
        try {
          const newResult = onFulfilled(this.result);
          if (newResult instanceof MyPromise) {
            newResult.then(resolve, reject);
          } else {
            resolve(newResult);
          }
        } catch (error) {
          reject(error);
        }
        return;
      }
    });

  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

const prom = new ImpPromise((resolve, reject) => {
  setTimeout(() => resolve('ok'), 1000);
}).then(console.log);
