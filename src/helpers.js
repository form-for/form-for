function isPromise(value: any): boolean {
  return (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
}

export { isPromise };
