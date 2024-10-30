import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

  get(key: string) {
    return this.storage.getItem(key);
  }
  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
  remove(key: string) {
    this.storage.removeItem(key);
  }

  clearIfExpired(key: string = 'token', expirationKey: string = 'expirationDate') {

    // get the expiration date from the local storage
    const expiration = new Date(this.get(expirationKey) || '').getTime();

    //  if expiration is 0, it means never expire
    if (expiration === 0) {
      return;
    }
    console.log("expiration", expiration);
    console.log("Date.now()", Date.now());
    // if expired parameter is lower than now, remove the key
    if (expiration < Date.now()) {
      this.remove(key);
      this.remove(expirationKey);
    }
  }

}
